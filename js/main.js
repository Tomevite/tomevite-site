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
  const ctx = c.getContext('2d');
  let w=0,h=0, dpr=window.devicePixelRatio||1;
  const particles=[], COUNT=90;
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
        vx:(Math.random()-.5)*.6, vy:(Math.random()-.5)*.6,
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
          p.x += (dx/Math.sqrt(dist2+0.0001))*f*1.4;
          p.y += (dy/Math.sqrt(dist2+0.0001))*f*1.4;
        }
      }

      // wrap
      if(p.x<-20) p.x=w+20; if(p.x>w+20) p.x=-20;
      if(p.y<-20) p.y=h+20; if(p.y>h+20) p.y=-20;

      // draw point
      ctx.beginPath();
      ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
      ctx.fillStyle='rgba(210, 255, 245, .7)';
      ctx.fill();
    }

    // connect nearby
    for(let i=0;i<particles.length;i++){
      for(let j=i+1;j<particles.length;j++){
        const a=particles[i], b=particles[j];
        const dx=a.x-b.x, dy=a.y-b.y;
        const d2=dx*dx+dy*dy;
        if(d2<120*120){
          ctx.strokeStyle='rgba(120,220,210,.08)';
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
   PARALLAX (subtle)
   ========================= */
(function(){
  const root = document.getElementById('parallaxRoot');
  const els = Array.from(document.querySelectorAll('[data-depth]'));
  window.addEventListener('mousemove', (e)=>{
    const cx = window.innerWidth/2, cy = window.innerHeight/2;
    const dx = (e.clientX - cx) / cx;
    const dy = (e.clientY - cy) / cy;
    els.forEach(el=>{
      const depth = parseFloat(el.getAttribute('data-depth')||'4');
      const tx = clamp(-dx*depth*2.2,-12,12);
      const ty = clamp(-dy*depth*2.2,-12,12);
      el.style.transform = `translate3d(${tx}px, ${ty}px, 0)`;
    });
  },{passive:true});
  // reset on leave
  window.addEventListener('mouseleave', ()=> els.forEach(el=>el.style.transform='translate3d(0,0,0)'));
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
    card.addEventListener('mouseleave', ()=>{
      card.style.transform = 'perspective(900px) rotateX(0) rotateY(0) translate3d(0,0,0)';
    });
    card.addEventListener('touchstart',()=>{}, {passive:true}); // iOS hover fix
  });
})();

/* =========================
   FOOTER YEAR
   ========================= */
document.getElementById('y').textContent = new Date().getFullYear();
