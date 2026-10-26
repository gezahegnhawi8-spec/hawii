/* =============================================
   HAWI GEZAHEGN — PORTFOLIO JAVASCRIPT
   ============================================= */

'use strict';

/* =============================================
   1. TYPED TEXT EFFECT
   ============================================= */
const typedStrings = [
  'Web Development',
  'Computer Networking',
  'Systems Administration',
  'Database Design',
  'Problem Solving',
  'Open Source',
];

let typedIndex   = 0;
let charIndex    = 0;
let isDeleting   = false;
const typedEl    = document.getElementById('typedText');
const typeSpeed  = 90;
const deleteSpeed = 50;
const pauseTime  = 2000;

function typeEffect() {
  if (!typedEl) return;

  const currentStr = typedStrings[typedIndex];

  if (isDeleting) {
    typedEl.textContent = currentStr.substring(0, charIndex - 1);
    charIndex--;
  } else {
    typedEl.textContent = currentStr.substring(0, charIndex + 1);
    charIndex++;
  }

  let delay = isDeleting ? deleteSpeed : typeSpeed;

  if (!isDeleting && charIndex === currentStr.length) {
    delay = pauseTime;
    isDeleting = true;
  } else if (isDeleting && charIndex === 0) {
    isDeleting = false;
    typedIndex = (typedIndex + 1) % typedStrings.length;
    delay = 400;
  }

  setTimeout(typeEffect, delay);
}

document.addEventListener('DOMContentLoaded', () => {
  setTimeout(typeEffect, 800);
});


/* =============================================
   2. NAVBAR – SCROLL BEHAVIOUR & ACTIVE LINKS
   ============================================= */
const navbar      = document.getElementById('navbar');
const navLinks    = document.querySelectorAll('.nav-link');
const sections    = document.querySelectorAll('section[id]');
const hamburger   = document.getElementById('hamburger');
const navLinkList = document.getElementById('nav-links');

