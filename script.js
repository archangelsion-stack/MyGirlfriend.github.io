
function rand(min,max){ return Math.random()*(max-min)+min; }

function spawnFloaty(container, opts){
  const el = document.createElement('div');
  el.className='floaty';
  el.textContent = opts.char;
  el.style.left = opts.left+'%';
  el.style.bottom = '-40px';
  el.style.fontSize = opts.size+'px';
  el.style.animation = `floatUp ${opts.dur}s linear ${opts.delay}s forwards`;
  el.style.color = opts.color||'#fff';
  container.appendChild(el);
  setTimeout(()=>el.remove(), (opts.dur+opts.delay)*1000+200);
}

function startFloatLoop(container, chars, count, colorFn){
  function spawnBatch(){
    for(let i=0;i<count;i++){
      spawnFloaty(container, {
        char: chars[Math.floor(Math.random()*chars.length)],
        left: rand(2,95),
        size: rand(14,30),
        dur: rand(6,11),
        delay: rand(0,3),
        color: colorFn ? colorFn() : '#fff'
      });
    }
  } 
  spawnBatch();
  return setInterval(spawnBatch, 3500);
}

function spawnSparkles(container, count){
  for(let i=0;i<count;i++){
    const s = document.createElement('div');
    s.className='floaty';
    s.textContent='✦';
    s.style.left = rand(0,100)+'%';
    s.style.top = rand(0,100)+'%';
    s.style.fontSize = rand(8,16)+'px';
    s.style.color = '#fff';
    s.style.animation = `sparkleTwinkle ${rand(1.5,3)}s ease-in-out ${rand(0,2)}s infinite`;
    container.appendChild(s);
  }
}

/* ---------------- Screen navigation ---------------- */
const screens = {
  welcome: document.getElementById('welcome'),
  login: document.getElementById('login'),
  travel: document.getElementById('travel'),
  choice: document.getElementById('choice'),
  letterScreen: document.getElementById('letterScreen'),
  courtScreen: document.getElementById('courtScreen'),
};
function goTo(name){
  Object.values(screens).forEach(s=>s.classList.add('hidden'));
  screens[name].classList.remove('hidden');
}

document.getElementById('enterBtn').addEventListener('click', ()=>{
  goTo('login');
  if(!loginDecoStarted){ initLoginDeco(); }
});

/* ---------------- Welcome screen effects ---------------- */
const welcomeDeco = document.getElementById('welcomeDeco');
spawnSparkles(welcomeDeco, 25);
startFloatLoop(welcomeDeco, ['💗','💖','💕','✨'], 4, ()=> ['#ff69b4','#ffc1e3','#ffd86b'][Math.floor(rand(0,3))]);

// confetti burst + poppers on load
function burstConfetti(container, n){
  const colors = ['#ff69b4','#ffd86b','#c9a7ff','#ff2d8a','#fff','#6cddff'];
  for(let i=0;i<n;i++){
    const c = document.createElement('div');
    c.className='confetti';
    c.style.left = rand(0,100)+'%';
    c.style.background = colors[Math.floor(rand(0,colors.length))];
    c.style.animation = `confettiFall ${rand(2.5,4.5)}s linear ${rand(0,1.2)}s forwards`;
    c.style.transform = `rotate(${rand(0,360)}deg)`;
    container.appendChild(c);
    setTimeout(()=>c.remove(), 6000);
  }
}
function burstPoppers(container){
  const positions = [['8%','15%'],['85%','12%'],['15%','75%'],['80%','70%']];
  positions.forEach((p,i)=>{
    setTimeout(()=>{
      const pop = document.createElement('div');
      pop.className='popper'; pop.textContent='🎉';
      pop.style.left = p[0]; pop.style.top = p[1];
      container.appendChild(pop);
      burstConfetti(container, 18);
      setTimeout(()=>pop.remove(), 1500);
    }, i*250);
  });
}
burstPoppers(welcomeDeco);
setInterval(()=>burstConfetti(welcomeDeco, 8), 4000);

/* music toggle */
const musicBtn = document.getElementById('musicBtn');
const bgMusic = document.getElementById('bgMusic');
let musicOn = false;
musicBtn.addEventListener('click', ()=>{
  musicOn = !musicOn;
  if(musicOn){
    bgMusic.play().catch(()=>{});
    musicBtn.textContent='🔊 Music';
  } else {
    bgMusic.pause();
    musicBtn.textContent='🔇 Music';
  }
});

