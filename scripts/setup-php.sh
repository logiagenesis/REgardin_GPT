#!/usr/bin/env bash
set -euo pipefail
if command -v php >/dev/null 2>&1; then
  php -r 'if (PHP_VERSION_ID < 80200 || !extension_loaded("pdo_sqlite") || !extension_loaded("fileinfo")) exit(1);'
  exit 0
fi
# Verified Debian 13 amd64 test runtime, extracted without root or system changes.
regardin_php_root=/workspace/.tools/php
regardin_php_downloads=/workspace/.tools/downloads
mkdir -p "$regardin_php_root" "$regardin_php_downloads"
while read -r regardin_php_package regardin_php_sha; do
  regardin_php_file="$regardin_php_downloads/${regardin_php_package##*/}"
  if [ ! -f "$regardin_php_file" ]; then
    curl --fail --silent --show-error "https://deb.debian.org/debian/$regardin_php_package" -o "$regardin_php_file"
  fi
  printf '%s  %s\n' "$regardin_php_sha" "$regardin_php_file" | sha256sum --check --status
  dpkg-deb -x "$regardin_php_file" "$regardin_php_root"
done <<'PACKAGES'
pool/main/a/argon2/libargon2-1_0~20190702+dfsg-4+b2_amd64.deb a54a6640be69c29c1e43b14ee464484a6f20e33fe73200c02949cfeb03228547
pool/main/p/php8.4/php8.4-cli_8.4.24-1~deb13u1_amd64.deb 8205f927545c28a03fdcc1bd1fc83c1aa9615d2ee1f7cec4cd5c86e59716782f
pool/main/p/php8.4/php8.4-common_8.4.24-1~deb13u1_amd64.deb fe81bee8ec155ed0ba14a2d1330f52f5ad3da2e7446ab74858f61c9e36202052
pool/main/p/php8.4/php8.4-sqlite3_8.4.24-1~deb13u1_amd64.deb f2166ad88645a238d132269bcf197ac06d27f08777bd312054173ad0b8d061b8
PACKAGES
cat > "$regardin_php_root/php" <<'WRAPPER'
#!/usr/bin/env bash
export LD_LIBRARY_PATH=/workspace/.tools/php/usr/lib/x86_64-linux-gnu
exec /workspace/.tools/php/usr/bin/php8.4 -n -d extension=/workspace/.tools/php/usr/lib/php/20240924/pdo.so -d extension=/workspace/.tools/php/usr/lib/php/20240924/pdo_sqlite.so -d extension=/workspace/.tools/php/usr/lib/php/20240924/fileinfo.so "$@"
WRAPPER
chmod +x "$regardin_php_root/php"
"$regardin_php_root/php" --version
