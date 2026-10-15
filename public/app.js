/* Avvos HQ: greeting and clock, the daily thought, today's one thing,
   the ask bar, keyboard shortcuts, the drifting dust and zen breathing. */
(() => {
  'use strict';

  const root = document.documentElement;
  const $ = (sel) => document.querySelector(sel);
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // localStorage can be missing or throw (private windows, blocked storage); HQ still works without it.
  const store = {
    get(key) {
      try {
        const raw = localStorage.getItem(key);
        return raw ? JSON.parse(raw) : null;
      } catch {
        return null;
      }
    },
    set(key, value) {
      try {
        localStorage.setItem(key, JSON.stringify(value));
      } catch {
        /* nothing to do */
      }
    },
  };

  const pad = (n) => String(n).padStart(2, '0');
  const ymd = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  const dayOfYear = (d) =>
    Math.round((new Date(d.getFullYear(), d.getMonth(), d.getDate()) - new Date(d.getFullYear(), 0, 0)) / 864e5);

  const phaseFor = (h) => (h >= 5 && h < 8 ? 'dawn' : h >= 8 && h < 17 ? 'day' : h >= 17 && h < 20 ? 'dusk' : 'night');

  function saluteFor(h) {
    if (h < 5) return 'Still up';
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    if (h < 22) return 'Good evening';
    return 'Good night';
  }

  function whisperSlot(h) {
    if (h < 5) return 'late';
    if (h < 8) return 'dawn';
    if (h < 12) return 'morning';
    if (h < 17) return 'afternoon';
    if (h < 22) return 'evening';
    return 'night';
  }

  const fadeIn = (el) => {
    if (!reduceMotion && el.animate) el.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 700, easing: 'ease-out' });
  };

  /* ---------- dust: slow motes drifting upward ---------- */

  const dust = (() => {
    const canvas = $('#dust');
    const ctx = canvas && canvas.getContext('2d');
    if (!ctx) return { recolor() {} };

    let w = 0;
    let h = 0;
    let raf = 0;
    let color = '#b9d0ff';
    const motes = [];

    const makeMote = (anywhere) => ({
      x: Math.random() * w,
      y: anywhere ? Math.random() * h : h + 4,
      r: Math.random() * 1.1 + 0.25,
      vx: (Math.random() - 0.5) * 0.06,
      vy: -(Math.random() * 0.12 + 0.03),
      a: Math.random() * 0.45 + 0.12,
      t: Math.random() * Math.PI * 2,
    });

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const target = Math.round(Math.min(90, (w * h) / 15000));
      while (motes.length < target) motes.push(makeMote(true));
      motes.length = target;
      for (const m of motes) {
        m.x = ((m.x % w) + w) % w;
        m.y = ((m.y % h) + h) % h;
      }
    }

    function draw(move) {
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = color;
      for (let i = 0; i < motes.length; i++) {
        const m = motes[i];
        if (move) {
          m.x += m.vx;
          m.y += m.vy;
          m.t += 0.012;
          if (m.y < -4) motes[i] = makeMote(false);
        }
        ctx.globalAlpha = m.a * (0.55 + 0.45 * Math.sin(m.t));
        ctx.beginPath();
        ctx.arc(m.x, m.y, m.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    }

    function loop() {
      draw(true);
      raf = requestAnimationFrame(loop);
    }

    function start() {
      cancelAnimationFrame(raf);
      if (reduceMotion) draw(false);
      else raf = requestAnimationFrame(loop);
    }

    window.addEventListener('resize', () => {
      resize();
      if (reduceMotion) draw(false);
    });
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) cancelAnimationFrame(raf);
      else start();
    });

    resize();
    start();

    return {
      recolor() {
        color = getComputedStyle(root).getPropertyValue('--glow-a').trim() || color;
        if (reduceMotion) draw(false);
      },
    };
  })();

  /* ---------- the seconds dial ---------- */

  function syncSweep(el) {
    if (!el) return;
    const now = new Date();
    el.style.animationDelay = `-${now.getSeconds() + now.getMilliseconds() / 1000}s`;
  }
  syncSweep($('.hero .sweep'));

  /* ---------- the daily thought ---------- */

  const THOUGHTS = window.HQ_THOUGHTS || [];
  const WHISPERS = window.HQ_WHISPERS || {};
  const quoteEl = $('#quote');
  const citeEl = $('#cite');
  const zenThought = $('#zen-thought');
  let thoughtIndex = 0;

  function showThought(i, animate) {
    const t = THOUGHTS[i];
    if (!t) return;
    quoteEl.textContent = `“${t.text}”`;
    citeEl.textContent = `${t.who} · ${t.where}`;
    zenThought.textContent = `“${t.text}” ${t.who}`;
    if (animate) {
      fadeIn(quoteEl);
      fadeIn(citeEl);
    }
  }

  function renderThought(now) {
    if (!THOUGHTS.length) return;
    thoughtIndex = (dayOfYear(now) * 7 + now.getFullYear()) % THOUGHTS.length;
    showThought(thoughtIndex, false);
  }

  $('#thought-next').addEventListener('click', () => {
    if (!THOUGHTS.length) return;
    thoughtIndex = (thoughtIndex + 1) % THOUGHTS.length;
    showThought(thoughtIndex, true);
  });

  /* ---------- today's one thing ---------- */

  const intentForm = $('#intent-form');
  const intentInput = $('#intent-input');
  const intentSet = $('#intent-set');
  const intentText = $('#intent-text');
  const intentDone = $('#intent-done');
  const intentNote = $('#intent-note');
  const carry = $('#carry');
  const carryText = $('#carry-text');

  const intentKey = (d) => `hq.intent.${ymd(d)}`;

  function renderIntent() {
    const now = new Date();
    const item = store.get(intentKey(now));
    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);
    const prev = store.get(intentKey(yesterday));

    intentForm.hidden = Boolean(item);
    intentSet.hidden = !item;
    if (item) {
      intentText.textContent = item.text;
      intentDone.setAttribute('aria-pressed', String(Boolean(item.done)));
      intentSet.classList.toggle('is-done', Boolean(item.done));
    }
    intentNote.hidden = !(item && item.done);
    intentNote.textContent = 'Done. That was the day well spent.';

    const showCarry = !item && prev && prev.text && !prev.done;
    carry.hidden = !showCarry;
    if (showCarry) carryText.textContent = prev.text;
  }

  intentForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const text = intentInput.value.trim();
    if (!text) {
      intentInput.focus();
      return;
    }
    store.set(intentKey(new Date()), { text, done: false });
    intentInput.value = '';
    renderIntent();
    fadeIn(intentSet);
    intentDone.focus();
  });

  intentDone.addEventListener('click', () => {
    const key = intentKey(new Date());
    const item = store.get(key);
    if (!item) {
      // storage is unavailable; still let the check reflect the click
      const pressed = intentDone.getAttribute('aria-pressed') !== 'true';
      intentDone.setAttribute('aria-pressed', String(pressed));
      intentSet.classList.toggle('is-done', pressed);
      intentNote.hidden = !pressed;
      return;
    }
    item.done = !item.done;
    store.set(key, item);
    renderIntent();
  });

  $('#intent-edit').addEventListener('click', () => {
    intentInput.value = intentText.textContent;
    intentSet.hidden = true;
    intentNote.hidden = true;
    intentForm.hidden = false;
    intentInput.focus();
    intentInput.select();
  });

  $('#carry-btn').addEventListener('click', () => {
    const text = carryText.textContent;
    store.set(intentKey(new Date()), { text, done: false });
    renderIntent();
    if (intentSet.hidden) {
      // storage is unavailable; show it for this visit anyway
      intentText.textContent = text;
      intentForm.hidden = true;
      intentSet.hidden = false;
      carry.hidden = true;
    }
    fadeIn(intentSet);
  });

  /* ---------- ask a mind ---------- */

  const MINDS = {
    claude: {
      name: 'Claude',
      home: 'https://claude.ai/new',
      ask: (q) => `https://claude.ai/new?q=${encodeURIComponent(q)}`,
    },
    chatgpt: {
      name: 'ChatGPT',
      home: 'https://chatgpt.com/',
      ask: (q) => `https://chatgpt.com/?q=${encodeURIComponent(q)}`,
    },
  };

  const askForm = $('#ask-form');
  const askInput = $('#ask-input');
  const askGo = $('#ask-go');
  const mindButtons = [...document.querySelectorAll('.seg [data-mind]')];
  let mind = MINDS[store.get('hq.mind')] ? store.get('hq.mind') : 'claude';

  function syncAsk() {
    const m = MINDS[mind];
    const q = askInput.value.trim();
    askGo.href = q ? m.ask(q) : m.home;
    askGo.textContent = `Ask ${m.name}`;
    askInput.placeholder = `Ask ${m.name} anything`;
    for (const b of mindButtons) {
      const on = b.dataset.mind === mind;
      b.setAttribute('aria-checked', String(on));
      b.tabIndex = on ? 0 : -1;
    }
  }

  function setMind(next, focus) {
    mind = next;
    store.set('hq.mind', mind);
    syncAsk();
    if (focus) mindButtons.find((b) => b.dataset.mind === mind).focus();
  }

  for (const b of mindButtons) {
    b.addEventListener('click', () => {
      setMind(b.dataset.mind, false);
      askInput.focus();
    });
    b.addEventListener('keydown', (e) => {
      if (!['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(e.key)) return;
      e.preventDefault();
      const i = mindButtons.indexOf(b);
      const step = e.key === 'ArrowLeft' || e.key === 'ArrowUp' ? -1 : 1;
      setMind(mindButtons[(i + step + mindButtons.length) % mindButtons.length].dataset.mind, true);
    });
  }

  askInput.addEventListener('input', syncAsk);
  askForm.addEventListener('submit', (e) => {
    e.preventDefault();
    syncAsk();
    askGo.click();
    askInput.value = '';
    syncAsk();
  });
  syncAsk();

  /* ---------- the lens looks toward the pointer ---------- */

  if (!reduceMotion && window.matchMedia('(pointer: fine)').matches) {
    let pending = false;
    let px = 0;
    let py = 0;
    const clamp = (v) => Math.max(-1, Math.min(1, v));
    window.addEventListener(
      'pointermove',
      (e) => {
        px = e.clientX;
        py = e.clientY;
        if (pending) return;
        pending = true;
        requestAnimationFrame(() => {
          pending = false;
          for (const el of document.querySelectorAll('.presence')) {
            const r = el.getBoundingClientRect();
            if (!r.width) continue;
            el.style.setProperty('--lx', clamp(((px - (r.left + r.width / 2)) / window.innerWidth) * 2.4).toFixed(3));
            el.style.setProperty('--ly', clamp(((py - (r.top + r.height / 2)) / window.innerHeight) * 2.4).toFixed(3));
          }
        });
      },
      { passive: true },
    );
  }

  /* ---------- zen: breathe with the orb ---------- */

  const BREATH = [
    { label: 'Breathe in', ms: 4000, state: 'in' },
    { label: 'Hold', ms: 4000, state: 'hold' },
    { label: 'Breathe out', ms: 6000, state: 'out' },
  ];

  const app = $('#app');
  const zen = $('#zen');
  const zenPresence = $('#zen-presence');
  const breathEl = $('#breath');
  const breathCount = $('#breath-count');
  const presence = $('#presence');
  let zenOn = false;
  let zenTimer = 0;

  function enterZen() {
    if (zenOn) return;
    zenOn = true;
    if (!zenPresence.firstElementChild) zenPresence.appendChild($('#orb').cloneNode(true)).removeAttribute('id');
    syncSweep(zenPresence.querySelector('.sweep'));
    breathEl.textContent = 'Settle in';
    breathCount.textContent = '';
    document.body.classList.add('is-zen');
    zen.setAttribute('aria-hidden', 'false');
    app.inert = true;
    setTimeout(() => $('#zen-exit').focus({ preventScroll: true }), 300);

    let i = 0;
    let round = 1;
    const step = () => {
      const b = BREATH[i];
      zenPresence.style.setProperty('--breath-ms', `${b.ms}ms`);
      zenPresence.dataset.breath = b.state;
      breathEl.textContent = b.label;
      breathCount.textContent = `Breath ${round}`;
      fadeIn(breathEl);
      zenTimer = setTimeout(() => {
        i = (i + 1) % BREATH.length;
        if (i === 0) round += 1;
        step();
      }, b.ms);
    };
    zenTimer = setTimeout(step, 1600);
  }

  function exitZen() {
    if (!zenOn) return;
    zenOn = false;
    clearTimeout(zenTimer);
    delete zenPresence.dataset.breath;
    document.body.classList.remove('is-zen');
    zen.setAttribute('aria-hidden', 'true');
    app.inert = false;
    presence.focus({ preventScroll: true });
  }

  presence.addEventListener('click', enterZen);
  $('#zen-open').addEventListener('click', enterZen);
  $('#zen-exit').addEventListener('click', exitZen);

  /* ---------- keyboard ---------- */

  document.addEventListener('keydown', (e) => {
    if (e.metaKey || e.ctrlKey || e.altKey || e.isComposing) return;
    const t = e.target;
    const typing = t && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName));

    if (e.key === 'Escape') {
      if (zenOn) exitZen();
      else if (typing) t.blur();
      return;
    }
    if (typing) return;
    if (e.key === 'z' || e.key === 'Z') {
      if (zenOn) exitZen();
      else enterZen();
      return;
    }
    if (zenOn) return;
    if (e.key === '/') {
      e.preventDefault();
      askInput.focus();
      return;
    }
    const room = document.querySelector(`.room[data-key="${CSS.escape(e.key)}"]`);
    if (room) {
      e.preventDefault();
      room.click();
    }
  });

  /* ---------- clock, greeting and the day ---------- */

  const dateFmt = new Intl.DateTimeFormat('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  const dateEl = $('#date');
  let currentDay = '';

  function tick() {
    const now = new Date();
    const h = now.getHours();
    root.dataset.phase = phaseFor(h);
    $('#salute').textContent = saluteFor(h);
    dateEl.textContent = dateFmt.format(now);
    dateEl.dateTime = ymd(now);
    $('#clock').textContent = `${pad(h)}:${pad(now.getMinutes())}`;

    const list = WHISPERS[whisperSlot(h)] || [];
    if (list.length) $('#whisper').textContent = list[(dayOfYear(now) + h) % list.length];

    if (ymd(now) !== currentDay) {
      currentDay = ymd(now);
      renderThought(now);
      renderIntent();
    }
    dust.recolor();
  }

  tick();
  setTimeout(() => {
    tick();
    setInterval(tick, 60000);
  }, (60 - new Date().getSeconds()) * 1000 + 50);
})();
