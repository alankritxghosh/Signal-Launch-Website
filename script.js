(function () {
  'use strict';

  // ---- Custom Cursor ----

  const cursorDot = document.querySelector('.cursor-dot');
  const cursorRing = document.querySelector('.cursor-ring');

  if (cursorDot && cursorRing) {
    let mouseX = 0, mouseY = 0;
    let ringX = 0, ringY = 0;
    const LERP = 0.12;

    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursorDot.style.transform = `translate(${mouseX - 4}px, ${mouseY - 4}px)`;
    });

    function animateRing() {
      ringX += (mouseX - ringX) * LERP;
      ringY += (mouseY - ringY) * LERP;
      cursorRing.style.transform = `translate(${ringX - 18}px, ${ringY - 18}px)`;
      requestAnimationFrame(animateRing);
    }
    animateRing();

    const hoverTargets = document.querySelectorAll('a, button, input, [data-hover]');
    hoverTargets.forEach((el) => {
      el.addEventListener('mouseenter', () => {
        cursorDot.classList.add('hovering');
        cursorRing.classList.add('hovering');
      });
      el.addEventListener('mouseleave', () => {
        cursorDot.classList.remove('hovering');
        cursorRing.classList.remove('hovering');
      });
    });
  }

  // ---- Navigation Scroll State ----

  const nav = document.querySelector('.nav');
  if (nav) {
    let navTicking = false;
    window.addEventListener('scroll', () => {
      if (!navTicking) {
        requestAnimationFrame(() => {
          nav.classList.toggle('scrolled', window.scrollY > 60);
          navTicking = false;
        });
        navTicking = true;
      }
    });
  }

  // ---- Mobile Nav Toggle ----

  const hamburger = document.querySelector('.nav-hamburger');
  const mobileNav = document.querySelector('.mobile-nav');

  if (hamburger && mobileNav) {
    hamburger.addEventListener('click', () => {
      const isOpen = mobileNav.classList.contains('open');
      mobileNav.classList.toggle('open');
      hamburger.classList.toggle('active');
      hamburger.setAttribute('aria-expanded', !isOpen);
      mobileNav.setAttribute('aria-hidden', isOpen);
      document.body.style.overflow = isOpen ? '' : 'hidden';
    });

    mobileNav.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        mobileNav.classList.remove('open');
        hamburger.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
        mobileNav.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
      });
    });
  }

  // ---- Hero Wordmark Spring-In ----

  const heroWordmark = document.querySelector('.hero-wordmark');
  if (heroWordmark) {
    setTimeout(() => {
      heroWordmark.classList.add('visible');
    }, 400);
  }

  // ---- Scroll-Driven Motion Blur on Hero Video ----

  const blurTarget = document.querySelector('[data-blur-target]');

  if (blurTarget) {
    let lastScrollY = window.scrollY;
    let scrollTimeout = null;
    let blurTicking = false;

    window.addEventListener('scroll', () => {
      if (!blurTicking) {
        requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;
          const delta = currentScrollY - lastScrollY;
          const absDelta = Math.abs(delta);
          const blur = Math.min(absDelta * 0.35, 8);
          const translateY = delta * 0.15;

          blurTarget.style.filter = `blur(${blur}px)`;
          blurTarget.style.transform = `translateY(${translateY}px) scale(1.02)`;
          blurTarget.style.transition = 'none';

          lastScrollY = currentScrollY;
          blurTicking = false;
        });
        blurTicking = true;
      }

      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        blurTarget.style.transition = 'filter 0.3s ease, transform 0.3s ease';
        blurTarget.style.filter = 'blur(0px)';
        blurTarget.style.transform = 'translateY(0px) scale(1.02)';
      }, 150);
    });
  }

  // ---- Section Reveal Animations ----

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 }
  );

  document.querySelectorAll('.reveal, .reveal-child, .scale-reveal').forEach((el) => {
    revealObserver.observe(el);
  });

  // ---- Smooth Scroll for Anchor Links ----

  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;
      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        const navHeight = nav ? nav.offsetHeight : 0;
        const targetPos = targetEl.getBoundingClientRect().top + window.scrollY - navHeight;
        window.scrollTo({ top: targetPos, behavior: 'smooth' });
      }
    });
  });


})();
