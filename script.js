
/* ============================= LOADER ============================= */
window.addEventListener('load', ()=>{
  setTimeout(()=>document.getElementById('loader').classList.add('hide'), 600);
});

/* ============================= NAV TOGGLE ============================= */
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');
navToggle.addEventListener('click', ()=> navLinks.classList.toggle('open'));
document.querySelectorAll('.nav-link').forEach(l=>l.addEventListener('click', ()=>navLinks.classList.remove('open')));

/* ============================= TYPING ANIMATION ============================= */
const roles = ["ServiceNow Certified System Administrator","IoT & Embedded Systems Enthusiast","Full Stack Learner"];
const typingEl = document.getElementById('typingText');
let rIdx=0, cIdx=0, deleting=false;
function typeLoop(){
  const word = roles[rIdx];
  if(!deleting){
    cIdx++;
    typingEl.innerHTML = word.slice(0,cIdx)+'<span class="cursor">&nbsp;</span>';
    if(cIdx===word.length){deleting=true; setTimeout(typeLoop,1400); return;}
  } else {
    cIdx--;
    typingEl.innerHTML = word.slice(0,cIdx)+'<span class="cursor">&nbsp;</span>';
    if(cIdx===0){deleting=false; rIdx=(rIdx+1)%roles.length;}
  }
  setTimeout(typeLoop, deleting?35:65);
}
typeLoop();

/* ============================= PARTICLE + CIRCUIT BG ============================= */
const canvas = document.getElementById('particle-canvas');
const ctx = canvas.getContext('2d');
let W,H;
function resize(){W=canvas.width=canvas.offsetWidth;H=canvas.height=canvas.offsetHeight;}
window.addEventListener('resize',resize);
resize();
let particles = Array.from({length:60},()=>({
  x:Math.random()*W, y:Math.random()*H, r:Math.random()*1.6+0.4,
  vx:(Math.random()-0.5)*0.25, vy:(Math.random()-0.5)*0.25
}));
let mouse={x:W/2,y:H/2};
document.getElementById('home').addEventListener('mousemove', e=>{
  const rect = canvas.getBoundingClientRect();
  mouse.x = e.clientX-rect.left; mouse.y = e.clientY-rect.top;
});
function drawBG(){
  ctx.clearRect(0,0,W,H);
  ctx.strokeStyle='rgba(139,92,246,0.07)';
  ctx.lineWidth=1;
  const cell=90;
  for(let x=0;x<W;x+=cell){
    ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,H);ctx.stroke();
  }
  for(let y=0;y<H;y+=cell){
    ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(W,y);ctx.stroke();
  }
  particles.forEach(p=>{
    p.x+=p.vx+ (mouse.x-p.x)*0.0006;
    p.y+=p.vy+ (mouse.y-p.y)*0.0006;
    if(p.x<0)p.x=W; if(p.x>W)p.x=0;
    if(p.y<0)p.y=H; if(p.y>H)p.y=0;
    ctx.beginPath();
    ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
    ctx.fillStyle='rgba(34,211,238,0.55)';
    ctx.fill();
  });
  for(let i=0;i<particles.length;i++){
    for(let j=i+1;j<particles.length;j++){
      const dx=particles[i].x-particles[j].x, dy=particles[i].y-particles[j].y;
      const dist=Math.sqrt(dx*dx+dy*dy);
      if(dist<110){
        ctx.beginPath();
        ctx.strokeStyle=`rgba(139,92,246,${0.12*(1-dist/110)})`;
        ctx.moveTo(particles[i].x,particles[i].y);
        ctx.lineTo(particles[j].x,particles[j].y);
        ctx.stroke();
      }
    }
  }
  requestAnimationFrame(drawBG);
}
drawBG();

/* ============================= SCROLL REVEAL ============================= */
const revealEls = document.querySelectorAll('.reveal');
const io = new IntersectionObserver((entries)=>{
  entries.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target);} });
},{threshold:0.15});
revealEls.forEach(el=>io.observe(el));

/* ============================= COUNTER ============================= */
const counters = document.querySelectorAll('.num[data-count]');
const cio = new IntersectionObserver((entries)=>{
  entries.forEach(e=>{
    if(e.isIntersecting){
      const target = +e.target.dataset.count;
      let cur=0;
      const step = Math.max(1, target/30);
      const t = setInterval(()=>{
        cur += step;
        if(cur>=target){cur=target; clearInterval(t);}
        e.target.textContent = Math.floor(cur);
      },40);
      cio.unobserve(e.target);
    }
  });
},{threshold:0.4});
counters.forEach(c=>cio.observe(c));

/* ============================= NAV ACTIVE + SPINE ============================= */
const sections = document.querySelectorAll('section[id]');
const navA = document.querySelectorAll('.nav-link');
const spineFill = document.getElementById('spine-fill');
const spineTrack = document.getElementById('spine');

// build spine nodes
sections.forEach(sec=>{
  const node = document.createElement('div');
  node.className='spine-node';
  node.dataset.id = sec.id;
  const label = document.createElement('span');
  label.className='node-label';
  label.textContent = sec.id.toUpperCase();
  node.appendChild(label);
  spineTrack.appendChild(node);
});
function layoutSpineNodes(){
  const total = document.body.scrollHeight - window.innerHeight;
  document.querySelectorAll('.spine-node').forEach(node=>{
    const sec = document.getElementById(node.dataset.id);
    const pos = sec.offsetTop / document.body.scrollHeight * 100;
    node.style.top = pos+'%';
  });
}
window.addEventListener('load', layoutSpineNodes);
window.addEventListener('resize', layoutSpineNodes);