/* ---------------- Login screen effects ---------------- */
let loginDecoStarted = false;
function initLoginDeco(){
  loginDecoStarted = true;
  const loginDeco = document.getElementById('loginDeco');
  spawnSparkles(loginDeco, 20);
  startFloatLoop(loginDeco, ['💗','✨','💫'], 3, ()=> ['#ff69b4','#ffc1e3'][Math.floor(rand(0,2))]);
}

const pwInput = document.getElementById('pwInput');
const errorMsg = document.getElementById('errorMsg');
const correctPW = ['04/02/2007','october/04/2009','10-04-2009','october 4 2009','10/4/2009'];

document.getElementById('unlockBtn').addEventListener('click', tryUnlock);
pwInput.addEventListener('keydown', e=>{ if(e.key==='Enter') tryUnlock(); });

function tryUnlock(){
  const val = pwInput.value.trim().toLowerCase();
  if(correctPW.includes(val)){
    errorMsg.style.display='none';
    startGalaxyTravel();
  } else {
    errorMsg.style.display='block';
    errorMsg.style.animation='none';
    void errorMsg.offsetWidth;
    errorMsg.style.animation='shake .4s ease';
  }
}

/* ── Galaxy Travel ── */
const TRAVEL_DURATION = 6200;
let warpRafId = null;

function startGalaxyTravel(){
  goTo('travel');
  runTravelText();
  runWarpCanvas();
  setTimeout(triggerFlash, TRAVEL_DURATION - 320);
  setTimeout(()=>{ goTo('choice'); initGalaxy3D(); }, TRAVEL_DURATION + 260);
}

function runTravelText(){
  const el = document.getElementById('travelText');
  const msgs = [
    { t:0,    txt:'Departing into deep space...' },
    { t:2000, txt:'Crossing the void between stars...' },
    { t:4200, txt:'Galaxy detected — arriving soon...' },
  ];
  msgs.forEach(({t, txt})=>{
    setTimeout(()=>{
      el.classList.remove('show');
      setTimeout(()=>{ el.textContent = txt; el.classList.add('show'); }, 280);
    }, t);
  });
}

function triggerFlash(){
  const f = document.getElementById('warpFlash');
  f.classList.remove('flash'); void f.offsetWidth; f.classList.add('flash');
}

