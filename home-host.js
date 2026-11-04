// PROTOTYPE · "Host at the window" home page → advisor module ("Desktop / 02 Conversation", Figma 72:2020).
//
// Starting the chat anywhere on the page (the advisor card's composer in "Three ways to begin", a prompt chip,
// a service row) opens the advisor
// as its own module under the sticky header, grown out of whatever started it:
//   1. the module's cream layer opens from that element's box to the full viewport (clip-path);
//   2. when it started in the advisor card's composer (`heroForm`, named from when it sat in the hero), a copy of that composer flies to the module's composer, so the
//      box you typed in is the box you keep typing in;
//   3. the bar, the thread and the side cards rise in behind it, and the advisor asks its next question.
// "Start over" and Escape run it backwards into the hero. With reduced motion every step is instant.
//
// The intake (goal → where you feel it → routine → plan) is fixed UI copy from the Figma frame, not AI output.
// The plan step goes through window.ZenyraAdvisor.ask (main.js), which is the one hook the backend engineer
// will connect; until then it answers with the "coming soon, please call" line. Nothing here invents a
// recommendation, a price or a duration.
(() => {
  const i18n = window.ZenyraI18n;
  const t = (key) => i18n.t(key);
  const module = document.querySelector('#advisor-module');
  const heroForm = document.querySelector('[data-host-form]');
  if (!module || !heroForm) return;

  const thread = module.querySelector('[data-am-thread]');
  const form = module.querySelector('[data-am-form]');
  const input = form.elements.q;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  const EASE = 'cubic-bezier(.22, 1, .36, 1)';
  const OPEN_MS = 640;
  const CLOSE_MS = 460;
  const TYPING_MS = 750;
  const ms = (value) => (reduce.matches ? 0 : value);

  const WHERE = ['am.where1', 'am.where2', 'am.where3', 'am.where4', 'am.where5']; // last = "Not sure"
  const ROUTINE = ['am.routine1', 'am.routine2', 'am.routine3'];
  const GOALS = { 'host.q1': 'am.goal1', 'host.q2': 'am.goal2', 'host.q3': 'am.goal3', 'host.q4': 'am.goal4' };

  let state = null;
  let origin = null;     // the element the module grew out of, to shrink back into
  let busy = false;      // true while an open/close animation runs

  // ---------- Thread ----------
  function scrollToEnd() {
    module.scrollTo({ top: module.scrollHeight, behavior: reduce.matches ? 'auto' : 'smooth' });
  }

  function aiMessage(text, { animate = true } = {}) {
    const row = document.createElement('div');
    row.className = 'am-msg am-msg--ai';
    const avatar = document.createElement('img');
    avatar.className = 'am-avatar';
    avatar.src = 'assets/images/zenyra-icon.png';
    avatar.alt = '';
    const bubble = document.createElement('div');
    bubble.className = 'am-bubble';
    const who = document.createElement('span');
    who.className = 'am-who';
    who.textContent = t('am.who');
    const body = document.createElement('p');
    if (text === null) {
      body.className = 'am-typing';
      body.setAttribute('aria-label', t('am.typing'));
      body.innerHTML = '<i></i><i></i><i></i>';
    } else {
      body.textContent = text;
    }
    bubble.append(who, body);
    row.append(avatar, bubble);
    if (animate) row.classList.add('am-in');
    thread.append(row);
    return row;
  }

  function guestMessage(text, { animate = true } = {}) {
    const row = document.createElement('div');
    row.className = 'am-msg am-msg--guest';
    const bubble = document.createElement('p');
    bubble.className = 'am-bubble';
    bubble.textContent = text;
    row.append(bubble);
    if (animate) row.classList.add('am-in');
    thread.append(row);
    scrollToEnd();
    return row;
  }

  // The advisor "types" for a moment, then the bubble fills in. Returns once the text is showing.
  async function advisorSays(text) {
    const row = aiMessage(null);
    scrollToEnd();
    await wait(ms(TYPING_MS) || 250);
    if (!row.isConnected) return null;
    const body = row.querySelector('p');
    body.className = '';
    body.removeAttribute('aria-label');
    body.textContent = typeof text === 'function' ? await text() : text;
    scrollToEnd();
    return row;
  }

  function replies(keys, { multi = false } = {}) {
    const group = document.createElement('div');
    group.className = 'am-replies am-in';
    group.setAttribute('role', 'group');
    group.setAttribute('aria-label', t('am.repliesLabel'));
    keys.forEach((key) => {
      const chip = document.createElement('button');
      chip.type = 'button';
      chip.dataset.key = key;
      chip.textContent = t(key);
      if (multi) chip.setAttribute('aria-pressed', 'false');
      group.append(chip);
    });
    thread.append(group);
    scrollToEnd();
    return group;
  }

  function lockReplies(group, chosen = []) {
    group?.querySelectorAll('button').forEach((chip) => {
      chip.disabled = true;
      chip.setAttribute('aria-pressed', String(chosen.includes(chip.dataset.key)));
    });
  }

  // ---------- Progress + "What we've heard" ----------
  function render() {
    if (!state) return;
    const step = Math.min(state.step, 4);
    module.querySelector('[data-am-step]').textContent = t('am.stepOf').replace('{n}', step);
    module.querySelector('[data-am-step-name]').textContent = t(`am.step${step}`);
    module.querySelectorAll('.am-track i').forEach((bar, index) => bar.classList.toggle('is-done', index < step));
    const facts = { goal: 1, where: 2, routine: 3 };
    Object.entries(facts).forEach(([name, asked]) => {
      const dd = module.querySelector(`[data-am-fact="${name}"]`);
      const value = state[name];
      const text = value ? (value.key ? t(value.key) : value.text) : state.step === asked ? t('am.answering') : '—';
      dd.textContent = text;
      dd.classList.toggle('is-pending', !value);
    });
  }

  // ---------- The intake ----------
  async function askWhere(fromKey) {
    state.step = 2;
    render();
    await advisorSays(t(fromKey === 'host.q1' ? 'am.askWhereStress' : 'am.askWhere'));
    if (!state) return;
    state.whereGroup = replies(WHERE, { multi: true });
  }

  async function askRoutine() {
    state.step = 3;
    render();
    await advisorSays(t('am.askRoutine'));
    if (!state) return;
    state.routineGroup = replies(ROUTINE);
  }

  async function plan() {
    state.step = 4;
    render();
    await advisorSays(t('am.planIntro'));
    if (!state) return;
    const summary = [state.goal, state.where, state.routine].map((v) => (v.key ? t(v.key) : v.text)).join(' · ');
    await advisorSays(async () => {
      try { return await window.ZenyraAdvisor.ask(summary, i18n.lang); } catch { return t('chat.placeholderReply'); }
    });
    if (!state) return;
    const actions = document.createElement('div');
    actions.className = 'am-actions am-in';
    actions.innerHTML = `
      <a class="button" href="https://zenyra-book.mase.cloud/" target="_blank" rel="noopener" data-book></a>
      <a class="button button--ghost" href="tel:+14157124366"></a>`;
    actions.children[0].textContent = t('am.bookFirst');
    actions.children[1].textContent = `${t('am.call')} (415) 712-4366`;
    thread.append(actions);
    state.step = 5;
    scrollToEnd();
  }

  // Whatever the visitor sends goes to the step they are on; after the plan it is a free question.
  async function answer(text, key = null) {
    if (!state || state.waiting) return;
    state.waiting = true;
    guestMessage(text);
    input.value = '';
    try {
      if (state.step === 2) {
        lockReplies(state.whereGroup, state.picked);
        state.where = key && state.picked.length === 1 ? { key } : { text };
        await askRoutine();
      } else if (state.step === 3) {
        lockReplies(state.routineGroup, key ? [key] : []);
        state.routine = key ? { key } : { text };
        await plan();
      } else {
        await advisorSays(async () => {
          try { return await window.ZenyraAdvisor.ask(text, i18n.lang); } catch { return t('chat.placeholderReply'); }
        });
      }
    } finally {
      if (state) state.waiting = false;
    }
  }

  thread.addEventListener('click', (event) => {
    const chip = event.target.closest('.am-replies button');
    if (!chip || chip.disabled || !state) return;
    if (chip.hasAttribute('aria-pressed')) {
      // "Where": pick any; the composer collects the picks and Send answers. "Not sure" stands alone.
      const notSure = chip.dataset.key === WHERE[WHERE.length - 1];
      const on = chip.getAttribute('aria-pressed') !== 'true';
      chip.parentElement.querySelectorAll('button').forEach((other) => {
        if (other === chip) return;
        const otherNotSure = other.dataset.key === WHERE[WHERE.length - 1];
        if (on && (notSure || otherNotSure)) other.setAttribute('aria-pressed', 'false');
      });
      chip.setAttribute('aria-pressed', String(on));
      state.picked = [...chip.parentElement.querySelectorAll('[aria-pressed="true"]')].map((b) => b.dataset.key);
      input.value = state.picked.map(t).join(t('am.listJoin'));
      input.focus({ preventScroll: true });
    } else {
      answer(chip.textContent, chip.dataset.key);
    }
  });

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const text = input.value.trim();
    if (!text || !state) return;
    const picked = state.step === 2 && state.picked.length && text === state.picked.map(t).join(t('am.listJoin'));
    answer(text, picked ? state.picked[0] : null);
  });

  // ---------- Open / close ----------
  const wait = (time) => new Promise((resolve) => setTimeout(resolve, time));

  // Settle on whichever comes first: the animation's own finish, or a timer at its scheduled end. Chrome
  // resolves `finished` from the rendering loop, which it suspends in a background tab, so `finished` alone
  // would strand the module half-open for anyone who starts a chat and switches tabs.
  function done(animation) {
    const timing = animation.effect.getComputedTiming();
    const end = (timing.endTime || 0) + 50;
    return Promise.race([animation.finished.catch(() => {}), wait(end)]).then(() => animation.finish?.());
  }

  // clip-path inset that puts the module's visible area exactly over `rect` (viewport coordinates).
  function insetFor(rect) {
    const box = module.getBoundingClientRect();
    const top = Math.max(0, rect.top - box.top);
    const left = Math.max(0, rect.left - box.left);
    const right = Math.max(0, box.right - rect.right);
    const bottom = Math.max(0, box.bottom - rect.bottom);
    const radius = Math.min(rect.height / 2, 32);
    return `inset(${top}px ${right}px ${bottom}px ${left}px round ${radius}px)`;
  }

  function inView(el) {
    const rect = el.getBoundingClientRect();
    return rect.bottom > 0 && rect.top < window.innerHeight && rect.width > 0;
  }

  // A fixed copy of the hero composer that travels from `from` to `to` while the real ones are hidden.
  function flyComposer(from, to, text, duration) {
    const ghost = heroForm.cloneNode(true);
    ghost.removeAttribute('data-host-form');
    ghost.querySelectorAll('[id]').forEach((el) => el.removeAttribute('id'));
    ghost.querySelector('label')?.remove();
    ghost.setAttribute('aria-hidden', 'true');
    ghost.inert = true;
    const field = ghost.querySelector('input');
    field.value = text;
    Object.assign(ghost.style, { position: 'fixed', margin: '0', zIndex: '45', boxSizing: 'border-box', pointerEvents: 'none' });
    document.body.append(ghost);
    const frame = (r) => ({ left: `${r.left}px`, top: `${r.top}px`, width: `${r.width}px`, height: `${r.height}px` });
    const move = ghost.animate([frame(from), frame(to)], { duration, easing: EASE, fill: 'forwards' });
    field.animate([{ opacity: 1 }, { opacity: 0 }], { duration: duration * .5, easing: 'ease-out', fill: 'forwards' });
    return done(move).finally(() => ghost.remove());
  }

  function reveal(direction = 'in') {
    const parts = [...module.querySelectorAll('[data-am-reveal]'), ...thread.children];
    return Promise.all(parts.map((el, index) => {
      if (direction === 'in') {
        return done(el.animate(
          [{ opacity: 0, transform: 'translateY(16px)' }, { opacity: 1, transform: 'none' }],
          { duration: ms(520), delay: ms(200 + index * 60), easing: EASE, fill: 'backwards' }
        ));
      }
      return done(el.animate([{ opacity: 1 }, { opacity: 0 }], { duration: ms(160), easing: 'ease-out', fill: 'forwards' }));
    }));
  }

  async function open(text, { from, key = null } = {}) {
    if (busy || state) return;
    busy = true;
    origin = from || heroForm;

    // Fresh conversation: greeting + what they said, already in place so the layout is final before measuring.
    state = { step: 1, goal: key && GOALS[key] ? { key: GOALS[key] } : { text }, where: null, routine: null, picked: [], waiting: true };
    thread.replaceChildren();
    aiMessage(t('am.greeting'), { animate: false });
    guestMessage(text, { animate: false });
    render();

    const startRect = origin.getBoundingClientRect();
    const flying = origin === heroForm && inView(heroForm);
    module.hidden = false;
    module.scrollTop = 0;
    document.documentElement.classList.add('am-open');
    document.querySelectorAll('main, footer').forEach((el) => { el.inert = true; });

    const jobs = [
      done(module.animate([{ clipPath: insetFor(startRect) }, { clipPath: 'inset(0px 0px 0px 0px round 0px)' }], { duration: ms(OPEN_MS), easing: EASE })),
      reveal('in')
    ];
    if (flying && !reduce.matches) {
      heroForm.style.visibility = 'hidden';
      form.style.opacity = '0';
      jobs.push(flyComposer(startRect, form.getBoundingClientRect(), text, OPEN_MS).then(() => { form.style.opacity = ''; }));
    }
    await Promise.all(jobs);
    heroForm.style.visibility = '';
    heroForm.reset();
    busy = false;
    input.focus({ preventScroll: true });
    await askWhere(key); // state.waiting stays true until the first quick replies are showing
    if (state) state.waiting = false;
  }

  async function close({ instant = false } = {}) {
    if (busy || !state) return;
    busy = true;
    state = null; // stops any reply still "typing"
    const target = origin && inView(origin) ? origin.getBoundingClientRect() : null;
    if (!instant && !reduce.matches) {
      await reveal('out');
      const end = target ? insetFor(target) : 'inset(50% 50% 50% 50% round 32px)';
      await done(module.animate([{ clipPath: 'inset(0px 0px 0px 0px round 0px)' }, { clipPath: end }], { duration: CLOSE_MS, easing: EASE, fill: 'forwards' }));
    }
    module.hidden = true;
    module.getAnimations({ subtree: true }).forEach((animation) => animation.cancel());
    document.documentElement.classList.remove('am-open');
    document.querySelectorAll('main, footer').forEach((el) => { el.inert = false; });
    thread.replaceChildren();
    input.value = '';
    busy = false;
    if (!instant) (origin === heroForm ? heroForm.querySelector('input') : origin)?.focus({ preventScroll: true });
  }

  // ---------- Triggers ----------
  heroForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const text = heroForm.elements.q.value.trim();
    if (text) open(text, { from: heroForm });
  });

  document.querySelectorAll('[data-host-q]').forEach((button) => {
    button.addEventListener('click', () => {
      const key = button.dataset.hostQ;
      const fromHero = Boolean(button.closest('.host-ask'));
      if (fromHero) heroForm.elements.q.value = t(key);
      open(t(key), { from: fromHero ? heroForm : button, key });
    });
  });


  module.querySelector('[data-am-close]').addEventListener('click', () => close());
  document.addEventListener('keydown', (event) => { if (event.key === 'Escape' && state) close(); });
  // The header stays usable while the module is open; following one of its page links closes the module.
  document.querySelectorAll('.site-header a[href^="#"], .site-header a[href$=".html"], .mobile-nav a').forEach((link) => {
    link.addEventListener('click', () => { if (state) close({ instant: true }); });
  });
  document.addEventListener('zenyra:langchange', render);
})();