function onScroll(){
  const scrollY = window.scrollY;
  const docH = document.body.scrollHeight - window.innerHeight;
  spineFill.style.height = Math.min(100,(scrollY/docH)*100)+'%';

  let current = sections[0].id;
  sections.forEach(sec=>{
    if(scrollY + window.innerHeight*0.4 >= sec.offsetTop) current = sec.id;
  });
  navA.forEach(a=>a.classList.toggle('active', a.getAttribute('href')==='#'+current));
  document.querySelectorAll('.spine-node').forEach(n=>n.classList.toggle('active', n.dataset.id===current));
}
window.addEventListener('scroll', onScroll);
window.addEventListener('load', onScroll);

/* ============================= ICON LIBRARY (inline SVG, no external logo deps) ============================= */
const icon = (path) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">${path}</svg>`;
const icons = {
  code: icon('<path d="M16 18l6-6-6-6M8 6l-6 6 6 6"/>'),
  globe: icon('<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18 14 14 0 0 1 0-18z"/>'),
  chip: icon('<rect x="7" y="7" width="10" height="10" rx="1"/><path d="M9 2v3M15 2v3M9 19v3M15 19v3M2 9h3M2 15h3M19 9h3M19 15h3"/>'),
  wifi: icon('<path d="M2 8.5a16 16 0 0 1 20 0M5 12a11 11 0 0 1 14 0M8.5 15.5a6 6 0 0 1 7 0"/><circle cx="12" cy="19" r="1"/>'),
  flow: icon('<circle cx="6" cy="6" r="2"/><circle cx="6" cy="18" r="2"/><circle cx="18" cy="12" r="2"/><path d="M8 6h4a4 4 0 0 1 4 4M8 18h4a4 4 0 0 0 4-4"/>'),
  db: icon('<ellipse cx="12" cy="5" rx="8" ry="3"/><path d="M4 5v14c0 1.7 3.6 3 8 3s8-1.3 8-3V5"/><path d="M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3"/>'),
  tool: icon('<path d="M14.7 6.3a4 4 0 1 1-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 1 1 5.4-5.4"/>'),
  play: icon('<polygon points="6 4 20 12 6 20 6 4" fill="currentColor" stroke="none"/>'),
  expand: icon('<path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/>'),
  verified: icon('<path d="M12 2l2.4 1.4 2.7-.4 1.3 2.4 2.4 1.4-.4 2.7 1.4 2.5-1.4 2.4.4 2.7-2.4 1.3-1.3 2.4-2.7-.4L12 22l-2.4-1.4-2.7.4-1.3-2.4-2.4-1.3.4-2.7L2.2 12l1.4-2.4-.4-2.7 2.4-1.4 1.3-2.4 2.7.4z"/><path d="M8.5 12.5l2.2 2.2 4.3-4.8" stroke-linecap="round" stroke-linejoin="round"/>'),
  scoreDoc: icon('<path d="M7 2h7l5 5v13a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z"/><path d="M14 2v5h5"/><path d="M9 13h6M9 17h6M9 9h2"/>')
};

