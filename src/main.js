import './styles.css';
const menu = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#navigation');
menu?.addEventListener('click', () => {
  const open = menu.getAttribute('aria-expanded') !== 'true';
  menu.setAttribute('aria-expanded', String(open));
  navigation.classList.toggle('is-open', open);
});
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && menu?.getAttribute('aria-expanded') === 'true') {
    menu.setAttribute('aria-expanded', 'false');
    navigation.classList.remove('is-open');
    menu.focus();
  }
});
const dialog = document.querySelector('#privacy-dialog');
document.querySelector('#privacy-settings')?.addEventListener('click', () => dialog.showModal());
document.querySelector('.dialog-close')?.addEventListener('click', () => dialog.close());
dialog?.addEventListener('click', (event) => {
  if (event.target === dialog) {
    const r = dialog.getBoundingClientRect();
    if (
      event.clientX < r.left ||
      event.clientX > r.right ||
      event.clientY < r.top ||
      event.clientY > r.bottom
    )
      dialog.close();
  }
});
const form = document.querySelector('#enquiry-form');
if (form) {
  const status = document.querySelector('#form-status');
  form.elements.idempotencyKey.value = crypto.randomUUID();
  const brief = () => {
    const d = new FormData(form);
    return `Project enquiry — ${d.get('service')}\n\nName: ${d.get('name')}\nPhone: ${d.get('phone')}\nEmail: ${d.get('email')}\nProject suburb: ${d.get('suburb')}\nService: ${form.elements.service.selectedOptions[0].textContent}\nPreferred timing: ${d.get('timing') || 'Not specified'}\n\n${d.get('brief')}`;
  };
  document.querySelector('#email-brief').addEventListener('click', () => {
    if (!form.reportValidity()) return;
    const email = document
      .querySelector('.contact-details a[href^="mailto:"]')
      .getAttribute('href');
    window.location.href = `${email}?subject=${encodeURIComponent('Project enquiry — ' + form.elements.suburb.value)}&body=${encodeURIComponent(brief())}`;
    status.textContent =
      'Your email app should open with the brief. Review it and choose Send. This page does not send the email for you.';
  });
  document.querySelector('#copy-brief').addEventListener('click', async () => {
    if (!form.reportValidity()) return;
    try {
      await navigator.clipboard.writeText(brief());
      status.textContent =
        'Project brief copied. Paste it into your email app and send it to Regardin.';
    } catch {
      status.textContent =
        'Clipboard access is unavailable. Use Prepare an email, or select and copy your details manually.';
    }
  });
  let connected = false;
  fetch('/api/enquiries', { headers: { Accept: 'application/json' } })
    .then((r) => (r.ok ? r.json() : null))
    .then((config) => {
      if (!config?.enabled || !config.siteKey) return;
      connected = true;
      document.querySelector('#submit-enquiry').hidden = false;
      document.querySelector('#email-brief').className = 'text-link';
      document.querySelector('#upload-field').hidden = false;
      document.querySelector('.form-notice').innerHTML =
        '<strong>Send your project enquiry.</strong><p>Your enquiry is stored securely before a receipt is shown. Up to five optional photographs or plans can be included.</p>';
      const script = document.createElement('script');
      script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
      script.onload = () => {
        window.turnstile.render('#turnstile-container', { sitekey: config.siteKey });
      };
      document.head.append(script);
    })
    .catch(() => {});
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (!connected) {
      status.textContent =
        'Online enquiries are not connected yet. Use Prepare an email or call Regardin.';
      return;
    }
    const submit = document.querySelector('#submit-enquiry');
    submit.disabled = true;
    status.textContent = 'Sending your enquiry…';
    try {
      const response = await fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' },
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'The enquiry could not be saved.');
      sessionStorage.setItem('regardin-receipt', result.receipt);
      window.location.href = '/thank-you/';
    } catch (error) {
      status.textContent = error.message + ' Your entered details are still here.';
      window.turnstile?.reset();
    } finally {
      submit.disabled = false;
    }
  });
}
const receiptStatus = document.querySelector('#receipt-status');
if (receiptStatus) {
  const receipt = sessionStorage.getItem('regardin-receipt');
  if (receipt) {
    receiptStatus.replaceChildren();
    const heading = document.createElement('h2');
    heading.textContent = 'Your enquiry has been saved.';
    const message = document.createElement('p');
    message.textContent =
      'Receipt: ' +
      receipt +
      '. This confirms secure storage, not a booking or a confirmed reply time.';
    receiptStatus.append(heading, message);
    sessionStorage.removeItem('regardin-receipt');
  }
}
