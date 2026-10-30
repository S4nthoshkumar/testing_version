/**
 * Nova Landing Page - Vanilla JavaScript
 */

document.addEventListener('DOMContentLoaded', () => {
  // --------------------------------------------------------------------------
  // 1. Theme Toggle (Dark / Light) with LocalStorage persistence
  // --------------------------------------------------------------------------
  const themeToggleBtn = document.getElementById('theme-toggle');
  const htmlRoot = document.documentElement;

  // Retrieve saved theme or check system preference
  const savedTheme = localStorage.getItem('nova-theme');
  if (savedTheme) {
    htmlRoot.setAttribute('data-theme', savedTheme);
  } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
    htmlRoot.setAttribute('data-theme', 'light');
  }

  themeToggleBtn.addEventListener('click', () => {
    const currentTheme = htmlRoot.getAttribute('data-theme') || 'dark';
    const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
    htmlRoot.setAttribute('data-theme', nextTheme);
    localStorage.setItem('nova-theme', nextTheme);
  });

  // --------------------------------------------------------------------------
  // 2. Mobile Navigation Menu Toggle
  // --------------------------------------------------------------------------
  const menuToggle = document.getElementById('menu-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', () => {
      navMenu.classList.toggle('open');
    });

    // Close mobile menu when a nav link is clicked
    navLinks.forEach((link) => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
      });
    });
  }

  // --------------------------------------------------------------------------
  // 3. Animated Stats Counters (Triggered on Scroll into View)
  // --------------------------------------------------------------------------
  const statNumbers = document.querySelectorAll('.stat-number');
  let hasAnimatedStats = false;

  const animateCounters = () => {
    statNumbers.forEach((counter) => {
      const target = parseFloat(counter.getAttribute('data-target'));
      const isDecimal = target % 1 !== 0;
      const duration = 1500; // ms
      const steps = 60;
      const increment = target / steps;
      let current = 0;
      const intervalTime = duration / steps;

      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          counter.textContent = isDecimal ? target.toFixed(1) : Math.round(target);
          clearInterval(timer);
        } else {
          counter.textContent = isDecimal ? current.toFixed(1) : Math.floor(current);
        }
      }, intervalTime);
    });
  };

  if ('IntersectionObserver' in window && statNumbers.length > 0) {
    const statsObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimatedStats) {
            hasAnimatedStats = true;
            animateCounters();
            statsObserver.disconnect();
          }
        });
      },
      { threshold: 0.3 }
    );

    const statsGrid = document.querySelector('.stats-grid');
    if (statsGrid) {
      statsObserver.observe(statsGrid);
    }
  } else {
    // Fallback if IntersectionObserver isn't supported
    animateCounters();
  }

  // --------------------------------------------------------------------------
  // 4. Interactive Showcase Tabs
  // --------------------------------------------------------------------------
  const tabButtons = document.querySelectorAll('.tab-btn');
  const tabPanels = document.querySelectorAll('.tab-panel');

  tabButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-tab');

      // Update button active state
      tabButtons.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      // Update panel visibility
      tabPanels.forEach((panel) => {
        if (panel.id === targetId) {
          panel.classList.add('active');
        } else {
          panel.classList.remove('active');
        }
      });
    });
  });

  // --------------------------------------------------------------------------
  // 5. Pricing Toggle (Monthly vs. Annual)
  // --------------------------------------------------------------------------
  const pricingToggle = document.getElementById('pricing-toggle');
  const monthlyLabel = document.getElementById('monthly-label');
  const annualLabel = document.getElementById('annual-label');
  const priceAmounts = document.querySelectorAll('.price .amount');
  let isAnnual = false;

  if (pricingToggle) {
    const updatePrices = () => {
      isAnnual = !isAnnual;
      pricingToggle.classList.toggle('active', isAnnual);
      pricingToggle.setAttribute('aria-checked', isAnnual.toString());

      if (isAnnual) {
        monthlyLabel.classList.remove('active');
        annualLabel.classList.add('active');
      } else {
        monthlyLabel.classList.add('active');
        annualLabel.classList.remove('active');
      }

      priceAmounts.forEach((el) => {
        const newPrice = isAnnual
          ? el.getAttribute('data-annual')
          : el.getAttribute('data-monthly');
        
        // Smooth opacity transition
        el.style.opacity = '0';
        setTimeout(() => {
          el.textContent = newPrice;
          el.style.opacity = '1';
        }, 150);
      });
    };

    pricingToggle.addEventListener('click', updatePrices);
    monthlyLabel.addEventListener('click', () => {
      if (isAnnual) updatePrices();
    });
    annualLabel.addEventListener('click', () => {
      if (!isAnnual) updatePrices();
    });
  }

  // --------------------------------------------------------------------------
  // 6. FAQ Accordion
  // --------------------------------------------------------------------------
  const accordionHeaders = document.querySelectorAll('.accordion-header');

  accordionHeaders.forEach((header) => {
    header.addEventListener('click', () => {
      const item = header.parentElement;
      const body = item.querySelector('.accordion-body');
      const isActive = item.classList.contains('active');

      // Close all other open accordion items
      document.querySelectorAll('.accordion-item').forEach((otherItem) => {
        if (otherItem !== item) {
          otherItem.classList.remove('active');
          const otherBody = otherItem.querySelector('.accordion-body');
          if (otherBody) otherBody.style.maxHeight = null;
        }
      });

      // Toggle current item
      if (isActive) {
        item.classList.remove('active');
        body.style.maxHeight = null;
      } else {
        item.classList.add('active');
        body.style.maxHeight = body.scrollHeight + 'px';
      }
    });
  });

  // --------------------------------------------------------------------------
  // 7. Video Demo Modal Dialog
  // --------------------------------------------------------------------------
  const demoModal = document.getElementById('demo-modal');
  const demoModalBtn = document.getElementById('demo-modal-btn');
  const modalCloseBtn = document.getElementById('modal-close-btn');
  const modalCancelBtn = document.getElementById('modal-cancel-btn');
  const modalConfirmBtn = document.getElementById('modal-confirm-btn');

  const openModal = () => {
    demoModal.classList.add('open');
    demoModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    demoModal.classList.remove('open');
    demoModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  if (demoModalBtn) demoModalBtn.addEventListener('click', openModal);
  if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeModal);
  if (modalCancelBtn) modalCancelBtn.addEventListener('click', closeModal);
  if (modalConfirmBtn) modalConfirmBtn.addEventListener('click', closeModal);

  // Close when clicking background outside modal card
  if (demoModal) {
    demoModal.addEventListener('click', (e) => {
      if (e.target === demoModal) {
        closeModal();
      }
    });

    // Close on Escape key
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && demoModal.classList.contains('open')) {
        closeModal();
      }
    });
  }

  // --------------------------------------------------------------------------
  // 8. Contact / Newsletter Form & Toast System
  // --------------------------------------------------------------------------
  const contactForm = document.getElementById('contact-form');
  const toastContainer = document.getElementById('toast-container');

  const showToast = (message, type = 'info') => {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `<span>${message}</span>`;

    toastContainer.appendChild(toast);

    // Remove toast automatically after 4 seconds
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(50px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 4000);
  };

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const nameInput = document.getElementById('name-input');
      const emailInput = document.getElementById('email-input');

      const name = nameInput.value.trim();
      const email = emailInput.value.trim();

      if (!name || !email) {
        showToast('Please fill in both your name and email.', 'error');
        return;
      }

      // Basic email regex pattern
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(email)) {
        showToast('Please enter a valid email address.', 'error');
        return;
      }

      // Success
      showToast(`Welcome aboard, ${name}! Thanks for subscribing.`, 'success');
      contactForm.reset();
    });
  }
});