/* ============================= PROJECT ILLUSTRATIONS (custom line-art, matches site's schematic style) ============================= */
const illustrations = {
  crop: `<svg class="pcard-illustration" viewBox="0 0 400 240" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M200 40c55 18 92 62 78 108-12 40-58 46-82 20-30-34-42-90-14-118-1 0 12-14 18-10Z" stroke="var(--cyan)" stroke-width="2"/>
    <path d="M198 46c4 46 12 92 48 128" stroke="var(--cyan)" stroke-width="1.3" opacity="0.55"/>
    <path d="M150 76l-14-16h20M250 66l16-14v20M148 168l-16 14v-20M256 176l14 16h-20" stroke="var(--violet)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    <circle cx="212" cy="120" r="6" fill="var(--violet)" opacity="0.85"/>
    <circle cx="228" cy="145" r="3.5" fill="var(--violet)" opacity="0.6"/>
    <circle cx="196" cy="150" r="3" fill="var(--violet)" opacity="0.5"/>
    <g stroke="var(--blue)" stroke-width="1.2" opacity="0.75">
      <circle cx="72" cy="70" r="4" fill="var(--blue)"/>
      <circle cx="66" cy="108" r="4" fill="var(--blue)"/>
      <circle cx="102" cy="92" r="4" fill="var(--blue)"/>
      <line x1="72" y1="70" x2="102" y2="92"/><line x1="66" y1="108" x2="102" y2="92"/>
    </g>
    <g stroke="var(--blue)" stroke-width="1.2" opacity="0.6">
      <circle cx="320" cy="150" r="4" fill="var(--blue)"/>
      <circle cx="332" cy="182" r="4" fill="var(--blue)"/>
      <circle cx="300" cy="176" r="4" fill="var(--blue)"/>
      <line x1="320" y1="150" x2="332" y2="182"/><line x1="320" y1="150" x2="300" y2="176"/>
    </g>
  </svg>`,

  water: `<svg class="pcard-illustration" viewBox="0 0 400 240" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M50 130h60l20-30 20 60 20-45 20 30h160" stroke="var(--blue)" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
    <circle cx="130" cy="100" r="7" fill="none" stroke="var(--cyan)" stroke-width="2"/>
    <circle cx="130" cy="100" r="13" fill="none" stroke="var(--cyan)" stroke-width="1" opacity="0.4"/>
    <circle cx="230" cy="145" r="7" fill="none" stroke="var(--cyan)" stroke-width="2"/>
    <circle cx="230" cy="145" r="13" fill="none" stroke="var(--cyan)" stroke-width="1" opacity="0.4"/>
    <path d="M290 60c0 18-24 30-24 50 0 13.3 10.7 24 24 24s24-10.7 24-24c0-20-24-32-24-50Z" stroke="var(--violet)" stroke-width="2"/>
    <path d="M60 180h280" stroke="rgba(255,255,255,0.15)" stroke-width="1" stroke-dasharray="4 5"/>
    <text x="60" y="200" font-family="monospace" font-size="10" fill="var(--muted-2)">FLOW · LEAK · ALERT</text>
  </svg>`,

  survey: `<svg class="pcard-illustration" viewBox="0 0 400 240" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="110" y="40" width="140" height="170" rx="10" stroke="var(--cyan)" stroke-width="2"/>
    <rect x="140" y="30" width="80" height="18" rx="5" fill="#0b0e1a" stroke="var(--cyan)" stroke-width="2"/>
    <rect x="128" y="72" width="14" height="14" rx="3" stroke="var(--violet)" stroke-width="2"/>
    <path d="M131 79l3 3 6-7" stroke="var(--violet)" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
    <line x1="152" y1="79" x2="230" y2="79" stroke="rgba(255,255,255,0.35)" stroke-width="2"/>
    <rect x="128" y="102" width="14" height="14" rx="3" stroke="var(--violet)" stroke-width="2"/>
    <line x1="152" y1="109" x2="230" y2="109" stroke="rgba(255,255,255,0.35)" stroke-width="2"/>
    <rect x="128" y="132" width="14" height="14" rx="3" stroke="var(--violet)" stroke-width="2"/>
    <path d="M131 139l3 3 6-7" stroke="var(--violet)" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
    <line x1="152" y1="139" x2="230" y2="139" stroke="rgba(255,255,255,0.35)" stroke-width="2"/>
    <g transform="translate(260,110)">
      <rect x="0" y="30" width="14" height="40" fill="var(--blue)" opacity="0.8"/>
      <rect x="20" y="10" width="14" height="60" fill="var(--violet)" opacity="0.8"/>
      <rect x="40" y="45" width="14" height="25" fill="var(--cyan)" opacity="0.8"/>
    </g>
  </svg>`,

  quiz: `<svg class="pcard-illustration" viewBox="0 0 400 240" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="90" y="35" width="170" height="175" rx="12" stroke="var(--violet)" stroke-width="2"/>
    <line x1="112" y1="66" x2="238" y2="66" stroke="rgba(255,255,255,0.4)" stroke-width="2.5"/>
    <circle cx="118" cy="96" r="8" stroke="var(--cyan)" stroke-width="2"/>
    <circle cx="118" cy="96" r="3.5" fill="var(--cyan)"/>
    <line x1="136" y1="96" x2="232" y2="96" stroke="rgba(255,255,255,0.3)" stroke-width="2"/>
    <circle cx="118" cy="126" r="8" stroke="rgba(255,255,255,0.35)" stroke-width="2"/>
    <line x1="136" y1="126" x2="232" y2="126" stroke="rgba(255,255,255,0.3)" stroke-width="2"/>
    <circle cx="118" cy="156" r="8" stroke="rgba(255,255,255,0.35)" stroke-width="2"/>
    <line x1="136" y1="156" x2="232" y2="156" stroke="rgba(255,255,255,0.3)" stroke-width="2"/>
    <rect x="112" y="180" width="126" height="10" rx="5" fill="rgba(255,255,255,0.08)"/>
    <rect x="112" y="180" width="78" height="10" rx="5" fill="var(--grad-main-fallback)" fill-opacity="0"/>
    <rect x="112" y="180" width="78" height="10" rx="5" fill="var(--cyan)" opacity="0.85"/>
    <g transform="translate(290,60)">
      <circle r="26" cx="0" cy="0" stroke="var(--blue)" stroke-width="3" opacity="0.85"/>
      <path d="M0 -26 A26 26 0 0 1 22 -13" stroke="var(--cyan)" stroke-width="3" fill="none"/>
      <text x="0" y="6" font-family="monospace" font-size="13" fill="var(--text)" text-anchor="middle">72%</text>
    </g>
  </svg>`,

  perfume: `<svg class="pcard-illustration" viewBox="0 0 400 240" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="172" y="60" width="20" height="16" rx="3" fill="none" stroke="var(--cyan)" stroke-width="2"/>
    <path d="M168 76h28l6 14h-40l6-14Z" stroke="var(--cyan)" stroke-width="2" stroke-linejoin="round"/>
    <path d="M158 90h44c6 0 8 4 8 9v78c0 8-6 14-14 14h-32c-8 0-14-6-14-14V99c0-5 2-9 8-9Z" stroke="var(--violet)" stroke-width="2"/>
    <line x1="150" y1="130" x2="208" y2="130" stroke="rgba(255,255,255,0.25)" stroke-width="1.5"/>
    <line x1="150" y1="150" x2="208" y2="150" stroke="rgba(255,255,255,0.25)" stroke-width="1.5"/>
    <g stroke="var(--cyan)" stroke-width="1.4" opacity="0.85">
      <path d="M270 60l4 10 10 4-10 4-4 10-4-10-10-4 10-4Z"/>
    </g>
    <g stroke="var(--blue)" stroke-width="1.2" opacity="0.6">
      <path d="M110 170l3 7 7 3-7 3-3 7-3-7-7-3 7-3Z"/>
    </g>
    <rect x="120" y="196" width="160" height="1" fill="rgba(255,255,255,0.15)"/>
  </svg>`,

  irrigation: `<svg class="pcard-illustration" viewBox="0 0 400 240" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M170 40c8 24-22 34-22 62 0 17.7 14.3 32 32 32s32-14.3 32-32c0-28-34-38-26-62 0 0-8-10-16 0Z" stroke="var(--cyan)" stroke-width="2"/>
    <path d="M90 190c10-30 34-46 90-46s80 16 90 46" stroke="var(--blue)" stroke-width="2" stroke-linecap="round"/>
    <path d="M150 190v-20M180 190v-30M210 190v-20M240 190v-30" stroke="var(--violet)" stroke-width="2" stroke-linecap="round" opacity="0.8"/>
    <circle cx="150" cy="165" r="3" fill="var(--violet)"/><circle cx="180" cy="155" r="3" fill="var(--violet)"/>
    <circle cx="210" cy="165" r="3" fill="var(--violet)"/><circle cx="240" cy="155" r="3" fill="var(--violet)"/>
    <path d="M300 70q14 10 0 20" stroke="var(--cyan)" stroke-width="1.5" opacity="0.6"/>
  </svg>`,

  fans: `<svg class="pcard-illustration" viewBox="0 0 400 240" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g transform="translate(160,120)">
      <circle r="7" fill="var(--cyan)"/>
      <path d="M0 0C10 -30 40 -30 44 -6C20 -8 8 6 0 0Z" fill="none" stroke="var(--blue)" stroke-width="2"/>
      <path d="M0 0C-30 -8 -34 -38 -8 -42C-6 -18 8 -6 0 0Z" fill="none" stroke="var(--blue)" stroke-width="2"/>
      <path d="M0 0C-10 30 -40 30 -44 6C-20 8 -8 -6 0 0Z" fill="none" stroke="var(--blue)" stroke-width="2"/>
      <path d="M0 0C30 8 34 38 8 42C6 18 -8 6 0 0Z" fill="none" stroke="var(--blue)" stroke-width="2"/>
    </g>
    <rect x="290" y="60" width="16" height="90" rx="8" stroke="var(--violet)" stroke-width="2"/>
    <circle cx="298" cy="162" r="14" stroke="var(--violet)" stroke-width="2"/>
    <rect x="294" y="90" width="8" height="50" fill="var(--cyan)" opacity="0.8"/>
    <text x="330" y="120" font-family="monospace" font-size="10" fill="var(--muted-2)">AUTO</text>
  </svg>`,
};

