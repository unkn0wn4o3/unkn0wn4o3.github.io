(() => {
  'use strict';
  const $ = id => document.getElementById(id);
  const root = document.documentElement;
  const cursor = $('customCursor');
  const finePointer = matchMedia('(pointer:fine)').matches;
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (cursor && finePointer && !reducedMotion) {
    root.classList.add('cursor-ready');
    addEventListener('mousemove', e => { cursor.style.transform = `translate(${e.clientX-5}px,${e.clientY-5}px) rotate(-10deg)`; }, {passive:true});
    const isInteractive = e => !!e.target.closest('a,button,input,select,summary,[role="button"]');
    document.addEventListener('pointerover', e => cursor.classList.toggle('is-pointing', isInteractive(e)));
    document.addEventListener('pointerout', e => { if (!e.relatedTarget || !e.relatedTarget.closest('a,button,input,select,summary,[role="button"]')) cursor.classList.remove('is-pointing'); });
    document.addEventListener('mouseleave', () => cursor.style.opacity='0');
    document.addEventListener('mouseenter', () => cursor.style.opacity='1');
  }

  // Artwork and metadata are matched by explicit filenames, not archive order.
  const tracks = [
    {title:'Bare Minimum — Best Part (Slowed + Reverb)',artist:'SABI & MIA BOYKA',cover:'bare minimum { best Part (slowed + reverb)}.jfif',file:'Bazovyi Minimum (BasoBbIN MMHMMYM) Best Part -SABI, MIABOYKA slowed + reverb audio edit.mp3'},
    {title:'Bad Boy (Slowed + Reverb + Ice Wave)',artist:'Marwa Loud',cover:'bad boy (slowed + reverb + ice wave).jfif',file:'BAD BOY - MARWA LOUD (SLOWED + REVERB + ICEWAVE).mp3'},
    {title:'Mala (Slowed + Reverb)',artist:'6ix9ine ft. Anuel AA',cover:'mala (slowed + reverb).jfif',file:'6ix9ine, Anuel Aa - MALA (slowed + reverb).mp3'},
    {title:'Bare Minimum — (Complete Song)',artist:'SABI & MIA BOYKA',cover:'bare minimum ( complete song ).jfif',file:'[VIETSUB+LYRICS] Bare minimum - SABI, MIA BOYKA (Russia Song); English lyrics.mp3'},
    {title:'Ramenez la coupe à la maison',artist:'Vegedream',cover:'ramenez-la-coupe-a-la-maison.jfif',file:'VEGEDREAM - RAMENEZ LA COUPE A LA MAISON.mp3'},
    {title:'Habibi',artist:'Ricky Rich & ARAM Mafia',cover:'habibi.jfif',file:'Ricky Rich & ARAM Mafia - Habibi (Official Video).mp3'},
    {title:'Habibi (Slowed + Reverb)',artist:'Ricky Rich & ARAM Mafia',cover:'habibi (slowed + reverb).jfif',file:'Ricky Rich & ARAM Mafia - Habibi (SLOWED AND REVERB) B.M.SLOWED MUXIC.mp3'},
    {title:'Love Nwantiti (TikTok Remix Slowed)',artist:'CKay',cover:'love nwantiti (tiktok remix slowed).jfif',file:'love nwantiti (tiktok remix slowed + with lyrics).mp3'},
    {title:'Me Gusta',artist:'DTF',cover:'me gusta.jfif',file:'DTF - Me Gusta [Clip Officiel].mp3'},
    {title:'Low Life',artist:'Future ft. The Weeknd',cover:'low life.jfif',file:'Future - Low Life (Official Music Video) ft. The Weeknd.mp3'},
    {title:'Mask Off',artist:'Future',cover:'mask off.jfif',file:'Future - Mask Off (Official Music Video).mp3'},
    {title:'London View',artist:'OTP',cover:'london view.jfif',file:'TPL BM (OTP) - London View Remix ft Mini x Sava x Marin x Rambizz (Music Video) Rzon.mp3'},
    {title:'Ransom (Slowed + Reverb)',artist:'Lil Tecca',cover:'ransom (slowed + reverb).jfif',file:'Lil Tecca - Ransom (slowed+reverb).mp3'},
    {title:'Rockstar (Slowed + Reverb)',artist:'Post Malone ft. 21 Savage',cover:'rockstar (slowed + reverb).jfif',file:'Post Malone ft. 21 Savage - Rockstar - (Slowed Reverb).mp3'},
    {title:'Goosebumps (Slowed + Reverb)',artist:'Travis Scott ft. Kendrick Lamar',cover:'goosebumps (slowed + reverb).jfif',file:'travis scott & kendrick lamar - goosebumps (slowed + reverb).mp3'},
    {title:'The Box',artist:'Roddy Ricch',cover:'the box.jfif',file:'Roddy Ricch - The Box [Official Music Video].mp3'}
  ];
  const coverBase='assets/afterhours/covers/';
  const audioBase='music/';
  const list=$('ahTrackList'), audio=$('ahAudio');
  let selected=-1, audioReady=false, audioCtx=null, filters=null, source=null, seeking=false, pendingPlay=false;
  const fmt = s => { if (!Number.isFinite(s)) return '0:00'; const n=Math.floor(s); return `${Math.floor(n/60)}:${String(n%60).padStart(2,'0')}`; };
  const safeUrl = path => path.split('/').map(encodeURIComponent).join('/');
  tracks.forEach((t,i)=>{
    const button=document.createElement('button'); button.type='button'; button.className='ah-track-slot'; button.dataset.index=i;
    button.innerHTML=`<span class="ah-slot-number">${String(i+1).padStart(2,'0')}</span><img class="ah-slot-art" alt="" loading="lazy"><span class="ah-slot-copy"><strong></strong><small></small></span><span class="ah-slot-duration">—:—</span>`;
    button.querySelector('img').src=safeUrl(coverBase+t.cover); button.querySelector('strong').textContent=t.title; button.querySelector('small').textContent=t.artist;
    button.addEventListener('click',()=>selectTrack(i)); list.append(button);
  });
  function selectTrack(i, autoplay=false){
    pendingPlay=autoplay; selected=i; const t=tracks[i];
    $('ahEmptyStage').hidden=true; $('ahNowPanel').hidden=false;
    $('ahFeatureImage').src=safeUrl(coverBase+t.cover); $('ahFeatureImage').alt=`Cover art for ${t.title}`;
    $('ahNowTitle').textContent=t.title; $('ahNowArtist').textContent=t.artist;
    $('ahTrackIndex').textContent=`${String(i+1).padStart(2,'0')} / 16`; $('ahArtCode').textContent=`AH / ${String(i+1).padStart(3,'0')}`;
    $('ahLibraryPlaying').textContent=String(i+1).padStart(2,'0');
    [...list.children].forEach((el,n)=>{el.classList.toggle('is-active',n===i);el.setAttribute('aria-pressed',String(n===i));});
    audioReady=false; audio.pause(); audio.src=safeUrl(audioBase+t.file); audio.load();
    $('ahPlay').disabled=false; $('ahPlay').textContent='▶'; $('ahPlay').setAttribute('aria-label','Play');
    $('ahPlayerStatus').textContent='AUDIO FILE NOT INCLUDED IN THIS BUILD — ADD A LICENSED MP3 TO /MUSIC.';
    $('ahSeek').value=0; $('ahCurrentTime').textContent='0:00'; $('ahDuration').textContent='0:00';
  }
  function setupAudioGraph(){
    if(audioCtx) return;
    const Ctx=window.AudioContext||window.webkitAudioContext; if(!Ctx) return;
    audioCtx=new Ctx(); source=audioCtx.createMediaElementSource(audio);
    const bass=audioCtx.createBiquadFilter(); bass.type='lowshelf'; bass.frequency.value=180;
    const mid=audioCtx.createBiquadFilter(); mid.type='peaking'; mid.frequency.value=1000; mid.Q.value=0.8;
    const treble=audioCtx.createBiquadFilter(); treble.type='highshelf'; treble.frequency.value=5000;
    source.connect(bass).connect(mid).connect(treble).connect(audioCtx.destination); filters={bass,mid,treble};
  }
  audio.addEventListener('loadedmetadata',()=>{audioReady=true;$('ahDuration').textContent=fmt(audio.duration);$('ahPlayerStatus').textContent='READY. PRESS PLAY, MAIN CHARACTER.';if(pendingPlay){pendingPlay=false;audio.play().catch(()=>{$('ahPlayerStatus').textContent='TAP PLAY TO START AUDIO.';});}});
  audio.addEventListener('error',()=>{audioReady=false;$('ahPlayerStatus').textContent='MP3 NOT FOUND. ADD THE MATCHING LICENSED FILE TO /MUSIC.';});
  audio.addEventListener('timeupdate',()=>{if(!seeking&&Number.isFinite(audio.duration))$('ahSeek').value=Math.round(audio.currentTime/audio.duration*1000);$('ahCurrentTime').textContent=fmt(audio.currentTime);});
  audio.addEventListener('ended',()=>{if($('ahRepeat').checked){audio.currentTime=0;audio.play();}else nextTrack();});
  $('ahPlay').addEventListener('click',async()=>{if(selected<0)return;if(!audioReady){$('ahPlayerStatus').textContent='MP3 NOT READY — CHECK THE /MUSIC FILE.';return;}setupAudioGraph();if(audioCtx?.state==='suspended')await audioCtx.resume();if(audio.paused){await audio.play();$('ahPlay').textContent='Ⅱ';$('ahPlay').setAttribute('aria-label','Pause');}else{audio.pause();$('ahPlay').textContent='▶';$('ahPlay').setAttribute('aria-label','Play');}});
  audio.addEventListener('pause',()=>{$('ahPlay').textContent='▶';$('ahPlay').setAttribute('aria-label','Play');});
  audio.addEventListener('play',()=>{$('ahPlay').textContent='Ⅱ';$('ahPlay').setAttribute('aria-label','Pause');});
  function nextTrack(){if(selected<0)return;let n;if($('ahShuffle').checked)n=Math.floor(Math.random()*tracks.length);else n=(selected+1)%tracks.length;selectTrack(n,true);}
  $('ahNext').addEventListener('click',nextTrack); $('ahPrevious').addEventListener('click',()=>{if(selected<0)return;selectTrack((selected+tracks.length-1)%tracks.length,true);});
  $('ahSeek').addEventListener('input',()=>{seeking=true;if(Number.isFinite(audio.duration))audio.currentTime=(Number($('ahSeek').value)/1000)*audio.duration;});$('ahSeek').addEventListener('change',()=>seeking=false);
  $('ahVolume').addEventListener('input',e=>{audio.volume=Number(e.target.value)/100;$('ahVolumeValue').textContent=`${e.target.value}%`;}); audio.volume=.8;
  [['ahBass','bass'],['ahMid','mid'],['ahTreble','treble']].forEach(([id,key])=>$(id).addEventListener('input',e=>{setupAudioGraph();if(filters)filters[key].gain.value=Number(e.target.value);$(`${id}Value`).textContent=`${e.target.value} dB`;}));
  $('ahPitch').addEventListener('input',e=>{audio.playbackRate=Number(e.target.value);audio.preservesPitch=false;$('ahPitchValue').textContent=`${Number(e.target.value).toFixed(2)}×`;});
  function setToggle(id,on){$(id).checked=on;$(id==='ahShuffle'?'ahShuffleButton':'ahRepeatButton').classList.toggle('is-on',on);}
  $('ahShuffle').addEventListener('change',e=>setToggle('ahShuffle',e.target.checked));$('ahRepeat').addEventListener('change',e=>setToggle('ahRepeat',e.target.checked));
  $('ahShuffleButton').addEventListener('click',()=>setToggle('ahShuffle',!$('ahShuffle').checked));$('ahRepeatButton').addEventListener('click',()=>setToggle('ahRepeat',!$('ahRepeat').checked));
  $('ahSettingsToggle').addEventListener('click',()=>{const open=$('ahSettings').hidden;$('ahSettings').hidden=!open;$('ahSettingsToggle').setAttribute('aria-expanded',String(open));});$('ahSettingsClose').addEventListener('click',()=>{$('ahSettings').hidden=true;$('ahSettingsToggle').setAttribute('aria-expanded','false');});
  $('ahBackgrounds').addEventListener('click',e=>{const b=e.target.closest('button[data-bg]');if(!b)return;const n=b.dataset.bg;$('ahCenterStage').style.setProperty('--ah-background',`url("assets/afterhours/backgrounds/${n}.png")`);document.querySelectorAll('.ah-backgrounds button').forEach(x=>x.classList.toggle('is-active',x===b));});
  // Set a deliberate default background.
  $('ahCenterStage').style.setProperty('--ah-background','url("assets/afterhours/backgrounds/1.png")');
})();