function runWarpCanvas(){
  const cvs = document.getElementById('warpCanvas');
  const ctx = cvs.getContext('2d');
  const dpr = Math.min(devicePixelRatio||1, 2);
  const W = window.innerWidth, H = window.innerHeight;
  cvs.width=W*dpr; cvs.height=H*dpr;
  cvs.style.width=W+'px'; cvs.style.height=H+'px';
  ctx.setTransform(dpr,0,0,dpr,0,0);

  const cx=W/2, cy=H/2;
  const DEPTH=Math.max(W,H)*1.25, FOCAL=240;

  /* Star colour palette — weighted toward white */
  const COLS=[
    '252,252,255','255,255,255','248,248,252','255,255,255','252,252,255',
    '255,255,255','248,248,255','255,255,255',   // white (8 entries)
    '255,185,225','255,165,215','240,180,255',   // pink / lavender
    '200,170,255','215,185,255',                 // purple
    '255,225,135','255,215,105',                 // gold
    '175,238,255','160,228,252',                 // cyan-blue
  ];
  const pickCol=()=>COLS[Math.floor(Math.random()*COLS.length)];

  function makeStar(spread){
    return {
      x: rand(-W*1.35, W*1.35),
      y: rand(-H*1.35, H*1.35),
      z: spread ? rand(DEPTH*0.01, DEPTH) : DEPTH,
      px:null, py:null,
      col: pickCol(),
      w: 0.35+Math.random()*1.0
    };
  }

  const N = Math.max(160, Math.min(300, Math.floor(W*0.38)));
  const stars = Array.from({length:N}, ()=>makeStar(true));

  /* Solid initial fill */
  ctx.fillStyle='#03000d'; ctx.fillRect(0,0,W,H);

  let t0=null, tLast=null, spiralA=0;

  /* Speed curve: quick ramp → cruise → graceful decel */
  function getSpeed(p){
    if(p<0.14) return 55 + 1680*(p/0.14)*(p/0.14);
    if(p<0.58) return 1680 + Math.sin(p*12)*28; // subtle shimmer at cruise
    const d=(p-0.58)/0.42;
    return 1680*Math.pow(1-d, 1.9)+22;
  }

  /* Background deep-space colour — shifts from black → indigo → purple-magenta near galaxy */
  function bgRGB(p){
    const r = Math.round(3  + (p>0.48 ? (p-0.48)/0.52*22  : 0));
    const g = Math.round(0  + (p>0.6  ? (p-0.6)/0.4*4    : 0));
    const b = Math.round(13 + (p>0.25 ? (p-0.25)/0.75*48 : 0));
    return `${r},${g},${b}`;
  }

  /* Destination galaxy bloom — a real spiral galaxy grows ahead */
  function drawGalaxy(p){
    if(p<0.46) return;
    const prog = Math.pow((p-0.46)/0.54, 1.15);
    const maxR = Math.min(W,H)*0.58;
    const size = prog*maxR;
    const bA   = prog*0.92;

    ctx.save();
    ctx.translate(cx, cy);

    /* 1. Outer diffuse halo (round, no tilt) */
    const halo=ctx.createRadialGradient(0,0,size*0.5,0,0,size*1.4);
    halo.addColorStop(0,`rgba(130,65,210,${(bA*0.16).toFixed(3)})`);
    halo.addColorStop(0.6,`rgba(80,30,160,${(bA*0.07).toFixed(3)})`);
    halo.addColorStop(1,'rgba(0,0,0,0)');
    ctx.fillStyle=halo;
    ctx.beginPath(); ctx.arc(0,0,size*1.4,0,Math.PI*2); ctx.fill();

    /* 2. Tilted galactic disc */
    ctx.save();
    ctx.rotate(-0.42);
    ctx.scale(1.0, 0.38);

    const disc=ctx.createRadialGradient(0,0,0,0,0,size*1.05);
    disc.addColorStop(0,    `rgba(255,225,255,${Math.min(1,bA*1.08).toFixed(3)})`);
    disc.addColorStop(0.10, `rgba(240,155,255,${(bA*0.88).toFixed(3)})`);
    disc.addColorStop(0.28, `rgba(175,95,255, ${(bA*0.58).toFixed(3)})`);
    disc.addColorStop(0.55, `rgba(90, 35,195, ${(bA*0.24).toFixed(3)})`);
    disc.addColorStop(1,    'rgba(0,0,0,0)');
    ctx.fillStyle=disc;
    ctx.beginPath(); ctx.ellipse(0,0,size*1.05,size*1.05,0,0,Math.PI*2); ctx.fill();

    ctx.restore(); // remove disc tilt

    /* 3. Spiral arms (particle dots) */
    if(prog>0.28){
      const armA=(prog-0.28)/0.72;
      spiralA+=0.006;
      for(let arm=0;arm<2;arm++){
        const aOff=arm*Math.PI;
        for(let i=1;i<62;i++){
          const fr=i/62;
          const r2=fr*size*0.84;
          const ang=aOff+spiralA+fr*3.9;
          const ax=Math.cos(ang)*r2;
          const ay=Math.sin(ang)*r2*0.36;
          const pa=armA*(1-fr*fr)*0.72;
          if(pa<0.015) continue;
          const pr=Math.max(0.4,(1-fr)*3.8*prog);
          ctx.beginPath();
          ctx.arc(ax,ay,pr,0,Math.PI*2);
          ctx.fillStyle=`rgba(218,172,255,${pa.toFixed(3)})`;
          ctx.fill();
        }
      }
    }

    /* 4. Bright nucleus */
    const nSize=size*0.13;
    const nuc=ctx.createRadialGradient(0,0,0,0,0,nSize);
    nuc.addColorStop(0,`rgba(255,255,255,${Math.min(1,bA*1.1).toFixed(3)})`);
    nuc.addColorStop(0.35,`rgba(255,230,255,${(bA*0.85).toFixed(3)})`);
    nuc.addColorStop(0.7,`rgba(195,135,255,${(bA*0.4).toFixed(3)})`);
    nuc.addColorStop(1,'rgba(0,0,0,0)');
    ctx.fillStyle=nuc;
    ctx.beginPath(); ctx.arc(0,0,nSize,0,Math.PI*2); ctx.fill();

    /* 5. Lens flare cross (only near arrival) */
    if(prog>0.7){
      const flA=(prog-0.7)/0.3*0.35;
      const fl=nSize*3.5;
      ctx.strokeStyle=`rgba(255,240,255,${flA.toFixed(3)})`;
      ctx.lineWidth=1.2;
      ctx.beginPath(); ctx.moveTo(-fl,0); ctx.lineTo(fl,0); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(0,-fl); ctx.lineTo(0,fl); ctx.stroke();
    }

    ctx.restore();
  }

  function frame(ts){
    if(!t0){ t0=ts; tLast=ts; }
    const dt=Math.min((ts-tLast)/1000, 0.05);
    tLast=ts;
    const elapsed=ts-t0;
    const p=Math.min(elapsed/TRAVEL_DURATION,1);
    const spd=getSpeed(p);

    /* Trail fade — shorter at slow speed, long at warp */
    const trailA=Math.max(0.09, Math.min(0.36, 1.0-spd/1720));
    ctx.fillStyle=`rgba(${bgRGB(p)},${trailA})`;
    ctx.fillRect(0,0,W,H);

    /* Stars */
    for(const s of stars){
      s.z-=spd*dt;
      if(s.z<=1){ Object.assign(s,makeStar(false)); continue; }
      const k=FOCAL/s.z;
      const sx=cx+s.x*k, sy=cy+s.y*k;
      if(sx<-90||sx>W+90||sy<-90||sy>H+90){ Object.assign(s,makeStar(false)); continue; }
      const cl=1-s.z/DEPTH;
      const rad=s.w*Math.max(0.22, cl*2.9);
      const al=Math.max(0.07, Math.min(1, cl*1.45+0.05));

      /* Streak trail */
      if(s.px!==null){
        const sf=Math.min(1,spd/650);
        const tx=sx+(s.px-sx)*(1-sf*0.72);
        const ty=sy+(s.py-sy)*(1-sf*0.72);
        ctx.strokeStyle=`rgba(${s.col},${al*0.88})`;
        ctx.lineWidth=rad*0.82; ctx.lineCap='round';
        ctx.beginPath(); ctx.moveTo(tx,ty); ctx.lineTo(sx,sy); ctx.stroke();
      }

      /* Star head with glow */
      if(cl>0.5){ ctx.shadowBlur=rad*5; ctx.shadowColor=`rgba(${s.col},${al*0.55})`; }
      ctx.fillStyle=`rgba(${s.col},${al})`;
      ctx.beginPath(); ctx.arc(sx,sy,rad*0.48,0,Math.PI*2); ctx.fill();
      ctx.shadowBlur=0;

      s.px=sx; s.py=sy;
    }

    drawGalaxy(p);

    if(elapsed<TRAVEL_DURATION){ warpRafId=requestAnimationFrame(frame); }
    else{ cancelAnimationFrame(warpRafId); }
  }

  if(warpRafId) cancelAnimationFrame(warpRafId);
  warpRafId=requestAnimationFrame(frame);
}