/* ============================= SKILLS DATA ============================= */
const skillsData = [
  {cat:'Programming', items:[['Java','code'],['Python','code'],['Embedded C','chip']]},
  {cat:'Web Development', items:[['HTML','globe'],['CSS','globe'],['PHP','code']]},
  {cat:'Embedded Systems', items:[['Arduino','chip'],['PIC18F452','chip'],['MPLAB X / XC8','tool']]},
  {cat:'IoT', items:[['ESP8266','wifi'],['OLED Display','chip'],['Sensor Interfacing','wifi']]},
  {cat:'ServiceNow', items:[['ServiceNow CSA','flow'],['ServiceNow CAD','flow']]},
  {cat:'Database & Tools', items:[['MySQL','db'],['GitHub','tool'],['VS Code','tool'],['Eclipse','tool'],['XAMPP','tool']]},
];
const skillsGrid = document.getElementById('skillsGrid');
skillsData.forEach(group=>{
  const card = document.createElement('div');
  card.className='skill-card glass';
  card.innerHTML = `<div class="skill-cat">${group.cat}</div>
    <div class="skill-items">${group.items.map(([name,ic])=>`<div class="skill-chip">${icons[ic]}<span>${name}</span></div>`).join('')}</div>`;
  skillsGrid.appendChild(card);
});

