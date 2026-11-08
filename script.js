const menu=document.getElementById('menuToggle');
const nav=document.getElementById('nav');
menu?.setAttribute('aria-expanded','false');
menu?.addEventListener('click',()=>{
  if (!nav) return;
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
      // Keep the 👾 idle cursor; the CSS hover state substitutes a tech crosshair for 🫵.
      cursor.classList.toggle('is-pointing', !!target);
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
    let tracker = document.querySelector('.egg-tracker');
    if (tracker) return tracker;
    tracker = document.createElement('button');
    tracker.type = 'button';
    tracker.className = 'egg-tracker';
    tracker.setAttribute('aria-label', 'Open secret discovery tracker');
    tracker.innerHTML = '<span class="egg-tracker-dot" aria-hidden="true"></span><span>DISCOVERY REGISTER</span><strong data-egg-count>0 / 4</strong>';
    tracker.addEventListener('click', () => {
      if (found.size === DISCOVERIES.length) unlockRoom();
      else if (window.matchMedia && window.matchMedia('(pointer: coarse)').matches) toggleMobileKonami();
      else showToast(trackerMessage());
    });
    document.body.appendChild(tracker);
    return tracker;
  }
  function trackerMessage() {
    return `DISCOVERY REGISTER: ${found.size} / ${DISCOVERIES.length}. ${found.size === DISCOVERIES.length ? 'All traces found. The Secret Room is unlocked.' : 'There are still traces hidden in this site.'}`;
  }
  function updateTracker() {
    document.querySelectorAll('[data-egg-count]').forEach(counter => {
      counter.textContent = `${found.size} / ${DISCOVERIES.length}`;
    });
    const tracker = document.querySelector('.egg-tracker');
    if (tracker) {
      const complete = found.size === DISCOVERIES.length;
      tracker.classList.toggle('complete', complete);
      tracker.setAttribute('aria-label', complete ? 'Open the Secret Room' : 'Show discovery progress');
      tracker.title = complete ? 'All traces found — open the Secret Room' : trackerMessage();
    }
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
    if (fresh && found.size === DISCOVERIES.length) {
      setTimeout(() => { unlockRoom(); }, 900);
    }
  }
  function createModal(className, title, inner) {
    const overlay = document.createElement('div');
    overlay.className = className;
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-label', title);
    overlay.tabIndex = -1;
    overlay.innerHTML = `<div class="egg-window"><div class="egg-window-top"><span class="egg-lights" aria-hidden="true"><i></i><i></i><i></i></span><span>unknown403://backroom</span><button type="button" class="egg-close" aria-label="Close window">×</button></div>${inner}</div>`;
    document.body.appendChild(overlay);

    let returnFocus = null;
    let closeVersion = 0;
    const close = () => {
      overlay._beforeClose?.();
      if (!overlay.classList.contains('open') || overlay.classList.contains('closing')) return;
      overlay.classList.add('closing');
      overlay.classList.remove('open');
      document.body.classList.remove('egg-modal-open');
      const version = ++closeVersion;
      const finish = () => {
        if (version !== closeVersion) return;
        overlay.classList.remove('closing');
        if (returnFocus && returnFocus.isConnected && typeof returnFocus.focus === 'function') {
          returnFocus.focus({ preventScroll: true });
        }
      };
      if (reducedMotion) finish(); else setTimeout(finish, 260);
    };

    overlay.querySelector('.egg-close').addEventListener('click', close);
    overlay.addEventListener('click', e => { if (e.target === overlay) close(); });
    // This listener intentionally stays installed while the reusable modal exists.
    // Removing it on the first Escape made subsequent openings impossible to close.
    document.addEventListener('keydown', e => {
      if (!overlay.classList.contains('open')) return;
      if (e.key === 'Escape') {
        e.preventDefault();
        close();
        return;
      }
      if (e.key === 'Tab') {
        const focusable = [...overlay.querySelectorAll('button:not([disabled]), input:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])')]
          .filter(el => !el.hidden && el.getAttribute('aria-hidden') !== 'true');
        if (!focusable.length) { e.preventDefault(); overlay.focus(); return; }
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    });

    overlay._open = () => {
      closeVersion++;
      returnFocus = document.activeElement;
      overlay.classList.remove('closing');
      overlay.classList.add('open');
      document.body.classList.add('egg-modal-open');
      if (!reducedMotion) {
        overlay.classList.remove('breach');
        void overlay.offsetWidth;
        overlay.classList.add('breach');
        setTimeout(() => overlay.classList.remove('breach'), 560);
      }
      const preferredFocus = overlay.querySelector('#egg-command, .egg-room-close, .egg-close');
      setTimeout(() => { if (overlay.classList.contains('open')) preferredFocus?.focus(); }, 0);
    };
    overlay._close = close;
    return overlay;
  }
  function openTerminal() {
    if (!terminal) {
      terminal = createModal('egg-modal', 'THE BACKROOM', `<div class="egg-terminal-content"><p class="egg-kicker">UNAUTHORIZED ACCESS // JUST KIDDING</p><h2>THE BACKROOM<span>.</span></h2><p class="egg-copy">A tiny terminal for people who click absolutely everything.</p><div class="egg-output" aria-live="polite">Type <code>help</code> to see available commands.</div><form class="egg-command-form"><label for="egg-command">guest@unknown403:~$</label><input id="egg-command" autocomplete="off" spellcheck="false" aria-label="Terminal command" placeholder="type a command..."><button type="submit">RUN ↵</button></form><div class="egg-footline"><span data-egg-count>0 / 4</span><span>NO HACKING. JUST VIBES.</span></div></div>`);
      const input = terminal.querySelector('#egg-command');
      const output = terminal.querySelector('.egg-output');
      const jokes = [
        'Why did the developer go broke? Too many cache issues. 💀',
        'My browser has 37 tabs open. The RAM filed a complaint.',
        'I tried to touch grass. It asked me to accept cookies.',
        'I asked my computer for a break. It opened Task Manager.',
        'My Wi-Fi has two moods: loading and pretending to load.',
        'I made a to-do list. It is now on my to-do list.',
        'The update said “2 minutes remaining” 45 minutes ago.',
        'My keyboard has a space bar. Still no space in my schedule.',
        'I named my laptop Titanic. It keeps crashing.',
        'The cloud is full. Apparently my thoughts were syncing.'
      ];
      const quotes = [
        'The plot is still loading. Character development takes time.',
        'Move in silence. Let the update speak.',
        'Not every delay is a failure; sometimes the build is compiling.',
        'Keep the standards high and the drama on mute.',
        'Small progress still counts. Keep the streak alive.',
        'Build quietly. Let consistency make the announcement.',
        'Curiosity is a side quest that often becomes the main quest.',
        'One good decision at a time. That is how the arc changes.',
        'A better version is built one honest revision at a time.',
        'Stay curious. The map is bigger than the current screen.'
      ];
      const roasts = [
        'Bro got 37 tabs open and still forgot why he opened the browser. 💀',
        'Your sleep schedule has been marked as a missing person. 🌙',
        'Bro said “one more game” three hours ago.',
        'The confidence is online. The common sense is buffering.',
        'Your to-do list just filed a missing-person report.',
        'Your loading screen has a loading screen.',
        'Bro opened settings and forgot what needed fixing.',
        'The plan is premium. The execution is still on the free trial.',
        'Your cursor has visited more places than your productivity.',
        'You have main-character energy with tutorial-level navigation.'
      ];
      const lore = [
        'TRACE 01: The alias is a mask, not the whole story.',
        'TRACE 02: Every corner has a clue. Not every clue is loud.',
        'TRACE 03: Four traces. One identity. Keep looking.',
        'TRACE 04: The blueprint records the work in progress.',
        'TRACE 05: The quietest page may hold the loudest clue.',
        'TRACE 06: Curiosity opened the door. You did the rest.',
        'TRACE 07: The archive remembers what the feed forgets.',
        'TRACE 08: A hidden route is still a route.',
        'TRACE 09: The system is local. The imagination is not.',
        'TRACE 10: Every finished build began as an unfinished idea.'
      ];
      const secrets = [
        'SECRET 01 // Five quick clicks on the crown logo open the terminal.',
        'SECRET 02 // The profile picture has its own five-click trigger.',
        'SECRET 03 // The classic Konami sequence leaves a trace.',
        'SECRET 04 // The footer is more than a footer.',
        'SECRET 05 // The final fragment is hidden in the blueprint.',
        'SECRET 06 // The discovery register tracks four traces.',
        'SECRET 07 // The terminal works locally in this browser.',
        'SECRET 08 // Reduced-motion settings are respected.',
        'SECRET 09 // The archive contains twelve red-flag files.',
        'SECRET 10 // Some commands have subcommands. Ask them directly.'
      ];
      const asciiArt = [
        {id:'ghost',label:'PHANTOM / GHOST',art:String.raw`        .-.
       (o o)   PHANTOM SIGNAL
       | O \\
      /|   |\\
     /_|___|_\\
       /   \\
      /_____\\
      ~~~~~~~~`},
        {id:'skull',label:'CYBER SKULL',art:String.raw`       .-=========-.
      /  .-"""""-.  \\
     |  /  .-. .-. \\  |
     | |  /   Y   \\ | |
     | |  \\  ^  /  | |
      \\  '.___.'  /
       '._ CYBER _. '
          /| |\\
         /_| |_\\`},
        {id:'dragon',label:'VOID DRAGON',art:String.raw`                 /\                 /\
        /\      /  \\   _____   /  \\      /\
       /  \\____/ /\ \\_/     \_/ /\ \\____/  \\
      /            \\   (o o)   /            \\
     /_____/\_______\\___\_/___/_______/\_____\\
            \\       /  /| |\\  \\       /
             \\_____/__/ |_| \__\\_____/`},
        {id:'wolf',label:'NIGHT WOLF',art:String.raw`             /\_/\\
      ______/ o o \\______
     /   __   ^   __      \\
    /___/  \\_____/  \\______\\
       /  /|  |  |\\  \\
      /__/ |__|__| \\__\\
          /_/  \\_\\
       NIGHT SIGNAL // 04`},
        {id:'angel',label:'DARK ANGEL',art:String.raw`       _.-'` + "`" + String.raw`-._       _.-'` + "`" + String.raw`-._
    .-'  /\\  ` + "`" + String.raw`-._.-'  /\\  ` + "`" + String.raw`-.
   /___ /  \\ ___|___ /  \\ ___\\
       / /\\ \\       / /\\ \\
      /_/  \\_\\     /_/  \\_\\
          .-^-.
         /  ✦  \\
        /_______\\
       WINGS // OFFLINE`},
        {id:'terminal',label:'HACKER MAINFRAME',art:String.raw`+--------------------------------+
| ROOT ACCESS: SIMULATED          |
| [##########..........] 50%      |
|                                |
| > tracing_signal.exe            |
| > decrypting_local_cache        |
| > access: GUEST                 |
|                                |
| STATUS: WATCHING                |
+--------------------------------+`},
        {id:'mask',label:'CYBERNETIC MASK',art:String.raw`       .----------------.
      /  .------------.  \\
     /  /  []      []  \\  \\
    |  |       __       |  |
    |  |   .-./  \\.-.   |  |
     \\  \\  '._==_.'  /  /
      \\  '---.____.---'  /
       '------|  |------'
              |__|
          UNIT // 403`},
        {id:'galaxy',label:'DEEP SPACE',art:String.raw`             .       *       .
       *          .     .
    .       .-=========-.      *
           /  .  *  .   \\
      *   |  *   .    *  |   .
          \\   .     .  /
     .     '---=====---'       *
          *      |      .
       .      .  |  *
             .  / \\
       SIGNAL FROM THE VOID`},
        {id:'machine',label:'MECHANICAL BEAST',art:String.raw`          .----.____.----.
       __/  []  ||  []  \\__
      /___  ____||____  ___\\
          \\|  _    _  |/
       ____| |o|  |o| |____
      /    |  ____    |    \\
     /_____|_/    \\__|_____\\
          /_/      \\_\\
       ENGINE // AWAKE`},
        {id:'sigil',label:'UNKNOWN SYSTEM SIGIL',art:String.raw`       +------------------+
       |   .----------.   |
       |  /  /\\  /\\  \\  |
       | |  (  \\/  )  | |
       |  \\  \\__/  /  |
       |   '---||---'   |
       |      /__\\      |
       |   UNKNOWN_403  |
       +------------------+`}
      ];
      const riddles = [
        {q:'I have keys but no locks. I have space but no room. What am I?',a:['keyboard','a keyboard'],hint:'You use it to type.'},
        {q:'The more you take, the more you leave behind. What are they?',a:['footsteps','steps'],hint:'Think about walking.'},
        {q:'I speak without a mouth and hear without ears. What am I?',a:['echo','an echo'],hint:'Sound can bounce back.'},
        {q:'What has one eye but cannot see?',a:['needle','a needle'],hint:'A small sewing tool.'},
        {q:'What gets wetter the more it dries?',a:['towel','a towel'],hint:'You might keep it near a shower.'},
        {q:'What has a neck but no head?',a:['bottle','a bottle'],hint:'It can hold a drink.'},
        {q:'What can travel around the world while staying in one corner?',a:['stamp','a stamp'],hint:'It goes on an envelope.'},
        {q:'What has many teeth but cannot bite?',a:['comb','a comb'],hint:'Used to tidy hair.'},
        {q:'What belongs to you but others use it more?',a:['name','your name'],hint:'People say it to get your attention.'},
        {q:'What has cities but no houses, rivers but no water?',a:['map','a map'],hint:'A paper or digital guide.'}
      ];
      const ciphers = [
        {q:'Caesar shift: decode by shifting each letter back 1: IFMMP',a:['hello'],hint:'I becomes H; F becomes E.'},
        {q:'Reverse this word: YRATERCES',a:['secretary'],hint:'Read it from right to left.'},
        {q:'Reverse this word: WOL',a:['low'],hint:'Read it backwards.'},
        {q:'Caesar shift back 1: UFTU',a:['test'],hint:'Move each letter one place earlier.'},
        {q:'Decode the binary ASCII: 01001000 01001001',a:['hi'],hint:'Two 8-bit characters.'},
        {q:'Reverse this word: NOHTYP',a:['python'],hint:'Flip the letter order.'},
        {q:'Caesar shift back 1: DPEF',a:['code'],hint:'Every letter is one step ahead.'},
        {q:'Decode the binary ASCII: 01001111 01001011',a:['ok'],hint:'Two uppercase letters.'},
        {q:'Reverse this word: EDOM',a:['mode'],hint:'Read it from right to left.'},
        {q:'Caesar shift back 1: TFDSFU',a:['secret'],hint:'Shift each letter back once.'}
      ];
      const commandHistory = [];
      let historyIndex = 0, activeChallenge = null, lastAscii = -1, scanTimer = null;
      let historyFilter = 'all';
      const commandRegistry = {
        help:{group:'CORE',usage:'help [command]',desc:'Show the command directory or details for one command.',subs:[]},
        clear:{group:'CORE',usage:'clear',desc:'Clear terminal output.',subs:[]},
        exit:{group:'CORE',usage:'exit',desc:'Close the terminal.',subs:[]},
        guide:{group:'CORE',usage:'guide',desc:'Show keyboard and terminal controls.',subs:[]},
        history:{group:'CORE',usage:'history',desc:'Show timestamped session history.',subs:[['history-filter','Filter command history by command name or result text.']]},
        joke:{group:'ENTERTAINMENT',usage:'joke',desc:'Display a random joke.',subs:[]},
        quote:{group:'ENTERTAINMENT',usage:'quote',desc:'Open the quote card. Use its button for another.',subs:[]},
        roast:{group:'ENTERTAINMENT',usage:'roast',desc:'Open a friendly roast card.',subs:[]},
        ascii:{group:'ENTERTAINMENT',usage:'ascii [name|next|list]',desc:'Display one of ten original terminal artworks.',subs:[['ascii next','Show another artwork without repeating the last one.'],['ascii list','List all artwork names.'],...asciiArt.map(a=>['ascii '+a.id,'Display '+a.label+'.'])]},
        whoami:{group:'INTEL & LORE',usage:'whoami',desc:'Show the current visitor access profile.',subs:[]},
        date:{group:'INTEL & LORE',usage:'date',desc:'Show local device date and time.',subs:[]},
        version:{group:'INTEL & LORE',usage:'version',desc:'Show terminal build information.',subs:[]},
        lore:{group:'INTEL & LORE',usage:'lore',desc:'Reveal a random lore fragment.',subs:[]},
        secrets:{group:'INTEL & LORE',usage:'secrets',desc:'Reveal a random discovery hint.',subs:[]},
        riddle:{group:'CHALLENGES',usage:'riddle',desc:'Start a riddle challenge.',subs:[['hint','Give a clue for the active challenge.'],['answer','Reveal the answer and end the challenge.'],['newchallenge','Replace the current challenge with a new one.'],['cancel','Cancel the active challenge.']]},
        cipher:{group:'CHALLENGES',usage:'cipher',desc:'Start a decoding challenge.',subs:[['hint','Give a clue for the active challenge.'],['answer','Reveal the answer and end the challenge.'],['newchallenge','Replace the current challenge with a new one.'],['cancel','Cancel the active challenge.']]},
        scan:{group:'CHALLENGES',usage:'scan',desc:'Run a harmless local interface status sequence.',subs:[['scan-cancel','Stop the current scan.']]},
        room:{group:'RESTRICTED',usage:'room',desc:'Open the archive after all four discoveries.',subs:[]}
      };
      const allCommands = Object.keys(commandRegistry);
      const escapeHTML = value => String(value).replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
      const normalize = value => value.trim().toLowerCase().replace(/[.!?]+$/g,'');
      const pick = list => list[Math.floor(Math.random()*list.length)];
      const setResponse = message => { output.textContent = message; };
      const clearScan = () => { if(scanTimer){clearTimeout(scanTimer);scanTimer=null;} };
      terminal._beforeClose = clearScan;
      const removeMainCard = () => { terminal.querySelectorAll('.egg-main-card').forEach(card => { if (!(activeChallenge && card.classList.contains('egg-card-challenge'))) card.remove(); }); };
      const showCard = (title, body, kind='info', extra='') => {
        removeMainCard();
        const card=document.createElement('section'); card.className='egg-main-card egg-card-'+kind; card.setAttribute('aria-label',title);
        const h=document.createElement('h3'); h.textContent=title;
        const content=document.createElement('div'); content.className='egg-card-body';
        if(typeof body==='string') content.textContent=body; else content.append(body);
        card.append(h,content); if(extra) { const foot=document.createElement('p'); foot.className='egg-card-foot'; foot.textContent=extra; card.append(foot); }
        output.insertAdjacentElement('beforebegin',card); output.textContent='';
        return card;
      };
      const showTextCard = (title, body, kind='info') => showCard(title,body,kind);
      const showAscii = index => {
        if(index===undefined){let next=Math.floor(Math.random()*asciiArt.length); if(asciiArt.length>1 && next===lastAscii) next=(next+1+Math.floor(Math.random()*(asciiArt.length-1)))%asciiArt.length; index=next;}
        lastAscii=index; const item=asciiArt[index];
        const wrap=document.createElement('div'); wrap.className='egg-ascii-wrap';
        const pre=document.createElement('pre'); pre.className='egg-ascii'; pre.textContent=item.art.replace(/\\n/g,'\n'); wrap.append(pre);
        const note=document.createElement('p'); note.className='egg-ascii-label'; note.textContent=item.label+' // '+(index+1)+' OF 10'; wrap.append(note);
        const card=showCard('ASCII ARCHIVE // '+item.label,wrap,'ascii');
        const controls=document.createElement('div'); controls.className='egg-card-actions';
        [['NEXT ART','ascii next'],['LIST ALL','ascii list']].forEach(([label,cmd])=>{const b=document.createElement('button');b.type='button';b.textContent=label;b.addEventListener('click',()=>runCommand(cmd));controls.append(b);});
        card.append(controls);
      };
      const renderHelp = target => {
        const keys=target && commandRegistry[target] ? [target] : Object.keys(commandRegistry);
        const wrap=document.createElement('div'); wrap.className='egg-help-list';
        const groups=['CORE','ENTERTAINMENT','INTEL & LORE','CHALLENGES','RESTRICTED'];
        groups.forEach(group=>{
          const items=keys.filter(key=>commandRegistry[key].group===group); if(!items.length)return;
          const section=document.createElement('section'); section.className='egg-help-group';
          const heading=document.createElement('h4'); heading.textContent='// '+group; section.append(heading);
          items.forEach(key=>{const item=document.createElement('div');item.className='egg-help-item';const cmd=document.createElement('code');cmd.textContent=commandRegistry[key].usage;const desc=document.createElement('span');desc.textContent=commandRegistry[key].desc;item.append(cmd,desc);section.append(item);});
          wrap.append(section);
        });
        const subs=keys.flatMap(key=>commandRegistry[key].subs.map(([cmd,desc])=>({cmd,desc,owner:key})));
        if(subs.length){const section=document.createElement('section');section.className='egg-help-group egg-help-additional';const h=document.createElement('h4');h.textContent='// ADDITIONAL COMMANDS & SUBCOMMANDS';section.append(h);subs.forEach(({cmd,desc,owner})=>{const row=document.createElement('div');row.className='egg-help-item';const c=document.createElement('code');c.textContent=cmd;const d=document.createElement('span');d.textContent=desc;row.append(c,d);section.append(row);});wrap.append(section);}
        showCard(target?'COMMAND DETAILS // '+target.toUpperCase():'COMMAND DIRECTORY // BACKROOM',wrap,'help','Type a command name to inspect its usage.');
      };
      const showHistory = filter => {
        const entries=commandHistory.map((entry,index)=>({...entry,number:index+1})).filter(entry=>!filter || filter==='all' || entry.command.includes(filter) || entry.result.toLowerCase().includes(filter));
        const wrap=document.createElement('div');wrap.className='egg-history-list';
        if(!entries.length){const empty=document.createElement('p');empty.textContent='No matching entries in this session.';wrap.append(empty);}
        entries.forEach(entry=>{const row=document.createElement('div');row.className='egg-history-entry';const n=document.createElement('span');n.className='egg-history-number';n.textContent=String(entry.number).padStart(2,'0');const body=document.createElement('div');body.className='egg-history-detail';const top=document.createElement('div');top.className='egg-history-top';const cmd=document.createElement('code');cmd.textContent=entry.command;const time=document.createElement('time');time.textContent=entry.time;top.append(cmd,time);const result=document.createElement('p');result.textContent=entry.result;body.append(top,result);row.append(n,body);wrap.append(row);});
        const summary=document.createElement('div');summary.className='egg-history-summary';summary.textContent=`SESSION TOTAL // ${commandHistory.length} COMMAND${commandHistory.length===1?'':'S'} · DISPLAYED ${entries.length}`;wrap.append(summary);
        const card=showCard('SESSION HISTORY // '+(filter?'FILTERED':'LIVE LOG'),wrap,'history');
        const controls=document.createElement('div');controls.className='egg-history-filter';const label=document.createElement('label');label.textContent='FILTER';const field=document.createElement('input');field.type='search';field.placeholder='command or result…';field.value=filter||'';field.setAttribute('aria-label','Filter history');const clear=document.createElement('button');clear.type='button';clear.textContent='RESET';clear.addEventListener('click',()=>{historyFilter='';showHistory('');});field.addEventListener('input',()=>{historyFilter=field.value.trim().toLowerCase();});field.addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();showHistory(historyFilter);}});label.append(field);controls.append(label,clear);card.append(controls);
      };
      const startChallenge = type => {
        activeChallenge=null; removeMainCard();
        const collection=type==='riddle'?riddles:ciphers; const item=pick(collection);
        const wrap=document.createElement('div');wrap.className='egg-challenge';const q=document.createElement('p');q.className='egg-challenge-question';q.textContent=item.q;const status=document.createElement('p');status.className='egg-challenge-status';status.textContent='ENTER YOUR ANSWER IN THE COMMAND LINE BELOW.';wrap.append(q,status);
        const card=showCard(type.toUpperCase()+' CHALLENGE // ACTIVE',wrap,'challenge','hint · answer · newchallenge · cancel');
        const actions=document.createElement('div');actions.className='egg-card-actions';[['HINT','hint'],['REVEAL ANSWER','answer'],['NEW CHALLENGE','newchallenge'],['CANCEL','cancel']].forEach(([label,cmd])=>{const b=document.createElement('button');b.type='button';b.textContent=label;b.addEventListener('click',()=>runCommand(cmd));actions.append(b);});card.append(actions);input.placeholder='type your answer…';
      };
      const finishChallenge = message => { activeChallenge=null; input.placeholder='type a command...'; showTextCard('CHALLENGE RESULT',message,'result'); };
      const runScan = () => {
        clearScan(); const frames=['INITIALIZING LOCAL DIAGNOSTICS...','CHECKING INTERFACE MODULES...','VERIFYING EASTER-EGG SIGNALS...','SCAN COMPLETE // 0 DEVICE THREATS'];let i=0;
        const scanCard=showTextCard('LOCAL SCAN // RUNNING',frames[0],'scan');
        const stop=document.createElement('div');stop.className='egg-card-actions';const stopButton=document.createElement('button');stopButton.type='button';stopButton.textContent='CANCEL SCAN';stopButton.addEventListener('click',()=>runCommand('scan-cancel'));stop.append(stopButton);scanCard.append(stop);
        const tick=()=>{if(!terminal?.classList.contains('open')){clearScan();return;}i++;if(i<frames.length){const body=terminal.querySelector('.egg-card-body');if(body)body.textContent=frames[i];scanTimer=setTimeout(tick,420);}else{scanTimer=null;const body=terminal.querySelector('.egg-card-body');if(body)body.textContent=frames[i]+'\nNo device inspection or network scan was performed.';}};
        scanTimer=setTimeout(tick,420);
      };
      const addHistory = (command,result) => {commandHistory.push({command,time:new Date().toLocaleTimeString(),result:String(result||'OK').slice(0,110)});historyIndex=commandHistory.length;};
      const runCommand = raw => {
        const value=raw.trim(); if(!value){setResponse('NO INPUT DETECTED. Type help for available commands.');return;}
        const command=value.toLowerCase(); const parts=command.split(/\s+/); const root=parts[0]; const arg=parts.slice(1).join(' ');
        if(activeChallenge){
          if(['help','hint','answer','newchallenge','cancel'].includes(command)){/* handled below */}
          else if(root==='riddle'||root==='cipher'){startChallenge(root);addHistory(command,'new challenge started');return;}
          else {const attempt=normalize(value);if(activeChallenge.item.a.includes(attempt)){finishChallenge('CORRECT. CHALLENGE CLEARED. NICE WORK.');addHistory(command,'correct answer');return;}setResponse('NOT QUITE. TRY AGAIN, OR USE hint / answer / cancel.');return;}
        }
        clearScan();
        if(root!=='clear'&&root!=='exit'&&root!=='scan-cancel') removeMainCard();
        let result='';
        if(root==='help'){renderHelp(arg);result='command directory opened';}
        else if(root==='clear'){removeMainCard();output.textContent='Terminal cleared. The void says hi.';result='terminal cleared';}
        else if(root==='exit'){clearScan();terminal._close();return;}
        else if(root==='joke'){result=pick(jokes);showTextCard('JOKE MODULE // RANDOM TRANSMISSION',result,'fun');}
        else if(root==='quote'||root==='roast'){
          const collection=root==='quote'?quotes:roasts;const isQuote=root==='quote';const wrap=document.createElement('div');wrap.className='egg-feature-quote';wrap.textContent='“'+pick(collection)+'”';const card=showCard(isQuote?'QUOTES // MAINFRAME':'ROASTS // FRIENDLY FIRE',wrap,isQuote?'quote':'roast');const b=document.createElement('button');b.type='button';b.textContent=isQuote?'NEW QUOTE ↻':'ROAST AGAIN ↻';b.addEventListener('click',()=>{wrap.textContent='“'+pick(collection)+'”';});const actions=document.createElement('div');actions.className='egg-card-actions';actions.append(b);card.append(actions);result=root+' card opened';
        }
        else if(root==='lore'){result=pick(lore);showTextCard('LORE FRAGMENT // ARCHIVE',result,'lore');}
        else if(root==='secrets'){result=pick(secrets)+'\n'+trackerMessage();showTextCard('DISCOVERY INTEL // CLASSIFIED',result,'secret');}
        else if(root==='room'){if(found.size===DISCOVERIES.length){result='ROOM ACCESS GRANTED. Opening archive...';showTextCard('ACCESS GRANTED',result,'result');setTimeout(unlockRoom,180);}else{result=`ACCESS DENIED. ${DISCOVERIES.length-found.size} trace(s) still missing.`;showTextCard('RESTRICTED // ACCESS DENIED',result,'warning');}}
        else if(root==='whoami'){result='IDENTITY: UNKNOWN VISITOR\nACCESS LEVEL: GUEST\nSESSION: LOCAL // ANONYMOUS';showTextCard('VISITOR PROFILE // WHOAMI',result,'intel');}
        else if(root==='date'){result='LOCAL DATE: '+new Date().toLocaleDateString()+'\nLOCAL TIME: '+new Date().toLocaleTimeString()+'\nCLOCK SOURCE: YOUR DEVICE';showTextCard('LOCAL CLOCK // DATE',result,'intel');}
        else if(root==='version'){result='UNKNOWN_403 // BACKROOM TERMINAL\nINTERFACE BUILD: 2.0\nMODULE STATUS: ONLINE\nRELEASE CHANNEL: PERSONAL';showTextCard('BUILD INFORMATION // VERSION',result,'intel');}
        else if(root==='history'){historyFilter='';addHistory(command,'history card opened');showHistory('');return;}
        else if(root==='history-filter'){historyFilter=arg;addHistory(command,'history filtered: '+(arg||'all'));showHistory(arg);return;}
        else if(root==='riddle'||root==='cipher'){startChallenge(root);result=root+' challenge started';}
        else if(root==='hint'){if(activeChallenge){result='HINT // '+activeChallenge.item.hint;const body=terminal.querySelector('.egg-challenge-status');if(body)body.textContent=result;}else result='NO ACTIVE CHALLENGE. Start riddle or cipher first.';}
        else if(root==='answer'){if(activeChallenge){result='ANSWER // '+activeChallenge.item.a[0].toUpperCase();finishChallenge(result);}else result='NO ACTIVE CHALLENGE.';}
        else if(root==='newchallenge'){if(activeChallenge){const type=activeChallenge.type;startChallenge(type);result='new '+type+' challenge started';}else result='NO ACTIVE CHALLENGE. Start riddle or cipher first.';}
        else if(root==='cancel'){if(activeChallenge){finishChallenge('CHALLENGE ABORTED. Start another with riddle or cipher.');result='challenge cancelled';}else result='NO ACTIVE CHALLENGE.';}
        else if(root==='ascii'){
          if(arg==='list'){result='ARTWORK REGISTRY // '+asciiArt.map(a=>a.id).join(' · ');showTextCard('ASCII REGISTRY // 10 DESIGNS',result,'ascii');}
          else if(arg==='next'||!arg){showAscii();result='ASCII artwork displayed';}
          else{const index=asciiArt.findIndex(a=>a.id===arg);if(index>=0){showAscii(index);result='ASCII '+arg+' displayed';}else result='UNKNOWN ARTWORK. Use ascii list.';}
        }
        else if(root==='scan'){runScan();result='local scan started';}
        else if(root==='scan-cancel'){clearScan();result='SCAN CANCELLED.';showTextCard('LOCAL SCAN // CANCELLED',result,'warning');}
        else if(root==='guide'){result='DESKTOP: ↑ / ↓ browse history · TAB complete · ENTER run · ESC close.\nMOBILE: use the on-screen controls below.\nCHALLENGES: hint · answer · newchallenge · cancel.\nType help for the full command directory.';showTextCard('QUICK GUIDE // CONTROLS',result,'guide');}
        else{result=`COMMAND NOT FOUND: ${command}. Type help. Skill issue? 💀`;showTextCard('UNKNOWN COMMAND // NOT FOUND',result,'warning');}
        addHistory(command,result);
      };
      // A compact touch keyboard mirrors the useful desktop controls.
      const mobilePad=document.createElement('div');mobilePad.className='egg-virtual-pad';mobilePad.setAttribute('role','group');mobilePad.setAttribute('aria-label','Terminal on-screen controls');
      mobilePad.innerHTML='<div class="egg-pad-row"><button type="button" data-action="ArrowUp">↑</button><button type="button" data-action="ArrowDown">↓</button><button type="button" data-action="Tab">TAB</button><button type="button" data-action="Enter">ENTER</button></div><div class="egg-pad-row"><button type="button" data-action="ArrowLeft">←</button><button type="button" data-action="ArrowRight">→</button><button type="button" data-action="Backspace">⌫</button><button type="button" data-action="Escape">ESC</button></div><div class="egg-pad-row"><button type="button" data-action="b">B</button><button type="button" data-action="a">A</button><button type="button" data-action="hint">HINT</button><button type="button" data-action="cancel">CANCEL</button></div>';
      terminal.querySelector('.egg-terminal-content').append(mobilePad);
      mobilePad.querySelectorAll('button').forEach(button=>button.addEventListener('click',()=>{
        const action=button.dataset.action;
        if(action==='hint'||action==='cancel'){runCommand(action);input.focus();return;}
        if(action==='ArrowUp'||action==='ArrowDown'){document.dispatchEvent(new KeyboardEvent('keydown',{key:action,bubbles:true}));}
        if(action==='ArrowUp'&&!activeChallenge){if(commandHistory.length){historyIndex=Math.max(0,historyIndex-1);input.value=commandHistory[historyIndex]?.command||'';}}
        else if(action==='ArrowDown'&&!activeChallenge){historyIndex=Math.min(commandHistory.length,historyIndex+1);input.value=commandHistory[historyIndex]?.command||'';}
        else if(action==='Tab'){const value=input.value.trim().toLowerCase();const matches=allCommands.filter(item=>item.startsWith(value));if(matches.length===1)input.value=matches[0];else if(matches.length>1)setResponse('MATCHES: '+matches.join(' · '));}
        else if(action==='Enter'){terminal.querySelector('.egg-command-form').requestSubmit();}
        else if(action==='Escape'){terminal._close();}
        else if(action==='Backspace'){const start=input.selectionStart??input.value.length;const end=input.selectionEnd??start;const from=start===end?Math.max(0,start-1):start;input.setRangeText('',from,end,'end');input.focus();}
        else if(['ArrowLeft','ArrowRight','a','b'].includes(action)){document.dispatchEvent(new KeyboardEvent('keydown',{key:action,bubbles:true}));input.focus();}
      }));
      terminal.querySelector('.egg-command-form').addEventListener('submit', e => {
        e.preventDefault(); const command = input.value; input.value = ''; runCommand(command);
      });
      input.addEventListener('keydown', e => {
        if (e.key === 'Escape') { e.preventDefault(); terminal._close(); return; }
        if (e.key === 'ArrowUp' && !activeChallenge) { e.preventDefault(); if (commandHistory.length) { historyIndex = Math.max(0, historyIndex - 1); input.value = commandHistory[historyIndex]?.command || ''; } }
        if (e.key === 'ArrowDown' && !activeChallenge) { e.preventDefault(); historyIndex = Math.min(commandHistory.length, historyIndex + 1); input.value = commandHistory[historyIndex]?.command || ''; }
        if (e.key === 'Tab') { e.preventDefault(); const value = input.value.trim().toLowerCase(); const matches = allCommands.filter(item => item.startsWith(value)); if (matches.length === 1) input.value = matches[0]; else if (matches.length > 1) setResponse('MATCHES: ' + matches.join(' · ')); }
      });
    }
    discover('terminal');
    updateTracker();
    terminal._open();
  }
  function unlockRoom() {
    const openRoomWindow = () => {
      // Do not reopen the archive if it is already visible (for example, after a rapid tracker click).
      if (room && room.classList.contains('open')) return;
      if (!room) {
        room = createModal('egg-room-modal', 'SECRET ROOM', `<div class="egg-room-content"><p class="egg-kicker">ACCESS GRANTED // 4 OF 4 TRACES</p><div class="egg-room-sigil">𓆩 ✦ 𓆪</div><h2>WELCOME TO THE<br><span>RED FLAG ARCHIVE 🚩</span></h2><p>u found the hidden archive. no spoilers, just lore. read at ur own risk 💀</p><div class="egg-secret-grid"><article class="egg-secret-card"><h3>ROMANCE ARC: SINGLE 💀</h3><p>No girlfriend. No side quests. Just the main character waiting for the next update.</p></article><article class="egg-secret-card"><h3>ACCESS POLICY: TRUST IS EARNED 🔒</h3><p>Real ones get access. Fake vibes get denied.</p></article><article class="egg-secret-card"><h3>PERSONALITY.EXE: UNPREDICTABLE</h3><p>Quiet in one moment. Randomly becomes the entire entertainment department in the next.</p></article><article class="egg-secret-card"><h3>FRIENDSHIP ACCESS: RESTRICTED 🔒</h3><p>Small circle. Real loyalty. Zero tolerance for fake energy.</p></article><article class="egg-secret-card"><h3>PERSONALITY PATCH NOTES: COMING SOON</h3><p>Still figuring things out. Character development is ongoing.</p></article><article class="egg-secret-card"><h3>FUTURE BUILD: IN DEVELOPMENT ⚙️</h3><p>Current version has bugs. The next update is going to be different.</p></article><article class="egg-secret-card"><h3>CURIOSITY LEVEL: UNPATCHABLE</h3><p>Starts learning one thing. Somehow ends up researching five unrelated things.</p></article><article class="egg-secret-card"><h3>STANDARDS: NON-NEGOTIABLE.</h3><p>Not everything deserves access to your time and energy.</p></article><article class="egg-secret-card"><h3>SLEEP PROTOCOL: COMPROMISED 🌙</h3><p>Brain scheduled a meeting after everyone else logged off.</p></article><article class="egg-secret-card"><h3>MAIN CHARACTER STATUS: UNCONFIRMED 💀</h3><p>Confidence installed. Common sense still downloading.</p></article><article class="egg-secret-card"><h3>LOYALTY CHECK: ACTIONS &gt; WORDS</h3><p>Anyone can talk. Consistency tells the real story.</p></article><article class="egg-secret-card"><h3>LIFE PLAN: NO SPOILERS</h3><p>The plot is developing. Even the main character doesn't know the next episode.</p></article></div><div class="egg-developer-status"><span>DEVELOPER STATUS</span><strong>UNKNOWN_403 // STILL IN DEVELOPMENT</strong><small>BUILD: UNFINISHED · ACCESS: LIMITED · VIBES: CLASSIFIED</small></div><button type="button" class="egg-room-close">RETURN TO THE INTERNET ↗</button><p class="egg-room-note">discoveries stay in this browser on this device. no account. no server. no tracking.</p></div>`);
        room.querySelector('.egg-room-close').addEventListener('click', () => room._close());
      }
      room._open();
    };

    // Avoid stacking two full-screen dialogs if the terminal is open when the last trace is found.
    if (terminal && terminal.classList.contains('open')) {
      terminal._close();
      setTimeout(openRoomWindow, reducedMotion ? 0 : 280);
    } else {
      openRoomWindow();
    }
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
    if (e.isTrusted && e.target && e.target.matches('input,textarea,select,[contenteditable="true"]')) return;
    const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
    seq = key === konami[seq] ? seq + 1 : (key === konami[0] ? 1 : 0);
    if (seq === konami.length) { seq = 0; discover('konami'); showToast('KONAMI CODE ACCEPTED // CLASSIC CHEAT CODE 🎮'); document.body.classList.add('egg-glitch'); setTimeout(() => document.body.classList.remove('egg-glitch'), reducedMotion ? 0 : 900); }
  });
  // Touch-friendly alternative for visitors without a physical keyboard.
  function toggleMobileKonami() {
    const existing = document.querySelector('.egg-mobile-konami');
    if (existing) { existing.remove(); return; }
    const panel = document.createElement('div');
    panel.className = 'egg-mobile-konami';
    panel.setAttribute('role', 'group');
    panel.setAttribute('aria-label', 'Enter the classic cheat code');
    panel.innerHTML = '<div class="egg-mobile-konami-head"><p>CLASSIC CHEAT CODE</p><button type="button" class="egg-mobile-konami-close" aria-label="Close cheat code panel">×</button></div><div class="egg-mobile-keys"><button type="button" data-key="ArrowUp" aria-label="Up">↑</button><button type="button" data-key="ArrowUp" aria-label="Up">↑</button><button type="button" data-key="ArrowDown" aria-label="Down">↓</button><button type="button" data-key="ArrowDown" aria-label="Down">↓</button><button type="button" data-key="ArrowLeft" aria-label="Left">←</button><button type="button" data-key="ArrowRight" aria-label="Right">→</button><button type="button" data-key="ArrowLeft" aria-label="Left">←</button><button type="button" data-key="ArrowRight" aria-label="Right">→</button><button type="button" data-key="b">B</button><button type="button" data-key="a">A</button></div><small class="egg-mobile-konami-progress" aria-live="polite">0 / 10</small>';
    document.body.appendChild(panel);
    let progress = 0;
    const counter = panel.querySelector('.egg-mobile-konami-progress');
    panel.querySelector('.egg-mobile-konami-close').addEventListener('click', () => panel.remove());
    panel.querySelectorAll('.egg-mobile-keys button').forEach(btn => btn.addEventListener('click', () => {
      if (btn.dataset.key === konami[progress]) progress++;
      else progress = btn.dataset.key === konami[0] ? 1 : 0;
      counter.textContent = `${progress} / ${konami.length}`;
      if (progress === konami.length) {
        panel.remove();
        discover('konami');
        showToast('KONAMI CODE ACCEPTED // CLASSIC CHEAT CODE 🎮');
      }
    }));
  }
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
  }
})();
