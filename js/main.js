/* =========================
   UTIL
========================= */
const clamp = (n, min, max) => Math.min(Math.max(n, min), max);

/* =========================
   MOBILE BURGER
========================= */
const burger = document.getElementById('burger');
const dropdown = document.getElementById('dropdown');
if(burger){
  burger.addEventListener('click', ()=>{
    const open = dropdown.style.display==='block';
    dropdown.style.display = open ? 'none':'block';
    burger.setAttribute('aria-expanded', String(!open));
  });
  document.addEventListener('click', e=>{
    if(!dropdown.contains(e.target) && !burger.contains(e.target)){
      dropdown.style.display='none'; 
      burger.setAttribute('aria-expanded','false');
    }
  });
}

/* =========================
   PARTICLE BACKGROUND (RAINBOW)
========================= */
(function(){
  const c=document.getElementById('space');
  const ctx=c.getContext('2d');
  let w=0,h=0,dpr=window.devicePixelRatio||1;
  const particles=[], COUNT=120;
  const colors=['#FFB3BA','#FFDFBA','#FFFFBA','#BAFFC9','#BAE1FF','#E0BAFF','#FFBAE1'];
  const mouse={x:-9999,y:-9999, active:false};
  function resize(){ w=window.innerWidth; h=window.innerHeight; c.width=w*dpr; c.height=h*dpr; ctx.setTransform(dpr,0,0,dpr,0,0);}
  window.addEventListener('resize', resize,{passive:true});
  resize();
  function spawn(){particles.length=0; for(let i=0;i<COUNT;i++){particles.push({x:Math.random()*w,y:Math.random()*h,vx:(Math.random()-.5)*.6,vy:(Math.random()-.5)*.6,r:Math.random()*2+0.6,color:colors[i%colors.length]});}}
  spawn();
  window.addEventListener('mousemove',e=>{mouse.x=e.clientX; mouse.y=e.clientY; mouse.active=true;},{passive:true});
  window.addEventListener('mouseleave',()=>mouse.active=false);
  function step(){
    ctx.clearRect(0,0,w,h);
    for(const p of particles){
      p.x+=p.vx; p.y+=p.vy;
      if(mouse.active){
        const dx=p.x-mouse.x, dy=p.y-mouse.y, dist2=dx*dx+dy*dy, rad=120*120;
        if(dist2<rad){ const f=(rad-dist2)/rad; p.x+=(dx/Math.sqrt(dist2+0.0001))*f*1.4; p.y+=(dy/Math.sqrt(dist2+0.0001))*f*1.4;}
      }
      if(p.x<-20)p.x=w+20;if(p.x>w+20)p.x=-20;if(p.y<-20)p.y=h+20;if(p.y>h+20)p.y=-20;
      ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,Math.PI*2); ctx.fillStyle=p.color; ctx.fill();
    }
    requestAnimationFrame(step);
  }
  step();
})();

/* =========================
   TYPING HERO
========================= */
const heroText = "Welcome to Tomevite.com";
const heroEl = document.getElementById('hero-text');
let i=0;
function typeHero(){
  if(i<heroText.length){
    heroEl.textContent += heroText[i++];
    setTimeout(typeHero, 80);
  }
}
typeHero();

/* =========================
   VIDEO CONTROLS
========================= */
const miniVideo=document.getElementById('miniVideo');
document.getElementById('playPause').addEventListener('click',()=>{
  if(miniVideo.paused){miniVideo.play(); this.textContent='Pause';}else{miniVideo.pause(); this.textContent='Play';}
});
document.getElementById('rewind10').addEventListener('click',()=>miniVideo.currentTime-=10);
document.getElementById('forward10').addEventListener('click',()=>miniVideo.currentTime+=10);
document.getElementById('volumeSlider').addEventListener('input', e=>miniVideo.volume=e.target.value);

/* =========================
   TOGGLE TOS
========================= */
const tosCard = document.getElementById('tos-card');
const toggleTosBtn = document.getElementById('toggle-tos');
toggleTosBtn.addEventListener('click', ()=>{
  const isVisible = tosCard.style.display==='block';
  tosCard.style.display = isVisible?'none':'block';
  toggleTosBtn.textContent = isVisible?'Open TOS':'Close TOS';
});

/* =========================
   FOOTER YEAR
========================= */
document.getElementById('y').textContent = new Date().getFullYear();
