/* =========================
   UTIL: small helpers
   ========================= */
const clamp = (n, min, max) => Math.min(Math.max(n, min), max);

/* =========================
   MOBILE BURGER MENU
   ========================= */
const burger = document.getElementById('burger');
const dropdown = document.getElementById('dropdown');
if(burger){
  burger.addEventListener('click', () => {
    const open = dropdown.style.display === 'block';
    dropdown.style.display = open ? 'none' : 'block';
    burger.setAttribute('aria-expanded', String(!open));
  });
  // Close when clicking outside
  document.addEventListener('click', (e) => {
    if(!dropdown.contains(e.target) && !burger.contains(e.target)){
      dropdown.style.display='none';
      burger.setAttribute('aria-expanded','false');
    }
  });
}

/* =========================
   PARTICLE BACKGROUND
   ========================= */
(function(){
  const c = document.getElementById('space');
  if(!c) return;
  const ctx = c.getContext('2d');
  let w=0,h=0, dpr=window.devicePixelRatio||1;
  const particles=[], COUNT=60; // reduced count for smoothness
  const mouse={x:-9999,y:-9999, active:false};

  function resize(){
    w=window.innerWidth; h=window.innerHeight;
    c.width=w*dpr; c.height=h*dpr; ctx.setTransform(dpr,0,0,dpr,0,0);
  }
  window.addEventListener('resize', resize,{passive:true});
  resize();

  function spawn(){
    particles.length=0;
    for(let i=0;i<COUNT;i++){
      particles.push({
        x:Math.random()*w, y:Math.random()*h,
        vx:(Math.random()-.5)*.45, vy:(Math.random()-.5)*.45,
        r:Math.random()*2+0.6
      });
    }
  }
  spawn();

  window.addEventListener('mousemove', e => {
    mouse.x=e.clientX; mouse.y=e.clientY; mouse.active=true;
  },{passive:true});
  window.addEventListener('mouseleave',()=>mouse.active=false);

  function step(){
    ctx.clearRect(0,0,w,h);

    // update + draw
    for(const p of particles){
      // gentle drift
      p.x+=p.vx; p.y+=p.vy;

      // repel from mouse
      if(mouse.active){
        const dx=p.x-mouse.x, dy=p.y-mouse.y;
        const dist2 = dx*dx + dy*dy;
        const rad = 120*120;
        if(dist2<rad){
          const f = (rad - dist2)/rad;
          p.x += (dx/Math.sqrt(dist2+0.0001))*f*1.2;
          p.y += (dy/Math.sqrt(dist2+0.0001))*f*1.2;
        }
      }

      // wrap
      if(p.x<-20) p.x=w+20; if(p.x>w+20) p.x=-20;
      if(p.y<-20) p.y=h+20; if(p.y>h+20) p.y=-20;

      // draw point
      ctx.beginPath();
      ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
      ctx.fillStyle='rgba(210, 255, 245, .75)';
      ctx.fill();
    }

    // connect nearby (optimized)
    for(let i=0;i<particles.length;i++){
      for(let j=i+1;j<particles.length;j++){
        const a=particles[i], b=particles[j];
        const dx=a.x-b.x, dy=a.y-b.y;
        const d2=dx*dx+dy*dy;
        if(d2<100*100){
          ctx.strokeStyle='rgba(120,220,210,.06)';
          ctx.lineWidth=1;
          ctx.beginPath();
          ctx.moveTo(a.x,a.y);
          ctx.lineTo(b.x,b.y);
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(step);
  }
  step();
})();

/* =========================
   PARALLAX (throttled with RAF)
   ========================= */
(function(){
  const root = document.getElementById('parallaxRoot');
  const els = Array.from(document.querySelectorAll('[data-depth]'));
  let cx = window.innerWidth/2, cy = window.innerHeight/2;
  let lastX = cx, lastY = cy;
  let needUpdate = false;

  function onMove(e){
    lastX = e.clientX; lastY = e.clientY;
    needUpdate = true;
  }
  window.addEventListener('mousemove', onMove, {passive:true});
  window.addEventListener('resize', ()=>{ cx = window.innerWidth/2; cy = window.innerHeight/2; }, {passive:true});

  function rafLoop(){
    if(needUpdate){
      const dx = (lastX - cx) / cx;
      const dy = (lastY - cy) / cy;
      els.forEach(el=>{
        const depth = parseFloat(el.getAttribute('data-depth')||'4');
        const tx = clamp(-dx*depth*2.2,-12,12);
        const ty = clamp(-dy*depth*2.2,-12,12);
        el.style.transform = `translate3d(${tx}px, ${ty}px, 0)`;
      });
      needUpdate = false;
    }
    requestAnimationFrame(rafLoop);
  }
  rafLoop();
})();

/* =========================
   CARD TILT + MAGNETIC HOVER
   ========================= */
(function(){
  const cards = document.querySelectorAll('[data-tilt],[data-magnetic]');
  cards.forEach(card=>{
    let rect, raf=null;

    function update(e){
      rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const px = (x/rect.width)*2 - 1;   // -1 .. 1
      const py = (y/rect.height)*2 - 1;

      const tiltX = clamp(-py*6,-8,8);
      const tiltY = clamp(px*6,-8,8);
      const magX  = clamp(px*8,-10,10);
      const magY  = clamp(py*8,-10,10);

      card.style.transform = `perspective(900px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translate3d(${magX}px, ${magY}px, 0)`;
    }

    card.addEventListener('mousemove', (e)=>{
      if(raf) cancelAnimationFrame(raf);
      raf = requestAnimationFrame(()=>update(e));
    });
    card.addEventListener('mouseleave', ()=> {
      card.style.transform = 'perspective(900px) rotateX(0) rotateY(0) translate3d(0,0,0)';
    });
    card.addEventListener('touchstart',()=>{}, {passive:true}); // iOS hover fix
  });
})();

/* =========================
   FOOTER YEAR
   ========================= */
document.getElementById('y').textContent = new Date().getFullYear();

/* =========================
   CUSTOM VIDEO PLAYER LOGIC
   ========================= */
(function(){
  const video = document.getElementById("myVideo");
  if(!video) return;

  const playPauseBtn = document.getElementById("playPause");
  const rewindBtn = document.getElementById("rewind");
  const forwardBtn = document.getElementById("forward");
  const volumeSlider = document.getElementById("volume");
  const currentTimeEl = document.getElementById("currentTime");
  const durationEl = document.getElementById("duration");
  const progress = document.getElementById("progress");
  const progressFilled = document.getElementById("progressFilled");

  // helper: format time
  const fmt = s => {
    if(isNaN(s)) return "0:00";
    const m = Math.floor(s/60);
    const sec = Math.floor(s%60).toString().padStart(2,'0');
    return `${m}:${sec}`;
  };

  // attempt autoplay muted (works most browsers)
  video.volume = parseFloat(volumeSlider.value || 1);
  video.muted = true; // start muted to increase autoplay success
  video.play().then(() => {
    playPauseBtn.textContent = "⏸";
    video.muted = false; // unmute if browser allowed; will remain muted if not allowed
  }).catch(err => {
    // autoplay blocked: keep video muted and wait for user interaction
    console.log("Autoplay blocked:", err);
    playPauseBtn.textContent = "▶️";
  });

  // load metadata for duration
  video.addEventListener('loadedmetadata', () => {
    durationEl.textContent = fmt(video.duration);
  });

  // update current time & progress
  video.addEventListener('timeupdate', () => {
    currentTimeEl.textContent = fmt(video.currentTime);
    const pct = (video.currentTime / (video.duration || 1)) * 100;
    progressFilled.style.width = `${pct}%`;
  });

  // play/pause toggle
  playPauseBtn.addEventListener("click", () => {
    if (video.paused) {
      // some browsers require user gesture to unmute; keep previous volume state
      video.play().catch(() => { /* ignore */ });
    } else {
      video.pause();
    }
  });

  // update button text
  video.addEventListener("play", () => {
    playPauseBtn.textContent = "⏸";
  });
  video.addEventListener("pause", () => {
    playPauseBtn.textContent = "▶️";
  });

  // skip back 10s
  rewindBtn.addEventListener("click", () => {
    video.currentTime = Math.max(video.currentTime - 10, 0);
  });

  // skip forward 10s
  forwardBtn.addEventListener("click", () => {
    video.currentTime = Math.min(video.currentTime + 10, video.duration || 0);
  });

  // volume control
  volumeSlider.addEventListener("input", () => {
    video.volume = parseFloat(volumeSlider.value);
    video.muted = video.volume === 0;
  });

  // allow clicking progress to seek
  progress.addEventListener('click', (e) => {
    const rect = progress.getBoundingClientRect();
    const pct = clamp((e.clientX - rect.left) / rect.width, 0, 1);
    video.currentTime = pct * (video.duration || 0);
  });

  // keyboard accessibility (space toggles)
  document.addEventListener('keydown', (e) => {
    if(document.activeElement && ['INPUT','TEXTAREA'].includes(document.activeElement.tagName)) return;
    if(e.code === 'Space') {
      e.preventDefault();
      if(video.paused) video.play(); else video.pause();
    }
    if(e.code === 'ArrowRight') {
      video.currentTime = Math.min(video.currentTime + 10, video.duration || 0);
    }
    if(e.code === 'ArrowLeft') {
      video.currentTime = Math.max(video.currentTime - 10, 0);
    }
  });
})();

/* =========================
   TOS Modal logic
   ========================= */
(function(){
  const open = document.getElementById('openTos');
  const modal = document.getElementById('tosModal');
  const close = document.getElementById('closeTos');

  if(!open || !modal) return;

  function showModal(){
    modal.classList.add('show');
    modal.setAttribute('aria-hidden','false');
    // trap focus briefly
    const focusable = modal.querySelector('button, a, input, textarea, [tabindex]');
    if(focusable) focusable.focus();
  }
  function hideModal(){
    modal.classList.remove('show');
    modal.setAttribute('aria-hidden','true');
  }

  open.addEventListener('click', showModal);
  close.addEventListener('click', hideModal);
  modal.addEventListener('click', (e) => {
    if(e.target === modal) hideModal();
  });
  document.addEventListener('keydown', (e) => {
    if(e.key === 'Escape') hideModal();
  });
})();