/* ================================================================
   3-D GALAXY CHOICE — Three.js
   ================================================================ */
const GDEFS = [
  { id:'1', name:'Memories Galaxy 🌙', desc:'where our moments live',
    pos:[-16, 3,-10], c1:0xd4baff, c2:0x8a5cff, c3:0x2a0f6e, arms:3, tilt:.18 },
  { id:'2', name:'Love Galaxy 💗',     desc:'straight from the heart',
    pos:[ 16, 3,-10], c1:0xffb8dc, c2:0xff2d8a, c3:0x7a0038, arms:4, tilt:-.12 },
  { id:'3', name:'Dream Galaxy ✨',    desc:'wishes written in stars',
    pos:[-12,-5, 18], c1:0xfff3a0, c2:0xffb238, c3:0x5a3000, arms:2, tilt:.22 },
  { id:'4', name:'Future Galaxy 🌎',  desc:'everything still to come',
    pos:[ 12, 7, 18], c1:0xaff0ff, c2:0x2fb6e0, c3:0x003a50, arms:3, tilt:-.08 },
];

const G3D = {
  renderer:null, scene:null, camera:null, rafId:null,
  orbit:{ theta:0, phi:Math.PI/3.2, r:55 },
  autoRotate:true, isDragging:false, isFlying:false,
  galaxyGroups:[], hitSpheres:[], labelEls:[],
  prevX:0, prevY:0, totalDrag:0
};