/* ============================= PROJECTS DATA ============================= */
const projectsData = [
  {name:'Smart Water Pipeline Monitoring System', year:'2026', desc:'IoT-based system for monitoring water flow and leakage detection, with sensors integrated to Arduino for real-time alerts. Won 1st place at Product Expo, LUNARA\'26.', tags:['Arduino','IoT','Sensors','Embedded Systems'], glyph:'01', github:'https://github.com/Deepika22-d/smart-water-pipeline-monitoring-system', live:null, video:null, photo:'assets/images/projects/smart-water-pipeline.jpg', img:'water'},
  {name:'Smart Crop Disease Detection and Action', year:'2025', desc:'AI-based application that classifies crop disease from plant images using machine learning and image processing, with recommendations for farmers. Published as an IEEE-indexed conference paper.', tags:['Python','Machine Learning','Image Processing'], glyph:'02', github:'https://github.com/Deepika22-d/Smart-Crop-Disease-Detection', live:null, video:null, photo:'assets/images/projects/smart-crop-disease-detection.jpg', img:'crop'},
  {name:'Online Survey System', year:'2025', desc:'Desktop-based survey application built in Java with an AWT/Swing GUI, connected to MySQL to manage questions, users, and responses.', tags:['Java','Swing/AWT','MySQL','Eclipse IDE'], glyph:'03', github:'https://github.com/Deepika22-d/Online-survey-System', live:null, img:'survey', photo:'assets/images/projects/online-survey-system.jpg', containFit:true, poster:'assets/images/projects/online-survey-system-poster.jpg', video:'assets/videos/online-survey-system-demo.mp4'},
  {name:'Online Quiz System', year:'2025', desc:'Web-based quiz platform for conducting online assessments, with PHP backend logic and MySQL for data storage and score management.', tags:['PHP','MySQL','XAMPP'], glyph:'04', github:'https://github.com/Deepika22-d/Online-Quiz-System', live:null, img:'quiz', photo:'assets/images/projects/online-quiz-system.jpg', containFit:true, poster:'assets/images/projects/online-quiz-system-poster.jpg', video:'assets/videos/online-quiz-system-demo.mp4'},
  {name:'Perfume Website', year:'2026', desc:'Responsive perfume showcase website with structured product sections, navigation, and a modern storefront UI layout.', tags:['HTML','CSS'], glyph:'05', github:'https://github.com/Deepika22-d/Perfume-HTML-CSS-Website', live:'https://deepika-perfume-site.netlify.app/', video:null, img:'perfume', photo:'assets/images/projects/perfume-website.jpg', containFit:true},
  {name:'Automatic Plant Irrigation System', year:'', desc:'An automated irrigation project that waters plants based on sensor input, reducing manual monitoring. // Add a more detailed description here.', tags:['Arduino','IoT','Sensors'], glyph:'06', github:'https://github.com/Deepika22-d/Automatic_Plant_Irrigation_System', live:null, video:null, photo:'assets/images/projects/automatic-plant-irrigation.jpg', img:'irrigation'},
  {name:'Temperature-Tuned Fans Using Microcontroller', year:'', desc:'A microcontroller-based project that adjusts fan speed automatically based on temperature readings. // Add a more detailed description here.', tags:['Microcontroller','Embedded C','Sensors'], glyph:'07', github:'https://github.com/Deepika22-d/temperature-tuned-fans-using-microcontroller', live:null, video:null, photo:'assets/images/projects/temperature-tuned-fans.jpg', img:'fans'},
];
const projectsGrid = document.getElementById('projectsGrid');
const demoModal = document.getElementById('demo-modal');
const demoModalBody = document.getElementById('demoModalBody');

function openDemoModal(project){
  if(project.video){
    demoModalBody.innerHTML = `
      <div class="demo-video-wrap" id="demoVideoWrap">
        <video id="demoVideoEl" poster="${project.poster || ''}" controls controlsList="nodownload noremoteplayback" disablePictureInPicture playsinline preload="metadata" oncontextmenu="return false"></video>
        <div class="video-play-overlay" id="videoPlayOverlay"><div class="play-btn video-play-btn">${icons.play}</div></div>
      </div>
      <div class="demo-modal-title">${project.name}</div>`;

    const videoEl = document.getElementById('demoVideoEl');
    const overlay = document.getElementById('videoPlayOverlay');

    videoEl.src = project.video;

    const startPlayback = ()=>{
      videoEl.play().then(()=>{
        overlay.style.display = 'none';
      }).catch(()=>{
        overlay.style.display = 'flex';
      });
    };
    overlay.addEventListener('click', startPlayback);
    videoEl.addEventListener('play', ()=>{ overlay.style.display = 'none'; });
    videoEl.addEventListener('pause', ()=>{ if(videoEl.currentTime===0) overlay.style.display='flex'; });
    videoEl.addEventListener('error', ()=>{
      demoModalBody.innerHTML = `
        <div class="demo-video-wrap"><div class="demo-placeholder"><div class="big-ic">${icons.globe}</div>This video could not be played in your browser.</div></div>
        <div class="demo-modal-title">${project.name}</div>`;
    });
  } else {
    demoModalBody.innerHTML = `
      <div class="demo-video-wrap">
        <div class="demo-placeholder">
          <div class="big-ic">${icons.globe}</div>
          Demo video coming soon for this project.
        </div>
      </div>
      <div class="demo-modal-title">${project.name}</div>`;
  }
  demoModal.classList.add('show');
}
function closeDemoModal(){
  const v = document.getElementById('demoVideoEl');
  if(v){ v.pause(); v.removeAttribute('src'); v.load(); }
  demoModal.classList.remove('show');
  demoModalBody.innerHTML='';
}
document.getElementById('demoModalClose').addEventListener('click', closeDemoModal);
demoModal.addEventListener('click', e=>{
  if(e.target===demoModal) closeDemoModal();
});
document.addEventListener('keydown', e=>{
  if(e.key==='Escape' && demoModal.classList.contains('show')) closeDemoModal();
  if(e.key==='Escape' && imageLightbox.classList.contains('show')) closeLightbox();
});

