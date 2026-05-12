/* ============================================================
   script.js — Portfolio interactions
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ──────────────────────────────────────────
     1. REVEAL ON SCROLL
  ────────────────────────────────────────── */
  const revealEls = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // Stagger delay for sibling elements
        entry.target.style.transitionDelay = `${i * 0.07}s`;
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  revealEls.forEach(el => revealObserver.observe(el));


  /* ──────────────────────────────────────────
     2. MAIN PROJECTS TOGGLE (open/close all)
  ────────────────────────────────────────── */
  const mainToggle  = document.getElementById('mainToggle');
  const projectsList = document.getElementById('projectsList');

  mainToggle.addEventListener('click', () => {
    const isOpen = projectsList.classList.contains('open');

    mainToggle.classList.toggle('open', !isOpen);
    projectsList.classList.toggle('open', !isOpen);

    // If closing, also close all individual projects
    if (isOpen) {
      closeAllProjects();
    }
  });


  /* ──────────────────────────────────────────
     3. INDIVIDUAL PROJECT TOGGLES
  ────────────────────────────────────────── */
  const projectHeaders = document.querySelectorAll('.project-header');

  projectHeaders.forEach(header => {
    header.addEventListener('click', () => {
      const targetId = header.getAttribute('data-project');
      const body     = document.getElementById(targetId);
      const isOpen   = body.classList.contains('open');

      // Close others (accordion behaviour)
      closeAllProjects();

      if (!isOpen) {
        header.classList.add('open');
        body.classList.add('open');

        // Smooth scroll into view
        setTimeout(() => {
          header.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }, 100);
      }
    });
  });

  function closeAllProjects() {
    document.querySelectorAll('.project-header').forEach(h => h.classList.remove('open'));
    document.querySelectorAll('.project-body').forEach(b => b.classList.remove('open'));
  }


  /* ──────────────────────────────────────────
     4. COMPÉTENCES TECHNIQUES TOGGLE
  ────────────────────────────────────────── */
  const techToggle = document.getElementById('techToggle');
  const techPanel  = document.getElementById('techPanel');

  techToggle.addEventListener('click', () => {
    const isOpen = techPanel.classList.contains('open');
    techToggle.classList.toggle('open', !isOpen);
    techPanel.classList.toggle('open', !isOpen);

    if (!isOpen) {
      // Animate skill bars after panel opens
      setTimeout(animateBars, 100);
    }
  });

  function animateBars() {
    const fills = techPanel.querySelectorAll('.skill-fill');
    fills.forEach(fill => {
      const width = fill.style.width; // e.g. "75%"
      fill.style.width = width;       // keep the target
    });
    // The CSS transition handles the rest since .skills-panel.open triggers the transform
  }


  /* ──────────────────────────────────────────
     5. COMPÉTENCES TRANSVERSALES TOGGLE
  ────────────────────────────────────────── */
  const transToggle = document.getElementById('transToggle');
  const transPanel  = document.getElementById('transPanel');

  transToggle.addEventListener('click', () => {
    const isOpen = transPanel.classList.contains('open');
    transToggle.classList.toggle('open', !isOpen);
    transPanel.classList.toggle('open', !isOpen);
  });


  /* ──────────────────────────────────────────
     6. ACTIVE NAV LINK HIGHLIGHT (scroll spy)
  ────────────────────────────────────────── */
  const sections  = document.querySelectorAll('section[id]');
  const navLinks  = document.querySelectorAll('.nav-links a');

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
     7. CURSOR GLOW FOLLOW
  ────────────────────────────────────────── */
  const glow = document.createElement('div');
  glow.style.cssText = `
    position: fixed;
    width: 400px;
    height: 400px;
    border-radius: 50%;
    pointer-events: none;
    z-index: 0;
    background: radial-gradient(circle, rgba(0,180,255,0.07) 0%, transparent 70%);
    transform: translate(-50%, -50%);
    transition: left 0.12s ease, top 0.12s ease;
  `;
  document.body.appendChild(glow);

  document.addEventListener('mousemove', (e) => {
    glow.style.left = e.clientX + 'px';
    glow.style.top  = e.clientY + 'px';
  });


  /* ──────────────────────────────────────────
     8. TOGGLE ICON "+" → "×" ANIMATION
     (for skill toggles that use accent2 style)
  ────────────────────────────────────────── */
  [techToggle, transToggle].forEach(toggle => {
    const icon = toggle.querySelector('.toggle-icon');

    toggle.addEventListener('click', () => {
      const isNowOpen = toggle.classList.contains('open');
      icon.textContent = isNowOpen ? '×' : '+';
    });
  });

  // Also update main toggle icon
  mainToggle.addEventListener('click', () => {
    const icon = mainToggle.querySelector('.toggle-icon');
    const isNowOpen = mainToggle.classList.contains('open');
    icon.textContent = isNowOpen ? '×' : '+';
  });


  /* ──────────────────────────────────────────
     9. TYPING EFFECT on hero tag
  ────────────────────────────────────────── */
  const heroTag = document.querySelector('.hero-tag');
  if (heroTag) {
    const originalText = heroTag.textContent.trim();
    heroTag.textContent = '';

    let charIndex = 0;
    function typeChar() {
      if (charIndex < originalText.length) {
        heroTag.textContent += originalText[charIndex];
        charIndex++;
        setTimeout(typeChar, 38);
      }
    }

    // Start after the fade-in animation delay
    setTimeout(typeChar, 250);
  }


  /* ──────────────────────────────────────────
    10. KEYBOARD ACCESSIBILITY
  ────────────────────────────────────────── */
  const allToggles = document.querySelectorAll('.projects-toggle, .project-header, .skills-toggle');

  allToggles.forEach(el => {
    el.setAttribute('tabindex', '0');
    el.setAttribute('role', 'button');

    el.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        el.click();
      }
    });
  });

});