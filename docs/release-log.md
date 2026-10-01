# Release log

| Commit                                   | Branch | Scope                                | Verification                          | Public preview                                |
| ---------------------------------------- | ------ | ------------------------------------ | ------------------------------------- | --------------------------------------------- |
| 0501c62acc001b136b7ec3501f4775c227e80b75 | main   | First 21-route website draft         | Remote SHA verified; 30 browser tests | Unavailable: Cloudflare account not connected |
| a46c736076b96337e3ea188179a5f737d4adaa74 | main   | Durable enquiry API and retry worker | Remote SHA verified; 13 SQL/API tests | Unavailable: Cloudflare account not connected |

| fec5088d8fe7a9caf4fdf04193eae09eec11300a | main | Project layout, image processing, signed downloads, consent code, source inventories, CI and planning packs | Remote SHA verified; 33 browser and 18 unit tests; local Lighthouse thresholds pass | Unavailable: Cloudflare account not authenticated |

No production release, custom-domain cutover or delivered-mail result is claimed. The CI workflow is committed; initial GitHub API status retrieval was denied by the network proxy, so no remote CI result is inferred from local tests.

## cPanel target correction

User explicitly confirmed cPanel and rejected the previous hosting assumption. The next pushed release contains releases/regardin-cpanel-preview.zip, its checksum, Apache/PHP backend and corrected instructions. Local validation: 33 browser and 21 unit/integration checks; no public upload or cutover. cPanel account access, actual PHP capabilities, Apache/HTTPS and mailbox delivery remain unverified. The attached master document is preserved unchanged; the direct user instruction takes precedence.
