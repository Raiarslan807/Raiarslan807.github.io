
/* ── 1. AURORA BACKGROUND ── */
(function initAurora() {
  const canvas = document.getElementById('aurora');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let W, H;
  const resize = () => {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  };
  resize();
  window.addEventListener('resize', resize);

  // Orbs
  const orbs = [
    { x: 0.15, y: 0.2,  r: 0.45, hue: 260, speed: 0.0003, amp: 0.06 },
    { x: 0.75, y: 0.35, r: 0.5,  hue: 300, speed: 0.0004, amp: 0.08 },
    { x: 0.5,  y: 0.75, r: 0.4,  hue: 220, speed: 0.00025,amp: 0.05 },
    { x: 0.85, y: 0.8,  r: 0.35, hue: 330, speed: 0.00035,amp: 0.07 },
  ];

  let t = 0;
  function draw() {
    ctx.clearRect(0, 0, W, H);
    orbs.forEach(o => {
      const cx = (o.x + Math.sin(t * o.speed * 1000 + o.hue) * o.amp) * W;
      const cy = (o.y + Math.cos(t * o.speed * 1000 + o.hue) * o.amp) * H;
      const r  = o.r * Math.min(W, H);
      const g  = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
      g.addColorStop(0,   `hsla(${o.hue},80%,55%,0.18)`);
      g.addColorStop(0.5, `hsla(${o.hue},70%,45%,0.07)`);
      g.addColorStop(1,   `hsla(${o.hue},60%,40%,0)`);
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fillStyle = g;
      ctx.fill();
    });
    t = performance.now();
    requestAnimationFrame(draw);
  }
  draw();
})();


/* ── 2. CUSTOM CURSOR ── */
(function initCursor() {
  const cursor = document.getElementById('cursor');
  const trail  = document.getElementById('cursorTrail');
  if (!cursor || !trail) return;

  let mx = -100, my = -100;

  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    cursor.style.left = mx + 'px';
    cursor.style.top  = my + 'px';
  });

  // Trail lags behind
  let tx = -100, ty = -100;
  function animTrail() {
    tx += (mx - tx) * 0.14;
    ty += (my - ty) * 0.14;
    trail.style.left = tx + 'px';
    trail.style.top  = ty + 'px';
    requestAnimationFrame(animTrail);
  }
  animTrail();
})();


/* ── 3. NAVBAR — scroll + active link ── */
(function initNavbar() {
  const navbar = document.getElementById('navbar');
  const links  = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);

    // Highlight active section link
    const scrollMid = window.scrollY + window.innerHeight * 0.4;
    document.querySelectorAll('section[id]').forEach(sec => {
      if (scrollMid >= sec.offsetTop && scrollMid < sec.offsetTop + sec.offsetHeight) {
        links.forEach(l => {
          l.classList.toggle('active', l.dataset.section === sec.id);
        });
      }
    });
  }, { passive: true });

  // Mobile burger
  const burger  = document.getElementById('burger');
  const navMenu = document.getElementById('navMenu');
  burger.addEventListener('click', () => {
    burger.classList.toggle('open');
    navMenu.classList.toggle('open');
  });
  navMenu.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      burger.classList.remove('open');
      navMenu.classList.remove('open');
    });
  });
})();


/* ── 4. SCROLL REVEAL ── */
(function initReveal() {
  const els = document.querySelectorAll('[data-reveal]');
  if (!els.length) return;

  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el    = entry.target;
      const delay = parseInt(el.dataset.delay || 0);
      setTimeout(() => el.classList.add('visible'), delay);
      obs.unobserve(el);
    });
  }, { threshold: 0.12 });

  els.forEach(el => obs.observe(el));
})();


/* ── 5. SKILL BAR ANIMATION ── */
(function initSkillBars() {
  const fills = document.querySelectorAll('.st-fill');
  if (!fills.length) return;

  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const fill = entry.target;
      const w    = fill.dataset.w || '0';
      // Slight delay so user sees the bar animate
      setTimeout(() => { fill.style.width = w + '%'; }, 200);
      obs.unobserve(fill);
    });
  }, { threshold: 0.4 });

  fills.forEach(f => obs.observe(f));
})();


/* ── 6. TYPING EFFECT on hero heading ── */
(function initTyping() {
  const target = document.querySelector('.hero-heading');
  if (!target) return;

  // Soft fade-in stagger on each .line
  const lines = target.querySelectorAll('.line');
  lines.forEach((line, i) => {
    line.style.opacity = '0';
    line.style.transform = 'translateY(20px)';
    line.style.transition = `opacity .7s ease ${i * 0.2}s, transform .7s ease ${i * 0.2}s`;
  });

  // Trigger after a tick so transition is picked up
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      lines.forEach(line => {
        line.style.opacity = '1';
        line.style.transform = 'none';
      });
    });
  });
})();


/* ── 7. CONTACT FORM ── */
(function initForm() {
  const form   = document.getElementById('contactForm');
  const status = document.getElementById('formStatus');
  const btn    = document.getElementById('sendBtn');
  if (!form) return;

  form.addEventListener('submit', function(e) {
    e.preventDefault();

    // Basic validation
    const name    = form.fname.value.trim();
    const email   = form.femail.value.trim();
    const message = form.fmsg.value.trim();

    if (!name || !email || !message) {
      status.textContent = '⚠ Please fill in all required fields.';
      status.style.color = '#f87171';
      return;
    }

    const emailRx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRx.test(email)) {
      status.textContent = '⚠ Please enter a valid email address.';
      status.style.color = '#f87171';
      return;
    }

    // Simulate send
    btn.disabled = true;
    btn.querySelector('.btn-text').textContent = 'Sending…';
    btn.querySelector('.btn-icon').className = 'fas fa-spinner fa-spin btn-icon';

    setTimeout(() => {
      btn.querySelector('.btn-text').textContent = 'Message Sent!';
      btn.querySelector('.btn-icon').className = 'fas fa-check btn-icon';
      status.textContent = '✅ Thank you! I\'ll get back to you soon.';
      status.style.color = '#4ade80';

      setTimeout(() => {
        form.reset();
        btn.disabled = false;
        btn.querySelector('.btn-text').textContent = 'Send Message';
        btn.querySelector('.btn-icon').className = 'fas fa-paper-plane btn-icon';
        status.textContent = '';
      }, 3500);
    }, 1600);
  });
})();


/* ── 8. SMOOTH ANCHOR SCROLL (offset for fixed nav) ── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const navH = document.getElementById('navbar')?.offsetHeight || 72;
    const top  = target.getBoundingClientRect().top + window.scrollY - navH;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});
