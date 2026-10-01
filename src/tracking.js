let current = null;
const storageKey = 'regardin-privacy-v1';
export function trackEvent(name, parameters = {}) {
  current?.track(name, parameters);
}
export function initialiseTracking(config) {
  if (
    !config.approved ||
    config.mode !== 'production' ||
    !/^GTM-[A-Z0-9]+$/.test(config.gtmId || '')
  )
    return null;
  window.dataLayer = window.dataLayer || [];
  const consentCommand = function () {
    window.dataLayer.push(arguments);
  };
  const denied = {
    analytics_storage: 'denied',
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
  };
  consentCommand('consent', 'default', denied);
  let accepted = false;
  let loaded = false;
  const banner = document.createElement('section');
  banner.className = 'consent-banner';
  banner.setAttribute('aria-label', 'Optional analytics choices');
  banner.innerHTML =
    '<div><strong>Optional website measurement</strong><p>Allow analytics to help us understand website use? Advertising storage stays off. Your choice does not affect project enquiries.</p></div><div><button type="button" data-allow>Allow analytics</button><button type="button" data-reject>Reject optional tracking</button></div>';
  document.body.append(banner);
  const apply = (allow, persist = true) => {
    accepted = allow;
    consentCommand('consent', 'update', {
      ...denied,
      analytics_storage: allow ? 'granted' : 'denied',
    });
    if (persist) {
      try {
        localStorage.setItem(storageKey, allow ? 'analytics' : 'rejected');
      } catch {
        /* Session-only choice when storage is unavailable. */
      }
    }
    banner.hidden = true;
    if (allow && !loaded) {
      loaded = true;
      window.dataLayer.push({ 'gtm.start': Date.now(), event: 'gtm.js' });
      const script = document.createElement('script');
      script.src = 'https://www.googletagmanager.com/gtm.js?id=' + config.gtmId;
      script.async = true;
      document.head.append(script);
    }
  };
  banner.querySelector('[data-allow]').addEventListener('click', () => apply(true));
  banner.querySelector('[data-reject]').addEventListener('click', () => apply(false));
  let saved = null;
  try {
    saved = localStorage.getItem(storageKey);
  } catch {
    /* Start denied when storage is unavailable. */
  }
  if (saved) apply(saved === 'analytics', false);
  const dialog = document.querySelector('#privacy-dialog');
  if (dialog) {
    dialog.querySelector('h2').textContent = 'Your privacy choices.';
    dialog.querySelector('p:not(.eyebrow)').textContent =
      'Optional analytics measures website use. Advertising storage and personalisation stay off. You can withdraw analytics permission at any time.';
    const actions = document.createElement('div');
    actions.className = 'consent-actions';
    actions.innerHTML =
      '<button type="button" class="button" data-privacy-allow>Allow analytics</button><button type="button" class="text-link" data-withdraw>Withdraw analytics permission</button>';
    dialog.append(actions);
    actions.querySelector('[data-privacy-allow]').addEventListener('click', () => {
      apply(true);
      dialog.close();
    });
    actions.querySelector('[data-withdraw]').addEventListener('click', () => {
      apply(false);
      dialog.close();
    });
  }
  const allowed = new Set([
    'generate_lead',
    'click_call',
    'click_whatsapp',
    'click_email',
    'view_project',
    'file_upload',
  ]);
  const controller = {
    track(name, parameters = {}) {
      if (!accepted || !allowed.has(name)) return;
      const safe = {};
      if (typeof parameters.service === 'string' && /^[a-z-]{1,80}$/.test(parameters.service))
        safe.service = parameters.service;
      if (typeof parameters.count === 'number' && parameters.count >= 0 && parameters.count <= 5)
        safe.count = parameters.count;
      window.dataLayer.push({ event: name, ...safe });
    },
    withdraw() {
      apply(false);
    },
    get accepted() {
      return accepted;
    },
  };
  current = controller;
  document.addEventListener('click', (event) => {
    const href = event.target.closest('a')?.getAttribute('href') || '';
    if (href.startsWith('tel:')) controller.track('click_call');
    if (href.startsWith('mailto:')) controller.track('click_email');
  });
  if (
    location.pathname.startsWith('/projects/') &&
    location.pathname !== '/projects/' &&
    location.pathname !== '/projects/project-preview/'
  )
    controller.track('view_project');
  return controller;
}
