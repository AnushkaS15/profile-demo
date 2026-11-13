/* ============================================================
   ANUSHKA PORTFOLIO — script.js
   ============================================================ */

'use strict';

/* ── LOADER ─────────────────────────────────────────────────── */
window.addEventListener('load', () => {
  const loader = document.getElementById('loader');
  setTimeout(() => {
    loader.classList.add('hidden');
    document.body.style.overflow = '';
    initAnimations();
  }, 2000);
});

document.body.style.overflow = 'hidden';

/* ── CUSTOM CURSOR ───────────────────────────────────────────── */
(function initCursor() {
  const cursor   = document.getElementById('cursor');
  const follower = document.getElementById('cursor-follower');
  if (!cursor || !follower) return;

  let mx = 0, my = 0, fx = 0, fy = 0;

  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    cursor.style.left = mx + 'px';
    cursor.style.top  = my + 'px';
  });

  function animateFollower() {
    fx += (mx - fx) * 0.12;
    fy += (my - fy) * 0.12;
    follower.style.left = fx + 'px';
    follower.style.top  = fy + 'px';
    requestAnimationFrame(animateFollower);
  }
  animateFollower();

  const hovers = document.querySelectorAll('a, button, .skill-card, .folder-card, .about-photo-frame, .polaroid');
  hovers.forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.classList.add('expanded');
      follower.classList.add('expanded');
    });
    el.addEventListener('mouseleave', () => {
      cursor.classList.remove('expanded');
      follower.classList.remove('expanded');
    });
  });
})();

/* ── SCROLL PROGRESS ─────────────────────────────────────────── */
function updateScrollProgress() {
  const bar  = document.getElementById('scrollProgress');
  if (!bar) return;
  const total  = document.documentElement.scrollHeight - window.innerHeight;
  const pct    = total > 0 ? (window.scrollY / total) * 100 : 0;
  bar.style.width = pct + '%';
}

/* ── NAV SCROLL BEHAVIOUR ───────────────────────────────────── */
function updateNav() {
  const nav = document.getElementById('nav');
  if (!nav) return;
  if (window.scrollY > 60) {
    nav.classList.add('scrolled');
  } else {
    nav.classList.remove('scrolled');
  }
}

window.addEventListener('scroll', () => {
  updateScrollProgress();
  updateNav();
}, { passive: true });

