/* =====================================================
   DHYAN KUMAR M — Portfolio Script
   Features: Cursor, Loader, BG Canvas, DSA Simulations,
             Typing, Scroll Effects, Form, Hex Particles
   ===================================================== */

// ===== CURSOR =====
const cursorOuter = document.getElementById('cursor-outer');
const cursorDot = document.getElementById('cursor-dot');
let mouseX = 0, mouseY = 0, outerX = 0, outerY = 0;

document.addEventListener('mousemove', e => {
  mouseX = e.clientX; mouseY = e.clientY;
  cursorDot.style.left = mouseX + 'px';
  cursorDot.style.top = mouseY + 'px';
});

function animateCursor() {
  outerX += (mouseX - outerX) * 0.12;
  outerY += (mouseY - outerY) * 0.12;
  cursorOuter.style.left = outerX + 'px';
  cursorOuter.style.top = outerY + 'px';
  requestAnimationFrame(animateCursor);
}
animateCursor();

document.querySelectorAll('a, button, .skill-tag, .cert-card, .project-card, .dsa-btn').forEach(el => {
  el.addEventListener('mouseenter', () => {
    cursorOuter.style.transform = 'translate(-50%,-50%) scale(2)';
    cursorOuter.style.borderColor = 'var(--magenta)';
    cursorDot.style.transform = 'translate(-50%,-50%) scale(0.5)';
  });
  el.addEventListener('mouseleave', () => {
    cursorOuter.style.transform = 'translate(-50%,-50%) scale(1)';
    cursorOuter.style.borderColor = 'rgba(0,255,245,0.5)';
    cursorDot.style.transform = 'translate(-50%,-50%) scale(1)';
  });
});

// ===== LOADER =====
const loaderBar = document.getElementById('loaderBar');
const loaderText = document.getElementById('loaderText');
const loaderPct = document.getElementById('loaderPct');
const loaderMatrixEl = document.getElementById('loaderMatrix');
const loaderMsgs = ['INITIALIZING SYSTEM...', 'LOADING NEURAL NETS...', 'COMPILING ASSETS...', 'CALIBRATING NEON...', 'SYSTEM READY'];

// Matrix background text
const matrixChars = '01アイウエオカキクケコサシスセソタチツテトナニヌネノ';
const matrixCols = Math.floor(window.innerWidth / 14);
let matrixIntervals = [];
function buildMatrix() {
  loaderMatrixEl.innerHTML = '';
  for (let i = 0; i < matrixCols; i++) {
    const col = document.createElement('span');
    col.style.cssText = `display:inline-block;width:14px;font-size:12px;vertical-align:top;`;
    loaderMatrixEl.appendChild(col);
    let h = '';
    const rows = Math.floor(window.innerHeight / 18);
    for (let j = 0; j < rows; j++) h += matrixChars[Math.floor(Math.random() * matrixChars.length)] + '<br>';
    col.innerHTML = h;
  }
}
buildMatrix();

let loadPct = 0;
const loaderInt = setInterval(() => {
  loadPct += Math.random() * 10 + 2;
  if (loadPct >= 100) { loadPct = 100; clearInterval(loaderInt); }
  loaderBar.style.width = loadPct + '%';
  loaderPct.textContent = Math.floor(loadPct) + '%';
  const idx = Math.min(Math.floor((loadPct / 100) * loaderMsgs.length), loaderMsgs.length - 1);
  loaderText.textContent = loaderMsgs[idx];
  if (loadPct === 100) {
    setTimeout(() => {
      document.getElementById('loader').classList.add('hide');
    }, 600);
  }
}, 120);

// ===== BG CANVAS =====
const canvas = document.getElementById('bgCanvas');
const ctx = canvas.getContext('2d');
function resizeCanvas() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

class Particle {
  constructor() { this.reset(); }
  reset() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.vx = (Math.random() - 0.5) * 0.25;
    this.vy = (Math.random() - 0.5) * 0.25;
    this.size = Math.random() * 1.8 + 0.4;
    this.alpha = Math.random() * 0.35 + 0.08;
    const r = Math.random();
    this.color = r < 0.5 ? '0,255,245' : r < 0.8 ? '157,0,255' : '255,0,170';
  }
  update() {
    this.x += this.vx; this.y += this.vy;
    if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) this.reset();
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${this.color},${this.alpha})`;
    ctx.fill();
  }
}
const particles = Array.from({ length: 130 }, () => new Particle());

function drawConnections() {
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 90) {
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.strokeStyle = `rgba(0,255,245,${0.05 * (1 - dist / 90)})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }
    }
  }
}

function animCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach(p => { p.update(); p.draw(); });
  drawConnections();
  requestAnimationFrame(animCanvas);
}
animCanvas();

// ===== HERO CANVAS (Neon nodes/wires) =====
const heroCanvas = document.getElementById('heroCanvas');
const hCtx = heroCanvas.getContext('2d');
function resizeHeroCanvas() {
  heroCanvas.width = heroCanvas.offsetWidth;
  heroCanvas.height = heroCanvas.offsetHeight;
}
window.addEventListener('resize', resizeHeroCanvas);
setTimeout(resizeHeroCanvas, 200);