// ---------- Polish: photographs unveil on view; the Services photo follows the row in focus. ----------
(() => {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');

  // Veil only what the visitor has not seen yet, and only once. Without JS, without IntersectionObserver
  // or with reduced motion nothing is veiled, so no photo can be left hidden. The hero photo, already on
  // screen, unveils right after first paint as the page's one load gesture.
  const photos = [...document.querySelectorAll('[data-reveal]')];
  if (!reduce.matches && 'IntersectionObserver' in window) {
    const unveil = (el) => el.classList.remove('is-veiled');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        unveil(entry.target);
        observer.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -12% 0px' });
    photos.forEach((el) => {
      el.classList.add('is-veiled');
      observer.observe(el);
    });
    // A backstop for the hero: if the observer is slow to report (a background tab), lift it anyway.
    setTimeout(() => photos.filter((el) => el.getBoundingClientRect().top < window.innerHeight).forEach(unveil), 1200);
  }

  // Services: pointing at or focusing a row shows the room it happens in; leaving the list goes back.
  const stack = document.querySelector('.host-services-photo');
  const list = document.querySelector('.service-rows');
  if (!stack || !list) return;
  const show = (name) => {
    const target = stack.querySelector(`[data-photo="${name}"]`) ?? stack.querySelector('[data-photo="default"]');
    stack.querySelectorAll('img').forEach((img) => img.classList.toggle('is-shown', img === target));
  };
  list.querySelectorAll('button').forEach((row) => {
    const name = row.dataset.photo ?? 'default';
    row.addEventListener('pointerenter', () => show(name));
    row.addEventListener('focus', () => show(name));
  });
  list.addEventListener('pointerleave', () => show('default'));
  list.addEventListener('focusout', (event) => { if (!list.contains(event.relatedTarget)) show('default'); });
})();