/* ============================= IMAGE LIGHTBOX ============================= */
const imageLightbox = document.getElementById('image-lightbox');
const lightboxBody = document.getElementById('lightboxBody');
function openLightbox(project){
  const mediaContent = project.photo
    ? `<img src="${project.photo}" alt="${project.name}"${project.containFit ? ' class="contain"' : ''}>`
    : (illustrations[project.img] || '');
  lightboxBody.innerHTML = `
    <div class="lightbox-media">${mediaContent}</div>
    <div class="lightbox-title">${project.name}</div>
    <div class="lightbox-desc">${project.desc}</div>`;
  imageLightbox.classList.add('show');
}
function closeLightbox(){
  imageLightbox.classList.remove('show');
  lightboxBody.innerHTML='';
}
document.getElementById('lightboxClose').addEventListener('click', closeLightbox);
imageLightbox.addEventListener('click', e=>{
  if(e.target===imageLightbox) closeLightbox();
});

projectsData.forEach(p=>{
  const card = document.createElement('div');
  card.className='pcard';
  const yearTag = p.year ? ` <span style="color:var(--muted-2);font-family:var(--font-mono);font-size:.7rem;">— ${p.year}</span>` : '';
  const playOverlay = p.video ? `<div class="play-overlay"><div class="play-btn">${icons.play}</div></div>` : '';
  const mediaContent = p.photo
    ? `<img class="pcard-photo${p.containFit ? ' contain' : ''}" src="${p.photo}" alt="${p.name}" loading="lazy">`
    : (illustrations[p.img] || `<span class="glyph">${p.glyph}</span>`);
  const linkButtons = [
    `<button type="button" class="btn-details">${icons.globe} View Details</button>`,
    `<a href="${p.github}" target="_blank" rel="noopener noreferrer">${icons.code} GitHub</a>`
  ];
  if(p.live) linkButtons.push(`<a href="${p.live}" target="_blank" rel="noopener noreferrer">🌐 Live Website</a>`);
  if(p.video) linkButtons.push(`<button type="button" class="btn-demo">${icons.play} View Demo</button>`);
  card.innerHTML = `
    <div class="pcard-media"${p.video ? '' : ' style="cursor:pointer;"'}>
      <span class="glyph">${p.glyph}</span>
      ${mediaContent}
      <div class="pcard-image-overlay"></div>
      <div class="pcard-expand" title="View larger image">${icons.expand}</div>
      ${playOverlay}
    </div>
    <div class="pcard-body">
      <div class="pcard-title">${p.name}${yearTag}</div>
      <div class="pcard-desc">${p.desc}</div>
      <div class="badge-row">${p.tags.map(t=>`<span class="badge">${t}</span>`).join('')}</div>
      <div class="pcard-links">${linkButtons.join('')}</div>
    </div>`;

  // Media click: video projects open the demo modal; others open the image lightbox
  card.querySelector('.pcard-media').addEventListener('click', (e)=>{
    if(e.target.closest('.pcard-expand')) return; // handled separately below
    if(p.video) openDemoModal(p); else openLightbox(p);
  });
  card.querySelector('.pcard-expand').addEventListener('click', (e)=>{
    e.stopPropagation();
    openLightbox(p);
  });
  card.querySelector('.btn-details').addEventListener('click', ()=>openLightbox(p));
  if(p.video){
    card.querySelector('.btn-demo').addEventListener('click', ()=>openDemoModal(p));
  }
  card.addEventListener('mousemove', e=>{
    const r = card.getBoundingClientRect();
    const px = (e.clientX-r.left)/r.width - 0.5, py=(e.clientY-r.top)/r.height - 0.5;
    card.style.transform = `perspective(700px) rotateX(${-py*7}deg) rotateY(${px*7}deg) translateY(-4px)`;
  });
  card.addEventListener('mouseleave', ()=> card.style.transform='');
  projectsGrid.appendChild(card);
});

/* ============================= ACHIEVEMENTS DATA ============================= */
const achData = [
  {title:'Product Expo Winner — LUNARA\'26', sub:'First place for Smart Water Pipeline Monitoring System at Bannari Amman Institute of Technology, 2026.', ic:'chip', photo:'assets/images/achievements/product-expo-winner.jpg'},
  {title:'IEEE Conference Publication', sub:'Published an IEEE-indexed paper on Smart Crop Disease Detection and Action using machine learning, 2025.', ic:'globe', photo:'assets/images/achievements/ieee-publication-saveetha.jpg'},
  {title:'24-Hour Hackathon Participant', sub:'Built a working prototype in a 24-hour sprint at KPR College of Engineering, 2025.', ic:'tool', photo:'assets/images/achievements/hackathon-kpr.jpg'},
  {title:'NPTEL: Cloud Computing (Elite)', sub:'IIT Kharagpur · Consolidated score 62% · Jul&ndash;Oct 2024 · 12-week course.', ic:'flow', photo:'assets/images/achievements/nptel-cloud-computing.jpg'},
  {title:'NPTEL: Network Security (Elite)', sub:'IIT Bombay · Consolidated score 64% · Jan&ndash;Apr 2026 · 12-week course.', ic:'flow', photo:'assets/images/achievements/nptel-network-security.jpg'},
  {title:'NPTEL: Operating System Fundamentals', sub:'IIT Kharagpur · Consolidated score 58% · Jul&ndash;Oct 2025 · 12-week course.', ic:'flow', photo:'assets/images/achievements/nptel-os-fundamentals.jpg'},
];
const achGrid = document.getElementById('achGrid');
achData.forEach(a=>{
  const card = document.createElement('div');
  card.className='ach-card glass';
  card.innerHTML = `
    <div class="ach-media">
      <img src="${a.photo}" alt="${a.title}" loading="lazy">
      <div class="ach-badge">${icons[a.ic]}</div>
    </div>
    <div class="ach-body">
      <div class="ach-title">${a.title}</div>
      <div class="ach-sub">${a.sub}</div>
    </div>`;
  card.addEventListener('click', ()=> openLightbox({name:a.title, desc:a.sub, photo:a.photo, containFit:true}));
  achGrid.appendChild(card);
});