const heroNodes = [];
for (let i = 0; i < 30; i++) {
  heroNodes.push({
    x: Math.random(), y: Math.random(),
    vx: (Math.random() - 0.5) * 0.0004,
    vy: (Math.random() - 0.5) * 0.0004,
    r: Math.random() * 2 + 1,
    color: Math.random() < 0.5 ? '0,255,245' : '157,0,255'
  });
}
function animHeroCanvas() {
  if (!heroCanvas.width) { requestAnimationFrame(animHeroCanvas); return; }
  hCtx.clearRect(0, 0, heroCanvas.width, heroCanvas.height);
  heroNodes.forEach(n => {
    n.x += n.vx; n.y += n.vy;
    if (n.x < 0 || n.x > 1) n.vx *= -1;
    if (n.y < 0 || n.y > 1) n.vy *= -1;
    const px = n.x * heroCanvas.width;
    const py = n.y * heroCanvas.height;
    hCtx.beginPath();
    hCtx.arc(px, py, n.r, 0, Math.PI * 2);
    hCtx.fillStyle = `rgba(${n.color},0.5)`;
    hCtx.fill();
  });
  for (let i = 0; i < heroNodes.length; i++) {
    for (let j = i + 1; j < heroNodes.length; j++) {
      const dx = (heroNodes[i].x - heroNodes[j].x) * heroCanvas.width;
      const dy = (heroNodes[i].y - heroNodes[j].y) * heroCanvas.height;
      const d = Math.sqrt(dx*dx + dy*dy);
      if (d < 120) {
        hCtx.beginPath();
        hCtx.moveTo(heroNodes[i].x * heroCanvas.width, heroNodes[i].y * heroCanvas.height);
        hCtx.lineTo(heroNodes[j].x * heroCanvas.width, heroNodes[j].y * heroCanvas.height);
        hCtx.strokeStyle = `rgba(0,255,245,${0.07 * (1 - d/120)})`;
        hCtx.lineWidth = 0.5;
        hCtx.stroke();
      }
    }
  }
  requestAnimationFrame(animHeroCanvas);
}
animHeroCanvas();

// ===== TYPING EFFECT =====
const roles = [
  'CS ENGINEER @ GAT BENGALURU',
  'MACHINE LEARNING DEVELOPER',
  'FULL STACK ARCHITECT',
  'CYBERSECURITY RESEARCHER',
  'OPEN SOURCE BUILDER',
];
let roleIdx = 0, charIdx = 0, deleting = false;
const typedEl = document.getElementById('typedText');
function typeEffect() {
  const current = roles[roleIdx];
  if (!deleting) {
    typedEl.textContent = current.slice(0, charIdx + 1);
    charIdx++;
    if (charIdx === current.length) { deleting = true; setTimeout(typeEffect, 2200); return; }
  } else {
    typedEl.textContent = current.slice(0, charIdx - 1);
    charIdx--;
    if (charIdx === 0) { deleting = false; roleIdx = (roleIdx + 1) % roles.length; }
  }
  setTimeout(typeEffect, deleting ? 35 : 65);
}
typeEffect();

// ===== SCROLL REVEAL =====
const revealObs = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: 0.1 });
document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(r => revealObs.observe(r));

// ===== SKILL BARS =====
const skillBarObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.querySelectorAll('.skill-bar-fill').forEach(fill => {
        const w = fill.dataset.width;
        fill.style.width = w + '%';
      });
      e.target.querySelectorAll('.skill-pct').forEach(pct => {
        const target = parseInt(pct.dataset.pct);
        let cur = 0;
        const step = () => {
          cur = Math.min(cur + 2, target);
          pct.textContent = cur + '%';
          if (cur < target) requestAnimationFrame(step);
        };
        step();
      });
    }
  });
}, { threshold: 0.3 });
document.querySelectorAll('.skill-bars-wrap').forEach(el => skillBarObs.observe(el));

// ===== COUNTER STATS =====
const statObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.querySelectorAll('.stat-num[data-target]').forEach(el => {
        const target = parseInt(el.dataset.target);
        const isDec = target === 885;
        let cur = 0;
        const duration = 1800;
        const start = performance.now();
        function step(now) {
          const p = Math.min((now - start) / duration, 1);
          const val = Math.floor(p * target);
          el.textContent = isDec ? (val / 100).toFixed(2) : val;
          if (p < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
      });
    }
  });
}, { threshold: 0.4 });
document.querySelectorAll('.about-stats').forEach(el => statObs.observe(el));

// ===== SCROLL PROGRESS =====
window.addEventListener('scroll', () => {
  const scrollTop = document.documentElement.scrollTop;
  const docH = document.documentElement.scrollHeight - window.innerHeight;
  document.getElementById('progress-bar').style.width = (scrollTop / docH * 100) + '%';
});

// ===== NAV =====
const mainNav = document.getElementById('mainNav');
window.addEventListener('scroll', () => {
  mainNav.classList.toggle('scrolled', window.scrollY > 80);
});

const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  mobileMenu.classList.toggle('open');
});
document.querySelectorAll('.mob-link').forEach(l => {
  l.addEventListener('click', () => {
    hamburger.classList.remove('open');
    mobileMenu.classList.remove('open');
  });
});

// ===== SMOOTH NAV =====
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    e.preventDefault();
    const t = document.querySelector(a.getAttribute('href'));
    if (t) t.scrollIntoView({ behavior: 'smooth' });
  });
});

// ===== NEON RIPPLE =====
document.addEventListener('click', e => {
  const ripple = document.createElement('div');
  ripple.style.cssText = `
    position:fixed;left:${e.clientX}px;top:${e.clientY}px;
    width:0;height:0;border-radius:50%;
    background:rgba(0,255,245,0.25);border:1px solid var(--cyan);
    transform:translate(-50%,-50%);pointer-events:none;z-index:9990;
    animation:ripple 0.7s ease-out forwards;
  `;
  document.body.appendChild(ripple);
  setTimeout(() => ripple.remove(), 700);
});

// ===== HEX PARTICLES =====
const hexChars = ['0x4F','0xFF','0x1A','0x2B','0x9D','0x00','0xAA','0x3C','0xF5','01','10','11'];
function spawnHex() {
  const el = document.createElement('div');
  el.className = 'hex-particle';
  el.textContent = hexChars[Math.floor(Math.random() * hexChars.length)];
  el.style.left = Math.random() * 100 + 'vw';
  el.style.animationDuration = (7 + Math.random() * 7) + 's';
  el.style.animationDelay = (Math.random() * 2) + 's';
  document.getElementById('hexContainer').appendChild(el);
  setTimeout(() => el.remove(), 14000);
}
setInterval(spawnHex, 2000);

