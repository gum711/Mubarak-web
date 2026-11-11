import { profile } from './content.js';

const SHORT = { ram: 'RAM', storage: 'OS', network: 'NET', cpu: 'CPU' };

const ICONS = {
  whatsapp: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.5 11.6a8.5 8.5 0 0 1-12.6 7.5L3.5 20.5l1.4-4.3A8.5 8.5 0 1 1 20.5 11.6Z"/><path d="M9 9.2c.3 1.9 2.4 4.4 4.9 5.2l1.2-1.2-1.7-1-.8.6c-.9-.4-1.8-1.3-2.2-2.2l.6-.8-1-1.7Z" fill="currentColor" stroke="none"/></svg>',
  email: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></svg>',
  instagram: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor"/></svg>',
  cv: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v12"/><path d="m7 10 5 5 5-5"/><path d="M5 21h14"/></svg>',
};

export function cardHTML(stage) {
  return `<article class="info-card" data-stage="${stage.id}">
    <p class="code mono">${stage.part} · FIXED ✓</p>
    <h3>${stage.label}</h3>
    <ul>${stage.info.map((i) => `<li>${i}</li>`).join('')}</ul>
  </article>`;
}

export function contactsHTML() {
  const c = profile.contacts;
  return `
    <a class="primary" href="${c.whatsapp}" target="_blank" rel="noopener">
      ${ICONS.whatsapp}
      <div class="btn-text">
        <span>تواصل عبر واتساب</span>
        <small class="mono">Direct Response</small>
      </div>
    </a>
    <a href="mailto:${c.email}" class="contact-card">
      ${ICONS.email}
      <div class="btn-text">
        <span>البريد الإلكتروني</span>
        <small class="mono">Outlook</small>
      </div>
    </a>
    <a href="${c.instagram}" target="_blank" rel="noopener" class="contact-card">
      ${ICONS.instagram}
      <div class="btn-text">
        <span>انستقرام</span>
        <small class="mono" dir="ltr">@guum</small>
      </div>
    </a>
    <a href="${c.cv}" download="Mubarak-AlMalki-CV.pdf" class="cv-btn">
      ${ICONS.cv}
      <span>تحميل السيرة الذاتية</span>
      <em class="mono">PDF</em>
    </a>`;
}

/** Fill every content slot in the DOM from content.js. */
export function render() {
  const $ = (s) => document.querySelector(s);

  $('#intro-name').textContent = '';
  $('#intro-name').dataset.target = profile.name;
  $('#intro-title').textContent = profile.title;

  $('#steps').innerHTML = profile.stages
    .map((s) => `<li data-id="${s.id}"><i></i><span>${SHORT[s.id]}</span></li>`)
    .join('');

  for (const s of profile.stages) {
    $(`#status-${s.id} .st-fault`).textContent = s.faultText;
    $(`#status-${s.id} .st-fixed`).textContent = s.fixedText;
  }

  $('#cards').innerHTML = profile.stages.map(cardHTML).join('');

  $('#final-name').textContent = profile.name;
  $('#final-title').textContent = profile.title;
  $('#final-line').textContent = profile.finalLine;
  $('#contacts').innerHTML = contactsHTML();
}

/** Plain, motion-free version of the whole story. */
export function renderStatic() {
  document.querySelector('#static-summary').innerHTML = `
    <header class="intro"><h1>${profile.name}</h1><p class="mono">${profile.title}</p></header>
    ${profile.stages.map(cardHTML).join('')}
    <section class="final">
      <p class="mono final-tag">✓ SYSTEM RESTORED</p>
      <p class="final-line">${profile.finalLine}</p>
      <nav class="contacts">${contactsHTML()}</nav>
    </section>`;
}