/* ============================= CERTIFICATES DATA ============================= */
const certData = [
  {name:'ServiceNow Certified System Administrator (CSA)', org:'ServiceNow', year:'Issued May 23, 2026', scoreCard:'assets/documents/ServiceNow_CSA_Score_Card.jpg', photo:'assets/documents/ServiceNow_CSA_Certificate.jpg'},
  {name:'ServiceNow Certified Application Developer (CAD)', org:'ServiceNow', year:'Issued July 4, 2026', scoreCard:'assets/documents/ServiceNow_CAD_Score_Card.jpg', photo:'assets/documents/ServiceNow_CAD_Certificate.jpg'},
];
const certGrid = document.getElementById('certGrid');
const modal = document.getElementById('cert-modal');
const modalBody = document.getElementById('modalBody');
certData.forEach(c=>{
  const card = document.createElement('div');
  card.className='cert-card glass';
  card.innerHTML = `
    <div class="cert-preview">
      <img src="${c.photo}" alt="${c.name}" loading="lazy">
      <div class="cert-badge">${icons.verified} Certified</div>
    </div>
    <div class="cert-body">
      <div class="cert-name">${c.name}</div>
      <div class="cert-org">Issued by: ${c.org}</div>
      <div class="cert-year">${c.year}</div>
      <div class="cert-actions">
        <div class="cert-btn">View Certificate →</div>
        <button type="button" class="cert-score-btn cert-score-trigger">${icons.scoreDoc} View Score Card</button>
      </div>
    </div>`;
  card.querySelector('.cert-score-trigger').addEventListener('click', (e)=>{
    e.stopPropagation();
    const win2 = window.open(c.scoreCard, '_blank', 'noopener');
    if(!win2){
      // Popup blocked - fall back to opening the score card inside the existing modal
      modalBody.innerHTML = `
        <div class="cert-preview" id="modalCertPreview">
          <img src="${c.scoreCard}" alt="${c.name} Score Card">
        </div>
        <h3 style="margin-top:4px;">${c.name} — Score Report</h3>
        <p style="color:var(--muted-2);font-size:.72rem;margin-top:10px;font-family:var(--font-mono);">Click the report to zoom in</p>`;
      modal.classList.add('show');
      const zp = document.getElementById('modalCertPreview');
      zp.addEventListener('click', ()=> zp.classList.toggle('zoomed'));
    }
  });
  card.addEventListener('click', ()=>{
    modalBody.innerHTML = `
      <div class="cert-preview" id="modalCertPreview">
        <img src="${c.photo}" alt="${c.name}">
        <div class="cert-badge">${icons.verified} Certified</div>
      </div>
      <h3 style="margin-top:4px;">${c.name}</h3>
      <p style="color:var(--muted);margin-top:8px;">Issued by: ${c.org} · ${c.year}</p>
      <p style="color:var(--muted-2);font-size:.72rem;margin-top:10px;font-family:var(--font-mono);">Click the certificate to zoom in</p>`;
    modal.classList.add('show');
    const zoomPreview = document.getElementById('modalCertPreview');
    zoomPreview.addEventListener('click', ()=> zoomPreview.classList.toggle('zoomed'));
  });
  certGrid.appendChild(card);
});
document.getElementById('modalClose').addEventListener('click', ()=>{ modal.classList.remove('show'); modalBody.innerHTML=''; });
modal.addEventListener('click', e=>{ if(e.target===modal){ modal.classList.remove('show'); modalBody.innerHTML=''; } });
document.addEventListener('keydown', e=>{ if(e.key==='Escape' && modal.classList.contains('show')){ modal.classList.remove('show'); modalBody.innerHTML=''; } });

/* ============================= INTERNSHIP CERTIFICATE MODAL ============================= */
function openInternshipCertModal(){
  const img = document.querySelector('#internCertThumb img');
  modalBody.innerHTML = `
    <div class="cert-preview" id="modalCertPreview">
      <img src="${img.src}" alt="Popular Systems Internship Certificate">
      <div class="cert-badge">${icons.verified} Verified</div>
    </div>
    <h3 style="margin-top:4px;">Certificate of Internship</h3>
    <p style="color:var(--muted);margin-top:8px;">Popular Systems · June 27 &ndash; July 28, 2025</p>
    <p style="color:var(--muted-2);font-size:.72rem;margin-top:10px;font-family:var(--font-mono);">Click the certificate to zoom in</p>`;
  modal.classList.add('show');
  const zoomPreview = document.getElementById('modalCertPreview');
  zoomPreview.addEventListener('click', ()=> zoomPreview.classList.toggle('zoomed'));
}
document.getElementById('internCertThumb').addEventListener('click', openInternshipCertModal);
document.getElementById('internCertBtn').addEventListener('click', openInternshipCertModal);

