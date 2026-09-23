/* ═══════════════════════════════════════════════════
   LOTUS — Main Application Logic
   Menu Image Loading, Lightbox, Particles, Scroll FX
   ═══════════════════════════════════════════════════ */

(function () {
  'use strict';

  const START_PAGE = 0;
  const END_PAGE = 9;
  const IMAGE_FOLDER = 'LOTUS';
  const EXTENSIONS = ['png', 'jpg', 'jpeg', 'webp'];

  // ─── DOM refs ───
  const gallery = document.getElementById('menu-gallery');
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxClose = document.getElementById('lightbox-close');
  const lightboxPrev = document.getElementById('lightbox-prev');
  const lightboxNext = document.getElementById('lightbox-next');
  const lightboxCounter = document.getElementById('lightbox-counter');
  const header = document.getElementById('header');
  const canvas = document.getElementById('particles-canvas');

  let currentLightboxIndex = 0;
  const loadedImages = []; // Stores { index, src } for lightbox nav

  // ═══════════════════════════════════════════════════
  // 1. BUILD MENU CARDS
  // ═══════════════════════════════════════════════════
  for (let i = START_PAGE; i <= END_PAGE; i++) {
    const card = document.createElement('div');
    card.className = 'menu-card';
    card.dataset.index = i;

    // Page number badge
    const badge = document.createElement('div');
    badge.className = 'card-number';
    badge.textContent = i + 1;

    // Expand icon
    const expand = document.createElement('div');
    expand.className = 'card-expand';
    expand.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <polyline points="15 3 21 3 21 9"/><polyline points="9 21 3 21 3 15"/>
      <line x1="21" y1="3" x2="14" y2="10"/><line x1="3" y1="21" x2="10" y2="14"/>
    </svg>`;

    // Skeleton loader
    const skeleton = document.createElement('div');
    skeleton.className = 'card-skeleton';
    const pulse = document.createElement('div');
    pulse.className = 'skeleton-pulse';
    skeleton.appendChild(pulse);

    // Image
    const img = document.createElement('img');
    img.alt = `Menu page ${i}`;
    img.loading = i <= 2 ? 'eager' : 'lazy';

    // Try loading with extension fallback
    let extIndex = 0;
    const tryLoad = () => {
      if (extIndex >= EXTENSIONS.length) {
        // All extensions failed — hide card
        card.style.display = 'none';
        return;
      }
      
      let filename = i.toString();
      
      img.src = `${IMAGE_FOLDER}/${filename}.${EXTENSIONS[extIndex]}`;
    };

    img.onload = () => {
      skeleton.classList.add('loaded');
      loadedImages.push({ index: i, src: img.src });
      loadedImages.sort((a, b) => a.index - b.index);
    };

    img.onerror = () => {
      extIndex++;
      tryLoad();
    };

    card.appendChild(badge);
    card.appendChild(expand);
    card.appendChild(skeleton);
    card.appendChild(img);
    gallery.appendChild(card);

    // Click to open lightbox
    card.addEventListener('click', () => openLightbox(i));

    tryLoad();
  }

  // ═══════════════════════════════════════════════════
  // 2. INTERSECTION OBSERVER — Scroll reveal
  // ═══════════════════════════════════════════════════
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
  );

  document.querySelectorAll('.menu-card').forEach((card) => observer.observe(card));

  // ═══════════════════════════════════════════════════
  // 3. LIGHTBOX
  // ═══════════════════════════════════════════════════
  function openLightbox(pageIndex) {
    const found = loadedImages.find((img) => img.index === pageIndex);
    if (!found) return;

    currentLightboxIndex = loadedImages.indexOf(found);
    showLightboxImage();
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }

  function showLightboxImage() {
    const item = loadedImages[currentLightboxIndex];
    if (!item) return;
    lightboxImg.src = item.src;
    lightboxCounter.textContent = `${currentLightboxIndex + 1} / ${loadedImages.length}`;
  }

  function prevImage() {
    currentLightboxIndex = (currentLightboxIndex - 1 + loadedImages.length) % loadedImages.length;
    showLightboxImage();
  }

  function nextImage() {
    currentLightboxIndex = (currentLightboxIndex + 1) % loadedImages.length;
    showLightboxImage();
  }

  lightboxClose.addEventListener('click', closeLightbox);
  lightboxPrev.addEventListener('click', (e) => { e.stopPropagation(); prevImage(); });
  lightboxNext.addEventListener('click', (e) => { e.stopPropagation(); nextImage(); });
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') prevImage();
    if (e.key === 'ArrowRight') nextImage();
  });

  // Touch swipe for lightbox
  let touchStartX = 0;
  lightbox.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });
  lightbox.addEventListener('touchend', (e) => {
    const diff = e.changedTouches[0].screenX - touchStartX;
    if (Math.abs(diff) > 50) {
      diff > 0 ? prevImage() : nextImage();
    }
  }, { passive: true });

  // ═══════════════════════════════════════════════════
  // 4. HEADER SCROLL EFFECT
  // ═══════════════════════════════════════════════════
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        header.classList.toggle('scrolled', window.scrollY > 60);
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });

  // ═══════════════════════════════════════════════════
  // 5. AMBIENT PARTICLES
  // ═══════════════════════════════════════════════════
  const ctx = canvas.getContext('2d');
  let particles = [];
  let animId;

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  class Particle {
    constructor() {
      this.reset();
    }
    reset() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * 1.5 + 0.5;
      this.speedX = (Math.random() - 0.5) * 0.3;
      this.speedY = (Math.random() - 0.5) * 0.3;
      this.opacity = Math.random() * 0.5 + 0.1;
      this.life = Math.random() * 400 + 200;
      this.age = 0;
    }
    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      this.age++;
      if (this.age > this.life || this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) {
        this.reset();
      }
    }
    draw() {
      const fade = 1 - this.age / this.life;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(212, 165, 116, ${this.opacity * fade})`;
      ctx.fill();
    }
  }

  function initParticles() {
    resizeCanvas();
    const count = Math.min(60, Math.floor((canvas.width * canvas.height) / 20000));
    particles = Array.from({ length: count }, () => new Particle());
  }

  function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach((p) => {
      p.update();
      p.draw();
    });
    animId = requestAnimationFrame(animateParticles);
  }

  // Only run particles on larger screens to save battery on mobile
  if (window.innerWidth > 480) {
    initParticles();
    animateParticles();
    window.addEventListener('resize', () => {
      cancelAnimationFrame(animId);
      initParticles();
      animateParticles();
    });
  }
})();
