/* mint.devv — script.js */

/* === NAV SCROLL BEHAVIOR ==================================== */
(function () {
  const nav = document.getElementById('nav');
  const toggle = document.getElementById('menuToggle');
  const mobileMenu = document.getElementById('mobileMenu');

  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 20);
  }, { passive: true });

  if (toggle && mobileMenu) {
    toggle.addEventListener('click', () => {
      const open = mobileMenu.classList.toggle('open');
      toggle.classList.toggle('open', open);
      mobileMenu.setAttribute('aria-hidden', String(!open));
    });
    mobileMenu.querySelectorAll('.nav__mobile-link').forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.remove('open');
        toggle.classList.remove('open');
        mobileMenu.setAttribute('aria-hidden', 'true');
      });
    });
  }
})();

/* === CURSOR GLOW ============================================ */
(function () {
  const glow = document.getElementById('cursorGlow');
  if (!glow || window.matchMedia('(pointer: coarse)').matches) {
    if (glow) glow.style.display = 'none';
    return;
  }
  let mx = -999, my = -999;
  let cx = -999, cy = -999;
  let raf;

  window.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; }, { passive: true });

  function animate() {
    cx += (mx - cx) * 0.08;
    cy += (my - cy) * 0.08;
    glow.style.left = cx + 'px';
    glow.style.top  = cy + 'px';
    raf = requestAnimationFrame(animate);
  }
  animate();
})();

/* === CANVAS PARTICLES ======================================= */
(function () {
  const canvas = document.getElementById('particles');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let W, H, particles = [];

  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }
  window.addEventListener('resize', resize, { passive: true });
  resize();

  const COUNT = 80;
  const COLORS = ['rgba(139,92,246,', 'rgba(236,72,153,', 'rgba(167,139,250,'];

  function randomParticle() {
    return {
      x: Math.random() * W,
      y: Math.random() * H,
      r: Math.random() * 1.5 + 0.4,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      alpha: Math.random() * 0.6 + 0.1,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      twinkleSpeed: Math.random() * 0.02 + 0.005,
      twinklePhase: Math.random() * Math.PI * 2
    };
  }

  for (let i = 0; i < COUNT; i++) particles.push(randomParticle());

  let frame = 0;
  function draw() {
    ctx.clearRect(0, 0, W, H);
    frame++;
    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.twinklePhase += p.twinkleSpeed;

      if (p.x < 0) p.x = W;
      if (p.x > W) p.x = 0;
      if (p.y < 0) p.y = H;
      if (p.y > H) p.y = 0;

      const alpha = p.alpha * (0.5 + 0.5 * Math.sin(p.twinklePhase));
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.color + alpha + ')';
      ctx.fill();
    });
    requestAnimationFrame(draw);
  }
  draw();
})();

/* === REVEAL ON SCROLL ======================================= */
(function () {
  const reveals = document.querySelectorAll('.reveal');
  if (!reveals.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  reveals.forEach(el => observer.observe(el));
})();

/* === SKILL BAR ANIMATION ==================================== */
(function () {
  const skillItems = document.querySelectorAll('.skill-item');
  if (!skillItems.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const idx = Array.from(skillItems).indexOf(entry.target);
        setTimeout(() => {
          entry.target.classList.add('is-visible');
        }, idx * 60);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  skillItems.forEach(el => observer.observe(el));
})();

/* === TYPING ANIMATION ======================================= */
(function () {
  const target = document.getElementById('typingTarget');
  const cursor = document.getElementById('typingCursor');
  if (!target || !cursor) return;

  const words = ['worlds.', 'games.', 'systems.', 'experiences.'];
  let wordIdx = 0;
  let charIdx = words[0].length; // start full
  let deleting = false;
  let pauseTimer = null;

  // Hide cursor until hero is visible
  cursor.style.opacity = '0';
  setTimeout(() => { cursor.style.opacity = '1'; }, 1500);

  function type() {
    const word = words[wordIdx];

    if (!deleting) {
      target.textContent = word.slice(0, charIdx);
      if (charIdx === word.length) {
        // Pause before deleting
        deleting = true;
        pauseTimer = setTimeout(type, 2200);
        return;
      }
      charIdx++;
      setTimeout(type, 95);
    } else {
      target.textContent = word.slice(0, charIdx);
      if (charIdx === 0) {
        deleting = false;
        wordIdx = (wordIdx + 1) % words.length;
        setTimeout(type, 400);
        return;
      }
      charIdx--;
      setTimeout(type, 55);
    }
  }

  // Start typing after a short delay on page load
  setTimeout(type, 2000);
})();

/* === DISCORD COPY =========================================== */
(function () {
  const btn = document.getElementById('discordCopy');
  const val = document.getElementById('discordValue');
  if (!btn || !val) return;

  btn.addEventListener('click', async () => {
    const text = 'kungfupandamaster';
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
    }
    val.textContent = 'Copied!';
    btn.classList.add('copied');
    setTimeout(() => {
      val.textContent = text;
      btn.classList.remove('copied');
    }, 2000);
  });
})();

/* === ACTIVE NAV HIGHLIGHT =================================== */
(function () {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav__link:not(.nav__link--cta)');
  if (!sections.length || !navLinks.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(link => {
          const active = link.getAttribute('href') === `#${entry.target.id}`;
          link.style.color = active ? 'var(--color-text)' : '';
        });
      }
    });
  }, { rootMargin: '-40% 0px -50% 0px' });

  sections.forEach(s => observer.observe(s));
})();
