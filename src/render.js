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
      'The Regardin Construction project archive. Approved photographs and project details are being prepared for publication.',
    kind: 'projects',
  },
  ...projects
    .filter((p) => p.approved || p.template)
    .map((project) => ({
      path: `/projects/${project.slug}/`,
      title: `${project.title} | Regardin`,
      description: project.approved
        ? 'A documented Regardin Construction project, with confirmed scope and approved photographs.'
        : 'A project-page layout for review. Project facts and photographs are pending approval; no completed project is claimed.',
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
const notice = (text) => `<p class="confirmation">[CONFIRM: ${escape(text)}]</p>`;
const heading = (eyebrow, title, body, extra = '') =>
  `<section class="page-heading wrap"><p class="eyebrow">${eyebrow}</p><h1>${title}</h1><p class="lead">${body}</p>${extra}</section>`;
const serviceList = (limit = services.length) =>
  `<div class="service-list">${services
    .slice(0, limit)
    .map(
      (s, i) =>
        `<a href="/services/${s.slug}/" class="service-row"><span class="row-number">0${i + 1}</span><div><h3>${s.title}</h3><p>${s.short}</p></div>${arrow}</a>`,
    )
    .join('')}</div>`;
const faqList = (limit = faqs.length) =>
  `<div class="faq-list">${faqs
    .slice(0, limit)
    .map(
      (f, i) =>
        `<details ${i === 0 ? 'open' : ''}><summary>${escape(f.question)}<span aria-hidden="true">+</span></summary><p>${escape(f.answer)}</p></details>`,
    )
    .join('')}</div>`;
const cta = () =>
  `<section class="closing-cta"><div class="wrap cta-inner"><p class="eyebrow">YOUR NEXT CHAPTER</p><h2>Tell us what<br>you have in mind.</h2><div><p>A room to rethink. A wall to build. A space to finish.<br>Start with a conversation about the work.</p>${link('/contact/', 'Discuss your project', 'button button-light')}</div></div></section>`;
const process = () =>
  `<ol class="process-list"><li><span>01</span><h3>Describe the space</h3><p>Tell us what you want to change, where it is and how you plan to use it.</p></li><li><span>02</span><h3>Bring the details</h3><p>Share dimensions, photographs and any available plans. Highlight access and site conditions.</p></li><li><span>03</span><h3>Agree the scope</h3><p>Establish the work, materials, timing and written terms before proceeding.</p></li></ol>`;
const quotes = () =>
  `<div class="quotes">${testimonials.map((t) => `<figure><span class="quote-mark" aria-hidden="true">“</span><blockquote><p>${escape(t.excerpt)}</p></blockquote><figcaption>${escape(t.name)}<span>Excerpt recorded on the existing website</span></figcaption></figure>`).join('')}</div>${notice('testimonial publication permission and attribution approval')}`;
export function picture(slug, { hero = false, className = '' } = {}) {
  const image = images[slug];
  if (!image) return '';
  const webp = image.variants.filter((v) => v.format === 'webp');
  const avif = image.variants.filter((v) => v.format === 'avif');
  const fallback = webp.at(-1);
  return `<picture class="${escape(className)}"><source type="image/avif" srcset="${avif.map((v) => `${v.url} ${v.width}w`).join(', ')}" sizes="(max-width: 600px) 100vw, 60vw"><img src="${fallback.url}" srcset="${webp.map((v) => `${v.url} ${v.width}w`).join(', ')}" sizes="(max-width: 600px) 100vw, 60vw" width="${fallback.width}" height="${fallback.height}" alt="${escape(image.alt)}" loading="${hero ? 'eager' : 'lazy'}" ${hero ? 'fetchpriority="high"' : ''} decoding="async"></picture>`;
}
export function comparison(project) {
  if (!images[project.before] || !images[project.after]) return '';
  return `<section class="wrap project-comparison"><p class="eyebrow">THE CHANGE IN CONTEXT</p><h2>Before & after.</h2><div class="comparison" data-comparison><div class="comparison-images"><figure class="comparison-before">${picture(project.before)}<figcaption>Before</figcaption></figure><figure class="comparison-after">${picture(project.after)}<figcaption>After</figcaption></figure></div><div class="comparison-control" hidden><label for="comparison-slider">Compare before and after</label><input id="comparison-slider" type="range" min="0" max="100" value="50" aria-label="Before and after image split"></div></div></section>`;
}
function projectPage(project) {
  const fact = (key, label) => (project[key] ? escape(project[key]) : `[CONFIRM: ${label}]`);
  const visual =
    project.hero && images[project.hero]
      ? picture(project.hero, { hero: true })
      : `<figure class="detail-art">${drawing('space')}<figcaption>Layout illustration · real project photograph awaiting approval</figcaption></figure>`;
  return `${heading('PROJECT STORY / ' + (project.approved ? 'CONFIRMED WORK' : 'LAYOUT PREVIEW'), project.approved ? escape(project.title) : 'A project,<br><em>in detail.</em>', project.approved ? escape(project.brief) : 'This page shows the case-study layout. It does not describe a completed project. Confirmed facts and approved photographs will replace the marked fields.')}<section class="wrap project-story"><div class="project-facts"><div><span>Project</span><p>${project.approved ? escape(project.title) : '[CONFIRM: approved project name]'}</p></div><div><span>Location</span><p>${fact('suburb', 'project suburb')}</p></div><div><span>Completed</span><p>${fact('year', 'completion year')}</p></div><div><span>Duration</span><p>${fact('duration', 'project duration')}</p></div></div>${visual}<div class="story-grid"><h2>The brief.<br>The work.<br>The details.</h2><div>${[
    ['brief', 'The client brief'],
    ['scope', 'Regardin’s scope'],
    ['constraints', 'Site constraints'],
    ['materials', 'Materials & finishes'],
  ]
    .map(
      ([key, label]) =>
        `<section><h3>${label}</h3><p class="${project[key] ? '' : 'confirmation'}">${fact(key, label)}</p></section>`,
    )
    .join('')}</div></div></section>${comparison(project)}${cta()}`;
}
function home() {
  return `<section class="hero"><div class="wrap hero-grid"><div class="hero-copy"><p class="eyebrow"><span class="tiny-line"></span> KENSINGTON · CAPE TOWN</p><h1>Building.<br>Renovating.<br><em>Making space.</em></h1><p>Building, renovation and finishing work for homes and businesses. From brickwork to the final coat.</p><div class="hero-actions">${link('/contact/', 'Discuss your project', 'button')}${link('/services/', 'Explore the services')}</div><p class="hero-footnote">REGARDIN CONSTRUCTION <span>—</span> A CONSIDERED APPROACH</p></div><figure class="hero-art">${drawing('space', true)}<span class="vertical-label" aria-hidden="true">FORM. MATERIAL. FINISH.</span><figcaption><span>01 / SPACE & STRUCTURE</span><span>Concept illustration</span></figcaption></figure></div></section>
 <section class="intro wrap"><p class="eyebrow">THE WORK STARTS WITH YOUR SPACE</p><div class="intro-grid"><h2>New possibilities.<br><em>Existing places.</em></h2><div><p class="lead">Some projects change a whole building. Others change the way one corner feels.</p><p>Regardin Construction is based in Kensington, Cape Town, with building and finishing services spanning renovation, masonry, painting, timber and concrete.</p>${link('/about/', 'Get to know Regardin')}</div></div></section>
 <section class="services-section wrap"><div class="section-header"><div><p class="eyebrow">01 / WHAT WE DO</p><h2>From structure<br>to surface.</h2></div><p>Work with the space you have.<br>Build towards the space you need.</p></div>${serviceList(5)}${link('/services/', 'All building & finishing services', 'text-link section-link')}</section>
 <section class="material-section"><div class="wrap"><div class="section-header"><div><p class="eyebrow">02 / FORM & MATERIAL</p><h2>Details make<br><em>the difference.</em></h2></div><p>Explore the work by material.<br>Concept drawings shown while the<br>approved project archive is prepared.</p></div><div class="material-grid"><a class="material-card" href="/services/carpentry-decking-pergolas/"><figure>${drawing('timber')}<figcaption><span>01 — TIMBER</span>${arrow}</figcaption></figure><h3>Warmth. Grain. Structure.</h3><p>Carpentry, decking & pergolas</p></a><a class="material-card" href="/services/concrete-work/"><figure>${drawing('steps')}<figcaption><span>02 — CONCRETE</span>${arrow}</figcaption></figure><h3>Form with purpose.</h3><p>Slabs, stairs & concrete work</p></a></div>${link('/projects/', 'About the project archive', 'text-link section-link')}</div></section>
 <section class="planning wrap"><div class="section-header"><div><p class="eyebrow">03 / A CLEAR START</p><h2>Good work begins<br>with a good brief.</h2></div>${link('/how-we-work/', 'Planning your project')}</div>${process()}</section>
 <section class="review-section wrap"><p class="eyebrow">04 / CLIENT WORDS · PREVIEW</p><h2>The people<br><em>behind the projects.</em></h2>${quotes()}${link('/reviews/', 'Read the full testimonials')}</section>
 <section class="questions wrap"><div><p class="eyebrow">05 / BEFORE YOU BEGIN</p><h2>A few useful<br>answers.</h2>${link('/faq/', 'More project questions')}</div>${faqList(3)}</section>${cta()}`;
}
function contact() {
  return `${heading('LET’S TALK ABOUT THE WORK', 'Every project starts<br>with a conversation.', 'Tell us about your space, your location and what you want to change.')}<section class="contact-layout wrap"><aside class="contact-details"><h2>Contact Regardin</h2><a href="tel:${business.phoneHref}" class="contact-call">${business.phone.replaceAll(' ', '&nbsp;')}</a><a href="mailto:${business.email}">${business.email}</a><p>${business.location}<br>South Africa</p><div class="contact-note"><h3>Prefer to send an email?</h3><p>Use the brief below to organise your thoughts, then open it in your email app. It stays on this device until you choose to send it.</p></div>${notice('primary monitored email and contact details before launch')}</aside><div><div class="form-notice" role="note"><strong>A useful brief, ready to send.</strong><p>The online submission service is not connected yet. You can prepare your brief here and send it using your email app, or call Regardin directly.</p></div><form id="enquiry-form" action="/api/enquiries" method="post" enctype="multipart/form-data"><input type="hidden" name="idempotencyKey" value=""><div class="honeypot" aria-hidden="true"><label for="website">Leave this empty</label><input type="text" id="website" name="website" tabindex="-1" autocomplete="off"></div><div class="form-grid"><div class="field"><label for="name">Your name <span>(required)</span></label><input type="text" id="name" name="name" autocomplete="name" maxlength="100" required></div><div class="field"><label for="phone">Phone number <span>(required)</span></label><input id="phone" name="phone" type="tel" autocomplete="tel" maxlength="40" required></div><div class="field"><label for="email">Email address <span>(required)</span></label><input id="email" name="email" type="email" autocomplete="email" maxlength="254" required></div><div class="field"><label for="suburb">Project suburb <span>(required)</span></label><input type="text" id="suburb" name="suburb" autocomplete="address-level2" maxlength="100" required></div><div class="field full"><label for="service">Type of work <span>(required)</span></label><select id="service" name="service" required><option value="">Select a service</option>${services.map((s) => `<option value="${s.slug}">${s.title}</option>`).join('')}<option value="not-sure">Not sure yet</option></select></div><div class="field full"><label for="brief">Tell us about the project <span>(required)</span></label><textarea id="brief" name="brief" rows="5" minlength="20" maxlength="5000" placeholder="What would you like to build, change or finish?" required></textarea></div><div class="field full"><label for="timing">Preferred timing <span>(optional)</span></label><input type="text" id="timing" name="timing" maxlength="150" placeholder="For example, flexible or planning for next year"></div><div class="field full" id="upload-field" hidden><label for="photos">Photographs or plans <span>(optional)</span></label><input id="photos" name="photos" type="file" accept="image/jpeg,image/png,image/webp,application/pdf" multiple><p class="field-hint">Up to 5 files, 8 MB each. JPEG, PNG, WebP or PDF. No sensitive personal documents.</p></div></div><p class="privacy-note">Your details are used to respond to your project enquiry. Read the <a href="/privacy-policy/">privacy notice</a>. No marketing opt-in is required.</p><div id="turnstile-container"></div><div class="form-actions"><button type="button" id="email-brief" class="button">Prepare an email ${arrow}</button><button type="submit" id="submit-enquiry" class="button" hidden>Request a project quote ${arrow}</button><button type="button" id="copy-brief" class="text-link">Copy project brief</button></div><p id="form-status" role="status" aria-live="polite"></p><noscript><p>Online submission is not configured for this preview. <a href="mailto:${business.email}">Email Regardin</a> or call ${business.phone.replaceAll(' ', '&nbsp;')}.</p></noscript></form></div></section>${cta()}`;
}
function content(route) {
  switch (route.kind) {
    case 'home':
      return home();
    case 'services':
      return `${heading('BUILDING & FINISHING', 'A space for<br>every kind of work.', 'Explore the services, then tell us what your project needs. The final scope is agreed for your site and brief.')}<section class="wrap content-section"><h2 class="visually-hidden">Building and finishing services</h2>${serviceList()}</section>${cta()}`;
    case 'service': {
      const s = route.service;
      return `${heading('SERVICES / CAPE TOWN', `${s.title}<br><em>in Cape Town.</em>`, s.description)}<section class="service-detail wrap"><figure class="detail-art">${drawing(s.drawing)}<figcaption>Material study · concept illustration, not project photography</figcaption></figure><div><p class="eyebrow">A STARTING POINT FOR YOUR BRIEF</p><h2>Tell us what<br>the work involves.</h2><ul class="scope-list">${s.items.map((i) => `<li>${i}</li>`).join('')}</ul><p class="field-hint">These are enquiry categories, not a fixed package of inclusions. Scope, exclusions and specialist requirements are agreed for each project.</p><h3>Before you begin</h3><p>${s.consideration}</p>${link('/contact/?service=' + s.slug, 'Discuss this project', 'button')}</div></section><section class="wrap planning"><p class="eyebrow">WHAT TO SHARE</p><h2>A clear starting point.</h2>${process()}</section><section class="wrap questions"><div><p class="eyebrow">PROJECT QUESTIONS</p><h2>Before the<br>first conversation.</h2></div>${faqList(3)}</section>${cta()}`;
    }
    case 'about':
      return `${heading('ABOUT REGARDIN', 'Building around<br><em>the way you live.</em>', 'Regardin Construction is based in Kensington, Cape Town, with construction and finishing services for homes and businesses.')}<section class="service-detail wrap"><figure class="detail-art">${drawing('space')}<figcaption>Space & structure · concept illustration</figcaption></figure><div><p class="eyebrow">STRUCTURE. MATERIAL. FINISH.</p><h2>One space.<br>Many possibilities.</h2><p>A renovation can mean reworking an existing room. It can mean a new opening, an outdoor timber structure, a concrete surface or a carefully prepared coat of paint.</p><p>Start with what you need the space to do. Bring the details of your site, your ideas and any plans, and use them to establish the work.</p>${link('/services/', 'Explore the services')}${notice('Regard’s role, business history, legal entity and operating model; omitted until verified')}</div></section>${cta()}`;
    case 'project':
      return projectPage(route.project);
    case 'projects':
      return `${heading('THE PROJECT ARCHIVE', 'Real work.<br><em>Its own story.</em>', 'Project photographs should show the work clearly. Project stories should describe what actually happened.')}<section class="archive-note wrap"><span class="archive-index">R / 01</span><div><h2>The archive is being prepared.</h2><p>Approved project photographs and their context are still being assembled. We will add the scope, location and details only when they have been confirmed.</p><p>The drawings across this preview are material studies. They are not photographs of completed Regardin projects.</p>${link('/contact/', 'Ask about work relevant to your project')}${notice('project photographs, publication permission, scope and attribution')}${link('/projects/project-preview/', 'Review the project-page layout')}</div></section><section class="material-section"><div class="wrap"><p class="eyebrow">IN THE MEANTIME</p><h2>Explore by material.</h2><div class="material-grid">${services
        .filter((s) => ['timber', 'steps'].includes(s.drawing))
        .map(
          (s) =>
            `<a class="material-card" href="/services/${s.slug}/"><figure>${drawing(s.drawing)}<figcaption><span>CONCEPT STUDY</span>${arrow}</figcaption></figure><h3>${s.title}</h3><p>${s.short}</p></a>`,
        )
        .join('')}</div></div></section>${cta()}`;
    case 'process':
      return `${heading('PLANNING THE WORK', 'A clear brief.<br><em>A useful beginning.</em>', 'These are practical steps for preparing a project enquiry. Project-specific arrangements are agreed directly with Regardin.')}<section class="wrap content-section"><h2 class="visually-hidden">Preparing your project brief</h2>${process()}<div class="reading-width"><h2>Put the important details in writing.</h2><p>Record the work included and excluded, the material choices, access arrangements, timing and payment terms. Ask how changes to the agreed scope will be discussed and documented.</p><h3>When plans or specialist advice are needed</h3><p>Structural work, changes to a building and some outdoor structures may require professional design or approvals. The requirements depend on your project and location; establish them before construction.</p>${notice('site-supervision arrangements, progress updates, snagging and handover procedure')}</div></section>${cta()}`;
    case 'reviews':
      return `${heading('CLIENT WORDS / PREVIEW', 'The words belong<br><em>to the clients.</em>', 'These testimonials were recorded on the existing website in the supplied audit. They are shown here for review, without added stars or claims.')}<section class="wrap full-reviews">${testimonials.map((t) => `<figure><blockquote><p>“${escape(t.quote)}”</p></blockquote><figcaption>${escape(t.name)}<span>${escape(t.source)}</span></figcaption></figure>`).join('')}${notice('permission to republish testimonials; these are not labelled as Google reviews')}</section>${cta()}`;
    case 'faq':
      return `${heading('BEFORE YOU BEGIN', 'Useful questions.<br><em>Clearer decisions.</em>', 'A starting point for planning your construction, renovation or finishing enquiry.')}<section class="wrap faq-page">${faqList()}<div class="reading-width"><h2>Questions about the agreement?</h2><p>Ask Regardin about quotation validity, deposits, warranties, availability and the requirements for your site. These details need confirmation for your specific work.</p></div></section>${cta()}`;
    case 'contact':
      return contact();
    case 'areas':
      return `${heading('KENSINGTON / CAPE TOWN', 'Tell us where<br><em>the work is.</em>', 'Regardin Construction is based in Kensington, Cape Town. Include your project suburb so availability for your location can be confirmed.')}<section class="wrap archive-note"><span class="archive-index">CPT</span><div><h2>A location is part of the brief.</h2><p>Share the suburb, access conditions and whether the work is inside or outside. You do not need to publish a residential street address to start an enquiry.</p>${link('/contact/', 'Discuss your location', 'button')}${notice('exact service areas; no suburb pages published without supporting evidence')}</div></section>${cta()}`;
    case 'privacy':
      return `${heading('WEBSITE PRIVACY / DRAFT', 'Your information.<br>Your project.', 'This draft explains the current preview and the intended enquiry service. It requires owner and legal review before launch.')}<article class="wrap legal"><h2>The current preview</h2><p>This preview does not load analytics, advertising tags or marketing cookies. The brief-preparation tools work on your device. Opening an email draft sends the text to your chosen email application; a brief is not delivered to Regardin until you send it.</p><h2>Direct calls and emails</h2><p>If you call or email Regardin, your contact details and message are available to the recipient. Ask Regardin about how correspondence is handled and retained.</p><h2>The planned online enquiry service</h2><p>Once connected, the form is intended to use Cloudflare D1 for enquiry records, private Cloudflare R2 storage for optional attachments, Cloudflare Turnstile for abuse prevention and a transactional email provider for notifications. The form will state when online submission becomes available.</p><h2>Your choices and rights</h2><p>Use the contact details on this website to ask about your enquiry information. Under applicable South African privacy law, requests can include access, correction and deletion, subject to legal retention requirements.</p>${notice('responsible legal entity, Information Officer, retention periods, provider agreements, cross-border safeguards and privacy contact')}</article>${cta()}`;
    case 'terms':
      return `${heading('WEBSITE TERMS / DRAFT', 'A clear agreement<br>comes before the work.', 'These draft website terms are for review. They do not replace a project contract.')}<article class="wrap legal"><h2>Website information</h2><p>Service descriptions provide a starting point for an enquiry. They do not constitute a fixed price, a confirmed booking or a complete specification.</p><h2>Project arrangements</h2><p>Scope, exclusions, materials, approvals, timing, payment terms, variations and any warranty need to be agreed directly and recorded in the project agreement.</p><h2>Illustrations and project photographs</h2><p>Concept drawings are labelled as illustrations. No drawing is presented as a completed Regardin project. Project photographs will be published only when permission and context have been confirmed.</p>${notice('legal entity, governing terms, quotation validity, deposits and warranty wording; legal approval required')}</article>${cta()}`;
    case 'thanks':
      return `${heading('ENQUIRY STATUS', 'Check your<br>enquiry receipt.', 'Opening this page alone does not mean an enquiry has been received.')}<section class="wrap content-section reading-width"><div id="receipt-status"><p>A successful online submission returns a receipt after the enquiry is stored. If you sent an email, check your email app’s sent folder.</p></div>${link('/contact/', 'Return to contact', 'button')}</section>`;
    case 'styleguide':
      return `${heading('REGARDIN / PROPOSED DESIGN SYSTEM', 'Form. Material.<br><em>Finish.</em>', 'An editorial palette inspired by plaster, dark timber and oxidised terracotta.')}<section class="wrap content-section"><div class="swatches">${['#1e1f1c', '#e9e4da', '#f7f5f0', '#a1432e'].map((c) => `<div><span style="background:${c}"></span><p>${c}</p></div>`).join('')}</div><h2>Bodoni Moda / Heading</h2><p class="lead">DM Sans / Body — clear, open, quiet.</p>${link('/contact/', 'Primary action', 'button')}<div class="content-section">${faqList(2)}</div>${process()}</section>`;
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
  const schema = { '@context': 'https://schema.org', '@graph': entities };

  return `<!DOCTYPE html><html lang="en-ZA" class="no-js"><head><meta charset="UTF-8"><link rel="preload" href="/fonts/dm-sans-latin-400-normal.woff2" as="font" type="font/woff2" crossorigin><link rel="preload" href="/fonts/dm-sans-latin-600-normal.woff2" as="font" type="font/woff2" crossorigin><link rel="preload" href="/fonts/bodoni-moda-latin-400-normal.woff2" as="font" type="font/woff2" crossorigin><link rel="preload" href="/fonts/bodoni-moda-latin-400-italic.woff2" as="font" type="font/woff2" crossorigin><meta name="viewport" content="width=device-width, initial-scale=1"><title>${escape(route.title)}</title><meta name="description" content="${escape(route.description)}"><meta name="robots" content="${preview || route.noindex ? 'noindex, nofollow' : 'index, follow'}"><meta name="theme-color" content="#f7f5f0"><link rel="canonical" href="${canonical}"><meta property="og:type" content="website"><meta property="og:title" content="${escape(route.title)}"><meta property="og:description" content="${escape(route.description)}"><meta property="og:url" content="${canonical}"><meta property="og:site_name" content="Regardin Construction"><meta name="twitter:card" content="summary"><link rel="icon" href="/favicon.svg" type="image/svg+xml"><script type="application/ld+json">${JSON.stringify(schema).replace(/</g, '\\u003c')}</script><script type="module" src="/src/main.js"></script></head><body>${preview ? '<section class="preview-strip" aria-label="Preview status"><span>DESIGN PREVIEW</span> <span>Content & project photography awaiting approval</span></section>' : ''}<a href="#main" class="skip-link">Skip to content</a><header class="site-header"><div class="wrap header-inner"><a href="/" class="brand" aria-label="Regardin Construction home"><span class="brand-mark" aria-hidden="true">R<span>.</span></span><span class="brand-name">REGARDIN<span>CONSTRUCTION</span></span></a><button type="button" class="menu-toggle" aria-controls="navigation" aria-expanded="false"><span>Menu</span><span class="menu-bars" aria-hidden="true"></span></button><nav id="navigation" aria-label="Main navigation"><a href="/about/"${current('/about/')}>About</a><a href="/services/"${current('/services/')}>Services</a><a href="/projects/"${current('/projects/')}>The work</a><a href="/how-we-work/"${current('/how-we-work/')}>Planning</a><a class="nav-contact" href="/contact/"${current('/contact/')}>Let’s talk ${arrow}</a></nav></div></header><main id="main">${content(route)}</main><footer><div class="wrap footer-grid"><div><a href="/" class="brand footer-brand"><span class="brand-mark" aria-hidden="true">R<span>.</span></span><span class="brand-name">REGARDIN<span>CONSTRUCTION</span></span></a><p>Building, renovation<br>and finishing work.</p><p class="footer-location">${business.location}</p></div><div><h2>Explore</h2><a href="/services/">Services</a><a href="/projects/">Project archive</a><a href="/about/">About Regardin</a><a href="/faq/">Project questions</a><a href="/areas/">Location enquiries</a></div><div><h2>Start a conversation</h2><a href="tel:${business.phoneHref}">${business.phone.replaceAll(' ', '&nbsp;')}</a><a href="mailto:${business.email}">${business.email}</a>${link('/contact/', 'Discuss your project')}</div></div><div class="wrap footer-bottom"><span>© ${new Date().getFullYear()} Regardin Construction</span><div><a href="/privacy-policy/">Privacy</a><a href="/terms-of-service/">Terms</a><button type="button" id="privacy-settings">Privacy choices</button></div><span>BUILT AROUND THE WORK.</span></div></footer><nav class="mobile-contact" aria-label="Mobile contact"><a href="tel:${business.phoneHref}">Call&nbsp;Regardin</a><a href="/contact/">Discuss your project ${arrow}</a></nav><dialog id="privacy-dialog"><button type="button" class="dialog-close" aria-label="Close privacy choices">×</button><p class="eyebrow">YOUR PRIVACY</p><h2>No marketing cookies.</h2><p>This preview does not load analytics or advertising trackers. Your project brief stays on your device until you choose to email it or submit it to a configured service.</p><a href="/privacy-policy/">Read the privacy notice</a></dialog></body></html>`
    .split(/(<script[\s\S]*?<\/script>)/g)
    .map((part) =>
      part.startsWith('<script')
        ? part
        : part.replace(/&(?!amp;|lt;|gt;|quot;|nbsp;|#(?:\d+|x[\da-f]+);)/gi, '&amp;'),
    )
    .join('');
}