function initGalaxy3D(){
  /* Rebuild label DOM every visit (they get wiped on screen change) */
  const cont = document.getElementById('galaxyLabels');
  cont.innerHTML = '';
  G3D.labelEls = GDEFS.map(d => {
    const el = document.createElement('div');
    el.className = 'galaxy-label';
    el.innerHTML = `<span class="lname">${d.name}</span><span class="ldesc">${d.desc}</span>`;
    el.addEventListener('click', () => selectGalaxy3D(d.id));
    cont.appendChild(el);
    return el;
  });
  G3D.isFlying = false;
  G3D.autoRotate = true;

  /* If renderer already built, just restart loop */
  if(G3D.renderer){
    if(G3D.rafId) cancelAnimationFrame(G3D.rafId);
    G3D.rafId = requestAnimationFrame(g3dLoop);
    return;
  }

  /* ── Renderer ── */
  const cvs = document.getElementById('galaxyCanvas');
  const W = window.innerWidth, H = window.innerHeight;
  const renderer = new THREE.WebGLRenderer({ canvas:cvs, antialias:true, alpha:false });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.setSize(W, H);
  renderer.setClearColor(0x020008, 1);
  G3D.renderer = renderer;

  /* ── Scene & Camera ── */
  const scene = new THREE.Scene();
  G3D.scene = scene;
  const camera = new THREE.PerspectiveCamera(58, W/H, 0.1, 700);
  G3D.camera = camera;
  g3dSetCamera();

  /* ── Background stars ── */
  const bN = 6000;
  const bP = new Float32Array(bN*3), bC = new Float32Array(bN*3);
  for(let i=0; i<bN; i++){
    bP[i*3]   = (Math.random()-.5)*500;
    bP[i*3+1] = (Math.random()-.5)*500;
    bP[i*3+2] = (Math.random()-.5)*500;
    const v = .45+Math.random()*.55;
    bC[i*3]=v*.88; bC[i*3+1]=v*.85; bC[i*3+2]=v;
  }
  const bGeo = new THREE.BufferGeometry();
  bGeo.setAttribute('position', new THREE.BufferAttribute(bP,3));
  bGeo.setAttribute('color',    new THREE.BufferAttribute(bC,3));
  scene.add(new THREE.Points(bGeo, new THREE.PointsMaterial({
    size:.35, sizeAttenuation:true, vertexColors:true,
    transparent:true, opacity:.7, depthWrite:false
  })));

  /* ── Nebula dust wisps ── */
  const wisp_colors=[0x5b1a63,0x1a0b50,0x3d0030,0x002040];
  wisp_colors.forEach((wc,wi)=>{
    const wN=300, wP=new Float32Array(wN*3);
    for(let i=0;i<wN;i++){
      const a=Math.random()*Math.PI*2, r2=30+Math.random()*80;
      wP[i*3]  = Math.cos(a)*r2+(wi%2===0?-20:20);
      wP[i*3+1]= (Math.random()-.5)*50;
      wP[i*3+2]= Math.sin(a)*r2+(wi<2?-15:15);
    }
    const wGeo=new THREE.BufferGeometry();
    wGeo.setAttribute('position',new THREE.BufferAttribute(wP,3));
    scene.add(new THREE.Points(wGeo,new THREE.PointsMaterial({
      color:wc, size:2.8, sizeAttenuation:true,
      transparent:true, opacity:.12, depthWrite:false
    })));
  });

  /* ── Spiral galaxy particle systems ── */
  G3D.galaxyGroups = [];
  G3D.hitSpheres   = [];
  const mobile = W < 600;
  const N  = mobile ? 4000 : 7500;   // arm particles
  const CN = mobile ?  450 :  900;   // core particles

  GDEFS.forEach(d => {
    const grp = new THREE.Group();
    grp.position.set(...d.pos);
    grp.rotation.x = d.tilt;
    grp.userData = { id:d.id };

    const C1=new THREE.Color(d.c1), C2=new THREE.Color(d.c2), C3=new THREE.Color(d.c3);
    const WHITE=new THREE.Color(1,1,1);

    /* Disc + arms */
    const pos=new Float32Array(N*3), col=new Float32Array(N*3);
    for(let i=0; i<N; i++){
      const i3=i*3;
      const r=Math.pow(Math.random(),.52)*11.5;

      if(r < 1.7){
        /* Central spherical bulge */
        const a=Math.random()*Math.PI*2;
        const e=Math.acos(2*Math.random()-1);
        pos[i3]  = Math.sin(e)*Math.cos(a)*r;
        pos[i3+1]= Math.cos(e)*r*.38;
        pos[i3+2]= Math.sin(e)*Math.sin(a)*r;
        const mc=C1.clone().lerp(WHITE,.55);
        col[i3]=mc.r; col[i3+1]=mc.g; col[i3+2]=mc.b;
      } else {
        /* Logarithmic spiral arms */
        const arm=Math.floor(Math.random()*d.arms);
        const angle=(arm/d.arms)*Math.PI*2 + r*0.78;
        const sc=(r/11.5)*2.9;
        /* Box-Muller-ish scatter for realistic arm width */
        const u1=Math.random()||1e-9, u2=Math.random();
        const gn=Math.sqrt(-2*Math.log(u1))*Math.cos(2*Math.PI*u2);
        pos[i3]  = Math.cos(angle)*r + gn*sc*.5;
        pos[i3+1]= (Math.random()-.5)*.22;
        pos[i3+2]= Math.sin(angle)*r + gn*sc*.5;
        const t=r/11.5;
        const mc=t<.5?C1.clone().lerp(C2,t*2):C2.clone().lerp(C3,(t-.5)*2);
        const br=1-t*.52;
        col[i3]=mc.r*br; col[i3+1]=mc.g*br; col[i3+2]=mc.b*br;
      }
    }
    const dGeo=new THREE.BufferGeometry();
    dGeo.setAttribute('position',new THREE.BufferAttribute(pos,3));
    dGeo.setAttribute('color',   new THREE.BufferAttribute(col,3));
    grp.add(new THREE.Points(dGeo, new THREE.PointsMaterial({
      size:.11, sizeAttenuation:true, vertexColors:true,
      transparent:true, opacity:.95, depthWrite:false,
      blending:THREE.AdditiveBlending
    })));

    /* Bright glowing core */
    const cp=new Float32Array(CN*3), cc=new Float32Array(CN*3);
    for(let i=0; i<CN; i++){
      const a=Math.random()*Math.PI*2;
      const rv=Math.pow(Math.random(),1.6)*2.2;
      cp[i*3]  = Math.cos(a)*rv;
      cp[i*3+1]= (Math.random()-.5)*.14;
      cp[i*3+2]= Math.sin(a)*rv;
      const br=1-(rv/2.2)*.38;
      const mc=C1.clone().lerp(WHITE,.6);
      cc[i*3]=mc.r*br; cc[i*3+1]=mc.g*br; cc[i*3+2]=mc.b*br;
    }
    const cGeo=new THREE.BufferGeometry();
    cGeo.setAttribute('position',new THREE.BufferAttribute(cp,3));
    cGeo.setAttribute('color',   new THREE.BufferAttribute(cc,3));
    grp.add(new THREE.Points(cGeo, new THREE.PointsMaterial({
      size:.32, sizeAttenuation:true, vertexColors:true,
      transparent:true, opacity:1, depthWrite:false,
      blending:THREE.AdditiveBlending
    })));

    /* Outer halo scatter */
    const hN=Math.floor(N*.12), hP=new Float32Array(hN*3), hC=new Float32Array(hN*3);
    for(let i=0;i<hN;i++){
      const a=Math.random()*Math.PI*2, r2=9+Math.random()*4;
      const e=Math.acos(2*Math.random()-1);
      hP[i*3]=Math.sin(e)*Math.cos(a)*r2*.6;
      hP[i*3+1]=Math.cos(e)*r2*.12;
      hP[i*3+2]=Math.sin(e)*Math.sin(a)*r2*.6;
      hC[i*3]=C3.r*.6; hC[i*3+1]=C3.g*.6; hC[i*3+2]=C3.b*.6;
    }
    const hGeo=new THREE.BufferGeometry();
    hGeo.setAttribute('position',new THREE.BufferAttribute(hP,3));
    hGeo.setAttribute('color',   new THREE.BufferAttribute(hC,3));
    grp.add(new THREE.Points(hGeo, new THREE.PointsMaterial({
      size:.08, sizeAttenuation:true, vertexColors:true,
      transparent:true, opacity:.5, depthWrite:false,
      blending:THREE.AdditiveBlending
    })))
