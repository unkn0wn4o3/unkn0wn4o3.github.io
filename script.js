const menu=document.getElementById('menuToggle');
const nav=document.getElementById('nav');
menu?.setAttribute('aria-expanded','false');
menu?.addEventListener('click',()=>{
  const isOpen=nav.classList.toggle('open');
  menu.setAttribute('aria-expanded',isOpen?'true':'false');
});
nav?.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{
  nav.classList.remove('open');
  menu?.setAttribute('aria-expanded','false');
}));
const progress=document.getElementById('progress');
function updateProgress(){
  const max=document.documentElement.scrollHeight-window.innerHeight;
  if(progress) progress.style.width=(max>0?(window.scrollY/max)*100:0)+'%';
}
window.addEventListener('scroll',updateProgress,{passive:true});
window.addEventListener('resize',updateProgress,{passive:true});
updateProgress();
const year=document.getElementById('year');
if(year) year.textContent=new Date().getFullYear();
const reduceMotion=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const revealTargets=document.querySelectorAll('.section-head,.subhead,.media-card,.interest-grid article,.project-card,.social-grid>a,.fact,.ambition-card,.blueprint-subhead');
if('IntersectionObserver' in window && !reduceMotion){
  const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{
    if(entry.isIntersecting){entry.target.classList.add('visible');observer.unobserve(entry.target);}
  }),{threshold:.08,rootMargin:'0px 0px -24px 0px'});
  revealTargets.forEach(el=>{el.classList.add('reveal');observer.observe(el);});
}else{revealTargets.forEach(el=>el.classList.add('visible'));}
// Keep the navigation aware of the section currently in view.
const sectionLinks=[...(nav?.querySelectorAll('a[href^="#"]')||[])];
const observedSections=sectionLinks.map(link=>document.querySelector(link.getAttribute('href'))).filter(Boolean);
if('IntersectionObserver' in window && observedSections.length){
  const activeObserver=new IntersectionObserver(entries=>{
    entries.forEach(entry=>{
      if(!entry.isIntersecting)return;
      sectionLinks.forEach(link=>{
        const active=link.getAttribute('href')==='#'+entry.target.id;
        link.classList.toggle('active',active);
        if(active)link.setAttribute('aria-current','location');else link.removeAttribute('aria-current');
      });
    });
  },{rootMargin:'-25% 0px -60% 0px',threshold:0});
  observedSections.forEach(section=>activeObserver.observe(section));
}


// Cinematic Noir extras: playful custom cursor, status capsule, and back-to-top.
(() => {
  const root = document.documentElement;
  const cursor = document.getElementById('customCursor');
  const finePointer = window.matchMedia('(pointer: fine)').matches;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (cursor && finePointer && !reducedMotion) {
    root.classList.add('cursor-ready');
    let x = window.innerWidth / 2, y = window.innerHeight / 2;
    let tx = x, ty = y;
    const interactive = 'a,button,[role="button"],.media-card,.ambition-card,.project-card,.social-grid>a';
    window.addEventListener('mousemove', (event) => {
      tx = event.clientX; ty = event.clientY;
      cursor.style.transform = `translate(${tx - 5}px, ${ty - 5}px) rotate(-10deg)`;
    }, {passive:true});
    document.addEventListener('mouseover', (event) => {
      const target = event.target.closest(interactive);
      cursor.textContent = target ? '🫵' : '👾';
      cursor.classList.toggle('is-pointing', !!target);
      cursor.style.fontSize = target ? '25px' : '23px';
    });
    document.addEventListener('mouseleave', () => { cursor.style.opacity = '0'; });
    document.addEventListener('mouseenter', () => { cursor.style.opacity = '1'; });
  }
  // Keep the system-status capsule floating at the bottom-right.
  // The copyright remains in its original footer position and stays unobstructed.
  if (!document.querySelector('.site-status')) {
    const status = document.createElement('span');
    status.className = 'site-status';
    status.innerHTML = 'SYSTEM <strong>ONLINE</strong> &nbsp;//&nbsp; BRAIN: 37 TABS';
    status.setAttribute('aria-hidden','true');
    document.body.appendChild(status);
  }
})();


