'use strict';

// lil toggle util
const toggler = el => el.classList.toggle('active');

// sidebar open/close (mobile)
const sidebar = document.querySelector('[data-sidebar]');
const sidebarBtn = document.querySelector('[data-sidebar-btn]');
if (sidebarBtn) sidebarBtn.addEventListener('click', () => toggler(sidebar));

// dropdown filter select
const sel = document.querySelector('[data-select]');
const selItems = document.querySelectorAll('[data-select-item]');
const selVal = document.querySelector('[data-selecct-value]');
const filterBtns = document.querySelectorAll('[data-filter-btn]');

if (sel) sel.addEventListener('click', function() { toggler(this); });

const doFilter = val => {
  document.querySelectorAll('[data-filter-item]').forEach(item => {
    if (val === 'all' || val === item.dataset.category) {
      item.classList.add('active');
    } else {
      item.classList.remove('active');
    }
  });
};

selItems.forEach(item => {
  item.addEventListener('click', function() {
    let v = this.innerText.toLowerCase();
    if (selVal) selVal.innerText = this.innerText;
    toggler(sel);
    doFilter(v);
  });
});

let lastBtn = filterBtns[0];
filterBtns.forEach(btn => {
  btn.addEventListener('click', function() {
    let v = this.innerText.toLowerCase();
    if (selVal) selVal.innerText = this.innerText;
    doFilter(v);
    if (lastBtn) lastBtn.classList.remove('active');
    this.classList.add('active');
    lastBtn = this;
  });
});

// tab nav
const navLinks = document.querySelectorAll('[data-nav-link]');
const pages = document.querySelectorAll('[data-page]');

navLinks.forEach((link, i) => {
  link.addEventListener('click', function() {
    let name = this.innerHTML.toLowerCase();
    pages.forEach((pg, j) => {
      if (pg.dataset.page === name) {
        pg.classList.add('active');
        pg.classList.remove('page-enter');
        void pg.offsetWidth; // reflow to restart animation
        pg.classList.add('page-enter');
        navLinks[j].classList.add('active');
        window.scrollTo(0, 0);
        // trigger skill bars if switching to skills
        if (name === 'skills') animateSkillBars();
      } else {
        pg.classList.remove('active');
        navLinks[j].classList.remove('active');
      }
    });
  });
});

// vid lightbox
const modal = document.getElementById('videoModal');
const modalVid = document.getElementById('modalVideo');
const modalTitle = document.getElementById('videoTitle');
const videoOverlay = document.getElementById('videoOverlay');
const videoClose = document.getElementById('videoClose');

function openVideo(src, title) {
  if (!modal) return;
  modalVid.src = src;
  if (modalTitle) modalTitle.textContent = title || '';
  modal.classList.add('active');
  modalVid.play().catch(() => {});
}

function closeVideo() {
  if (!modal) return;
  modal.classList.remove('active');
  modalVid.pause();
  modalVid.src = '';
}

document.querySelectorAll('.proj-btn').forEach(btn => {
  btn.addEventListener('click', function() {
    let src = this.dataset.video;
    let title = this.dataset.title;
    if (src) openVideo(src, title);
  });
});

if (videoOverlay) videoOverlay.addEventListener('click', closeVideo);
if (videoClose) videoClose.addEventListener('click', closeVideo);

document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && modal && modal.classList.contains('active')) closeVideo();
});

// copy discord tag + show toast
const toast = document.getElementById('toastMsg');

function showToast(msg) {
  if (!toast) return;
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2200);
}

document.querySelectorAll('.copy-discord').forEach(btn => {
  btn.addEventListener('click', function() {
    let txt = this.dataset.copy || 'kungfupandamaster';
    navigator.clipboard.writeText(txt).then(() => {
      showToast('Discord tag copied!');
    }).catch(() => {
      // fallback
      let ta = document.createElement('textarea');
      ta.value = txt;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      showToast('Discord tag copied!');
    });
  });
});

