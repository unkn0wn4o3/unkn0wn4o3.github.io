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
  if (!document.querySelector('.site-status')) {
    const status = document.createElement('div');
    status.className = 'site-status';
    status.innerHTML = 'SYSTEM <strong>ONLINE</strong> &nbsp;//&nbsp; BRAIN: 37 TABS';
    status.setAttribute('aria-hidden','true');
    document.body.appendChild(status);
  }
  if (!document.querySelector('.back-top-float')) {
    const topButton = document.createElement('button');
    topButton.className = 'back-top-float';
    topButton.type = 'button';
    topButton.setAttribute('aria-label','Back to top');
    topButton.title = 'Back to top';
    topButton.textContent = '↑';
    document.body.appendChild(topButton);
    topButton.addEventListener('click', () => window.scrollTo({top:0,behavior:reducedMotion?'auto':'smooth'}));
    const refresh = () => topButton.classList.toggle('visible', window.scrollY > 500);
    window.addEventListener('scroll', refresh, {passive:true});
    refresh();
  }
})();