/* ============================= CONTACT FORM (EmailJS) ============================= */
/*
  SETUP — replace these 3 placeholder values with your own EmailJS credentials:
  1. EMAILJS_PUBLIC_KEY  -> EmailJS Dashboard > Account > General > Public Key
  2. EMAILJS_SERVICE_ID  -> EmailJS Dashboard > Email Services > your connected Gmail service's Service ID
  3. EMAILJS_TEMPLATE_ID -> EmailJS Dashboard > Email Templates > your template's Template ID
*/
const EMAILJS_PUBLIC_KEY  = 'LBgJWcGomD5eohzQj';    // EmailJS Public Key
const EMAILJS_SERVICE_ID  = 'service_swaey47';      // EmailJS Service ID
const EMAILJS_TEMPLATE_ID = 'template_yvi3zcd';     // EmailJS Template ID

if(window.emailjs){ emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY }); }

const contactForm = document.getElementById('contactForm');
const contactSubmitBtn = document.getElementById('contactSubmitBtn');
const formStatus = document.getElementById('form-status');
const contactNameEl = document.getElementById('contactName');
const contactEmailEl = document.getElementById('contactEmail');
const contactMessageEl = document.getElementById('contactMessage');

const statusIcons = {
  sending: '<svg class="status-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>',
  success: '<svg class="status-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 6L9 17l-5-5"/></svg>',
  error: '<svg class="status-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 8v5M12 16h.01"/></svg>'
};

function setFormStatus(type, message){
  formStatus.className = type ? `status-${type}` : '';
  formStatus.innerHTML = type ? `${statusIcons[type] || ''}<span>${message}</span>` : '';
}

function validateContactForm(){
  let valid = true;
  [contactNameEl, contactEmailEl, contactMessageEl].forEach(el => el.classList.remove('field-error'));

  if(contactNameEl.value.trim().length < 2){
    contactNameEl.classList.add('field-error');
    valid = false;
  }
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if(!emailPattern.test(contactEmailEl.value.trim())){
    contactEmailEl.classList.add('field-error');
    valid = false;
  }
  if(contactMessageEl.value.trim().length < 5){
    contactMessageEl.classList.add('field-error');
    valid = false;
  }
  return valid;
}

let lastSubmitTime = 0;
const SUBMIT_COOLDOWN_MS = 20000; // blocks rapid repeat submissions (basic spam prevention)
let isSending = false;

contactForm.addEventListener('submit', function(e){
  e.preventDefault();

  if(isSending) return;

  const now = Date.now();
  if(now - lastSubmitTime < SUBMIT_COOLDOWN_MS){
    const waitSec = Math.ceil((SUBMIT_COOLDOWN_MS - (now - lastSubmitTime)) / 1000);
    setFormStatus('error', `Please wait ${waitSec}s before sending another message.`);
    return;
  }

  if(!validateContactForm()){
    setFormStatus('error', 'Please fill in a valid name, email, and message.');
    return;
  }

  if(!window.emailjs || EMAILJS_PUBLIC_KEY === 'YOUR_PUBLIC_KEY'){
    setFormStatus('error', 'Email sending isn\'t configured yet — add your EmailJS keys in script.js.');
    return;
  }

  isSending = true;
  contactSubmitBtn.disabled = true;
  contactSubmitBtn.textContent = 'Sending...';
  setFormStatus('sending', 'Sending your message...');

  // Primary keys match your EmailJS template variables exactly: {{name}}, {{email}}, {{message}}.
  // The extra aliases are harmless fallbacks EmailJS simply ignores if your template
  // doesn't reference them - they don't overwrite or interfere with name/email/message.
  const nameVal = contactNameEl.value.trim();
  const emailVal = contactEmailEl.value.trim();
  const messageVal = contactMessageEl.value.trim();
  const templateParams = {
    name: nameVal,
    email: emailVal,
    message: messageVal,
    user_name: nameVal,
    from_name: nameVal,
    user_email: emailVal,
    from_email: emailVal,
    reply_to: emailVal,
    user_message: messageVal
  };
  console.log('[EmailJS] Sending template params:', templateParams);

  emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams)
    .then(()=>{
      setFormStatus('success', 'Message sent! I\'ll get back to you soon.');
      contactForm.reset();
      lastSubmitTime = Date.now();
    })
    .catch((err)=>{
      console.error('EmailJS error:', err);
      setFormStatus('error', 'Something went wrong — please try again or email me directly.');
    })
    .finally(()=>{
      isSending = false;
      contactSubmitBtn.disabled = false;
      contactSubmitBtn.textContent = 'Send Message';
    });
});

[contactNameEl, contactEmailEl, contactMessageEl].forEach(el=>{
  el.addEventListener('input', ()=> el.classList.remove('field-error'));
});

