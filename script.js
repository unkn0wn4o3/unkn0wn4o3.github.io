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
