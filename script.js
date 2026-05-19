/* ============================================================
   script.js — Portfolio interactions + Lightbox galerie
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ──────────────────────────────────────────
     1. REVEAL ON SCROLL
  ────────────────────────────────────────── */
  const revealEls = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        entry.target.style.transitionDelay = `${i * 0.07}s`;
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  revealEls.forEach(el => revealObserver.observe(el));


  /* ──────────────────────────────────────────
     2. MAIN PROJECTS TOGGLE
  ────────────────────────────────────────── */
  const mainToggle   = document.getElementById('mainToggle');
  const projectsList = document.getElementById('projectsList');

  mainToggle.addEventListener('click', () => {
    const isOpen = projectsList.classList.contains('open');
    mainToggle.classList.toggle('open', !isOpen);
    projectsList.classList.toggle('open', !isOpen);
    mainToggle.querySelector('.toggle-icon').textContent = isOpen ? '+' : '×';
    if (isOpen) closeAllProjects();
  });


  /* ──────────────────────────────────────────
     3. INDIVIDUAL PROJECT TOGGLES (accordion)
  ────────────────────────────────────────── */
  document.querySelectorAll('.project-header').forEach(header => {
    header.addEventListener('click', () => {
      const targetId = header.getAttribute('data-project');
      const body     = document.getElementById(targetId);
      const isOpen   = body.classList.contains('open');

      closeAllProjects();

      if (!isOpen) {
        header.classList.add('open');
        body.classList.add('open');
        setTimeout(() => header.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 120);
      }
    });
  });

  function closeAllProjects() {
    document.querySelectorAll('.project-header').forEach(h => h.classList.remove('open'));
    document.querySelectorAll('.project-body').forEach(b => b.classList.remove('open'));
  }


  /* ──────────────────────────────────────────
     4. COMPÉTENCES TECHNIQUES
  ────────────────────────────────────────── */
  const techToggle = document.getElementById('techToggle');
  const techPanel  = document.getElementById('techPanel');

  techToggle.addEventListener('click', () => {
    const isOpen = techPanel.classList.contains('open');
    techToggle.classList.toggle('open', !isOpen);
    techPanel.classList.toggle('open', !isOpen);
    techToggle.querySelector('.toggle-icon').textContent = isOpen ? '+' : '×';
  });


  /* ──────────────────────────────────────────
     5. COMPÉTENCES TRANSVERSALES
  ────────────────────────────────────────── */
  const transToggle = document.getElementById('transToggle');
  const transPanel  = document.getElementById('transPanel');

  transToggle.addEventListener('click', () => {
    const isOpen = transPanel.classList.contains('open');
    transToggle.classList.toggle('open', !isOpen);
    transPanel.classList.toggle('open', !isOpen);
    transToggle.querySelector('.toggle-icon').textContent = isOpen ? '+' : '×';
  });


  /* ──────────────────────────────────────────
     6. LIGHTBOX — galerie photos
  ────────────────────────────────────────── */
  const lightbox   = document.getElementById('lightbox');
  const lbImg      = document.getElementById('lb-img');
  const lbClose    = document.getElementById('lbClose');
  const lbPrev     = document.getElementById('lbPrev');
  const lbNext     = document.getElementById('lbNext');
  const lbCounter  = document.getElementById('lbCounter');
  const lbCaption  = document.getElementById('lbCaption');

  let currentGallery = [];   // array of { src, caption }
  let currentIndex   = 0;

  // Build gallery arrays from each project's thumbs
  function getGalleryFromThumb(thumb) {
    const allThumbs = [...thumb.closest('.gallery-grid').querySelectorAll('.gallery-thumb')];
    return allThumbs.map(t => ({
      src:     t.getAttribute('data-src') || t.querySelector('img')?.src || '',
      caption: t.getAttribute('data-caption') || ''
    }));
  }

  // Open lightbox
  function openLightbox(thumb) {
    currentGallery = getGalleryFromThumb(thumb);
    const allThumbs = [...thumb.closest('.gallery-grid').querySelectorAll('.gallery-thumb')];
    currentIndex = allThumbs.indexOf(thumb);
    showSlide(currentIndex);
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
    lbImg.focus();
  }

  // Close lightbox
  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }

  // Show a specific slide
  function showSlide(index) {
    if (!currentGallery.length) return;
    // Clamp index
    currentIndex = (index + currentGallery.length) % currentGallery.length;
    const item = currentGallery[currentIndex];

    lbImg.style.opacity = '0';
    lbImg.src = item.src;
    lbImg.onload = () => { lbImg.style.opacity = '1'; };
    lbImg.onerror = () => { lbImg.style.opacity = '0.3'; };

    lbCounter.textContent = `${currentIndex + 1} / ${currentGallery.length}`;
    lbCaption.textContent  = item.caption || '';

    // Hide nav if only one image
    const showNav = currentGallery.length > 1;
    lbPrev.style.visibility = showNav ? 'visible' : 'hidden';
    lbNext.style.visibility = showNav ? 'visible' : 'hidden';
  }

  // Attach click on all gallery thumbs (using delegation for dynamically opened panels)
  document.addEventListener('click', (e) => {
    const thumb = e.target.closest('.gallery-thumb');
    if (thumb) openLightbox(thumb);
  });

  // Controls
  lbClose.addEventListener('click', closeLightbox);
  lbPrev.addEventListener('click', (e) => { e.stopPropagation(); showSlide(currentIndex - 1); });
  lbNext.addEventListener('click', (e) => { e.stopPropagation(); showSlide(currentIndex + 1); });

  // Click outside image → close
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  // Keyboard: arrow keys + Escape
  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'Escape')      closeLightbox();
    if (e.key === 'ArrowLeft')   showSlide(currentIndex - 1);
    if (e.key === 'ArrowRight')  showSlide(currentIndex + 1);
  });

  // Touch swipe support for mobile
  let touchStartX = 0;
  lightbox.addEventListener('touchstart', (e) => { touchStartX = e.touches[0].clientX; }, { passive: true });
  lightbox.addEventListener('touchend', (e) => {
    const delta = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(delta) > 50) showSlide(delta < 0 ? currentIndex + 1 : currentIndex - 1);
  });


  /* ──────────────────────────────────────────
     7. SCROLL SPY (active nav link)
  ────────────────────────────────────────── */
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a');

  const spyObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(link => {
          link.style.color = '';
          if (link.getAttribute('href') === '#' + entry.target.id) {
            link.style.color = 'var(--accent)';
          }
        });
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px' });

  sections.forEach(s => spyObserver.observe(s));


  /* ──────────────────────────────────────────
     8. CURSOR GLOW
  ────────────────────────────────────────── */
  const glow = document.createElement('div');
  glow.style.cssText = `
    position: fixed; width: 380px; height: 380px; border-radius: 50%;
    pointer-events: none; z-index: 0;
    background: radial-gradient(circle, rgba(0,180,255,0.07) 0%, transparent 70%);
    transform: translate(-50%, -50%);
    transition: left 0.1s ease, top 0.1s ease;
  `;
  document.body.appendChild(glow);

  document.addEventListener('mousemove', (e) => {
    glow.style.left = e.clientX + 'px';
    glow.style.top  = e.clientY + 'px';
  });


  /* ──────────────────────────────────────────
     9. TYPING EFFECT on hero tag
  ────────────────────────────────────────── */
  const heroTag = document.querySelector('.hero-tag');
  if (heroTag) {
    const text = heroTag.textContent.trim();
    heroTag.textContent = '';
    let i = 0;
    const type = () => {
      if (i < text.length) { heroTag.textContent += text[i++]; setTimeout(type, 36); }
    };
    setTimeout(type, 300);
  }


  /* ──────────────────────────────────────────
    10. KEYBOARD ACCESSIBILITY for toggles
  ────────────────────────────────────────── */
  document.querySelectorAll('.projects-toggle, .project-header, .skills-toggle').forEach(el => {
    el.setAttribute('tabindex', '0');
    el.setAttribute('role', 'button');
    el.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); el.click(); }
    });
  });

});