// ===== GLITCH FLICKER =====
function randomGlitch() {
  const hero = document.querySelector('.hero-name .line1');
  if (hero) {
    hero.style.filter = 'hue-rotate(40deg) brightness(1.6)';
    setTimeout(() => hero.style.filter = '', 80);
  }
  setTimeout(randomGlitch, 3000 + Math.random() * 5000);
}
setTimeout(randomGlitch, 2000);

// ===== CONTACT FORM =====
document.getElementById('formSubmit').addEventListener('click', () => {
  const name = document.getElementById('fName').value;
  const email = document.getElementById('fEmail').value;
  const msg = document.getElementById('fMsg').value;
  const btn = document.getElementById('formSubmit').querySelector('span');
  if (!name || !email || !msg) {
    btn.textContent = '⚠ ALL FIELDS REQUIRED';
    btn.parentElement.style.borderColor = 'var(--red)';
    setTimeout(() => { btn.textContent = '⟶ TRANSMIT MESSAGE'; btn.parentElement.style.borderColor = 'var(--cyan)'; }, 2500);
    return;
  }
  btn.textContent = '⟳ TRANSMITTING...';
  setTimeout(() => {
    btn.textContent = '✔ TRANSMISSION SUCCESSFUL';
    document.getElementById('fName').value = '';
    document.getElementById('fEmail').value = '';
    document.getElementById('fMsg').value = '';
    setTimeout(() => btn.textContent = '⟶ TRANSMIT MESSAGE', 3000);
  }, 1200);
});

// ===========================================================

// ===========================================================
// ===== DSA ALGORITHM VISUALIZER ============================
// ===========================================================

const dsaCanvas = document.getElementById('dsaCanvas');
const dCtx = dsaCanvas.getContext('2d');
let currentAlgo = 'bubble';
let animRunning = false;
let animTimer = null;
let comparisons = 0, swaps = 0;

// ---- DSA State ----
let dsaArr = [];
let dsaHighlight   = [];   // yellow  – being swapped / mid
let dsaCompared    = [];   // pink    – being compared
let dsaSorted      = [];   // green   – confirmed sorted
let dsaFound       = -1;   // green   – binary search hit
let dsaMergeLeft   = [];   // cyan    – left merge region
let dsaMergeRight  = [];   // purple  – right merge region
let dsaMergePlacing= [];   // yellow  – element being placed
let dsaDone        = false;

const pseudocodes = {
  bubble: `<span class="ps-comment">// Bubble Sort — O(n²) time, O(1) space</span>
<span class="ps-key">function</span> <span class="ps-fn">bubbleSort</span>(arr):
  n = arr.length
  <span class="ps-key">for</span> i = <span class="ps-num">0</span> to n-<span class="ps-num">1</span>:
    <span class="ps-key">for</span> j = <span class="ps-num">0</span> to n-i-<span class="ps-num">2</span>:
      comparisons++
      <span class="ps-key">if</span> arr[j] > arr[j+<span class="ps-num">1</span>]:
        swap(arr[j], arr[j+<span class="ps-num">1</span>])
        swaps++
  <span class="ps-key">return</span> arr`,
  merge: `<span class="ps-comment">// Merge Sort — O(n log n) time, O(n) space</span>
<span class="ps-key">function</span> <span class="ps-fn">mergeSort</span>(arr, l, r):
  <span class="ps-key">if</span> l >= r: <span class="ps-key">return</span>
  mid = floor((l + r) / <span class="ps-num">2</span>)
  <span class="ps-fn">mergeSort</span>(arr, l, mid)       <span class="ps-comment">// cyan region</span>
  <span class="ps-fn">mergeSort</span>(arr, mid+<span class="ps-num">1</span>, r)    <span class="ps-comment">// purple region</span>
  <span class="ps-fn">merge</span>(arr, l, mid, r)

<span class="ps-key">function</span> <span class="ps-fn">merge</span>(arr, l, mid, r):
  L = arr[l..mid]  R = arr[mid+<span class="ps-num">1</span>..r]
  <span class="ps-key">while</span> both halves have elements:
    <span class="ps-key">if</span> L[i] <= R[j]: place L[i]  <span class="ps-comment">// yellow</span>
    <span class="ps-key">else</span>: place R[j]`,
  binary: `<span class="ps-comment">// Binary Search — O(log n) time, O(1) space</span>
<span class="ps-key">function</span> <span class="ps-fn">binarySearch</span>(arr, target):
  lo = <span class="ps-num">0</span>, hi = arr.length - <span class="ps-num">1</span>
  <span class="ps-key">while</span> lo <= hi:
    mid = floor((lo + hi) / <span class="ps-num">2</span>)
    comparisons++
    <span class="ps-key">if</span> arr[mid] == target:
      <span class="ps-key">return</span> mid  <span class="ps-comment">// FOUND ✓</span>
    <span class="ps-key">else if</span> arr[mid] < target:
      lo = mid + <span class="ps-num">1</span>
    <span class="ps-key">else</span>:
      hi = mid - <span class="ps-num">1</span>
  <span class="ps-key">return</span> -<span class="ps-num">1</span>  <span class="ps-comment">// NOT FOUND</span>`,
  bfs: `<span class="ps-comment">// BFS Graph Traversal — O(V+E) time, O(V) space</span>
<span class="ps-key">function</span> <span class="ps-fn">BFS</span>(graph, start):
  visited = Set()
  queue = [start]
  visited.add(start)
  
  <span class="ps-key">while</span> queue not empty:
    node = queue.dequeue()   <span class="ps-comment">// yellow</span>
    <span class="ps-fn">process</span>(node)
    
    <span class="ps-key">for</span> neighbor <span class="ps-key">in</span> graph[node]:
      <span class="ps-key">if</span> neighbor <span class="ps-key">not in</span> visited:
        visited.add(neighbor)
        queue.enqueue(neighbor)  <span class="ps-comment">// cyan</span>`,
  stack: `<span class="ps-comment">// Stack Operations — O(1) push/pop/peek</span>
<span class="ps-key">class</span> <span class="ps-fn">Stack</span>:
  data = []
  
  <span class="ps-key">function</span> <span class="ps-fn">push</span>(val):
    data.append(val)     <span class="ps-comment">// O(1) — green glow</span>
  
  <span class="ps-key">function</span> <span class="ps-fn">pop</span>():
    <span class="ps-key">if</span> isEmpty(): throw Error
    <span class="ps-key">return</span> data.pop()    <span class="ps-comment">// O(1) — pink glow</span>
  
  <span class="ps-key">function</span> <span class="ps-fn">peek</span>():
    <span class="ps-key">return</span> data[top]     <span class="ps-comment">// O(1) — yellow glow</span>`
};