// Scroll – sticky + active link highlight
function onScroll() {
  // Sticky class
  if (window.scrollY > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }

  // Active nav link based on current section
  let current = '';
  sections.forEach(sec => {
    const top = sec.offsetTop - 120;
    if (window.scrollY >= top) current = sec.getAttribute('id');
  });

  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${current}`) {
      link.classList.add('active');
    }
  });

  // Back to Top button
  const backBtn = document.getElementById('backToTop');
  if (backBtn) {
    if (window.scrollY > 400) {
      backBtn.classList.add('visible');
    } else {
      backBtn.classList.remove('visible');
    }
  }
}

window.addEventListener('scroll', onScroll, { passive: true });


// Hamburger menu toggle
hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navLinkList.classList.toggle('open');
});

// Close menu on link click (mobile)
navLinks.forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinkList.classList.remove('open');
  });
});


/* =============================================
   3. THEME TOGGLE (Dark / Light Mode)
   ============================================= */
const themeToggle = document.getElementById('themeToggle');
const themeIcon   = document.getElementById('themeIcon');
const body        = document.body;

// Load saved preference
const savedTheme = localStorage.getItem('theme') || 'dark';
if (savedTheme === 'light') {
  body.classList.remove('dark-mode');
  themeIcon.classList.replace('fa-sun', 'fa-moon');
}

themeToggle.addEventListener('click', () => {
  const isDark = body.classList.toggle('dark-mode');
  if (isDark) {
    themeIcon.classList.replace('fa-moon', 'fa-sun');
    localStorage.setItem('theme', 'dark');
  } else {
    themeIcon.classList.replace('fa-sun', 'fa-moon');
    localStorage.setItem('theme', 'light');
  }
});


/* =============================================
   4. SCROLL ANIMATIONS (Intersection Observer)
   ============================================= */
const fadeEls = document.querySelectorAll(
  '.section-header, .about-avatar-col, .about-text-col, ' +
  '.contact-info, .contact-form, .project-card, ' +
  '.footer-grid, .hero-stats, .stat-card, .projects-cta'
);

fadeEls.forEach(el => el.classList.add('fade-up'));

const fadeObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      // Only animate once
      fadeObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -50px 0px' });

fadeEls.forEach(el => fadeObserver.observe(el));


/* =============================================
   5. SKILL BARS ANIMATION
   ============================================= */
const skillCategories = document.querySelectorAll('.skill-category');
const barFills        = document.querySelectorAll('.bar-fill');

const skillObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      // Reveal category card
      const delay = parseInt(entry.target.dataset.delay || 0, 10);
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, delay);

      // Animate progress bars inside this card
      const bars = entry.target.querySelectorAll('.bar-fill');
      bars.forEach(bar => {
        const targetWidth = bar.dataset.width + '%';
        setTimeout(() => {
          bar.style.width = targetWidth;
        }, delay + 400);
      });

      skillObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.2 });

skillCategories.forEach(cat => skillObserver.observe(cat));


/* =============================================
   6. PROJECT FILTER
   ============================================= */
const filterBtns    = document.querySelectorAll('.filter-btn');
const projectCards  = document.querySelectorAll('.project-card');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    // Active state
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const filter = btn.dataset.filter;

    projectCards.forEach(card => {
      const categories = card.dataset.category || '';

      if (filter === 'all' || categories.includes(filter)) {
        card.classList.remove('hidden');
        card.style.animation = 'none';
        requestAnimationFrame(() => {
          card.style.animation = 'fadeInCard 0.4s ease forwards';
        });
      } else {
        card.classList.add('hidden');
      }
    });
  });
});

// Inject filter card animation keyframe dynamically
const filterStyle = document.createElement('style');
filterStyle.textContent = `
  @keyframes fadeInCard {
    from { opacity: 0; transform: scale(0.95) translateY(10px); }
    to   { opacity: 1; transform: scale(1)    translateY(0); }
  }
`;
document.head.appendChild(filterStyle);


/* =============================================
   7. CONTACT FORM VALIDATION & SUBMISSION
   ============================================= */
const contactForm  = document.getElementById('contactForm');
const submitBtn    = document.getElementById('submitBtn');
const submitText   = document.getElementById('submitText');
const submitLoading = document.getElementById('submitLoading');
const formSuccess  = document.getElementById('formSuccess');
const messageArea  = document.getElementById('message');
const charCountEl  = document.getElementById('charCount');

// Live character count
if (messageArea) {
  messageArea.addEventListener('input', () => {
    const len = messageArea.value.length;
    if (charCountEl) {
      charCountEl.textContent = `${len} / 500`;
      charCountEl.style.color = len > 450 ? 'var(--red)' : 'var(--text-muted)';
    }
    if (len > 500) {
      messageArea.value = messageArea.value.substring(0, 500);
    }
  });
}

// Field validators
function validateField(id, errorId, condition, message) {
  const field = document.getElementById(id);
  const error = document.getElementById(errorId);
  if (!field || !error) return true;

  if (!condition(field.value.trim())) {
    error.textContent = message;
    field.classList.add('error');
    return false;
  }
  error.textContent = '';
  field.classList.remove('error');
  return true;
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

if (contactForm) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Validate all fields
    const v1 = validateField('fname',   'fnameError',   v => v.length >= 2,      'Please enter your first name (min 2 chars).');
    const v2 = validateField('email',   'emailError',   isValidEmail,             'Please enter a valid email address.');
    const v3 = validateField('subject', 'subjectError', v => v !== '',            'Please select a subject.');
    const v4 = validateField('message', 'messageError', v => v.length >= 10,      'Message must be at least 10 characters.');

    if (!v1 || !v2 || !v3 || !v4) return;

    // Loading state
    submitText.style.display    = 'none';
    submitLoading.style.display = 'inline-flex';
    submitBtn.disabled = true;

    // Simulate sending (replace with your actual fetch / FormData call)
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Reset form & show success
    contactForm.reset();
    if (charCountEl) charCountEl.textContent = '0 / 500';
    submitText.style.display    = 'inline-flex';
    submitLoading.style.display = 'none';
    submitBtn.disabled = false;
    formSuccess.classList.add('show');

    setTimeout(() => formSuccess.classList.remove('show'), 5000);
  });
}


/* =============================================
   8. BACK TO TOP BUTTON
   ============================================= */
const backToTopBtn = document.getElementById('backToTop');
if (backToTopBtn) {
  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}


/* =============================================
   9. FOOTER YEAR
   ============================================= */
const yearEl = document.getElementById('footerYear');
if (yearEl) yearEl.textContent = new Date().getFullYear();


/* =============================================
   10. SMOOTH SCROLL FOR ALL ANCHOR LINKS
   ============================================= */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offset = parseInt(getComputedStyle(document.documentElement)
      .getPropertyValue('--nav-height') || '70', 10);
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});


/* =============================================
   11. HERO PARALLAX GRID
   ============================================= */
const heroBgGrid = document.querySelector('.hero-bg-grid');
window.addEventListener('mousemove', (e) => {
  if (!heroBgGrid) return;
  const x = (e.clientX / window.innerWidth  - 0.5) * 20;
  const y = (e.clientY / window.innerHeight - 0.5) * 20;
  heroBgGrid.style.transform = `translate(${x}px, ${y}px)`;
}, { passive: true });


/* =============================================
   12. CONSOLE EASTER EGG
   ============================================= */
console.log(
  '%c👋 Hey there, developer!',
  'color: #a78bfa; font-size: 18px; font-weight: bold;'
);
console.log(
  '%cThis portfolio was built with ❤️ and pure HTML, CSS & JS.',
  'color: #06b6d4; font-size: 13px;'
);
console.log(
  '%c✉️  Want to collaborate? Reach out: hawi@example.com',
  'color: #86efac; font-size: 13px;'
);

