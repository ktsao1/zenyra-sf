const i18n = window.ZenyraI18n;

document.querySelectorAll('[data-year]').forEach((el) => { el.textContent = new Date().getFullYear(); });

// Header: borderless at the top of the page, a hairline once content scrolls beneath it.
const header = document.querySelector('.site-header');
const markScrolled = () => header?.classList.toggle('is-scrolled', window.scrollY > 8);
markScrolled();
window.addEventListener('scroll', markScrolled, { passive: true });

// Mobile menu
const menuToggle = document.querySelector('.menu-toggle');
const mobileNav = document.querySelector('#mobile-nav');

function setMenu(open) {
  menuToggle.setAttribute('aria-expanded', String(open));
  // The label stays in the button (visually hidden on phones, where the icon shows) so it keeps its name.
  (menuToggle.querySelector('.menu-label') ?? menuToggle).textContent = i18n.t(open ? 'common.close' : 'common.menu');
  mobileNav.hidden = !open;
}

menuToggle?.addEventListener('click', () => setMenu(menuToggle.getAttribute('aria-expanded') !== 'true'));
mobileNav?.addEventListener('click', (event) => { if (event.target.closest('a')) setMenu(false); });
document.addEventListener('zenyra:langchange', () => { if (menuToggle) setMenu(menuToggle.getAttribute('aria-expanded') === 'true'); });

// Language switch: the ink pill sits under the pressed language and slides when it changes (styles.css).
// Measured after i18n.js has marked the pressed button, and again whenever fonts or the layout change its width.
const langSwitches = document.querySelectorAll('.lang-switch');
function placeLangPill() {
  langSwitches.forEach((group) => {
    const on = group.querySelector('[aria-pressed="true"]');
    if (!on || !on.offsetWidth) return;
    group.style.setProperty('--lang-x', `${on.offsetLeft}px`);
    group.style.setProperty('--lang-w', `${on.offsetWidth}px`);
    if (group.classList.contains('is-sliding')) return;
    group.classList.add('is-sliding');
    requestAnimationFrame(() => requestAnimationFrame(() => group.classList.add('is-ready')));
  });
}
document.addEventListener('DOMContentLoaded', placeLangPill);
document.addEventListener('zenyra:langchange', placeLangPill);
window.addEventListener('resize', placeLangPill);
document.fonts?.ready.then(placeLangPill);

// Lightbox: any [data-lightbox] button opens its image; the caption comes from its label or figure caption.
const lightbox = document.querySelector('[data-lightbox-dialog]');
const lightboxImg = document.querySelector('[data-lightbox-img]');
const lightboxCaption = document.querySelector('[data-lightbox-caption]');

document.querySelectorAll('[data-lightbox]').forEach((trigger) => {
  trigger.addEventListener('click', () => {
    const caption = trigger.closest('figure')?.querySelector('figcaption') ?? trigger.querySelector('strong');
    lightboxImg.src = trigger.dataset.lightbox;
    lightboxImg.alt = trigger.querySelector('img')?.alt ?? caption?.textContent ?? '';
    lightboxCaption.textContent = caption?.textContent ?? '';
    lightbox.showModal();
  });
});

document.querySelector('[data-lightbox-close]')?.addEventListener('click', () => lightbox.close());
lightbox?.addEventListener('click', (event) => { if (event.target === lightbox) lightbox.close(); });

// Gallery filters. Where the browser can, the change runs as a View Transition: each photo is named only for
// its duration, so the ones that stay glide to their new places and the rest fade (styles.css, html.gal-filter).
const filters = document.querySelectorAll('[data-filter]');
const galleryItems = [...document.querySelectorAll('[data-cat]')];
filters.forEach((filter) => {
  filter.addEventListener('click', () => {
    if (filter.getAttribute('aria-pressed') === 'true') return;
    const category = filter.dataset.filter;
    const apply = () => {
      filters.forEach((item) => item.setAttribute('aria-pressed', String(item === filter)));
      galleryItems.forEach((item) => {
        item.hidden = category !== 'all' && !item.dataset.cat.split(' ').includes(category);
      });
    };
    const calm = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!document.startViewTransition || calm) { apply(); return; }
    const root = document.documentElement;
    galleryItems.forEach((item, index) => { item.style.viewTransitionName = `g-item-${index}`; });
    root.classList.add('gal-filter');
    document.startViewTransition(apply).finished.finally(() => {
      root.classList.remove('gal-filter');
      galleryItems.forEach((item) => { item.style.viewTransitionName = ''; });
    });
  });
});

// Wellness advisor — placeholder until the backend is ready.
// To connect it, replace ask() with a call to the real service. It receives the question and the current
// language ('en' | 'zh') and must resolve to the reply text.
window.ZenyraAdvisor = window.ZenyraAdvisor ?? {
  async ask(_question, _lang) {
    return i18n.t('chat.placeholderReply');
  }
};

const chatLog = document.querySelector('[data-chat-log]');
const chatForm = document.querySelector('[data-chat-form]');

function addMessage(kind, text) {
  const message = document.createElement('div');
  message.className = `msg msg--${kind}`;
  const who = document.createElement('span');
  who.className = 'msg-who';
  who.textContent = i18n.t(kind === 'ai' ? 'chat.who' : 'chat.you');
  const body = document.createElement('p');
  body.textContent = text;
  message.append(who, body);
  chatLog.append(message);
  chatLog.scrollTop = chatLog.scrollHeight;
  return message;
}

async function askAdvisor(question) {
  addMessage('user', question);
  const pending = addMessage('ai', '…');
  pending.setAttribute('aria-busy', 'true');
  try {
    pending.querySelector('p').textContent = await window.ZenyraAdvisor.ask(question, i18n.lang);
  } catch {
    pending.querySelector('p').textContent = i18n.t('chat.placeholderReply');
  }
  pending.removeAttribute('aria-busy');
}

document.querySelectorAll('[data-chat-q]').forEach((chip) => {
  chip.addEventListener('click', () => askAdvisor(i18n.t(chip.dataset.chatQ)));
});

chatForm?.addEventListener('submit', (event) => {
  event.preventDefault();
  const input = chatForm.elements.q;
  const question = input.value.trim();
  if (!question) return;
  input.value = '';
  askAdvisor(question);
});