const complexities = {
  bubble: { time: 'Time: O(n²)',    space: 'Space: O(1)' },
  merge:  { time: 'Time: O(n log n)', space: 'Space: O(n)' },
  binary: { time: 'Time: O(log n)', space: 'Space: O(1)' },
  bfs:    { time: 'Time: O(V+E)',   space: 'Space: O(V)' },
  stack:  { time: 'Time: O(1) ops', space: 'Space: O(n)' }
};
const algoNames = { bubble:'BUBBLE SORT', merge:'MERGE SORT', binary:'BINARY SEARCH', bfs:'GRAPH BFS', stack:'STACK OPS' };

// BFS state
let bfsGraph = {}, bfsNodes = {}, bfsEdges = [], bfsQueue = [], bfsVisited = new Set(), bfsCurrentNode = -1;
// Stack state
let stackData = [], stackOp = '', stackHighlight = -1;

function getSpeed() { return Math.max(30, 1000 - parseInt(document.getElementById('dsaSpeed').value)); }

function initDSAState() {
  const sz = 16;
  dsaArr         = Array.from({ length: sz }, () => Math.floor(Math.random() * 88) + 8);
  dsaHighlight   = [];
  dsaCompared    = [];
  dsaSorted      = [];
  dsaMergeLeft   = [];
  dsaMergeRight  = [];
  dsaMergePlacing= [];
  dsaFound       = -1;
  dsaDone        = false;
  comparisons    = 0;
  swaps          = 0;
  updateStats();
}

function initBFS() {
  resizeDSACanvas();
  const W = dsaCanvas.width, H = dsaCanvas.height;
  const cx = W / 2, cy = H / 2;
  const rad = Math.min(W, H) * 0.36;
  const nodeCount = 8;
  bfsNodes = {};
  for (let i = 0; i < nodeCount; i++) {
    const angle = (i / nodeCount) * Math.PI * 2 - Math.PI / 2;
    bfsNodes[i] = { x: cx + rad * Math.cos(angle), y: cy + rad * Math.sin(angle), id: i };
  }
  bfsGraph = {}; bfsEdges = [];
  for (let i = 0; i < nodeCount; i++) bfsGraph[i] = [];
  [[0,1],[0,2],[1,3],[1,4],[2,5],[3,6],[4,6],[5,7],[2,7],[0,7]].forEach(([a,b]) => {
    if (!bfsGraph[a].includes(b)) bfsGraph[a].push(b);
    if (!bfsGraph[b].includes(a)) bfsGraph[b].push(a);
    bfsEdges.push([a,b]);
  });
  bfsQueue=[]; bfsVisited=new Set(); bfsCurrentNode=-1; dsaDone=false;
}

function initStack() { stackData=[]; stackOp=''; stackHighlight=-1; dsaDone=false; }

function resizeDSACanvas() {
  const wrap = dsaCanvas.parentElement;
  dsaCanvas.width  = wrap.offsetWidth;
  dsaCanvas.height = wrap.offsetHeight;
}
window.addEventListener('resize', () => { resizeDSACanvas(); drawCurrentState(); });
setTimeout(() => { resizeDSACanvas(); }, 300);

function drawCurrentState() {
  if (!dsaCanvas.width) return;
  if (currentAlgo === 'bfs') drawBFSState();
  else if (currentAlgo === 'stack') drawStackState();
  else drawSortState();
}

