/* AFTERHOURS interaction shell. Track/audio integration is intentionally deferred. */
(() => {
  'use strict';
  const root=document.documentElement;
  const cursor=document.getElementById('customCursor');
  const finePointer=window.matchMedia('(pointer: fine)').matches;
  const reducedMotion=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if(cursor&&finePointer&&!reducedMotion){
    root.classList.add('cursor-ready');
    window.addEventListener('mousemove',event=>{cursor.style.transform=`translate(${event.clientX-5}px,${event.clientY-5}px) rotate(-10deg)`;},{passive:true});
    const interactive='a,button,[role="button"],input,select';
    document.addEventListener('mouseover',event=>cursor.classList.toggle('is-pointing',!!event.target.closest(interactive)));
    document.addEventListener('mouseleave',()=>{cursor.style.opacity='0';});
    document.addEventListener('mouseenter',()=>{cursor.style.opacity='1';});
  }
  // The empty stage remains visible until a real track is supplied and selected.
  const slots=document.querySelectorAll('.ah-track-slot');
  const stage=document.getElementById('ahEmptyStage');
  const player=document.getElementById('ahNowPanel');
  if(stage&&player){stage.hidden=false;player.hidden=true;}
  slots.forEach(slot=>slot.setAttribute('aria-disabled','true'));
})();