/* UNKNOWN_403 EASTER EGG SYSTEM — local-only, dependency-free. */
(() => {
  'use strict';
  const STORE_KEY = 'unknown403-discoveries-v1';
  const DISCOVERIES = [
    { id: 'terminal', title: 'THE BACKROOM TERMINAL', text: 'You found the command line. Clicking absolutely everything finally paid off.' },
    { id: 'konami', title: 'THE CLASSIC CHEAT CODE', text: '↑ ↑ ↓ ↓ ← → ← → B A — old-school gamer credentials detected.' },
    { id: 'footer', title: 'BOTTOM FEEDER', text: 'You made it to the bottom and paid attention. Respect.' },
    { id: 'fragment', title: 'FINAL FRAGMENT', text: 'Four traces. One identity. You were not just browsing — you were decoding.' }
  ];
  const reducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let found = readFound();
  let terminal = null;
  let toastTimer = null;
  let room = null;
  function readFound() {
    try {
      const raw = JSON.parse(localStorage.getItem(STORE_KEY) || '[]');
      return new Set(Array.isArray(raw) ? raw.filter(id => DISCOVERIES.some(d => d.id === id)) : []);
    } catch (_) { return new Set(); }
  }
  function persist() {
    try { localStorage.setItem(STORE_KEY, JSON.stringify([...found])); } catch (_) { /* Storage may be disabled. Features still work for this page session. */ }
  }
  function ensureTracker() {
    if (document.querySelector('.egg-tracker')) return;
    const tracker = document.createElement('button');
    tracker.type = 'button'; tracker.className = 'egg-tracker'; tracker.setAttribute('aria-label', 'Open secret discovery tracker');
    tracker.innerHTML = '<span class="egg-tracker-dot"></span><span>DISCOVERY REGISTER</span><strong data-egg-count>0 / 4</strong>';
    tracker.addEventListener('click', () => showToast(trackerMessage()));
    document.body.appendChild(tracker);
  }
  function trackerMessage() {
    return `DISCOVERY REGISTER: ${found.size} / ${DISCOVERIES.length}. ${found.size === DISCOVERIES.length ? 'All traces found. The Secret Room is unlocked.' : 'There are still traces hidden in this site.'}`;
  }
  function updateTracker() {
    const counter = document.querySelector('[data-egg-count]');
    if (counter) counter.textContent = `${found.size} / ${DISCOVERIES.length}`;
    const tracker = document.querySelector('.egg-tracker');
    if (tracker) tracker.classList.toggle('complete', found.size === DISCOVERIES.length);
  }
  function showToast(message) {
    let toast = document.querySelector('.egg-toast');
    if (!toast) { toast = document.createElement('div'); toast.className = 'egg-toast'; toast.setAttribute('role','status'); toast.setAttribute('aria-live','polite'); document.body.appendChild(toast); }
    toast.textContent = message; toast.classList.add('show');
    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 3800);
  }
  function discover(id) {
    const item = DISCOVERIES.find(d => d.id === id);
    if (!item) return;
    const fresh = !found.has(id);
    found.add(id); persist(); updateTracker();
    if (fresh) showToast(`TRACE FOUND // ${item.title}`);
    if (found.size === DISCOVERIES.length) {
      setTimeout(() => { unlockRoom(); }, fresh ? 900 : 0);
    }
  }
  function createModal(className, title, inner) {
    const overlay = document.createElement('div'); overlay.className = className; overlay.setAttribute('role','dialog'); overlay.setAttribute('aria-modal','true');
    overlay.innerHTML = `<div class="egg-window"><div class="egg-window-top"><span class="egg-lights"><i></i><i></i><i></i></span><span>unknown403://backroom</span><button type="button" class="egg-close" aria-label="Close window">×</button></div>${inner}</div>`;
    document.body.appendChild(overlay);
    const close = () => { overlay.classList.remove('open'); document.body.classList.remove('egg-modal-open'); };
    overlay.querySelector('.egg-close').addEventListener('click', close);
    overlay.addEventListener('click', e => { if (e.target === overlay) close(); });
    document.addEventListener('keydown', function esc(e) { if (e.key === 'Escape' && overlay.classList.contains('open')) { close(); document.removeEventListener('keydown', esc); } });
    overlay._open = () => { overlay.classList.add('open'); document.body.classList.add('egg-modal-open'); };
    overlay._close = close;
    return overlay;
  }
  function openTerminal() {
    if (!terminal) {
      terminal = createModal('egg-modal', 'THE BACKROOM', `<div class="egg-terminal-content"><p class="egg-kicker">UNAUTHORIZED ACCESS // JUST KIDDING</p><h2>THE BACKROOM<span>.</span></h2><p class="egg-copy">A tiny terminal for people who click absolutely everything.</p><div class="egg-output" aria-live="polite">Type <code>help</code> to see available commands.</div><form class="egg-command-form"><label for="egg-command">guest@unknown403:~$</label><input id="egg-command" autocomplete="off" spellcheck="false" aria-label="Terminal command" placeholder="type a command..."><button type="submit">RUN ↵</button></form><div class="egg-footline"><span data-egg-count>0 / 4</span><span>NO HACKING. JUST VIBES.</span></div></div>`);
      const input = terminal.querySelector('#egg-command');
      const output = terminal.querySelector('.egg-output');
      terminal.querySelector('.egg-command-form').addEventListener('submit', e => {
        e.preventDefault(); const command = input.value.trim().toLowerCase(); input.value = '';
        const jokes = ['Why did the developer go broke? Too many cache issues. 💀','My browser has 37 tabs open. The RAM filed a complaint.','I tried to touch grass. It asked me to accept cookies.','I opened one tutorial and somehow earned a minor in procrastination.','My PC said “low memory” so I closed my hopes and dreams.','Debugging is just being a detective in a crime you committed.'];
        const quotes = ['The plot is still loading. Character development takes time.','Move in silence. Let the update speak.','Not every delay is a failure; sometimes the build is compiling.','Keep the standards high and the drama on mute.','Build quietly. Let the results make the noise.'];
        const roasts = ['Bro got 37 tabs open and still forgot why he opened the browser. 💀','Your sleep schedule has been marked as a missing person. 🌙','Bro said “one more game” three hours ago.','The confidence is online. The common sense is buffering.','Your motivation has a free trial that expired yesterday.'];
        const lore = ['TRACE 01: The alias is a mask, not the whole story.','TRACE 02: Every corner has a clue. Not every clue is loud.','TRACE 03: Four traces. One identity. Keep looking.','TRACE 04: The archive rewards curiosity, not speed.','Some details are decoys. The pattern is the point.'];
        let response;
        if (command === 'help') response = 'COMMANDS: help · joke · quote · roast · lore · secrets · clear · room · exit';
        else if (command === 'joke') response = jokes[Math.floor(Math.random() * jokes.length)];
        else if (command === 'quote') response = quotes[Math.floor(Math.random() * quotes.length)];
        else if (command === 'roast') response = roasts[Math.floor(Math.random() * roasts.length)];
        else if (command === 'lore') response = lore[Math.floor(Math.random() * lore.length)];
        else if (command === 'secrets') response = trackerMessage() + ' Hint: logo, keyboard, footer, blueprint.';
        else if (command === 'room') response = found.size === DISCOVERIES.length ? 'ROOM ACCESS GRANTED.' : `ACCESS DENIED. ${DISCOVERIES.length - found.size} trace(s) still missing.`;
        else if (command === 'clear') { output.textContent = 'Terminal cleared. The void says hi.'; updateTracker(); return; }
        else if (command === 'exit') { terminal._close(); return; }
        else response = `COMMAND NOT FOUND: ${command || '(nothing)'}. Type help. Skill issue? 💀`;
        output.textContent = response;
        if (command === 'lore') output.dataset.lore = 'seen';
      });
      input.addEventListener('keydown', e => { if (e.key === 'Escape') terminal._close(); });
    }
    discover('terminal'); updateTracker(); terminal._open();
    setTimeout(() => { const input = terminal && terminal.querySelector('#egg-command'); if (input) input.focus(); }, 100);
  }
  function unlockRoom() {
    if (!room) {
      room = createModal('egg-room-modal', 'SECRET ROOM', `<div class="egg-room-content"><p class="egg-kicker">ACCESS GRANTED // 4 OF 4 TRACES</p><div class="egg-room-sigil">𓆩 ✦ 𓆪</div><h2>YOU FOUND THE<br><span>SECRET ROOM.</span></h2><p>Four traces. One identity. You were never just scrolling — you were decoding the little details.</p><div class="egg-achievement">🏆 <div><strong>UNKNOWN_403 // SYSTEM EXPLORER</strong><small>ACHIEVEMENT UNLOCKED · 100% DISCOVERY</small></div></div><button type="button" class="egg-room-close">RETURN TO THE INTERNET ↗</button><p class="egg-room-note">Your discoveries are stored only in this browser on this device. No account. No server. No tracking.</p></div>`);
      room.querySelector('.egg-room-close').addEventListener('click', () => room._close());
    }
    room._open();
  }
  // The site logo is a secret terminal trigger after five quick clicks.
  const brand = document.querySelector('.brand');
  if (brand) {
    let clicks = 0, clickTimer;
    brand.addEventListener('click', e => {
      clicks++; clearTimeout(clickTimer); clickTimer = setTimeout(() => { clicks = 0; }, 1800);
      if (clicks >= 5) { e.preventDefault(); clicks = 0; openTerminal(); }
    });
  }
  // '?' opens the terminal; ignore when typing in a form control.
  document.addEventListener('keydown', e => {
    const target = e.target;
    if (target && (target.matches('input,textarea,select,[contenteditable="true"]'))) return;
    if (e.key === '?' && !document.querySelector('.egg-modal.open')) openTerminal();
  });
  // Konami Code; mobile users can use the accessible tracker and its built-in sequence button.
  const konami = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];
  let seq = 0;
  document.addEventListener('keydown', e => {
    if (e.target && e.target.matches('input,textarea,select,[contenteditable="true"]')) return;
    const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
    seq = key === konami[seq] ? seq + 1 : (key === konami[0] ? 1 : 0);
    if (seq === konami.length) { seq = 0; discover('konami'); showToast('KONAMI CODE ACCEPTED // CLASSIC CHEAT CODE 🎮'); document.body.classList.add('egg-glitch'); setTimeout(() => document.body.classList.remove('egg-glitch'), reducedMotion ? 0 : 900); }
  });
  // Mobile-friendly alternative for visitors without a physical keyboard.
  const trackerBtn = document.querySelector('.egg-tracker');
  if (trackerBtn) trackerBtn.addEventListener('dblclick', () => {
    const prompt = document.querySelector('.egg-mobile-konami');
    if (prompt) { prompt.remove(); return; }
    const panel = document.createElement('div'); panel.className = 'egg-mobile-konami';
    panel.innerHTML = '<p>CLASSIC CHEAT CODE</p><div class="egg-mobile-keys"><button data-key="ArrowUp">↑</button><button data-key="ArrowUp">↑</button><button data-key="ArrowDown">↓</button><button data-key="ArrowDown">↓</button><button data-key="ArrowLeft">←</button><button data-key="ArrowRight">→</button><button data-key="ArrowLeft">←</button><button data-key="ArrowRight">→</button><button data-key="b">B</button><button data-key="a">A</button></div>';
    document.body.appendChild(panel); let progress = 0;
    panel.querySelectorAll('button').forEach(btn => btn.addEventListener('click', () => { if (btn.dataset.key === konami[progress]) progress++; else progress = btn.dataset.key === konami[0] ? 1 : 0; if (progress === konami.length) { panel.remove(); discover('konami'); showToast('KONAMI CODE ACCEPTED // CLASSIC CHEAT CODE 🎮'); } }));
  });
  // Five quick clicks on the copyright line reveal the hidden message.
  const copyright = document.querySelector('footer small');
  if (copyright) {
    copyright.title = 'Some things are not on the menu.'; copyright.classList.add('egg-copyright');
    let clicks = 0, timer;
    copyright.addEventListener('click', () => {
      clicks++; clearTimeout(timer); timer = setTimeout(() => { clicks = 0; }, 2200);
      if (clicks >= 5) { clicks = 0; discover('footer'); showToast('HIDDEN FOOTER MESSAGE: You scrolled all the way down. Now prove you were paying attention.'); }
    });
  }
  const fragment = document.querySelector('[data-egg-fragment]');
  if (fragment) fragment.addEventListener('click', () => {
    discover('fragment'); showToast('FINAL FRAGMENT: Four traces. One identity. You were decoding it.');
  });
  // Make the secret room accessible after returning to the site with all discoveries saved.
  ensureTracker(); updateTracker();
  if (found.size === DISCOVERIES.length) {
    const roomHint = document.createElement('span'); roomHint.className = 'egg-room-ready'; roomHint.textContent = 'SECRET ROOM AVAILABLE'; roomHint.setAttribute('aria-hidden','true'); document.body.appendChild(roomHint);
    document.querySelector('.egg-tracker')?.addEventListener('click', unlockRoom);
  }
})();