// ---- DRAW: Sort bars ----
function drawSortState() {
  dCtx.clearRect(0, 0, dsaCanvas.width, dsaCanvas.height);
  if (!dsaArr.length) return;
  const W = dsaCanvas.width, H = dsaCanvas.height;
  const n = dsaArr.length;
  const gap = 2;
  const barW = Math.max(4, Math.floor((W - 40) / n) - gap);
  const maxVal = Math.max(...dsaArr, 1);
  const padX = 20, padY = 20;

  dsaArr.forEach((val, i) => {
    const barH = Math.max(4, (val / maxVal) * (H - padY * 2 - 30));
    const x = padX + i * (barW + gap);
    const y = H - padY - barH - 20;

    let fillColor, glowColor = null;

    if (dsaDone || dsaSorted.includes(i)) {
      fillColor = 'rgba(0,255,136,0.85)';  glowColor = '#00ff88';
    } else if (i === dsaFound) {
      fillColor = 'rgba(0,255,136,1)';     glowColor = '#00ff88';
    } else if (dsaMergePlacing.includes(i)) {
      fillColor = 'rgba(255,238,0,1)';     glowColor = '#ffee00';
    } else if (dsaMergeLeft.includes(i)) {
      fillColor = 'rgba(0,255,245,0.85)';  glowColor = '#00fff5';
    } else if (dsaMergeRight.includes(i)) {
      fillColor = 'rgba(157,0,255,0.85)';  glowColor = '#9d00ff';
    } else if (dsaHighlight.includes(i)) {
      fillColor = 'rgba(255,238,0,0.95)';  glowColor = '#ffee00';
    } else if (dsaCompared.includes(i)) {
      fillColor = 'rgba(255,0,170,0.9)';   glowColor = '#ff00aa';
    } else {
      fillColor = 'rgba(0,255,245,0.22)';
    }

    if (glowColor) { dCtx.shadowColor = glowColor; dCtx.shadowBlur = 10; }
    dCtx.fillStyle = fillColor;
    dCtx.fillRect(x, y, barW, barH);
    dCtx.shadowBlur = 0;

    if (barW >= 16) {
      dCtx.fillStyle = 'rgba(255,255,255,0.5)';
      dCtx.font = `${Math.min(10, barW - 2)}px Share Tech Mono`;
      dCtx.textAlign = 'center';
      dCtx.fillText(val, x + barW / 2, H - padY - 4);
    }
  });

  // Legends
  if (currentAlgo === 'merge') {
    const leg = [
      { c:'rgba(0,255,245,0.85)', l:'LEFT' },
      { c:'rgba(157,0,255,0.85)', l:'RIGHT' },
      { c:'rgba(255,238,0,1)',    l:'PLACING' },
      { c:'rgba(0,255,136,0.85)',l:'SORTED' }
    ];
    leg.forEach((e, li) => {
      const lx = 16 + li * 88;
      dCtx.fillStyle = e.c; dCtx.fillRect(lx, 10, 12, 10);
      dCtx.fillStyle = 'rgba(255,255,255,0.4)';
      dCtx.font = '9px Share Tech Mono'; dCtx.textAlign = 'left';
      dCtx.fillText(e.l, lx + 16, 20);
    });
  }
  if (currentAlgo === 'binary') {
    const leg = [
      { c:'rgba(0,255,245,0.7)', l:'RANGE' },
      { c:'rgba(255,238,0,0.95)',l:'MID' },
      { c:'rgba(0,255,136,1)',   l:'FOUND' }
    ];
    leg.forEach((e, li) => {
      const lx = 16 + li * 88;
      dCtx.fillStyle = e.c; dCtx.fillRect(lx, 10, 12, 10);
      dCtx.fillStyle = 'rgba(255,255,255,0.4)';
      dCtx.font = '9px Share Tech Mono'; dCtx.textAlign = 'left';
      dCtx.fillText(e.l, lx + 16, 20);
    });
  }
}

// ---- DRAW: BFS ----
function drawBFSState() {
  dCtx.clearRect(0, 0, dsaCanvas.width, dsaCanvas.height);
  if (!Object.keys(bfsNodes).length) return;

  bfsEdges.forEach(([a,b]) => {
    const isActive = bfsVisited.has(a) && bfsVisited.has(b);
    dCtx.beginPath();
    dCtx.moveTo(bfsNodes[a].x, bfsNodes[a].y);
    dCtx.lineTo(bfsNodes[b].x, bfsNodes[b].y);
    dCtx.strokeStyle = isActive ? 'rgba(0,255,245,0.5)' : 'rgba(255,255,255,0.1)';
    dCtx.lineWidth = isActive ? 2 : 1;
    dCtx.stroke();
  });

  if (bfsQueue.length) {
    dCtx.fillStyle = 'rgba(0,255,245,0.5)';
    dCtx.font = '10px Share Tech Mono'; dCtx.textAlign = 'left';
    dCtx.fillText('QUEUE: [' + bfsQueue.join(' → ') + ']', 20, 24);
  }

  Object.values(bfsNodes).forEach(n => {
    const isCurrent = n.id === bfsCurrentNode;
    const isVisited = bfsVisited.has(n.id);
    const inQueue   = bfsQueue.includes(n.id);
    const r = isCurrent ? 22 : 18;
    let fillColor, strokeColor;
    if (isCurrent)      { fillColor='rgba(255,238,0,0.3)';    strokeColor='#ffee00'; }
    else if (isVisited) { fillColor='rgba(0,255,136,0.2)';    strokeColor='#00ff88'; }
    else if (inQueue)   { fillColor='rgba(0,255,245,0.12)';   strokeColor='#00fff5'; }
    else                { fillColor='rgba(255,255,255,0.02)'; strokeColor='rgba(255,255,255,0.18)'; }

    dCtx.shadowColor = isCurrent ? '#ffee00' : isVisited ? '#00ff88' : 'transparent';
    dCtx.shadowBlur  = isCurrent ? 22 : isVisited ? 12 : 0;
    dCtx.beginPath(); dCtx.arc(n.x, n.y, r, 0, Math.PI*2);
    dCtx.fillStyle = fillColor; dCtx.fill();
    dCtx.strokeStyle = strokeColor; dCtx.lineWidth = 2; dCtx.stroke();
    dCtx.shadowBlur = 0;

    dCtx.fillStyle = isCurrent ? '#ffee00' : isVisited ? '#00ff88' : 'rgba(255,255,255,0.7)';
    dCtx.font = 'bold 13px Orbitron, monospace';
    dCtx.textAlign = 'center'; dCtx.textBaseline = 'middle';
    dCtx.fillText(n.id, n.x, n.y);
    dCtx.textBaseline = 'alphabetic';
  });
}