// ---------- Recognitions: a print of the certificate rises above the card in focus. ----------
(() => {
  const section = document.querySelector('.recognition');
  if (!section || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
  const cards = [...section.querySelectorAll('[data-lightbox]')];
  const preview = document.createElement('figure');
  preview.className = 'rec-preview';
  preview.setAttribute('aria-hidden', 'true'); // the card already names it and opens it full size
  const img = document.createElement('img');
  img.alt = '';
  img.decoding = 'async';
  preview.append(img);
  section.append(preview);

  // Load the five prints the first time the visitor comes near, so the first hover is not empty.
  const ready = new Map();
  const load = (src) => {
    if (!ready.has(src)) {
      const probe = new Image();
      probe.src = src;
      ready.set(src, probe.decode().then(() => probe).catch(() => probe));
    }
    return ready.get(src);
  };
  section.addEventListener('pointerenter', () => cards.forEach((card) => load(card.dataset.lightbox)), { once: true });

  let current = null;
  async function show(card) {
    current = card;
    const probe = await load(card.dataset.lightbox);
    if (current !== card) return;
    const wasOn = preview.classList.contains('is-on');
    img.src = probe.src;
    img.width = probe.naturalWidth || 4;
    img.height = probe.naturalHeight || 3;
    // Place it centred over the card, just above it, kept inside the section's width.
    const width = preview.offsetWidth;
    const height = width / ((probe.naturalWidth || 4) / (probe.naturalHeight || 3)) + 16;
    const box = section.getBoundingClientRect();
    const rect = card.getBoundingClientRect();
    const x = Math.min(Math.max(rect.left - box.left + rect.width / 2 - width / 2, 0), box.width - width);
    const y = rect.top - box.top - height - 12;
    if (!wasOn) preview.classList.add('is-instant'); // appear in place, then slide between cards
    preview.style.transform = `translate(${x}px, ${y}px)`;
    if (!wasOn) { preview.offsetWidth; preview.classList.remove('is-instant'); }
    preview.classList.add('is-on');
  }
  function hide(card) {
    if (current !== card) return;
    current = null;
    preview.classList.remove('is-on');
  }

  cards.forEach((card) => {
    card.addEventListener('pointerenter', () => show(card));
    card.addEventListener('pointerleave', () => hide(card));
    card.addEventListener('focus', () => { if (card.matches(':focus-visible')) show(card); });
    card.addEventListener('blur', () => hide(card));
    card.addEventListener('click', () => hide(card));
  });
})();

// ---------- Motion: the window into the studio, and the surfaces that answer the pointer. ----------
// One scroll-linked value (--p on the hero) drives the window: how far the visitor has scrolled from the first
// screen (the photo peeking in) to the photo's top reaching the header. Everything else is small, local and
// pointer-driven. With reduced motion none of it runs and the page is flat and still (the CSS defaults).
(() => {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (reduce.matches) { document.documentElement.classList.remove('motion'); return; }
  const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const clamp = (v, lo = 0, hi = 1) => Math.min(hi, Math.max(lo, v));

  // The window. Its resting top is measured once per resize from layout (offsetTop ignores the transforms).
  const hero = document.querySelector('.host-hero');
  const win = hero?.querySelector('[data-window]');
  if (hero && win) {
    let start = 0, span = 1, frame = 0, visible = true;
    const headerH = () => document.querySelector('.site-header')?.offsetHeight ?? 0;
    const measure = () => {
      const top = win.offsetTop + hero.offsetTop;
      const h = headerH();
      start = Math.max(0, top - window.innerHeight + 1);           // where it first peeks in (usually 0)
      span = Math.max(1, top - h - start - window.innerHeight * .04); // until its top nears the header
      update();
    };
    const update = () => {
      frame = 0;
      const p = clamp((window.scrollY - start) / span);
      const eased = 1 - Math.pow(1 - p, 2);
      hero.style.setProperty('--p', eased.toFixed(4));
      hero.style.setProperty('--p-text', clamp(p * 1.35).toFixed(4));
    };
    const request = () => { if (visible && !frame) frame = requestAnimationFrame(update); };
    new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; if (visible) request(); }).observe(hero);
    window.addEventListener('scroll', request, { passive: true });
    window.addEventListener('resize', measure);
    window.addEventListener('load', measure);
    measure();

    // The drift leans toward the pointer while it is over the hero.
    if (fine) {
      hero.addEventListener('pointermove', (event) => {
        const box = hero.getBoundingClientRect();
        hero.style.setProperty('--mx', ((event.clientX - box.left) / box.width - .5).toFixed(3));
        hero.style.setProperty('--my', ((event.clientY - box.top) / box.height - .5).toFixed(3));
      });
      hero.addEventListener('pointerleave', () => { hero.style.setProperty('--mx', 0); hero.style.setProperty('--my', 0); });
    }
  }

  if (fine) {
    // Hero buttons: pulled a few px toward the pointer when it comes near, released on leave.
    document.querySelectorAll('[data-magnet]').forEach((el) => {
      const zone = el.parentElement;
      zone.addEventListener('pointermove', (event) => {
        const r = el.getBoundingClientRect();
        const dx = event.clientX - (r.left + r.width / 2);
        const dy = event.clientY - (r.top + r.height / 2);
        const reach = Math.hypot(dx, dy) < r.width * .9;
        el.classList.toggle('is-pulled', reach);
        el.style.setProperty('--tx', reach ? `${(dx * .18).toFixed(1)}px` : '0px');
        el.style.setProperty('--ty', reach ? `${(dy * .28).toFixed(1)}px` : '0px');
      });
      zone.addEventListener('pointerleave', () => { el.classList.remove('is-pulled'); el.style.setProperty('--tx', '0px'); el.style.setProperty('--ty', '0px'); });
    });

    // Cards: a turn of a few degrees toward the pointer and a light under it. [data-glow] takes only the light.
    document.querySelectorAll('[data-tilt], [data-glow]').forEach((el) => {
      const tilts = el.hasAttribute('data-tilt');
      el.addEventListener('pointermove', (event) => {
        const r = el.getBoundingClientRect();
        const x = (event.clientX - r.left) / r.width;
        const y = (event.clientY - r.top) / r.height;
        el.style.setProperty('--gx', `${(x * 100).toFixed(1)}%`);
        el.style.setProperty('--gy', `${(y * 100).toFixed(1)}%`);
        el.classList.add('is-lit');
        if (tilts) {
          el.classList.add('is-tilting');
          el.style.setProperty('--rx', `${((.5 - y) * 7).toFixed(2)}deg`);
          el.style.setProperty('--ry', `${((x - .5) * 9).toFixed(2)}deg`);
        }
      });
      el.addEventListener('pointerleave', () => {
        el.classList.remove('is-lit', 'is-tilting');
        el.style.setProperty('--rx', '0deg');
        el.style.setProperty('--ry', '0deg');
      });
    });
  }

  // Steeping: a heading's teal phrase (and the founder's quote rule) steeps in the first time it is seen.
  // The hero's waits for the welcome to come into focus; anything already scrolled past is simply steeped.
  if ('IntersectionObserver' in window) {
    const steepers = [...document.querySelectorAll('main :is(h1, h2)[data-i18n-rich], .founder-copy blockquote')];
    const steep = (el) => el.classList.add('is-steeped');
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting && entry.boundingClientRect.top > 0) return;
        const el = entry.target;
        io.unobserve(el);
        if (el.closest('.host-hero') && entry.isIntersecting) setTimeout(() => steep(el), 900);
        else steep(el);
      });
    }, { rootMargin: '0px 0px -18% 0px' });
    steepers.forEach((el) => { el.classList.add('steep'); io.observe(el); });
  }

  // Membership tiers: dealt up as a set the first time the list comes into view (only if it starts below the fold).
  document.querySelectorAll('[data-deal]').forEach((list) => {
    if (!('IntersectionObserver' in window) || list.getBoundingClientRect().top < window.innerHeight) return;
    [...list.children].forEach((li, i) => li.style.setProperty('--i', i));
    list.classList.add('is-pending');
    const io = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      list.classList.replace('is-pending', 'is-dealt');
      io.disconnect();
    }, { rootMargin: '0px 0px -15% 0px' });
    io.observe(list);
  });
})();

