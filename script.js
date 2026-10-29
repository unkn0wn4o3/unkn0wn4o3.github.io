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
  // Copyright stays centered at the bottom of the page.
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
    const close = () => { if (!overlay.classList.contains('open') || overlay.classList.contains('closing')) return; overlay.classList.add('closing'); overlay.classList.remove('open'); document.body.classList.remove('egg-modal-open'); const finish = () => { overlay.classList.remove('closing'); }; if (reducedMotion) finish(); else setTimeout(finish, 260); };
    overlay.querySelector('.egg-close').addEventListener('click', close);
    overlay.addEventListener('click', e => { if (e.target === overlay) close(); });
    document.addEventListener('keydown', function esc(e) { if (e.key === 'Escape' && overlay.classList.contains('open')) { close(); document.removeEventListener('keydown', esc); } });
    overlay._open = () => { overlay.classList.remove('closing'); overlay.classList.add('open'); document.body.classList.add('egg-modal-open'); if (!reducedMotion) { overlay.classList.remove('breach'); void overlay.offsetWidth; overlay.classList.add('breach'); setTimeout(() => overlay.classList.remove('breach'), 560); } };
    overlay._close = close;
    return overlay;
  }
  function openTerminal() {
    if (!terminal) {
      terminal = createModal('egg-modal', 'THE BACKROOM', `<div class="egg-terminal-content"><p class="egg-kicker">UNAUTHORIZED ACCESS // JUST KIDDING</p><h2>THE BACKROOM<span>.</span></h2><p class="egg-copy">A tiny terminal for people who click absolutely everything.</p><div class="egg-output" aria-live="polite">Type <code>help</code> to see available commands.</div><form class="egg-command-form"><label for="egg-command">guest@unknown403:~$</label><input id="egg-command" autocomplete="off" spellcheck="false" aria-label="Terminal command" placeholder="type a command..."><button type="submit">RUN ↵</button></form><div class="egg-footline"><span data-egg-count>0 / 4</span><span>NO HACKING. JUST VIBES.</span></div></div>`);
      const input = terminal.querySelector('#egg-command');
      const output = terminal.querySelector('.egg-output');
      const quotes = ['The plot is still loading. Character development takes time.','Move in silence. Let the update speak.','Not every delay is a failure; sometimes the build is compiling.','Keep the standards high and the drama on mute.','Quiet progress still counts.','Consistency is louder than a motivational speech.','Your next version is built by what you do today.','Not every thought needs a microphone.','Small steps still move the storyline forward.','Less announcing. More becoming.'];
      const roasts = ['Bro got 37 tabs open and still forgot why he opened the browser. 💀','Your sleep schedule has been marked as a missing person. 🌙','Bro said “one more game” three hours ago.','The confidence is online. The common sense is buffering.','Your to-do list has become historical fiction.','Your brain has 4K ideas and 2% battery.','Your focus left the chat and disabled read receipts.','You have main-character energy with background-app organization.','You said “five more minutes” in a different timezone.','You are not late; you are arriving in a different season.'];
      terminal.querySelector('[data-egg-action="quote"]').addEventListener('click', () => { terminal.querySelector('[data-egg-quote]').textContent = '“' + quotes[Math.floor(Math.random()*quotes.length)] + '”'; });
      terminal.querySelector('[data-egg-action="roast"]').addEventListener('click', () => { terminal.querySelector('[data-egg-roast]').textContent = '“' + roasts[Math.floor(Math.random()*roasts.length)] + '”'; });
      terminal.querySelector('.egg-command-form').addEventListener('submit', e => {
        e.preventDefault(); const command = input.value.trim().toLowerCase(); input.value = '';
        const quotes = ['“Be a work in progress, not a finished excuse.”','“Quiet progress still counts.”','“The plot is still loading. Character development takes time.”','“Consistency is louder than a motivational speech.”','“Your next version is built by what you do today.”','“Not every thought needs a microphone.”','“Stay curious. Stay difficult to predict.”','“Small steps still move the storyline forward.”','“The future is a draft. Keep editing.”','“Less announcing. More becoming.”'];
        const roasts = ['Bro has 37 tabs open and still forgot why he opened the browser. 💀','Your sleep schedule looks like a random number generator.','You call it multitasking; the tasks call it abandonment.','Your brain has 4K ideas and 2% battery.','Bro is buffering in real life. Please do not unplug.','Your to-do list has become historical fiction.','You have main-character energy with background-app organization.','You said “five more minutes” in a different timezone.','Your focus left the chat and disabled read receipts.','You are not late; you are arriving in a different season.'];
        const jokes = ['Why did the developer go broke? Too many cache issues. 💀','My browser has 37 tabs open. The RAM filed a complaint.','I tried to touch grass. It asked me to accept cookies.','My sleep schedule is a rumor with no confirmed witnesses.','I opened one tutorial and unlocked a whole side quest.','Brain.exe stopped responding. Try turning the human off and on again.','I am not procrastinating. I am loading dramatically.','The Wi-Fi has more stability than my life plan.','I came, I saw, I forgot why I came.','My motivation said “brb” three business days ago.'];
        const quotes = ['The plot is still loading. Character development takes time.','Move in silence. Let the update speak.','Not every delay is a failure; sometimes the build is compiling.','Keep the standards high and the drama on mute.','Quiet progress still counts.','Consistency is louder than a motivational speech.','Your next version is built by what you do today.','Not every thought needs a microphone.','Small steps still move the storyline forward.','Less announcing. More becoming.'];
        const roasts = ['Bro got 37 tabs open and still forgot why he opened the browser. 💀','Your sleep schedule has been marked as a missing person. 🌙','Bro said “one more game” three hours ago.','The confidence is online. The common sense is buffering.','Your to-do list has become historical fiction.','Your brain has 4K ideas and 2% battery.','Your focus left the chat and disabled read receipts.','You have main-character energy with background-app organization.','You said “five more minutes” in a different timezone.','You are not late; you are arriving in a different season.'];
        const lore = ['TRACE 01: The alias is a mask, not the whole story.','TRACE 02: Every corner has a clue. Not every clue is loud.','TRACE 03: Four traces. One identity. Keep looking.','TRACE 04: The profile is the cover. The details are the actual story.','TRACE 05: Curiosity is the key. Clicking everything is the security flaw.','TRACE 06: The archive remembers discoveries on this device only.','TRACE 07: Some secrets are hidden in plain sight. This one is testing your attention.','TRACE 08: The build is unfinished on purpose. Character development is ongoing.','TRACE 09: The red accents are warnings. Mostly about the owner.','TRACE 10: You found the terminal. Now pretend you meant to do that.'];
        let response;
        if (command === 'help') { response = 'COMMANDS: help · joke · roast · quote · lore · secrets · clear · room · exit'; const oldPanel = terminal.querySelector('.egg-fun-zone'); if (oldPanel) oldPanel.remove(); const panel = document.createElement('section'); panel.className = 'egg-fun-zone'; panel.setAttribute('aria-label', 'Quotes and roasts'); panel.innerHTML = '<article class="egg-fun-card"><h3>QUOTES // MAINFRAME</h3><p data-egg-quote>“The plot is still loading. Character development takes time.”</p><button type="button" data-egg-action="quote">NEW QUOTE ↻</button></article><article class="egg-fun-card"><h3>ROASTS // FRIENDLY FIRE</h3><p data-egg-roast>“Bro has 37 tabs open and still forgot why he opened the browser.” 💀</p><button type="button" data-egg-action="roast">ROAST ME ↻</button></article>'; output.before(panel); }
        else if (command === 'joke') response = jokes[Math.floor(Math.random() * jokes.length)];
        else if (command === 'roast') response = roasts[Math.floor(Math.random() * roasts.length)];
        else if (command === 'quote') response = quotes[Math.floor(Math.random() * quotes.length)];
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
      room = createModal('egg-room-modal', 'SECRET ROOM', `<div class="egg-room-content"><p class="egg-kicker">ACCESS GRANTED // 4 OF 4 TRACES</p><div class="egg-room-sigil">𓆩 ✦ 𓆪</div><h2>WELCOME TO THE<br><span>RED FLAG ARCHIVE 🚩</span></h2><p>u found the hidden archive. no spoilers, just lore. read at ur own risk 💀</p><div class="egg-secret-grid"><article class="egg-secret-card"><h3>ROMANCE ARC: SINGLE 💀</h3><p>No girlfriend. No side quests. Just the main character waiting for the next update.</p></article><article class="egg-secret-card"><h3>ACCESS POLICY: TRUST IS EARNED 🔒</h3><p>Real ones get access. Fake vibes get denied.</p></article><article class="egg-secret-card"><h3>PERSONALITY.EXE: UNPREDICTABLE</h3><p>Quiet in one moment. Randomly becomes the entire entertainment department in the next.</p></article><article class="egg-secret-card"><h3>FRIENDSHIP ACCESS: RESTRICTED 🔒</h3><p>Small circle. Real loyalty. Zero tolerance for fake energy.</p></article><article class="egg-secret-card"><h3>PERSONALITY PATCH NOTES: COMING SOON</h3><p>Still figuring things out. Character development is ongoing.</p></article><article class="egg-secret-card"><h3>FUTURE BUILD: IN DEVELOPMENT ⚙️</h3><p>Current version has bugs. The next update is going to be different.</p></article><article class="egg-secret-card"><h3>CURIOSITY LEVEL: UNPATCHABLE</h3><p>Starts learning one thing. Somehow ends up researching five unrelated things.</p></article><article class="egg-secret-card"><h3>STANDARDS: NON-NEGOTIABLE.</h3><p>Not everything deserves access to your time and energy.</p></article><article class="egg-secret-card"><h3>SLEEP PROTOCOL: COMPROMISED 🌙</h3><p>Brain scheduled a meeting after everyone else logged off.</p></article><article class="egg-secret-card"><h3>MAIN CHARACTER STATUS: UNCONFIRMED 💀</h3><p>Confidence installed. Common sense still downloading.</p></article><article class="egg-secret-card"><h3>LOYALTY CHECK: ACTIONS &gt; WORDS</h3><p>Anyone can talk. Consistency tells the real story.</p></article><article class="egg-secret-card"><h3>LIFE PLAN: NO SPOILERS</h3><p>The plot is developing. Even the main character doesn't know the next episode.</p></article></div><div class="egg-developer-status"><span>DEVELOPER STATUS</span><strong>UNKNOWN_403 // STILL IN DEVELOPMENT</strong><small>BUILD: UNFINISHED · ACCESS: LIMITED · VIBES: CLASSIFIED</small></div><button type="button" class="egg-room-close">RETURN TO THE INTERNET ↗</button><p class="egg-room-note">discoveries stay in this browser on this device. no account. no server. no tracking.</p></div>`);
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
  // Five quick clicks on the profile picture reveal the same hidden terminal.
  const profilePicture = document.querySelector('.portrait-frame img');
  if (profilePicture) {
    profilePicture.tabIndex = 0;
    profilePicture.setAttribute('role', 'button');
    profilePicture.setAttribute('aria-label', 'Profile picture: click five times for a hidden interaction');
    let pfpClicks = 0, pfpTimer;
    const countPfpClick = () => {
      pfpClicks++; clearTimeout(pfpTimer); pfpTimer = setTimeout(() => { pfpClicks = 0; }, 2200);
      profilePicture.classList.remove('pfp-secret-flicker'); void profilePicture.offsetWidth; profilePicture.classList.add('pfp-secret-flicker');
      if (pfpClicks >= 5) { pfpClicks = 0; openTerminal(); }
    };
    profilePicture.addEventListener('click', countPfpClick);
    profilePicture.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); countPfpClick(); } });
    profilePicture.addEventListener('animationend', () => profilePicture.classList.remove('pfp-secret-flicker'));
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
