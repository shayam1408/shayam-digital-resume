/**
 * Digital Resume - Shayam Satish Shetty
 * Interactive Script: Dark/Light Mode, Clipboard Copy, ScrollSpy, Print Trigger & Mobile Nav
 */

document.addEventListener('DOMContentLoaded', () => {
  // ---------------------------------------------------------------------------
  // 1. Theme Management (Dark / Light with LocalStorage Persistence)
  // ---------------------------------------------------------------------------
  const themeToggleBtn = document.getElementById('theme-toggle');
  const rootElement = document.documentElement;

  // Initialize theme from saved preference or OS preference
  const savedTheme = localStorage.getItem('shayam_resume_theme');
  const prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;

  if (savedTheme) {
    rootElement.setAttribute('data-theme', savedTheme);
  } else if (prefersLight) {
    rootElement.setAttribute('data-theme', 'light');
  } else {
    rootElement.setAttribute('data-theme', 'dark');
  }

  // Handle theme toggle click
  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = rootElement.getAttribute('data-theme') || 'dark';
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

      rootElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('shayam_resume_theme', newTheme);
    });
  }

  // ---------------------------------------------------------------------------
  // 2. One-Click Copy Email to Clipboard with Toast Notification
  // ---------------------------------------------------------------------------
  const copyButtons = document.querySelectorAll('.copy-email-btn');
  const toast = document.getElementById('toast');
  const toastMessage = document.getElementById('toast-message');
  let toastTimer = null;

  function showToast(message) {
    if (!toast) return;

    if (toastMessage) {
      toastMessage.textContent = message;
    }

    toast.classList.add('show');

    // Clear any active timer so toast stays visible if clicked again
    if (toastTimer) {
      clearTimeout(toastTimer);
    }

    toastTimer = setTimeout(() => {
      toast.classList.remove('show');
    }, 3200);
  }

  copyButtons.forEach(button => {
    button.addEventListener('click', async (e) => {
      e.preventDefault();
      const emailToCopy = button.getAttribute('data-email') || 'shayamshett290@gmail.com';

      try {
        if (navigator.clipboard && window.isSecureContext) {
          await navigator.clipboard.writeText(emailToCopy);
        } else {
          // Fallback for non-HTTPS / local execution
          const textarea = document.createElement('textarea');
          textarea.value = emailToCopy;
          textarea.style.position = 'fixed';
          textarea.style.left = '-999999px';
          textarea.style.top = '-999999px';
          document.body.appendChild(textarea);
          textarea.focus();
          textarea.select();
          document.execCommand('copy');
          textarea.remove();
        }

        showToast(`Copied ${emailToCopy} to clipboard! ✓`);
      } catch (err) {
        console.error('Failed to copy email: ', err);
        showToast(`Could not auto-copy. Email: ${emailToCopy}`);
      }
    });
  });

  // ---------------------------------------------------------------------------
  // 3. Print / Save as PDF Triggers
  // ---------------------------------------------------------------------------
  const printTriggers = document.querySelectorAll('#print-btn, .quick-print-trigger');

  printTriggers.forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      window.print();
    });
  });

  // ---------------------------------------------------------------------------
  // 4. ScrollSpy & Navigation Active State
  // ---------------------------------------------------------------------------
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  function updateActiveNavLink() {
    const scrollY = window.scrollY || window.pageYOffset;
    const navOffset = 120; // threshold offset for navbar

    sections.forEach(section => {
      const sectionHeight = section.offsetHeight;
      const sectionTop = section.offsetTop - navOffset;
      const sectionId = section.getAttribute('id');

      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', updateActiveNavLink, { passive: true });
  updateActiveNavLink(); // run once on load

  // ---------------------------------------------------------------------------
  // 5. Mobile Navigation Menu Toggle & Auto-Close
  // ---------------------------------------------------------------------------
  const mobileToggleBtn = document.getElementById('mobile-toggle');
  const navMenu = document.getElementById('nav-menu');

  if (mobileToggleBtn && navMenu) {
    mobileToggleBtn.addEventListener('click', () => {
      const isExpanded = mobileToggleBtn.getAttribute('aria-expanded') === 'true';
      mobileToggleBtn.setAttribute('aria-expanded', !isExpanded);
      mobileToggleBtn.classList.toggle('active');
      navMenu.classList.toggle('open');
    });

    // Close menu when clicking a link
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
        mobileToggleBtn.classList.remove('active');
        mobileToggleBtn.setAttribute('aria-expanded', 'false');
      });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (
        navMenu.classList.contains('open') &&
        !navMenu.contains(e.target) &&
        !mobileToggleBtn.contains(e.target)
      ) {
        navMenu.classList.remove('open');
        mobileToggleBtn.classList.remove('active');
        mobileToggleBtn.setAttribute('aria-expanded', 'false');
      }
    });
  }
});