// ---- DRAW: Stack ----
function drawStackState() {
  dCtx.clearRect(0, 0, dsaCanvas.width, dsaCanvas.height);
  const W = dsaCanvas.width, H = dsaCanvas.height;
  const slotH = 44, slotW = 130;
  const maxVis = Math.floor((H - 60) / (slotH + 6));
  const x = W / 2 - slotW / 2;

  dCtx.font = '11px Share Tech Mono';
  dCtx.fillStyle = 'rgba(0,255,245,0.4)';
  dCtx.textAlign = 'left';
  dCtx.fillText('STACK (TOP → BOTTOM)', 20, 28);

  const vis = stackData.slice().reverse().slice(0, maxVis);
  vis.forEach((val, idx) => {
    const y = 50 + idx * (slotH + 6);
    const isTop = idx === 0;
    const isHL  = isTop && stackHighlight === 0;
    let fc, sc;
    if (isHL && stackOp.includes('PUSH'))  { fc='rgba(0,255,136,0.18)';   sc='#00ff88'; }
    else if (isHL && stackOp.includes('POP'))   { fc='rgba(255,0,170,0.18)';  sc='#ff00aa'; }
    else if (isHL && stackOp.includes('PEEK'))  { fc='rgba(255,238,0,0.18)';  sc='#ffee00'; }
    else if (isTop) { fc='rgba(0,255,245,0.1)';  sc='var(--cyan)'; }
    else            { fc='rgba(0,255,245,0.03)'; sc='rgba(0,255,245,0.15)'; }

    if (isHL) { dCtx.shadowColor = sc; dCtx.shadowBlur = 16; }
    dCtx.fillStyle = fc; dCtx.fillRect(x, y, slotW, slotH);
    dCtx.strokeStyle = sc; dCtx.lineWidth = isTop ? 1.5 : 1;
    dCtx.strokeRect(x, y, slotW, slotH);
    dCtx.shadowBlur = 0;

    dCtx.fillStyle = isTop ? '#00fff5' : 'rgba(255,255,255,0.6)';
    dCtx.font = isTop ? 'bold 14px Share Tech Mono' : '13px Share Tech Mono';
    dCtx.textAlign = 'center'; dCtx.textBaseline = 'middle';
    dCtx.fillText(val, x + slotW/2, y + slotH/2);
    dCtx.textBaseline = 'alphabetic';
    if (isTop) {
      dCtx.fillStyle = 'rgba(0,255,245,0.45)';
      dCtx.font = '9px Share Tech Mono'; dCtx.textAlign = 'left';
      dCtx.fillText('← TOP', x + slotW + 10, y + slotH/2 + 4);
    }
  });

  if (stackData.length === 0) {
    dCtx.fillStyle = 'rgba(255,255,255,0.2)'; dCtx.font = '12px Share Tech Mono';
    dCtx.textAlign = 'center'; dCtx.fillText('STACK IS EMPTY', W/2, H/2);
  }
  if (stackOp) {
    let oc = stackOp.includes('PUSH') ? 'rgba(0,255,136,0.8)' : stackOp.includes('POP') ? 'rgba(255,0,170,0.8)' : 'rgba(0,255,245,0.6)';
    dCtx.fillStyle = oc; dCtx.font = '12px Share Tech Mono';
    dCtx.textAlign = 'right'; dCtx.fillText(stackOp, W - 20, H - 20);
  }
}

// ---- LOG / STATS ----
function log(msg, type='') {
  const div = document.getElementById('dsaLog');
  const line = document.createElement('div');
  line.className = 'log-line' + (type ? ' log-'+type : '');
  const t = new Date().toLocaleTimeString('en-US',{hour12:false});
  line.textContent = `[${t}] ${msg}`;
  div.appendChild(line);
  div.scrollTop = div.scrollHeight;
}
function clearLog() {
  document.getElementById('dsaLog').innerHTML = '<div class="log-line">&gt; READY</div>';
}
function updateStats() {
  document.getElementById('cmpCount').textContent  = comparisons;
  document.getElementById('swapCount').textContent = swaps;
}
function setStatus(s) { document.getElementById('algoStatus').textContent = s; }

// ============================
// ---- ALGORITHM STEP BUILDERS
// ============================

// BUBBLE SORT — builds a flat array of steps (no generators!)
function buildBubbleSteps(input) {
  const arr = [...input];
  const n   = arr.length;
  const steps = [];
  for (let i = 0; i < n-1; i++) {
    for (let j = 0; j < n-i-1; j++) {
      const sortedSoFar = Array.from({length:i}, (_,k) => n-1-k);
      steps.push({ type:'compare', arr:[...arr], hi:[j,j+1], cmp:[j,j+1], sorted:sortedSoFar,
                   msg:`Compare arr[${j}]=${arr[j]} vs arr[${j+1}]=${arr[j+1]}` });
      if (arr[j] > arr[j+1]) {
        [arr[j], arr[j+1]] = [arr[j+1], arr[j]];
        steps.push({ type:'swap', arr:[...arr], hi:[j,j+1], cmp:[j,j+1], sorted:sortedSoFar,
                     msg:`Swap → arr[${j}]=${arr[j]}, arr[${j+1}]=${arr[j+1]}` });
      }
    }
    steps.push({ type:'pass', arr:[...arr], hi:[], cmp:[], sorted:Array.from({length:i+1},(_,k)=>n-1-k),
                 msg:`Pass ${i+1} done — index ${n-1-i} is sorted` });
  }
  steps.push({ type:'done', arr:[...arr], hi:[], cmp:[], sorted:Array.from({length:n},(_,k)=>k),
               msg:`Bubble Sort complete!` });
  return steps;
}