// ---------- In-page links land where they point. ----------
// A nav click while the page is still settling (web fonts swapping in, photos decoding) can shift the layout after
// the smooth scroll has picked its target, so it overshoots. Once the scroll ends, check where the section sits
// against the header's scroll padding and correct it in one instant step. Same for a link from another page
// (index.html#membership), once everything has loaded.
(() => {
  const padding = () => parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 0;
  const settle = (target) => {
    if (!target) return;
    const off = target.getBoundingClientRect().top - padding();
    if (Math.abs(off) > 4) window.scrollBy({ top: off, behavior: 'instant' });
  };
  const afterScroll = (fn) => {
    let done = false;
    const run = () => { if (done) return; done = true; window.removeEventListener('scrollend', run); fn(); };
    window.addEventListener('scrollend', run);
    setTimeout(run, 1400); // scrollend is missing in older Safari
  };
  document.addEventListener('click', (event) => {
    const link = event.target.closest('a[href^="#"]');
    if (!link || link.getAttribute('href').length < 2) return;
    const target = document.getElementById(link.getAttribute('href').slice(1));
    if (target) afterScroll(() => settle(target));
  });
  if (location.hash.length > 1) {
    const target = document.getElementById(decodeURIComponent(location.hash.slice(1)));
    // Re-check a few times as late layout lands, but stop the moment the visitor scrolls on their own.
    let touched = false;
    const stop = () => { touched = true; };
    ['wheel', 'touchstart', 'keydown', 'pointerdown'].forEach((type) => window.addEventListener(type, stop, { once: true, passive: true }));
    const fix = () => (document.fonts?.ready ?? Promise.resolve()).then(() => {
      [0, 300, 800, 1600].forEach((delay) => setTimeout(() => { if (!touched) settle(target); }, delay));
    });
    if (document.readyState === 'complete') fix(); else window.addEventListener('load', fix, { once: true });
  }
})();