/* ── HAMBURGER / MOBILE MENU ────────────────────────────────── */
(function initMobileMenu() {
  const burger = document.getElementById('hamburger');
  const menu   = document.getElementById('mobileMenu');
  if (!burger || !menu) return;

  burger.addEventListener('click', () => {
    const isOpen = menu.classList.toggle('open');
    burger.classList.toggle('open', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  document.querySelectorAll('.mobile-link').forEach(link => {
    link.addEventListener('click', () => {
      menu.classList.remove('open');
      burger.classList.remove('open');
      document.body.style.overflow = '';
    });
  });
})();

/* ── SMOOTH SCROLL for all nav anchors ─────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

/* ── INTERSECTION OBSERVER — fade-in ───────────────────────── */
function initFadeIns() {
  const els = document.querySelectorAll('.fade-in');
  const io  = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        const delay = entry.target.dataset.delay || 0;
        setTimeout(() => entry.target.classList.add('visible'), delay * 80);
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  els.forEach((el, i) => {
    el.dataset.delay = i % 6; // stagger within viewport batch
    io.observe(el);
  });
}

/* ── SKILL BARS ─────────────────────────────────────────────── */
function initSkillBars() {
  const fills = document.querySelectorAll('.skill-fill');
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const w = entry.target.dataset.width || 0;
        entry.target.style.width = w + '%';
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });
  fills.forEach(f => io.observe(f));
}

/* ── FOLDER CARD OPEN EFFECT ────────────────────────────────── */
function initFolderCards() {
  document.querySelectorAll('.folder-card').forEach(card => {
    const tab = card.querySelector('.folder-tab');
    if (!tab) return;

    card.addEventListener('mouseenter', () => {
      tab.style.transform = 'translateY(-3px)';
      tab.style.transition = 'transform 0.3s cubic-bezier(0.16,1,0.3,1)';
    });
    card.addEventListener('mouseleave', () => {
      tab.style.transform = 'translateY(0)';
    });
  });
}

/* ── ACHIEVEMENT ROW HOVER ──────────────────────────────────── */
function initAchievementHover() {
  document.querySelectorAll('.achievement-row').forEach(row => {
    row.addEventListener('mouseenter', () => {
      row.querySelector('.ach-num').style.color = 'var(--gold)';
    });
    row.addEventListener('mouseleave', () => {
      row.querySelector('.ach-num').style.color = '';
    });
  });
}

/* ── CONTACT FORM ───────────────────────────────────────────── */
function initContactForm() {
  const form    = document.getElementById('contactForm');
  const success = document.getElementById('formSuccess');
  if (!form) return;

  form.addEventListener('submit', e => {
    e.preventDefault();

    const name    = form.name.value.trim();
    const email   = form.email.value.trim();
    const message = form.message.value.trim();

    if (!name || !email || !message) {
      shakeBtnSend(form.querySelector('.btn-send'));
      return;
    }

    // Simulate async send
    const btn  = form.querySelector('.btn-send');
    const text = btn.querySelector('.btn-send-text');
    text.textContent = 'Sending…';
    btn.disabled = true;

    setTimeout(() => {
      text.textContent = 'Send Message';
      btn.disabled = false;
      form.reset();
      success.classList.add('show');
      setTimeout(() => success.classList.remove('show'), 4000);
    }, 1400);
  });
}

function shakeBtnSend(btn) {
  if (!btn) return;
  btn.style.animation = 'shake 0.4s ease';
  btn.addEventListener('animationend', () => btn.style.animation = '', { once: true });
}

/* inject shake keyframe dynamically */
(function injectShake() {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes shake {
      0%,100% { transform: translateX(0); }
      20%      { transform: translateX(-6px); }
      40%      { transform: translateX(6px); }
      60%      { transform: translateX(-4px); }
      80%      { transform: translateX(4px); }
    }`;
  document.head.appendChild(style);
})();

/* ── HERO TITLE PARALLAX ────────────────────────────────────── */
function initParallax() {
  const title = document.querySelector('.hero-title');
  if (!title) return;
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    title.style.transform = `translateY(${y * 0.18}px)`;
  }, { passive: true });
}

/* ── SECTION ACTIVE NAV LINK ────────────────────────────────── */
function initActiveNav() {
  const sections  = document.querySelectorAll('section[id]');
  const navLinks  = document.querySelectorAll('.nav-link');

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(link => {
          link.classList.toggle(
            'active',
            link.getAttribute('href') === '#' + entry.target.id
          );
        });
      }
    });
  }, { threshold: 0.45 });

  sections.forEach(s => io.observe(s));
}

/* active nav style injection */
(function injectActiveNav() {
  const style = document.createElement('style');
  style.textContent = `
    .nav-link.active { color: var(--ink); }
    .nav-link.active::after { width: 100%; }`;
  document.head.appendChild(style);
})();

/* ── MARQUEE PAUSE ON HOVER ─────────────────────────────────── */
function initMarquee() {
  const track = document.querySelector('.marquee-track');
  if (!track) return;
  track.addEventListener('mouseenter', () => track.style.animationPlayState = 'paused');
  track.addEventListener('mouseleave', () => track.style.animationPlayState = 'running');
}

/* ── SKILL CARD TILT ────────────────────────────────────────── */
function initSkillTilt() {
  document.querySelectorAll('.skill-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width  - 0.5) * 12;
      const y = ((e.clientY - rect.top)  / rect.height - 0.5) * 12;
      card.style.transform = `translateY(-3px) rotateX(${-y}deg) rotateY(${x}deg)`;
      card.style.transition = 'transform 0.1s';
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.transition = 'transform 0.4s cubic-bezier(0.16,1,0.3,1), background 0.25s';
    });
  });
}

/* ── PROJECT CARD STAGGER ───────────────────────────────────── */
function initProjectStagger() {
  const cards = document.querySelectorAll('.folder-card.fade-in');
  cards.forEach((card, i) => {
    card.style.transitionDelay = `${i * 0.08}s`;
  });
}

/* ── TYPED HERO SUBTITLE ────────────────────────────────────── */
function initTyped() {
  const el = document.querySelector('.hero-sub');
  if (!el) return;

  const lines = [
    'Second-Year CSE (AI) Student',
    'Aspiring Software Developer',
    'AI / ML Enthusiast',
    'Problem Solver'
];

  let lineIdx = 0, charIdx = 0, deleting = false;
  const speed = { type: 60, delete: 30, pause: 1800 };

  el.innerHTML = '';
  el.style.minHeight = '3.5em';

  function tick() {
    const current = lines[lineIdx];
    if (!deleting) {
      charIdx++;
      el.textContent = current.slice(0, charIdx);
      if (charIdx === current.length) {
        deleting = true;
        setTimeout(tick, speed.pause);
        return;
      }
      setTimeout(tick, speed.type);
    } else {
      charIdx--;
      el.textContent = current.slice(0, charIdx);
      if (charIdx === 0) {
        deleting = false;
        lineIdx  = (lineIdx + 1) % lines.length;
        setTimeout(tick, 300);
        return;
      }
      setTimeout(tick, speed.delete);
    }
  }

  tick();
}

/* ── COUNTER ANIMATION ──────────────────────────────────────── */
function initCounters() {
  const stats = document.querySelectorAll('.stat-num');
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el  = entry.target;
      const raw = el.textContent.trim();
      const num = parseFloat(raw);
      if (isNaN(num)) return;
      const suffix = raw.replace(String(num), '');
      let start = 0;
      const duration = 1200;
      const step = 16;
      const increment = num / (duration / step);

      function count() {
        start = Math.min(start + increment, num);
        el.textContent = (Number.isInteger(num) ? Math.round(start) : start.toFixed(1)) + suffix;
        if (start < num) setTimeout(count, step);
      }
      count();
      io.unobserve(el);
    });
  }, { threshold: 0.5 });

  stats.forEach(s => io.observe(s));
}

/* ── IMAGE HOVER RIPPLE ─────────────────────────────────────── */
function initImageRipple() {
  const frame = document.querySelector('.about-photo-frame');
  if (!frame) return;

  frame.addEventListener('click', e => {
    const rect   = frame.getBoundingClientRect();
    const ripple = document.createElement('span');
    const size   = Math.max(rect.width, rect.height) * 2;
    ripple.style.cssText = `
      position:absolute; border-radius:50%; pointer-events:none;
      width:${size}px; height:${size}px;
      left:${e.clientX - rect.left - size/2}px;
      top:${e.clientY - rect.top - size/2}px;
      background:rgba(200,169,110,0.25);
      transform:scale(0); animation:ripple 0.7s ease-out forwards;`;
    frame.style.position = 'relative';
    frame.style.overflow = 'hidden';
    frame.appendChild(ripple);
    ripple.addEventListener('animationend', () => ripple.remove());
  });

  const style = document.createElement('style');
  style.textContent = `@keyframes ripple { to { transform:scale(1); opacity:0; } }`;
  document.head.appendChild(style);
}

/* ── SECTION HEADINGS SPLIT-CHAR ANIMATE ───────────────────── */
function initHeadingSplit() {
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('chars-visible');
      io.unobserve(entry.target);
    });
  }, { threshold: 0.2 });

  document.querySelectorAll('.section-heading').forEach(h => {
    io.observe(h);
  });

  const style = document.createElement('style');
  style.textContent = `
    .section-heading {
      opacity: 0;
      transform: translateY(20px);
      transition: opacity 0.8s cubic-bezier(0.16,1,0.3,1), transform 0.8s cubic-bezier(0.16,1,0.3,1);
    }
    .section-heading.chars-visible {
      opacity: 1;
      transform: translateY(0);
    }`;
  document.head.appendChild(style);
}

/* ── FOOTER YEAR ────────────────────────────────────────────── */
(function updateYear() {
  const y = document.querySelector('.footer-name');
  if (y) y.textContent = `© ${new Date().getFullYear()} Anushka`;
})();

/* ── INIT ALL ───────────────────────────────────────────────── */
function initAnimations() {
  initFadeIns();
  initSkillBars();
  initFolderCards();
  initAchievementHover();
  initContactForm();
  initParallax();
  initActiveNav();
  initMarquee();
  initSkillTilt();
  initProjectStagger();
  initTyped();
  initCounters();
  initImageRipple();
  initHeadingSplit();
}