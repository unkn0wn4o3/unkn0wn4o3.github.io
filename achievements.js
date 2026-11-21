(() => {
  'use strict';
  const KEY = 'unknown403-achievements-v1';
  const DISCOVERY_KEY = 'unknown403-discoveries-v1';
  const LOCKED_IMAGE = 'assets/achievements/Dark Crystal Question Mark Icon.png';
  const BADGES = [
    {id:'spawned-in',name:'Spawned In',desc:'You spawned in. First W secured. Welcome to the lore 💀',image:'Sci-Fi Portal Emblem with Orbital Crescent.png',hint:'Visit the website for the first time.',group:'SITE'},
    {id:'lore-check',name:'Lore Check',desc:'Read the lore. Now you know slightly too much. 😭',image:'Antique Dossier with Bronze Seal.png',hint:'Spend a moment in the About section.',group:'SITE'},
    {id:'queue-dodger',name:'Queue Dodger',desc:'Entered Gaming HQ. Productivity has officially left the chat. 🎮',image:'Neon Blue and Violet Gaming Controller.png',hint:'Explore Gaming HQ.',group:'GAMING'},
    {id:'fictional-hours',name:'Fictional Hours',desc:'Entertainment tab opened. Fictional people are carrying the plot.',image:'Vintage Projector Golden Beam.png',hint:'Click any card in Entertainment.',group:'ENTERTAINMENT'},
    {id:'anime-rent-free',name:'Anime Rent-Free',desc:'Anime section visited. Character arcs got you in a chokehold. 💀',image:'Intense Indigo Manga Eye Emblem.png',hint:'Click at least one Anime I FW card.',group:'ENTERTAINMENT'},
    {id:'one-more-ep',name:'One More Ep',desc:'One more episode? Be fr. We know how this goes. 😭',image:'Cinematic Remote and Filmstrip Emblem.png',hint:'Click at least one Series That Got Me Hooked card.',group:'ENTERTAINMENT'},
    {id:'cinema-tax',name:'Cinema Tax',desc:'Movies explored. Popcorn tax has been paid. 🍿',image:'Vintage Burgundy Cinema Ticket and Film Reel.png',hint:'Click at least one Movies card.',group:'ENTERTAINMENT'},
    {id:'not-just-pixels',name:'Not Just Pixels',desc:'“It’s just cartoons” is a weak take. 💀',image:'Neon Anime Motion Reel.png',hint:'Click at least one Animated Movies card.',group:'ENTERTAINMENT'},
    {id:'side-quest-irl',name:'Side Quest IRL',desc:'All six side quests checked. Bro actually explored the map. 🗺️',image:'Antique Compass and Treasure Map Emblem.png',hint:'Unlock all six My World card achievements.',group:'MY WORLD'},
    {id:'ball-knowledge',name:'Ball Knowledge',desc:'Football corner visited. Ball knowledge +1. ⚽',image:'Green Football Stadium Emblem.png',hint:'Click the Football card in My World.',group:'MY WORLD'},
    {id:'37-tabs',name:'37 Tabs Open',desc:'Learning stuff opened. 37 tabs and still curious. 😭',image:'Antique Scholar Emblem with Journal.png',hint:'Click the Learning Stuff card in My World.',group:'MY WORLD'},
    {id:'fictional-resident',name:'Fictional Resident',desc:'Fictional worlds explored. Reality got muted for a sec.',image:'Moonlit Portal to a Dreaming Citadel.png',hint:'Click the Fictional Worlds card in My World.',group:'MY WORLD'},
    {id:'menu-investigator',name:'Menu Investigator',desc:'Food section visited. Priorities? Immaculate. 🍜',image:'Copper-Kissed Ramen Still Life.png',hint:'Click the Food card in My World.',group:'MY WORLD'},
    {id:'delulu-dept',name:'Delulu Dept.',desc:'Delulu Dept. explored. Headcanon running at 4K. 💀',image:'Enchanted Moonlit Dream Journal.png',hint:'Click the Delulu Hours card in My World.',group:'MY WORLD'},
    {id:'patch-notes',name:'Patch Notes IRL',desc:'Self-improvement checked. Character development loading…',image:'Resilient Sprout and Vintage Compass.png',hint:'Click the Self Improvement card in My World.',group:'MY WORLD'},
    {id:'blueprint-lurker',name:'Blueprint Lurker',desc:'Blueprint explored. Four quests inspected. Bro is reviewing the patch notes. 💀',image:'Blueprint Mapping Compass Emblem.png',hint:'View all four Focus Quests and open the live website project.',group:'BLUEPRINT'},
    {id:'social-battery',name:'Social Battery',desc:'Socials checked. Choose your fighter. No pressure. 🤝',image:'Glowing Metallic Network Emblem.png',hint:'Visit the Socials section.',group:'SOCIALS'},
    {id:'terminal-tourist',name:'Terminal Tourist',desc:'Backroom Terminal opened. IT department? That’s you now. 💀',image:'Retro Green Terminal Workspace.png',hint:'Open the Backroom Terminal.',group:'SECRETS'},
    {id:'big-brain',name:'Big Brain, No Buffer',desc:'Riddle solved. Brain finally clocked in. 🧠',image:'Steampunk Puzzle Gear Emblem.png',hint:'Correctly solve a terminal riddle or cipher.',group:'SECRETS'},
    {id:'four-traces',name:'Four Traces, One Door',desc:'All four traces found. Red Flag Archive unlocked. Plot twist: you were the detective. 🚩',image:'Steampunk Vault Door with Purple Glow.png',hint:'Discover all four existing Easter eggs and unlock the Secret Room.',group:'SECRETS'}
  ];
  const read = () => { try { const x=JSON.parse(localStorage.getItem(KEY)||'[]'); return new Set(Array.isArray(x)?x.filter(id=>BADGES.some(b=>b.id===id)):[]); } catch (_) { return new Set(); } };
  const unlocked = read();
  const save = () => { try { localStorage.setItem(KEY,JSON.stringify([...unlocked])); } catch (_) {} };
  let toastTimer;
  function toast(badge) {
    let el=document.querySelector('.achievement-toast');
    if(!el){el=document.createElement('div');el.className='achievement-toast';el.setAttribute('role','status');el.setAttribute('aria-live','polite');document.body.appendChild(el);}
    el.innerHTML=`<span class="achievement-toast-mark">✦</span><span><small>ACHIEVEMENT UNLOCKED</small><strong>${badge.name}</strong></span>`;
    el.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.classList.remove('show'),4200);
  }
  function renderProgress() {
    const count=document.querySelector('[data-achievement-count]');
    const fill=document.querySelector('[data-achievement-progress]');
    const pct=Math.round(unlocked.size/BADGES.length*100);
    if(count)count.textContent=`${unlocked.size} / ${BADGES.length} UNLOCKED`;
    if(fill)fill.style.width=pct+'%';
    const sub=document.querySelector('[data-achievement-subtitle]');
    if(sub)sub.textContent=unlocked.size===BADGES.length?'100%. The archive is cleared. Touch grass? maybe later.':`${pct}% complete · ${BADGES.length-unlocked.size} still hiding. go get 'em.`;
    document.querySelectorAll('[data-badge-id]').forEach(card=>{
      const yes=unlocked.has(card.dataset.badgeId);card.classList.toggle('is-unlocked',yes);card.classList.toggle('is-locked',!yes);
      const status=card.querySelector('.badge-status');if(status)status.textContent=yes?'UNLOCKED':'LOCKED';
      const img=card.querySelector('img');if(img){img.src=yes?img.dataset.badgeImage:LOCKED_IMAGE;img.alt=yes?`${card.dataset.badgeName} achievement badge`:'Locked crystal question mark';}
      const desc=card.querySelector('.badge-description');if(desc)desc.hidden=!yes;
      const condition=card.querySelector('.badge-condition');if(condition)condition.hidden=yes;
      const how=card.querySelector('.badge-hint');if(how)how.hidden=yes;
    });
  }
  function award(id) {
    const badge=BADGES.find(b=>b.id===id);if(!badge||unlocked.has(id))return false;
    unlocked.add(id);save();renderProgress();toast(badge);
    if(['ball-knowledge','37-tabs','fictional-resident','menu-investigator','delulu-dept','patch-notes'].every(x=>unlocked.has(x))) award('side-quest-irl');
    return true;
  }
  window.Unknown403Achievements={award,has:id=>unlocked.has(id),list:()=>BADGES.map(b=>({...b,unlocked:unlocked.has(b.id)}))};
  if(['ball-knowledge','37-tabs','fictional-resident','menu-investigator','delulu-dept','patch-notes'].every(id=>unlocked.has(id))) award('side-quest-irl');
  // Reconcile discoveries earned before this achievement system existed; never reset or replace the original tracker.
  try {
    const traces=JSON.parse(localStorage.getItem(DISCOVERY_KEY)||'[]');
    if(Array.isArray(traces)&&traces.includes('terminal')) award('terminal-tourist');
    if(Array.isArray(traces)&&['terminal','konami','footer','fragment'].every(id=>traces.includes(id))) award('four-traces');
  } catch (_) {}

  const isArchive=document.body.classList.contains('achievement-archive');
  if(isArchive){
    const grid=document.getElementById('achievementGrid');
    if(grid){
      const groups=['SITE','GAMING','ENTERTAINMENT','MY WORLD','BLUEPRINT','SOCIALS','SECRETS'];
      grid.innerHTML=groups.map(group=>{
        const cards=BADGES.filter(b=>b.group===group).map(b=>`<article class="badge-card ${unlocked.has(b.id)?'is-unlocked':'is-locked'}" data-badge-id="${b.id}" data-badge-name="${b.name}"><div class="badge-art"><img data-badge-image="assets/achievements/${encodeURIComponent(b.image).replace(/%2F/g,'/')}" src="${unlocked.has(b.id)?'assets/achievements/'+encodeURIComponent(b.image).replace(/%2F/g,'/'):LOCKED_IMAGE}" alt="${unlocked.has(b.id)?b.name+' achievement badge':'Locked crystal question mark'}" loading="lazy"></div><div class="badge-copy"><div class="badge-meta"><span>${b.group}</span><b class="badge-status">${unlocked.has(b.id)?'UNLOCKED':'LOCKED'}</b></div><h3>${b.name}</h3><p class="badge-description" ${unlocked.has(b.id)?'':'hidden'}>${b.desc}</p><p class="badge-condition" ${unlocked.has(b.id)?'hidden':''}>HOW TO UNLOCK: ${b.hint}</p></div></article>`).join('');
        return `<section class="badge-group"><div class="badge-group-heading"><span>ARCHIVE // ${group}</span><i></i></div><div class="badge-grid">${cards}</div></section>`;
      }).join('');
      
    }
    renderProgress();
    document.getElementById('resetAchievements')?.addEventListener('click',()=>{
      if(!window.confirm('Reset all 20 achievement unlocks on this browser? This cannot be undone.'))return;
      unlocked.clear();save();renderProgress();
    });
    return;
  }

  // The first-visit badge is intentionally the only automatic reward.
  award('spawned-in');
  // Section-visit tasks use actual viewport visibility, not mere DOM presence.
  if('IntersectionObserver' in window){
    const sectionMap={'#about':'lore-check','#gaming':'queue-dodger','#socials':'social-battery'};
    const sectionObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting&&entry.intersectionRatio>=.16){const id=sectionMap['#'+entry.target.id];if(id)award(id);sectionObserver.unobserve(entry.target);}}),{threshold:[.16,.35],rootMargin:'0px 0px -8% 0px'});
    Object.keys(sectionMap).forEach(sel=>{const el=document.querySelector(sel);if(el)sectionObserver.observe(el);});
  } else { /* Older browsers: a section becomes eligible when the visitor reaches it. */
    ['about','gaming','socials'].forEach(id=>{const el=document.getElementById(id);el?.addEventListener('pointerenter',()=>award(id==='about'?'lore-check':id==='gaming'?'queue-dodger':'social-battery'),{once:true});});
  }
  // My World: each of the six real cards is a click target, with keyboard support.
  const worldIds=['ball-knowledge','37-tabs','fictional-resident','menu-investigator','delulu-dept','patch-notes'];
  document.querySelectorAll('#world .interest-grid article').forEach((card,i)=>{
    card.classList.add('achievement-click-card');card.tabIndex=0;card.setAttribute('role','button');
    card.setAttribute('aria-label',`Explore ${card.querySelector('h3')?.textContent.trim()||'interest'} and unlock its achievement`);
    const activate=()=>award(worldIds[i]);card.addEventListener('click',activate);card.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();activate();}});
  });
  // Entertainment: a click on any actual card in a category grants that category's badge + the parent badge.
  const entertainmentRules=[['.anime-block','anime-rent-free'],['.series-block','one-more-ep'],['.movies-block','cinema-tax'],['.animated-block','not-just-pixels']];
  entertainmentRules.forEach(([selector,id])=>document.querySelectorAll(`#entertainment ${selector} .media-card`).forEach(card=>{
    card.classList.add('achievement-click-card');card.tabIndex=0;card.setAttribute('role','button');
    card.setAttribute('aria-label',`Select ${card.querySelector('h3')?.textContent.trim()||'card'} to unlock an achievement`);
    const activate=()=>{award('fictional-hours');award(id);};card.addEventListener('click',activate);card.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();activate();}});
  }));
  // Blueprint: all four focus quests must actually enter view AND the live project link must be opened.
  const quests=[...document.querySelectorAll('#projects .ambition-card')];let seenQuests=new Set();let openedProject=false;
  const checkBlueprint=()=>{if(seenQuests.size===4&&openedProject)award('blueprint-lurker');};
  if('IntersectionObserver' in window&&quests.length){const qObs=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting&&entry.intersectionRatio>=.25){seenQuests.add(entry.target);checkBlueprint();qObs.unobserve(entry.target);}}),{threshold:[.25,.5]});quests.forEach(q=>qObs.observe(q));}
  document.querySelector('#projects .project-card.current a.project-foot')?.addEventListener('click',()=>{openedProject=true;checkBlueprint();});
})();