// MERGE SORT — distinct colors per region
function buildMergeSteps(input) {
  const arr   = [...input];
  const steps = [];

  function merge(a, lo, mid, hi) {
    const L = a.slice(lo, mid+1), R = a.slice(mid+1, hi+1);
    const leftIdx  = Array.from({length:mid-lo+1}, (_,k) => lo+k);
    const rightIdx = Array.from({length:hi-mid},   (_,k) => mid+1+k);
    steps.push({ type:'merge_start', arr:[...a], left:leftIdx, right:rightIdx, placing:[],
                 msg:`Merging [${lo}..${mid}] + [${mid+1}..${hi}]` });
    let i=0, j=0, k=lo;
    while (i<L.length && j<R.length) {
      steps.push({ type:'merge_cmp', arr:[...a], left:leftIdx.slice(i), right:rightIdx.slice(j), placing:[k],
                   msg:`Compare L[${i}]=${L[i]} vs R[${j}]=${R[j]}` });
      if (L[i]<=R[j]) a[k++]=L[i++]; else a[k++]=R[j++];
      steps.push({ type:'merge_place', arr:[...a], left:leftIdx.slice(i), right:rightIdx.slice(j), placing:[k-1],
                   msg:`Placed ${a[k-1]} → index ${k-1}` });
    }
    while (i<L.length) {
      a[k++]=L[i++];
      steps.push({ type:'merge_place', arr:[...a], left:[], right:[], placing:[k-1], msg:`Copy left → index ${k-1}` });
    }
    while (j<R.length) {
      a[k++]=R[j++];
      steps.push({ type:'merge_place', arr:[...a], left:[], right:[], placing:[k-1], msg:`Copy right → index ${k-1}` });
    }
  }
  function sort(a, lo, hi) {
    if (lo>=hi) return;
    const mid = Math.floor((lo+hi)/2);
    steps.push({ type:'divide', arr:[...a],
                 left:Array.from({length:mid-lo+1},(_,k)=>lo+k),
                 right:Array.from({length:hi-mid},(_,k)=>mid+1+k),
                 placing:[], msg:`Divide [${lo}..${hi}] → [${lo}..${mid}] | [${mid+1}..${hi}]` });
    sort(a, lo, mid); sort(a, mid+1, hi); merge(a, lo, mid, hi);
  }
  sort(arr, 0, arr.length-1);
  steps.push({ type:'done', arr:[...arr], left:[], right:[], placing:[], sorted:Array.from({length:arr.length},(_,k)=>k),
               msg:'Merge Sort complete!' });
  return steps;
}

// BINARY SEARCH
function buildBinarySteps(input, target) {
  const arr = [...input].sort((a,b)=>a-b);
  const steps = [];
  steps.push({ type:'init', arr:[...arr], lo:0, hi:arr.length-1, mid:-1, found:-1,
               msg:`Array sorted. Searching for ${target}` });
  let lo=0, hi=arr.length-1;
  while (lo<=hi) {
    const mid = Math.floor((lo+hi)/2);
    steps.push({ type:'step', arr:[...arr], lo, hi, mid, found:-1,
                 msg:`lo=${lo} mid=${mid} hi=${hi} | arr[mid]=${arr[mid]}` });
    if (arr[mid]===target) {
      steps.push({ type:'found', arr:[...arr], lo, hi, mid, found:mid, msg:`FOUND ${target} at index ${mid}! 🎯` });
      return steps;
    } else if (arr[mid]<target) { lo=mid+1; }
    else                         { hi=mid-1; }
  }
  steps.push({ type:'notfound', arr:[...arr], lo:0, hi:arr.length-1, mid:-1, found:-1,
               msg:`${target} not found in array` });
  return steps;
}

// BFS
function buildBFSSteps() {
  const steps=[], visited=new Set(), queue=[0];
  visited.add(0);
  steps.push({ type:'start', node:0, visited:new Set(visited), queue:[...queue], msg:'BFS start from node 0' });
  while (queue.length) {
    const node=queue.shift();
    steps.push({ type:'process', node, visited:new Set(visited), queue:[...queue], msg:`Processing node ${node}` });
    for (const nb of bfsGraph[node]) {
      if (!visited.has(nb)) {
        visited.add(nb); queue.push(nb);
        steps.push({ type:'enqueue', node:nb, from:node, visited:new Set(visited), queue:[...queue],
                     msg:`Enqueue ${nb} (neighbour of ${node})` });
      }
    }
  }
  steps.push({ type:'done', node:-1, visited:new Set(visited), queue:[], msg:`BFS done — visited all ${visited.size} nodes` });
  return steps;
}

// STACK
function buildStackSteps() {
  const vals=[42,17,88,5,63,29];
  return [
    ...vals.map(v => ({ type:'push', val:v, msg:`push(${v})` })),
    { type:'peek', msg:'peek()' },
    { type:'pop',  msg:'pop()' },
    { type:'pop',  msg:'pop()' },
    { type:'push', val:99,  msg:'push(99)' },
    { type:'push', val:7,   msg:'push(7)' },
    { type:'peek', msg:'peek()' },
    { type:'pop',  msg:'pop()' },
    { type:'done', msg:'Stack simulation complete!' }
  ];
}

// ============================
// ---- RUNNERS
// ============================

function runAlgo() {
  if (animRunning) return;
  clearLog(); setStatus('RUNNING');
  animRunning = true;
  document.getElementById('dsaPlay').disabled = true;
  comparisons=0; swaps=0; updateStats();

  if      (currentAlgo==='bubble') runBubble();
  else if (currentAlgo==='merge')  runMerge();
  else if (currentAlgo==='binary') runBinarySearch();
  else if (currentAlgo==='bfs')    runBFS();
  else if (currentAlgo==='stack')  runStack();
}

function playSteps(steps, applyStep, onDone) {
  let si = 0;
  function tick() {
    if (si >= steps.length) { onDone(); return; }
    applyStep(steps[si++]);
    animTimer = setTimeout(tick, getSpeed());
  }
  tick();
}

function finishRun(msg) {
  animRunning = false;
  document.getElementById('dsaPlay').disabled = false;
  setStatus('DONE');
  if (msg) log('> ' + msg, 'success');
}

// --- Bubble ---
function runBubble() {
  log('> Bubble Sort on ' + dsaArr.length + ' elements');
  const steps = buildBubbleSteps(dsaArr);
  playSteps(steps, s => {
    dsaArr      = [...s.arr];
    dsaHighlight= s.hi  || [];
    dsaCompared = s.cmp || [];
    dsaSorted   = s.sorted || [];
    dsaDone     = s.type==='done';
    if (s.type==='swap')  { swaps++;       updateStats(); }
    if (s.type==='compare') { comparisons++; updateStats(); }
    if (s.msg) log('> '+s.msg);
    drawSortState();
  }, () => finishRun(`Complete! Comparisons: ${comparisons}, Swaps: ${swaps}`));
}

