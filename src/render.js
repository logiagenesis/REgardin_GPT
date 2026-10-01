import copy from './data/copy.json' with { type: 'json' };
import business from './data/business.json' with { type: 'json' };
import services from './data/services.json' with { type: 'json' };
import testimonials from './data/testimonials.json' with { type: 'json' };
import faqs from './data/faqs.json' with { type: 'json' };

import projects from './data/projects.json' with { type: 'json' };
import images from './data/generated-images.json' with { type: 'json' };

export const escape = (value) =>
  String(value).replace(
    /[&<>"']/g,
    (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c],
  );
export const arrow =
  '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 12h15m-6-6 6 6-6 6" stroke="currentColor" stroke-width="1.5"/></svg>';
const link = (url, text, cls = 'text-link') =>
  `<a class="${cls}" href="${url}">${text}${arrow}</a>`;
export const routes = [
  {
    path: '/',
    title: 'Building & Renovations in Cape Town | Regardin',
    description:
      'Regardin Construction in Kensington, Cape Town. Explore renovation, brickwork, painting, carpentry and concrete work, and discuss your project.',
    kind: 'home',
  },
  {
    path: '/about/',
    title: 'About Regardin Construction | Cape Town',
    description:
      'Meet Regardin Construction, based in Kensington, Cape Town. Building, renovation and finishing work for homes and businesses.',
    kind: 'about',
  },
  {
    path: '/services/',
    title: 'Building & Finishing Services | Regardin Construction',
    description:
      'Explore renovations, brickwork, painting, carpentry, decking, concrete work and plastering in Cape Town. Start with a clear project brief.',
    kind: 'services',
  },
  ...services.map((service) => ({
    path: `/services/${service.slug}/`,
    title: `${service.title.replace('Interior & exterior painting', 'Painting').replace('Plastering, screeds & pool finishes', 'Plastering & Screeds')} | Regardin`,
    description: `${service.title} enquiries in Cape Town. Explore project considerations and what to share with Regardin for a scope discussion.`,
    kind: 'service',
    service,
  })),
  {
    path: '/projects/',
    title: 'Work & Project Archive | Regardin Construction',
    description:
      'Explore Regardin Construction photographs: brickwork, renovations, timber decking, painting, concrete and interior finishes.',
    kind: 'projects',
  },
  ...projects
    .filter((p) => p.approved || p.template)
    .map((project) => ({
      path: `/projects/${project.slug}/`,
      title: 'Construction & Finishing Gallery | Regardin',
      description: project.approved
        ? 'A documented Regardin Construction project, with confirmed scope and approved photographs.'
        : 'Construction photographs from the Regardin portfolio: brickwork, decking and interior finishing details.',
      kind: 'project',
      project,
      noindex: !project.approved,
    })),
  {
    path: '/how-we-work/',
    title: 'Planning Your Project | Regardin Construction',
    description:
      'Prepare a useful construction brief: explain the work, share the site conditions and agree the scope before work starts.',
    kind: 'process',
  },
  {
    path: '/reviews/',
    title: 'Client Testimonials | Regardin Construction',
    description:
      'Client words recorded on the existing Regardin Construction website. Preview excerpts pending publication approval.',
    kind: 'reviews',
  },
  {
    path: '/faq/',
    title: 'Project Questions & Answers | Regardin Construction',
    description:
      'What to send for a building enquiry, how to explain the scope and what to consider when planning renovation work in Cape Town.',
    kind: 'faq',
  },
  {
    path: '/contact/',
    title: 'Discuss Your Project | Regardin Construction',
    description:
      'Contact Regardin Construction in Kensington, Cape Town. Call, email or prepare a renovation, building or finishing enquiry.',
    kind: 'contact',
  },
  {
    path: '/areas/',
    title: 'Cape Town Project Enquiries | Regardin Construction',
    description:
      'Regardin Construction is based in Kensington, Cape Town. Share your project suburb to confirm availability for your location.',
    kind: 'areas',
  },
  {
    path: '/privacy-policy/',
    title: 'Privacy Notice | Regardin Construction',
    description:
      'Preview privacy notice and proposed enquiry data handling for the new Regardin Construction website. Pending owner and legal review.',
    kind: 'privacy',
  },
  {
    path: '/terms-of-service/',
    title: 'Website Terms | Regardin Construction',
    description:
      'Preview website terms for Regardin Construction. Project scope and commercial terms must be agreed separately in writing.',
    kind: 'terms',
  },
  {
    path: '/thank-you/',
    title: 'Enquiry Status | Regardin Construction',
    description:
      'Enquiry receipt is confirmed only after successful storage by the project enquiry system.',
    kind: 'thanks',
    noindex: true,
  },
  {
    path: '/styleguide/',
    title: 'Design System | Regardin Construction',
    description: 'The proposed Regardin Construction website design system.',
    kind: 'styleguide',
    noindex: true,
  },
  {
    path: '/404.html',
    title: 'Page Not Found | Regardin Construction',
    description:
      'This page could not be found. Return to the Regardin Construction homepage or explore the services.',
    kind: '404',
    noindex: true,
  },
];

export function drawing(kind = 'space', hero = false) {
  const steps = Array.from(
    { length: 7 },
    (_, i) =>
      `<path d="M${120 + i * 36} ${430 - i * 29}v-29h36v210l-36 20Z" fill="${i % 2 ? '#d7cec0' : '#e9e4da'}" stroke="#8c8272" stroke-width="1"/><path d="M${120 + i * 36} ${401 - i * 29}l110-60h36l-110 60Z" fill="#f7f5f0" stroke="#8c8272"/>`,
  ).join('');
  const lines = Array.from({ length: 12 }, (_, i) => `<path d="M${72 + i * 26} 110v320"/>`).join(
    '',
  );
  const inner =
    kind === 'steps'
      ? steps
      : kind === 'timber'
        ? `<g stroke="#655244" stroke-width="3">${lines}<path d="M72 110h286M72 430h286"/></g><path d="M72 110l135-70h286l-135 70Zm286 0 135-70v320l-135 70Z" fill="#c1a486" stroke="#655244"/><g stroke="#655244" stroke-width="2"><path d="M99 96h286M126 82h286M153 68h286M180 54h286"/></g>`
        : kind === 'wall'
          ? `<path d="M65 230l330-110 150 75-330 110Z" fill="#e5d8c5"/><path d="M65 230v180l150 75V305Z" fill="#b85c40"/><path d="M215 305l330-110v180L215 485Z" fill="#d69a7c"/><g stroke="#794b3b" stroke-width="1">${Array.from({ length: 6 }, (_, i) => `<path d="M215 ${335 + i * 25}l330-110"/>`).join('')}<path d="M270 287v180m65-202v180m65-202v180m65-202v180"/></g>`
          : kind === 'finish'
            ? `<path d="M85 170l265-70 170 95-265 70Z" fill="#f7f5f0"/><path d="M85 170v230l170 95V265Z" fill="#c4b7a2"/><path d="M255 265l265-70v230l-265 70Z" fill="#e4dbcd"/><path d="M320 248v198l120-32V216Z" fill="#b5563a"/><path d="M341 248v168l79-21V227Z" fill="#b5563a" stroke="#f3c4ac"/>`
            : `<path d="M70 345l215-120 235 120-215 120Z" fill="#b7aa95"/><path d="M70 345V155l215-120v190Z" fill="#ded5c5"/><path d="M285 35l235 120v190L285 225Z" fill="#ede6d9"/><path d="M330 248V140q0-62 47-38l67 34q38 20 38 67v124Z" fill="#b5563a"/><path d="M351 259V156q0-44 31-28l55 28q25 14 25 52v110" fill="#81462f"/><path d="M94 320V185l70-39v136Z" fill="#333c34"/><path d="M99 319l65-37 28 15-65 38Z" fill="#817b62"/>${steps}<g stroke="#696859" fill="none"><path d="M90 390l-40 22m440-18 57 29M285 35V15"/></g>`;
  return `<svg class="drawing ${hero ? 'drawing-hero' : ''}" viewBox="0 0 600 560" role="img" aria-label="${escape(kind === 'timber' ? 'Timber structure concept drawing' : kind === 'wall' ? 'Masonry wall concept drawing' : kind === 'steps' ? 'Concrete staircase concept drawing' : 'Architectural concept drawing, not a Regardin project photograph')}"><defs><pattern id="grid-${kind}-${hero}" width="30" height="30" patternUnits="userSpaceOnUse"><path d="M30 0H0V30" fill="none" stroke="currentColor" stroke-opacity=".08"/></pattern></defs><rect width="600" height="560" fill="url(#grid-${kind}-${hero})"/><g>${inner}</g><g fill="none" stroke="currentColor" opacity=".5" stroke-width=".7"><path d="M40 500H550M40 492v16m510-16v16M550 80v385m-8-385h16m-16 385h16"/><path d="M38 37h24m-12-12v24m488 465h24m-12-12v24"/></g><text x="42" y="526" font-size="10" fill="currentColor" font-family="sans-serif" letter-spacing="3">REGARDIN / MATERIAL STUDY</text></svg>`;
}
const notice = () => ''; // Unresolved business/account items are maintained in the private handover, not customer page copy.
const heading = (eyebrow, title, body, extra = '') =>
  `<section class="page-heading wrap"><p class="eyebrow">${escape(eyebrow)}</p><h1>${title.replaceAll('&', '&amp;')}</h1><p class="lead">${escape(body)}</p>${extra}</section>`;
const faqList = (limit = faqs.length) =>
  `<div class="faq-list">${faqs
    .slice(0, limit)
    .map(
      (f, i) =>
        `<details ${i === 0 ? 'open' : ''}><summary>${escape(f.question)}<span aria-hidden="true">+</span></summary><p>${escape(f.answer)}</p></details>`,
    )
    .join('')}</div>`;
const cta = () =>
  `<section class="closing-cta"><div class="wrap cta-inner"><p class="eyebrow">${copy.cta.eyebrow}</p><h2>${copy.cta.heading}</h2><div><p>${copy.cta.body}</p>${link('/contact/', copy.cta.primary, 'button button-light')}<a class="cta-phone" href="tel:${business.phoneHref}">${copy.cta.secondary.replaceAll(' ', '&nbsp;')}&nbsp;·&nbsp;${business.phone.replaceAll(' ', '&nbsp;')}</a></div></div></section>`;
const process = () =>
  `<ol class="process-list">${copy.process.steps.map((step, i) => `<li><span>0${i + 1}</span><h3>${escape(step.title)}</h3><p>${escape(step.body)}</p></li>`).join('')}</ol>`;
const quotes = () =>
  `<div class="quotes">${testimonials.map((t) => `<figure><span class="quote-mark" aria-hidden="true">“</span><blockquote><p>${escape(t.excerpt)}</p></blockquote><figcaption>${escape(t.name)}<span>Client testimonial</span></figcaption></figure>`).join('')}</div>`;
const servicePhotos = {
  'renovations-alterations': 'interior-finish',
  'brickwork-boundary-walls': 'brickwork-on-site',
  painting: 'wall-painting',
  'carpentry-decking-pergolas': 'decking-pergola',
  'concrete-work': 'concrete-stairs',
  'plastering-screeds-pool-plastering': 'floor-screed',
  'custom-projects': 'custom-braai',
};
const serviceTiles = () =>
  `<div class="construction-services">${services.map((service) => `<a class="construction-service" href="/services/${service.slug}/">${picture(servicePhotos[service.slug])}<div><h3>${escape(service.title)}</h3><p>${escape(service.short)}</p><span class="service-more">View service ${arrow}</span></div></a>`).join('')}</div>`;
const portfolioPhotos = [
  'decking-pergola',
  'brickwork-on-site',
  'interior-painting',
  'custom-braai',
  'concrete-stairs',
  'boundary-wall',
  'carpentry-kitchen',
  'floor-screed',
  'decking-detail',
  'pool-work',
  'cupboard-carpentry',
  'masonry-detail',
  'pool-concrete',
  'wall-painting',
  'interior-finish',
  'building-exterior',
];
const gallery = (slugs = portfolioPhotos) =>
  `<div class="construction-gallery">${slugs.map((slug) => `<figure>${picture(slug)}<figcaption>${escape(images[slug]?.alt || '')}</figcaption></figure>`).join('')}</div>`;
export function picture(slug, { hero = false, className = '' } = {}) {
  const image = images[slug];
  if (!image) return '';
  const webp = image.variants.filter((v) => v.format === 'webp');
  const avif = image.variants.filter((v) => v.format === 'avif');
  const fallback = webp.at(-1);
  const sizes = hero ? '100vw' : '(max-width: 600px) 100vw, (max-width: 1000px) 50vw, 33vw';
  return `<picture class="${escape(className)}"><source type="image/avif" srcset="${avif.map((v) => `${v.url} ${v.width}w`).join(', ')}" sizes="${sizes}"><img src="${fallback.url}" srcset="${webp.map((v) => `${v.url} ${v.width}w`).join(', ')}" sizes="${sizes}" width="${fallback.width}" height="${fallback.height}" alt="${escape(image.alt)}" loading="${hero ? 'eager' : 'lazy'}" ${hero ? 'fetchpriority="high"' : ''} decoding="async"></picture>`;
}
export function comparison(project) {
  if (!images[project.before] || !images[project.after]) return '';
  return `<section class="wrap project-comparison"><p class="eyebrow">THE CHANGE IN CONTEXT</p><h2>Before & after.</h2><div class="comparison" data-comparison><div class="comparison-images"><figure class="comparison-before">${picture(project.before)}<figcaption>Before</figcaption></figure><figure class="comparison-after">${picture(project.after)}<figcaption>After</figcaption></figure></div><div class="comparison-control" hidden><label for="comparison-slider">Compare before and after</label><input id="comparison-slider" type="range" min="0" max="100" value="50" aria-label="Before and after image split"></div></div></section>`;
}
function home() {
  const h = copy.home;
  const featured = [
    [
      'decking-pergola',
      'Decking & outdoor living',
      'Timber decking and a pergola beside the pool.',
    ],
    ['interior-painting', 'A fresh interior', 'Painted walls and a finished living space.'],
    ['brickwork-on-site', 'Building & brickwork', 'A building extension taking shape.'],
    ['carpentry-kitchen', 'The finishing details', 'Timber surfaces and fitted cabinetry.'],
  ];
  return `<section class="editorial-hero wrap"><div class="editorial-hero-copy"><p class="eyebrow">CONSTRUCTION &amp; RENOVATIONS · CAPE TOWN</p><h1>Build. Renovate.<br><em>Make it yours.</em></h1><p class="hero-description">${escape(h.heroBody)}</p><div class="hero-actions">${link('/contact/', 'Discuss your project', 'button')}${link('/projects/', 'Explore our work')}</div><p class="hero-location">Based in Kensington. Building in Cape Town.</p></div><figure class="hero-frame">${picture('decking-pergola', { hero: true })}<div class="hero-detail">${picture('decking-detail')}<span>Timber pergola detail</span></div><figcaption><span>Timber decking &amp; pergola</span><a href="/projects/" aria-label="View the construction portfolio">Our work ${arrow}</a></figcaption></figure></section>
  <div class="scope-strip wrap"><span>Residential &amp; commercial</span><span>Building &amp; renovations</span><span>Timber, concrete &amp; finishes</span></div>
  <section class="intro-statement wrap"><div><p class="eyebrow">REGARDIN CONSTRUCTION</p><h2>One team for the build.<br><em>And the finishing.</em></h2></div><div><p class="intro-lead">A new room. A better layout. An outdoor space you can use.</p><p>${escape(h.introBody)}</p>${link('/about/', 'Get to know Regardin')}</div></section>
  <section class="services-editorial"><div class="wrap"><div class="section-header"><div><p class="eyebrow">WHAT WE DO</p><h2>The work, from<br><em>start to finish.</em></h2></div><p>Building, renovation and finishing work for homes and businesses. Explore the service that fits your project.</p></div><div class="service-selector"><div class="service-index">${services.map((service, i) => `<a href="/services/${service.slug}/" data-service-photo="${servicePhotos[service.slug]}" class="service-index-link${i === 1 ? ' is-active' : ''}"><span class="service-number">0${i + 1}</span><span>${escape(service.title)}</span>${arrow}</a>`).join('')}</div><figure class="service-showcase">${services.map((service, i) => `<div data-service-image="${servicePhotos[service.slug]}"${i === 1 ? '' : ' hidden'}>${picture(servicePhotos[service.slug])}<p class="service-image-caption">${escape(images[servicePhotos[service.slug]].alt)}</p></div>`).join('')}</figure></div></div></section>
  <section class="selected-work wrap"><div class="section-header"><div><p class="eyebrow">A CLOSER LOOK</p><h2>From the structure<br><em>to the spaces we live in.</em></h2></div>${link('/projects/', 'View the full portfolio')}</div><div class="selected-work-grid">${featured.map(([slug, title, caption]) => `<figure><a href="/projects/" aria-label="${escape(title)} — view the portfolio">${picture(slug)}<figcaption><h3>${escape(title)}</h3><p>${escape(caption)}</p>${arrow}</figcaption></a></figure>`).join('')}</div></section>
  <section class="client-notes"><div class="wrap client-notes-grid"><div><p class="eyebrow">WORDS FROM OUR CLIENTS</p><h2>The work is personal.<br><em>So is the feedback.</em></h2>${link('/reviews/', 'Read the client testimonials')}</div>${quotes()}</div></section>
  <section class="questions wrap"><div><p class="eyebrow">BEFORE YOU BUILD</p><h2>Good questions.<br><em>A clearer start.</em></h2>${link('/how-we-work/', 'How to get started')}</div>${faqList(3)}</section>${cta()}`;
}
function contact() {
  return `${heading(copy.contact.eyebrow, copy.contact.heading, copy.contact.body)}<section class="contact-layout wrap"><aside class="contact-details"><h2>${copy.contact.detailsHeading}</h2><a href="tel:${business.phoneHref}" class="contact-call">${business.phone.replaceAll(' ', '&nbsp;')}</a><a href="mailto:${business.email}">${business.email}</a><p>${business.location}<br>South Africa</p><div class="contact-note"><h3>Prefer to send an email?</h3><p>Use the brief below to organise your thoughts, then open it in your email app. It stays on this device until you choose to send it.</p></div>${notice('primary monitored email and contact details before launch')}</aside><div><div class="form-notice" role="note"><strong>A useful brief, ready to send.</strong><p>The online submission service is not connected yet. You can prepare your brief here and send it using your email app, or call Regardin directly.</p></div><form id="enquiry-form" action="/api/enquiries" method="post" enctype="multipart/form-data"><input type="hidden" name="idempotencyKey" value=""><div class="honeypot" aria-hidden="true"><label for="website">Leave this empty</label><input type="text" id="website" name="website" tabindex="-1" autocomplete="off"></div><div class="form-grid"><div class="field"><label for="name">Your name <span>(required)</span></label><input type="text" id="name" name="name" autocomplete="name" maxlength="100" required></div><div class="field"><label for="phone">Phone number <span>(required)</span></label><input id="phone" name="phone" type="tel" autocomplete="tel" maxlength="40" required></div><div class="field"><label for="email">Email address <span>(required)</span></label><input id="email" name="email" type="email" autocomplete="email" maxlength="254" required></div><div class="field"><label for="suburb">Project suburb <span>(required)</span></label><input type="text" id="suburb" name="suburb" autocomplete="address-level2" maxlength="100" required></div><div class="field full"><label for="service">Type of work <span>(required)</span></label><select id="service" name="service" required><option value="">Select a service</option>${services.map((s) => `<option value="${s.slug}">${s.title}</option>`).join('')}<option value="not-sure">Not sure yet</option></select></div><div class="field full"><label for="brief">Tell us about the project <span>(required)</span></label><textarea id="brief" name="brief" rows="5" minlength="20" maxlength="5000" placeholder="What would you like to build, change or finish?" required></textarea></div><div class="field full"><label for="timing">Preferred timing <span>(optional)</span></label><input type="text" id="timing" name="timing" maxlength="150" placeholder="For example, flexible or planning for next year"></div><div class="field full" id="upload-field" hidden><label for="photos">Photographs or plans <span>(optional)</span></label><input id="photos" name="photos" type="file" accept="image/jpeg,image/png,image/webp,application/pdf" multiple><p class="field-hint">Up to 5 files, 8 MB each. JPEG, PNG, WebP or PDF. No sensitive personal documents.</p></div></div><p class="privacy-note">Your details are used to respond to your project enquiry. Read the <a href="/privacy-policy/">privacy notice</a>. No marketing opt-in is required.</p><div id="turnstile-container"></div><div class="form-actions"><button type="button" id="email-brief" class="button">Prepare an email ${arrow}</button><button type="submit" id="submit-enquiry" class="button" hidden>Request a project quote ${arrow}</button><button type="button" id="copy-brief" class="text-link">Copy project brief</button></div><p id="form-status" role="status" aria-live="polite"></p><noscript><p>Online submission is not configured for this preview. <a href="mailto:${business.email}">Email Regardin</a> or call ${business.phone.replaceAll(' ', '&nbsp;')}.</p></noscript></form></div></section>${cta()}`;
}
function content(route) {
  switch (route.kind) {
    case 'home':
      return home();
    case 'services':
      return `${heading(copy.serviceHub.eyebrow, copy.serviceHub.heading, copy.serviceHub.body)}<section class="wrap content-section"><h2 class="visually-hidden">Construction and finishing services</h2>${serviceTiles()}<div class="construction-scope"><h2>New builds, maintenance & outdoor work</h2><p>${copy.home.introBody}</p>${link('/contact/', 'Discuss your building project', 'button')}</div></section>${cta()}`;
    case 'service': {
      const service = route.service;
      return `${heading('BUILDING & FINISHING / CAPE TOWN', service.title + '.', service.description)}<section class="service-detail wrap"><figure class="construction-detail-photo">${picture(servicePhotos[service.slug], { hero: true })}<figcaption>${escape(images[servicePhotos[service.slug]]?.alt || '')}</figcaption></figure><div><p class="eyebrow">${copy.serviceHub.scopeEyebrow}</p><h2>${copy.serviceHub.scopeHeading}</h2><ul class="scope-list">${service.items.map((item) => `<li>${escape(item)}</li>`).join('')}</ul><p>${copy.serviceHub.scopeNote}</p><h3>Planning this work</h3><p>${service.consideration}</p>${link('/contact/?service=' + service.slug, copy.serviceHub.serviceCta, 'button')}</div></section><section class="wrap construction-section"><h2>More work from the portfolio</h2>${gallery(service.slug === 'carpentry-decking-pergolas' ? ['decking-detail', 'carpentry-kitchen', 'cupboard-carpentry'] : service.slug === 'concrete-work' ? ['pool-concrete', 'concrete-stairs', 'pool-work'] : service.slug === 'painting' ? ['interior-painting', 'wall-painting', 'interior-finish'] : service.slug === 'brickwork-boundary-walls' ? ['boundary-wall', 'brickwork-on-site', 'masonry-detail'] : service.slug === 'plastering-screeds-pool-plastering' ? ['floor-screed', 'pool-work', 'interior-finish'] : ['interior-painting', 'custom-braai', 'decking-pergola'])}</section><section class="wrap planning"><h2>Start with a clear brief.</h2>${process()}</section>${cta()}`;
    }
    case 'about':
      return `${heading(copy.about.eyebrow, copy.about.heading, copy.about.intro)}<section class="service-detail wrap"><figure class="construction-detail-photo">${picture('brickwork-on-site', { hero: true })}<figcaption>Brickwork and a building extension in progress</figcaption></figure><div><p class="eyebrow">RESIDENTIAL &amp; COMMERCIAL CONSTRUCTION</p><h2>${copy.about.sectionHeading}</h2>${copy.about.paragraphs.map((paragraph) => `<p>${escape(paragraph)}</p>`).join('')}${link('/services/', copy.about.primaryLink, 'button')}${link('/projects/', copy.about.secondaryLink)}</div></section><section class="wrap construction-section"><h2>Building, inside and out.</h2>${gallery(['decking-pergola', 'interior-painting', 'carpentry-kitchen'])}</section>${cta()}`;
    case 'project':
      return `${heading('CONSTRUCTION & FINISHING GALLERY', 'Brickwork, timber and finishing details.', 'Photographs from the Regardin Construction portfolio, showing the structure and the finishing work.')}<section class="wrap content-section">${gallery(['brickwork-on-site', 'decking-pergola', 'decking-detail', 'interior-finish', 'custom-braai', 'concrete-stairs'])}</section>${cta()}`;
    case 'projects':
      return `${heading(copy.projects.eyebrow, copy.projects.heading, copy.projects.body)}<section class="wrap construction-section"><h2>${copy.projects.galleryHeading}</h2>${gallery()}${link('/contact/', copy.projects.cta, 'button')}</section>${cta()}`;
    case 'process':
      return `${heading(copy.process.eyebrow, copy.process.heading, copy.process.body)}<section class="wrap content-section"><h2 class="visually-hidden">Preparing your project brief</h2>${process()}<div class="reading-width"><h2>Put the important details in writing.</h2><p>Record the work included and excluded, the material choices, access arrangements, timing and payment terms. Ask how changes to the agreed scope will be discussed and documented.</p><h3>When plans or specialist advice are needed</h3><p>Structural work, changes to a building and some outdoor structures may require professional design or approvals. The requirements depend on your project and location; establish them before construction.</p>${notice('site-supervision arrangements, progress updates, snagging and handover procedure')}</div></section>${cta()}`;
    case 'reviews':
      return `${heading(copy.reviews.eyebrow, copy.reviews.heading, copy.reviews.body)}<section class="wrap full-reviews">${testimonials.map((t) => `<figure><blockquote><p>“${escape(t.quote)}”</p></blockquote><figcaption>${escape(t.name)}<span>Client testimonial</span></figcaption></figure>`).join('')}${notice('permission to republish testimonials; these are not labelled as Google reviews')}</section>${cta()}`;
    case 'faq':
      return `${heading('BEFORE YOU BEGIN', 'Useful questions.<br><em>Clearer decisions.</em>', 'A starting point for planning your construction, renovation or finishing enquiry.')}<section class="wrap faq-page">${faqList()}<div class="reading-width"><h2>Questions about the agreement?</h2><p>Ask Regardin about quotation validity, deposits, warranties, availability and the requirements for your site. These details need confirmation for your specific work.</p></div></section>${cta()}`;
    case 'contact':
      return contact();
    case 'areas':
      return `${heading('KENSINGTON / CAPE TOWN', 'Tell us where<br><em>the work is.</em>', 'Regardin Construction is based in Kensington, Cape Town. Include your project suburb so availability for your location can be confirmed.')}<section class="wrap archive-note"><span class="archive-index">CPT</span><div><h2>A location is part of the brief.</h2><p>Share the suburb, access conditions and whether the work is inside or outside. You do not need to publish a residential street address to start an enquiry.</p>${link('/contact/', 'Discuss your location', 'button')}${notice('exact service areas; no suburb pages published without supporting evidence')}</div></section>${cta()}`;
    case 'privacy':
      return `${heading('WEBSITE PRIVACY / DRAFT', 'Your information.<br>Your project.', 'This draft explains the current preview and the intended enquiry service. It requires owner and legal review before launch.')}<article class="wrap legal"><h2>The current preview</h2><p>This preview does not load analytics, advertising tags or marketing cookies. The brief-preparation tools work on your device. Opening an email draft sends the text to your chosen email application; a brief is not delivered to Regardin until you send it.</p><h2>Direct calls and emails</h2><p>If you call or email Regardin, your contact details and message are available to the recipient. Ask Regardin about how correspondence is handled and retained.</p><h2>The planned online enquiry service</h2><p>Once connected, the form is intended to use the cPanel hosting account for private enquiry records and attachments, session verification and rate limits for abuse prevention, and its approved mail service for notifications. The form will state when online submission becomes available.</p><h2>Your choices and rights</h2><p>Use the contact details on this website to ask about your enquiry information. Under applicable South African privacy law, requests can include access, correction and deletion, subject to legal retention requirements.</p>${notice('responsible legal entity, Information Officer, retention periods, provider agreements, cross-border safeguards and privacy contact')}</article>${cta()}`;
    case 'terms':
      return `${heading('WEBSITE TERMS / DRAFT', 'A clear agreement<br>comes before the work.', 'These draft website terms are for review. They do not replace a project contract.')}<article class="wrap legal"><h2>Website information</h2><p>Service descriptions provide a starting point for an enquiry. They do not constitute a fixed price, a confirmed booking or a complete specification.</p><h2>Project arrangements</h2><p>Scope, exclusions, materials, approvals, timing, payment terms, variations and any warranty need to be agreed directly and recorded in the project agreement.</p><h2>Illustrations and project photographs</h2><p>The photographs shown are reused from Regardin Construction’s existing website. Descriptive captions identify the visible work; they do not add project locations, dates, prices or specifications that the source does not provide.</p>${notice('legal entity, governing terms, quotation validity, deposits and warranty wording; legal approval required')}</article>${cta()}`;
    case 'thanks':
      return `${heading('ENQUIRY STATUS', 'Check your<br>enquiry receipt.', 'Opening this page alone does not mean an enquiry has been received.')}<section class="wrap content-section reading-width"><div id="receipt-status"><p>A successful online submission returns a receipt after the enquiry is stored. If you sent an email, check your email app’s sent folder.</p></div>${link('/contact/', 'Return to contact', 'button')}</section>`;
    case 'styleguide':
      return `${heading('REGARDIN / PROPOSED DESIGN SYSTEM', 'Form. Material.<br><em>Finish.</em>', 'Source photography, warm mineral tones, a green brand accent and editorial typography.')}<section class="wrap content-section"><div class="swatches">${['#242824', '#e8e4da', '#f8f7f3', '#0b6244'].map((c) => `<div><span style="background:${c}"></span><p>${c}</p></div>`).join('')}</div><h2>Bodoni Moda / Editorial headings</h2><p class="lead">DM Sans / Body — clear, open, quiet.</p>${link('/contact/', 'Primary action', 'button')}<div class="content-section">${faqList(2)}</div>${process()}</section>`;
    default:
      return `${heading('PAGE NOT FOUND', 'A different<br>way forward.', 'This page could not be found. Explore the services or return to the homepage.')}<section class="wrap content-section">${link('/', 'Return home', 'button')}${link('/services/', 'Explore the services')}</section>`;
  }
}
export function render(route, mode = 'preview') {
  const current = (path) =>
    route.path === path || (path === '/services/' && route.kind === 'service')
      ? ' aria-current="page"'
      : '';
  const preview = mode !== 'production';
  const canonical = `${business.url}${route.path}`;
  const businessId = business.url + '/#business';
  const breadcrumbs = [
    { '@type': 'ListItem', position: 1, name: 'Home', item: business.url + '/' },
  ];
  if (route.kind === 'service')
    breadcrumbs.push({
      '@type': 'ListItem',
      position: 2,
      name: 'Services',
      item: business.url + '/services/',
    });
  if (route.kind === 'project')
    breadcrumbs.push({
      '@type': 'ListItem',
      position: 2,
      name: 'Projects',
      item: business.url + '/projects/',
    });
  if (route.path !== '/')
    breadcrumbs.push({
      '@type': 'ListItem',
      position: breadcrumbs.length + 1,
      name: route.kind === 'service' ? route.service.title : route.title.split(' | ')[0],
      item: canonical,
    });
  const entities = [
    {
      '@type': 'GeneralContractor',
      '@id': businessId,
      name: business.name,
      url: business.url,
      telephone: business.phone,
    },
    {
      '@type': route.kind === 'service' ? 'Service' : 'WebPage',
      '@id': canonical + '#page',
      name: route.title,
      url: canonical,
      description: route.description,
      ...(route.kind === 'service'
        ? { serviceType: route.service.title, provider: { '@id': businessId } }
        : { about: { '@id': businessId } }),
    },
  ];
  if (breadcrumbs.length > 1)
    entities.push({ '@type': 'BreadcrumbList', itemListElement: breadcrumbs });
  if (['home', 'service', 'faq', 'styleguide'].includes(route.kind))
    entities.push({
      '@type': 'FAQPage',
      mainEntity: faqs
        .slice(0, route.kind === 'faq' ? faqs.length : route.kind === 'styleguide' ? 2 : 3)
        .map((f) => ({
          '@type': 'Question',
          name: f.question,
          acceptedAnswer: { '@type': 'Answer', text: f.answer },
        })),
    });
  const socialSlug =
    route.kind === 'service' ? servicePhotos[route.service.slug] : 'decking-pergola';
  const socialImage =
    (globalThis.process.env.SITE_ORIGIN || business.url) +
    (globalThis.process.env.SITE_BASE || '/').replace(/\/$/, '') +
    (images[socialSlug]?.og || '/images/decking-pergola-og.jpg');
  const schema = { '@context': 'https://schema.org', '@graph': entities };

  return `<!DOCTYPE html><html lang="en-ZA" class="no-js"><head><meta charset="UTF-8"><script src="/js/boot.js"></script><link rel="preload" href="/fonts/dm-sans-latin-400-normal.woff2" as="font" type="font/woff2" crossorigin><link rel="preload" href="/fonts/bodoni-moda-latin-400-normal.woff2" as="font" type="font/woff2" crossorigin><link rel="preload" href="/fonts/bodoni-moda-latin-400-italic.woff2" as="font" type="font/woff2" crossorigin><link rel="preload" href="/fonts/dm-sans-latin-600-normal.woff2" as="font" type="font/woff2" crossorigin><meta name="viewport" content="width=device-width, initial-scale=1"><title>${escape(route.title)}</title><meta name="description" content="${escape(route.description)}"><meta name="robots" content="${preview || route.noindex ? 'noindex, nofollow' : 'index, follow'}"><meta name="theme-color" content="#f8f7f3"><link rel="canonical" href="${canonical}"><meta property="og:type" content="website"><meta property="og:title" content="${escape(route.title)}"><meta property="og:description" content="${escape(route.description)}"><meta property="og:url" content="${canonical}"><meta property="og:site_name" content="Regardin Construction"><meta property="og:image" content="${socialImage}"><meta property="og:image:alt" content="${escape(images[socialSlug]?.alt || 'Regardin Construction portfolio')}"><meta name="twitter:card" content="summary_large_image"><link rel="icon" href="/favicon.svg" type="image/svg+xml"><script type="application/ld+json">${JSON.stringify(schema).replace(/</g, '\\u003c')}</script><script type="module" src="/src/main.js"></script></head><body><a href="#main" class="skip-link">Skip to content</a><header class="site-header"><div class="wrap header-inner"><a href="/" class="brand" aria-label="Regardin Construction home"><img class="source-logo" src="/images/regardin-logo.webp" width="372" height="90" alt="Regardin Construction"></a><button type="button" class="menu-toggle" aria-controls="navigation" aria-expanded="false"><span>Menu</span><span class="menu-bars" aria-hidden="true"></span></button><nav id="navigation" aria-label="Main navigation"><a href="/about/"${current('/about/')}>About</a><a href="/services/"${current('/services/')}>Services</a><a href="/projects/"${current('/projects/')}>Portfolio</a><a href="/how-we-work/"${current('/how-we-work/')}>How we work</a><a class="nav-contact" href="/contact/"${current('/contact/')}>Request a quote ${arrow}</a></nav></div></header><main id="main">${content(route)}</main><footer><div class="wrap footer-grid"><div><a href="/" class="brand footer-brand"><img class="source-logo" src="/images/regardin-logo.webp" width="372" height="90" alt="Regardin Construction"></a><p>${copy.footer.description}</p><p class="footer-location">${business.location}</p></div><div><h2>Explore</h2><a href="/services/">Services</a><a href="/projects/">Our portfolio</a><a href="/about/">About Regardin</a><a href="/faq/">Project questions</a><a href="/areas/">Location enquiries</a></div><div><h2>Start a conversation</h2><a href="tel:${business.phoneHref}">${business.phone.replaceAll(' ', '&nbsp;')}</a><a href="mailto:${business.email}">${business.email}</a>${link('/contact/', 'Discuss your project')}</div></div><div class="wrap footer-bottom"><span>© ${new Date().getFullYear()} Regardin Construction${preview ? ' · Design preview' : ''}</span><div><a href="/privacy-policy/">Privacy</a><a href="/terms-of-service/">Terms</a><button type="button" id="privacy-settings">Privacy choices</button></div><span>BUILDING. RENOVATING. FINISHING.</span></div></footer><nav class="mobile-contact" aria-label="Mobile contact"><a href="tel:${business.phoneHref}">Call&nbsp;Regardin</a><a href="/contact/">Request a quote ${arrow}</a></nav><dialog id="privacy-dialog"><button type="button" class="dialog-close" aria-label="Close privacy choices">×</button><p class="eyebrow">YOUR PRIVACY</p><h2>No marketing cookies.</h2><p>This preview does not load analytics or advertising trackers. Your project brief stays on your device until you choose to email it or submit it to a configured service.</p><a href="/privacy-policy/">Read the privacy notice</a></dialog></body></html>`
    .split(/(<script[\s\S]*?<\/script>)/g)
    .map((part) =>
      part.startsWith('<script')
        ? part
        : part.replace(/&(?!amp;|lt;|gt;|quot;|nbsp;|#(?:\d+|x[\da-f]+);)/gi, '&amp;'),
    )
    .join('');
}
