/* AFTERHOURS scaffold. Track data and audio sources will be added in a later pass. */
(() => {
  const cursor = document.getElementById('ahCursor');
  const list = document.getElementById('ahTrackList');
  if (cursor && window.matchMedia('(pointer:fine)').matches && !window.matchMedia('(prefers-reduced-motion:reduce)').matches) {
    document.addEventListener('mousemove', e => {
      cursor.style.transform = `translate(${e.clientX - 5}px,${e.clientY - 5}px)`;
    }, {passive:true});
  }
  // Deliberately no audio source, track metadata, or playback action in this structure-only build.
  if (list) list.dataset.trackSlots = '16';
})();