// --- Merge ---
function runMerge() {
  log('> Merge Sort on ' + dsaArr.length + ' elements');
  const steps = buildMergeSteps(dsaArr);
  playSteps(steps, s => {
    dsaArr          = [...s.arr];
    dsaMergeLeft    = s.left    || [];
    dsaMergeRight   = s.right   || [];
    dsaMergePlacing = s.placing || [];
    dsaHighlight    = [];
    dsaCompared     = [];
    dsaSorted       = s.sorted  || [];
    dsaDone         = s.type==='done';
    if (s.type==='merge_cmp')   { comparisons++; updateStats(); }
    if (s.type==='merge_place') { swaps++;        updateStats(); }
    if (s.msg) log('> '+s.msg);
    drawSortState();
  }, () => finishRun('Merge Sort complete!'));
}

// --- Binary Search ---
function runBinarySearch() {
  let target = parseInt(document.getElementById('dsaSearchVal').value);
  if (isNaN(target)) {
    target = dsaArr[Math.floor(Math.random() * dsaArr.length)];
    document.getElementById('dsaSearchVal').value = target;
  }
  log('> Binary Search for: ' + target);
  const steps = buildBinarySteps(dsaArr, target);
  playSteps(steps, s => {
    dsaArr      = [...s.arr];
    dsaHighlight= s.mid >= 0 ? [s.mid] : [];
    dsaCompared = (s.lo !== undefined && s.hi !== undefined)
                  ? Array.from({length: s.hi-s.lo+1}, (_,k) => s.lo+k) : [];
    dsaFound    = s.found;
    comparisons++; updateStats();
    if (s.msg) log('> '+s.msg, s.type==='found' ? 'success' : s.type==='notfound' ? 'warn' : '');
    drawSortState();
    if (s.type==='found' || s.type==='notfound') {
      finishRun(null); setStatus(s.type==='found' ? 'FOUND ✓' : 'NOT FOUND');
      return;
    }
  }, () => finishRun(null));
}

// --- BFS ---
function runBFS() {
  initBFS();
  log('> BFS traversal from node 0');
  const steps = buildBFSSteps();
  playSteps(steps, s => {
    if (s.visited)  bfsVisited    = s.visited;
    if (s.queue)    bfsQueue      = s.queue;
    bfsCurrentNode = (s.node !== undefined) ? s.node : -1;
    if (s.type==='done') bfsCurrentNode = -1;
    comparisons++; updateStats();
    if (s.msg) log('> '+s.msg, s.type==='done'?'success':'');
    drawBFSState();
  }, () => finishRun('BFS complete! Visited all nodes'));
}

// --- Stack ---
function runStack() {
  initStack();
  log('> Stack simulation — push/pop/peek');
  const steps = buildStackSteps();
  const localStack = [];
  playSteps(steps, s => {
    stackHighlight = -1;
    if (s.type==='push') {
      localStack.push(s.val); stackOp=`PUSH(${s.val})`; stackHighlight=0; swaps++; updateStats();
    } else if (s.type==='pop') {
      const p=localStack.pop(); stackOp=`POP → ${p}`; stackHighlight=0; comparisons++; updateStats();
    } else if (s.type==='peek') {
      stackOp=`PEEK → ${localStack[localStack.length-1]}`; stackHighlight=0;
    } else if (s.type==='done') {
      stackOp='COMPLETE';
    }
    stackData = [...localStack];
    if (s.msg) log('> '+s.msg, s.type==='done'?'success':'');
    drawStackState();
  }, () => finishRun('Stack simulation complete!'));
}

// ============================
// ---- RESET
// ============================
function resetDSA() {
  if (animTimer) clearTimeout(animTimer);
  animRunning = false;
  document.getElementById('dsaPlay').disabled = false;
  initDSAState();
  dsaMergeLeft=[]; dsaMergeRight=[]; dsaMergePlacing=[];
  if (currentAlgo==='bfs')   { initBFS();   drawBFSState();   }
  else if (currentAlgo==='stack') { initStack(); drawStackState(); }
  else drawSortState();
  clearLog(); setStatus('IDLE');
  comparisons=0; swaps=0; updateStats();
}

// ============================
// ---- ALGO SELECTOR
// ============================
document.querySelectorAll('.dsa-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    if (animTimer) clearTimeout(animTimer);
    animRunning = false;
    document.getElementById('dsaPlay').disabled = false;
    document.querySelectorAll('.dsa-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentAlgo = btn.dataset.algo;
    document.getElementById('dsaAlgoName').textContent    = algoNames[currentAlgo];
    document.getElementById('dsaTimeComp').textContent    = complexities[currentAlgo].time;
    document.getElementById('dsaSpaceComp').textContent   = complexities[currentAlgo].space;
    document.getElementById('dsaPseudo').innerHTML        = pseudocodes[currentAlgo];
    document.getElementById('dsaInputWrap').style.display = currentAlgo==='binary' ? 'flex' : 'none';
    resetDSA();
  });
});

document.getElementById('dsaPlay').addEventListener('click', runAlgo);
document.getElementById('dsaReset').addEventListener('click', resetDSA);

// Init DSA on page load
setTimeout(() => {
  resizeDSACanvas();
  initDSAState();
  document.getElementById('dsaPseudo').innerHTML        = pseudocodes.bubble;
  document.getElementById('dsaInputWrap').style.display = 'none';
  drawSortState();
}, 700);

// ===== CORNER DECORATIONS =====
['tl','tr','bl','br'].forEach(pos => {
  const d = document.createElement('div');
  d.className = `corner-decorator corner-${pos}`;
  document.body.appendChild(d);
});
