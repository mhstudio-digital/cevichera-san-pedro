/* ═══════════════════════════════════════════════════════════════
   LA CEVICHERA SAN PEDRO — script.js
═══════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  /* ─── NAVBAR: scroll effect + hamburger ─────────────────────── */
  const navbar    = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobile-menu');

  function updateNavbar() {
    if (window.scrollY > 40) {
      navbar.classList.add('navbar--scrolled');
    } else {
      navbar.classList.remove('navbar--scrolled');
    }
  }

  window.addEventListener('scroll', updateNavbar, { passive: true });
  updateNavbar();

  hamburger.addEventListener('click', function () {
    const isOpen = mobileMenu.classList.toggle('open');
    hamburger.classList.toggle('active', isOpen);
    hamburger.setAttribute('aria-expanded', String(isOpen));
    mobileMenu.setAttribute('aria-hidden', String(!isOpen));
    mobileMenu.style.display = isOpen ? 'flex' : '';
  });

  // Close mobile menu on link click
  mobileMenu.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () {
      mobileMenu.classList.remove('open');
      hamburger.classList.remove('active');
      hamburger.setAttribute('aria-expanded', 'false');
      mobileMenu.setAttribute('aria-hidden', 'true');
    });
  });

  // Close on outside click
  document.addEventListener('click', function (e) {
    if (!navbar.contains(e.target) && mobileMenu.classList.contains('open')) {
      mobileMenu.classList.remove('open');
      hamburger.classList.remove('active');
      hamburger.setAttribute('aria-expanded', 'false');
      mobileMenu.setAttribute('aria-hidden', 'true');
    }
  });


  /* ─── INTERSECTION OBSERVER: reveal on scroll ───────────────── */
  const revealObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  document.querySelectorAll('.reveal').forEach(function (el) {
    revealObserver.observe(el);
  });


  /* ─── COUNT-UP ANIMATION for trust bar ──────────────────────── */
  function animateCount(el) {
    const target   = parseFloat(el.dataset.count);
    const decimals = parseInt(el.dataset.decimal || '0', 10);
    const duration = 1800;
    const start    = performance.now();

    function step(now) {
      const elapsed  = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out cubic
      const eased    = 1 - Math.pow(1 - progress, 3);
      const value    = target * eased;

      el.textContent = decimals > 0
        ? value.toFixed(decimals)
        : Math.floor(value).toLocaleString('es-CR');

      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = decimals > 0
        ? target.toFixed(decimals)
        : target.toLocaleString('es-CR');
    }

    requestAnimationFrame(step);
  }

  const trustObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.querySelectorAll('[data-count]').forEach(animateCount);
          trustObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  const trustBar = document.querySelector('.trust-bar');
  if (trustBar) trustObserver.observe(trustBar);


  /* ─── HERO PARTICLES ─────────────────────────────────────────── */
  (function initParticles() {
    const container = document.getElementById('particles');
    if (!container) return;

    // Respect reduced-motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const count = window.innerWidth < 768 ? 8 : 18;

    for (let i = 0; i < count; i++) {
      const p = document.createElement('div');
      p.className = 'particle';

      const size  = Math.random() * 6 + 2;
      const left  = Math.random() * 100;
      const delay = Math.random() * 12;
      const dur   = Math.random() * 14 + 10;
      const dx    = (Math.random() - 0.5) * 80;

      p.style.cssText = [
        'width:'  + size + 'px',
        'height:' + size + 'px',
        'left:'   + left + '%',
        'bottom:' + '-20px',
        '--dx:'   + dx + 'px',
        'animation-duration:'  + dur + 's',
        'animation-delay:'     + delay + 's',
        'opacity: 0',
        'background: ' + (Math.random() > 0.6
          ? 'rgba(201,145,61,0.18)'
          : 'rgba(74,159,212,0.15)')
      ].join(';');

      container.appendChild(p);
    }
  })();


  /* ─── PARALLAX: hero layers ─────────────────────────────────── */
  (function initParallax() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const heroEl      = document.querySelector('.hero');
    const heroOcean   = document.querySelector('.hero__ocean');
    const heroContent = document.querySelector('.hero__content');
    if (!heroOcean && !heroContent) return;

    window.addEventListener('scroll', function () {
      const y = window.scrollY;
      if (heroEl && y > heroEl.offsetHeight) return;
      if (heroOcean)   heroOcean.style.transform   = 'translateY(' + (y * 0.45) + 'px)';
      if (heroContent) heroContent.style.transform = 'translateY(' + (y * 0.18) + 'px)';
    }, { passive: true });
  })();


  /* ─── MOBILE BANNER ─────────────────────────────────────────── */
  (function initBanner() {
    const banner   = document.getElementById('mobile-banner');
    const closeBtn = document.getElementById('banner-close');
    if (!banner) return;

    const day    = new Date().getDay(); // 0=Sun, 1=Mon
    const textEl = banner.querySelector('.mobile-banner__text');
    if (textEl) {
      textEl.textContent = day === 1
        ? 'Abrimos mañana · Mar–Dom 11am–9pm'
        : 'Abierto hoy · Mar–Dom 11am–9pm';
    }

    setTimeout(function () { banner.classList.add('visible'); }, 1200);

    if (closeBtn) {
      closeBtn.addEventListener('click', function () {
        banner.style.transform = 'translateY(-100%)';
        setTimeout(function () { banner.style.display = 'none'; }, 350);
      });
    }
  })();


  /* ─── SMOOTH SCROLL for anchor links ────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (!target) return;
      e.preventDefault();

      const navH   = parseInt(getComputedStyle(document.documentElement)
        .getPropertyValue('--navbar-h')) || 72;
      const top    = target.getBoundingClientRect().top + window.scrollY - navH - 8;

      window.scrollTo({ top, behavior: 'smooth' });
    });
  });


  /* ─── ACTIVE NAV LINK on scroll ─────────────────────────────── */
  const sections  = document.querySelectorAll('section[id]');
  const navLinks  = document.querySelectorAll('.navbar__link');

  const sectionObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        const id = entry.target.getAttribute('id');
        navLinks.forEach(function (link) {
          link.classList.toggle(
            'active',
            link.getAttribute('href') === '#' + id
          );
        });
      });
    },
    { threshold: 0.35 }
  );

  sections.forEach(function (s) { sectionObserver.observe(s); });


  /* ─── GALLERY: keyboard accessibility ───────────────────────── */
  document.querySelectorAll('.gallery-item').forEach(function (item) {
    item.setAttribute('tabindex', '0');
    item.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        this.querySelector('.gallery-item__overlay').style.opacity = '1';
        setTimeout(function () {
          item.querySelector('.gallery-item__overlay').style.opacity = '';
        }, 1200);
      }
    });
  });


  /* ─── WhatsApp button: hide when footer visible ──────────────── */
  const waBtn     = document.getElementById('whatsapp-float');
  const callBtn   = document.getElementById('call-float');
  const footer    = document.querySelector('.footer');

  if (footer && waBtn) {
    const footerObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          const opacity = entry.isIntersecting ? '0' : '';
          const ptr     = entry.isIntersecting ? 'none' : '';
          waBtn.style.opacity       = opacity;
          waBtn.style.pointerEvents = ptr;
          if (callBtn) {
            callBtn.style.opacity       = opacity;
            callBtn.style.pointerEvents = ptr;
          }
        });
      },
      { threshold: 0.2 }
    );
    footerObserver.observe(footer);
  }

})();