// footer year
let yr = document.getElementById('yr');
if (yr) yr.textContent = new Date().getFullYear();


/* ---- effects ---- */

// cursor glow
const glow = document.createElement('div');
glow.id = 'cursor-glow';
document.body.appendChild(glow);
let mx = -999, my = -999;
document.addEventListener('mousemove', e => {
  mx = e.clientX; my = e.clientY;
  glow.style.left = mx + 'px';
  glow.style.top  = my + 'px';
});

// particle canvas
(function() {
  const cv = document.createElement('canvas');
  cv.id = 'particles-canvas';
  document.body.appendChild(cv);
  const ctx = cv.getContext('2d');

  let W, H, pts = [];

  function resize() {
    W = cv.width  = window.innerWidth;
    H = cv.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  const COUNT = 55;
  for (let i = 0; i < COUNT; i++) {
    pts.push({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      r: 0.8 + Math.random() * 1.4,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
      o: 0.2 + Math.random() * 0.5
    });
  }

  const LINK_DIST = 130;
  const COLORS = ['hsla(262,83%,66%,', 'hsla(330,81%,61%,'];

  function draw() {
    ctx.clearRect(0, 0, W, H);
    // lines between close pts + to cursor
    for (let i = 0; i < pts.length; i++) {
      let p = pts[i];
      // to cursor
      let dx = mx - p.x, dy = my - p.y;
      let d = Math.sqrt(dx*dx + dy*dy);
      if (d < 160) {
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(mx, my);
        ctx.strokeStyle = 'hsla(262,83%,66%,' + (0.18 * (1 - d/160)) + ')';
        ctx.lineWidth = 0.6;
        ctx.stroke();
      }
      // between pts
      for (let j = i+1; j < pts.length; j++) {
        let q = pts[j];
        let ddx = p.x - q.x, ddy = p.y - q.y;
        let dd = Math.sqrt(ddx*ddx + ddy*ddy);
        if (dd < LINK_DIST) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(q.x, q.y);
          ctx.strokeStyle = 'hsla(262,83%,66%,' + (0.12 * (1 - dd/LINK_DIST)) + ')';
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
    // dots
    pts.forEach((p, idx) => {
      let col = COLORS[idx % 2];
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = col + p.o + ')';
      ctx.fill();
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0) p.x = W;
      if (p.x > W) p.x = 0;
      if (p.y < 0) p.y = H;
      if (p.y > H) p.y = 0;
    });
    requestAnimationFrame(draw);
  }
  draw();
})();

// skill bars animate in
function animateSkillBars() {
  document.querySelectorAll('.skill-progress-fill').forEach(bar => {
    // store target width from inline style
    let target = bar.style.width || bar.getAttribute('style')?.match(/width:\s*([\d.]+%)/)?.[1] || '0%';
    bar.style.setProperty('--skill-w', target);
    bar.classList.remove('animated');
    void bar.offsetWidth;
    bar.classList.add('animated');
  });
}

// run skill bars if about tab starts active on load
// (they're on skills tab, so not needed at load — but prep the css vars)
document.querySelectorAll('.skill-progress-fill').forEach(bar => {
  let m = (bar.getAttribute('style') || '').match(/width:\s*([\d.]+%)/);
  if (m) bar.style.setProperty('--skill-w', m[1]);
});

// typewriter on name
(function() {
  const nameEl = document.querySelector('.sidebar .name');
  if (!nameEl) return;
  const txt = nameEl.textContent.trim();
  nameEl.textContent = '';
  const cursor = document.createElement('span');
  cursor.className = 'name-cursor';
  nameEl.appendChild(cursor);
  let i = 0;
  function type() {
    if (i < txt.length) {
      nameEl.insertBefore(document.createTextNode(txt[i]), cursor);
      i++;
      setTimeout(type, 75 + Math.random() * 55);
    }
    // cursor stays blinking after done
  }
  setTimeout(type, 400);
})();
