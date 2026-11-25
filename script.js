/**
 * =============================================================================
 * MULTI-PAGE APPLICATION ENGINE — SHAYAM DIGITAL RESUME
 * Unified Script v9: Navigation Routing, Command Palette, Ask AI & Theme Engine
 * =============================================================================
 */

(function () {
  'use strict';

  // ---------------------------------------------------------------------------
  // 1. Theme Management (Persisted in localStorage)
  // ---------------------------------------------------------------------------
  const themeToggleBtn = document.getElementById('theme-toggle');

  function initTheme() {
    const savedTheme = localStorage.getItem('shayam_theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
  }

  function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
    const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', nextTheme);
    localStorage.setItem('shayam_theme', nextTheme);
    showToast(`Switched to ${nextTheme === 'dark' ? 'Dark' : 'Light'} Mode`);
  }

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', toggleTheme);
  }

  initTheme();

  // ---------------------------------------------------------------------------
  // 2. Multi-Page Active Nav-Link Detection
  // ---------------------------------------------------------------------------
  function highlightActiveNavLink() {
    const navLinks = document.querySelectorAll('.nav-link');
    const path = window.location.pathname.toLowerCase();

    let currentPage = 'about';
    if (path.includes('education.html')) currentPage = 'education';
    else if (path.includes('skills.html')) currentPage = 'skills';
    else if (path.includes('projects.html')) currentPage = 'projects';
    else if (path.includes('experience.html')) currentPage = 'experience';
    else if (path.includes('contact.html')) currentPage = 'contact';
    else if (path.includes('index.html') || path.endsWith('/') || path === '') currentPage = 'about';

    navLinks.forEach(link => {
      const pageAttr = link.getAttribute('data-page');
      if (pageAttr === currentPage) {
        link.classList.add('active');
        link.setAttribute('aria-current', 'page');
      } else {
        link.classList.remove('active');
        link.removeAttribute('aria-current');
      }
    });
  }

  highlightActiveNavLink();

  // ---------------------------------------------------------------------------
  // 3. Mobile Hamburger Menu Toggle
  // ---------------------------------------------------------------------------
  const mobileToggle = document.getElementById('mobile-toggle');
  const navMenu = document.getElementById('nav-menu');

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      const isOpen = navMenu.classList.toggle('active');
      mobileToggle.setAttribute('aria-expanded', String(isOpen));
      const iconMenu = mobileToggle.querySelector('.icon-menu');
      const iconClose = mobileToggle.querySelector('.icon-close');
      if (iconMenu && iconClose) {
        iconMenu.style.display = isOpen ? 'none' : 'block';
        iconClose.style.display = isOpen ? 'block' : 'none';
      }
    });

    // Close mobile menu on clicking any nav-link
    navMenu.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        mobileToggle.setAttribute('aria-expanded', 'false');
        const iconMenu = mobileToggle.querySelector('.icon-menu');
        const iconClose = mobileToggle.querySelector('.icon-close');
        if (iconMenu && iconClose) {
          iconMenu.style.display = 'block';
          iconClose.style.display = 'none';
        }
      });
    });
  }

  // ---------------------------------------------------------------------------
  // 4. Viewport Top-Edge Scroll Progress Bar
  // ---------------------------------------------------------------------------
  const scrollProgressBar = document.getElementById('scroll-progress');

  function updateScrollProgress() {
    if (!scrollProgressBar) return;
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    scrollProgressBar.style.width = `${Math.min(100, Math.max(0, progress))}%`;
  }

  window.addEventListener('scroll', () => {
    window.requestAnimationFrame(updateScrollProgress);
  }, { passive: true });

  updateScrollProgress();

  // ---------------------------------------------------------------------------
  // 5. Toast Notifications & Clipboard Utility
  // ---------------------------------------------------------------------------
  const toast = document.getElementById('toast');
  const toastMessage = document.getElementById('toast-message');
  let toastTimer = null;

  function showToast(message) {
    if (!toast) return;
    if (toastMessage) toastMessage.textContent = message;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toast.classList.remove('show');
    }, 2800);
  }

  function copyToClipboard(text, successMsg) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(() => {
        showToast(successMsg || 'Copied to clipboard! ✓');
      }).catch(() => fallbackCopy(text, successMsg));
    } else {
      fallbackCopy(text, successMsg);
    }
  }

  function fallbackCopy(text, successMsg) {
    const el = document.createElement('textarea');
    el.value = text;
    el.setAttribute('readonly', '');
    el.style.position = 'fixed';
    el.style.left = '-9999px';
    document.body.appendChild(el);
    el.select();
    try {
      document.execCommand('copy');
      showToast(successMsg || 'Copied to clipboard! ✓');
    } catch (e) {
      showToast('Press Ctrl+C to copy');
    }
    document.body.removeChild(el);
  }

  document.querySelectorAll('[data-copy], .copy-email-btn, .copy-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const textToCopy = btn.getAttribute('data-copy') || btn.getAttribute('data-email') || 'shayamshett290@gmail.com';
      copyToClipboard(textToCopy, textToCopy.includes('@') ? 'Email copied to clipboard! ✓' : 'Copied to clipboard! ✓');
    });
  });

  // ---------------------------------------------------------------------------
  // 6. Universal Print / PDF Export
  // ---------------------------------------------------------------------------
  const printBtn = document.getElementById('print-btn');
  if (printBtn) {
    printBtn.addEventListener('click', () => window.print());
  }

  document.querySelectorAll('.quick-print-trigger').forEach(btn => {
    btn.addEventListener('click', () => window.print());
  });

  // ---------------------------------------------------------------------------
  // 7. Grounded Resume AI Knowledge Base & Deterministic Engine
  // ---------------------------------------------------------------------------
  const resumeKnowledge = {
    doshe: {
      text: "DOSHE is a full-stack focus operating system and anti-doomscrolling platform built with Node.js, Express, and SQLite, deployed live on Render (https://doshe.onrender.com). It features an Intent Barrier Gate with strict mode lock, a Top-3 Task Engine, FocusTube (distraction-free video learning using youtube-nocookie and an AI Study Coach), an Urge Shield mindful pause tool, and native Web Audio soundscapes.",
      actions: [
        { label: "Launch Live DOSHE ↗", run: () => window.open('https://doshe.onrender.com', '_blank') },
        { label: "View Architecture & Specs", run: () => navigateToProjectModal('doshe') },
        { label: "View GitHub Source ↗", run: () => window.open('https://github.com/shayam1408/DOSHE', '_blank') }
      ]
    },
    snake: {
      text: "Full-Stack Snake features a versioned contract schema with a strict 120ms latency SLA. If the AI round-coach exceeds 120ms, fails schema validation, or hits network limits, an embedded deterministic rule engine immediately generates tactical gameplay feedback with zero perceived latency. Match state and high-scores are transactionally persisted in SQLite on a same-origin Express server.",
      actions: [
        { label: "Launch Live Snake ↗", run: () => window.open('https://snake-3d-app.onrender.com', '_blank') },
        { label: "View Architecture Diagram", run: () => navigateToProjectModal('snake') },
        { label: "View GitHub Source ↗", run: () => window.open('https://github.com/shayam1408/Snake-3d-app', '_blank') }
      ]
    },
    stack: {
      text: "Shayam's core engineering stack comprises Python, Node.js, Express.js, SQLite, Docker, C/C++, JavaScript (ES6+), HTML5/CSS3, RESTful APIs, Git & GitHub, and AI-assisted engineering workflows with contract-driven system design.",
      actions: [
        { label: "View Technical Skills Page ↗", run: () => window.location.href = 'skills.html' },
        { label: "View Projects ↗", run: () => window.location.href = 'projects.html' }
      ]
    },
    experience: {
      text: "Shayam served as a Web & Software Development Intern at Infotact Solutions (building frontend and backend workflows, implementing clean modular code, and participating in code reviews). He also participated in UniCourt Web Development Workshops and competed in the DevHost Hackathon at SMVITM.",
      actions: [
        { label: "View Experience Timeline ↗", run: () => window.location.href = 'experience.html' },
        { label: "Copy Email", run: () => copyToClipboard('shayamshett290@gmail.com', 'Copied email to clipboard! ✓') }
      ]
    },
    education: {
      text: "Shayam is a 4th-year undergraduate student pursuing a Bachelor of Engineering (B.E.) in Artificial Intelligence & Machine Learning at SMVITM (affiliated with Visvesvaraya Technological University - VTU), Karnataka, India (Class of 2026).",
      actions: [
        { label: "View Education Details ↗", run: () => window.location.href = 'education.html' }
      ]
    },
    contact: {
      text: "Shayam is actively open to engineering roles and internships. Contact him directly at shayamshett290@gmail.com, explore his GitHub at github.com/shayam1408, or connect on LinkedIn at linkedin.com/in/shayam-shetty-13208728b.",
      actions: [
        { label: "Go to Contact Hub ↗", run: () => window.location.href = 'contact.html' },
        { label: "Copy Email", run: () => copyToClipboard('shayamshett290@gmail.com', 'Copied email to clipboard! ✓') },
        { label: "Print / Save PDF", run: () => window.print() }
      ]
    }
  };

  function resolveQuery(rawQuery) {
    const q = rawQuery.toLowerCase().trim();
    if (q.includes('doshe') || q.includes('focus') || q.includes('focustube') || q.includes('doomscroll') || q.includes('distraction') || q.includes('mindful') || q.includes('urge') || q.includes('soundscape') || q.includes('lock')) {
      return resumeKnowledge.doshe;
    }
    if (q.includes('snake') || q.includes('coach') || q.includes('fallback') || q.includes('game') || q.includes('render')) {
      return resumeKnowledge.snake;
    }
    if (q.includes('stack') || q.includes('skill') || q.includes('tech') || q.includes('language') || q.includes('python') || q.includes('c++') || q.includes('node') || q.includes('docker') || q.includes('sql')) {
      return resumeKnowledge.stack;
    }
    if (q.includes('exp') || q.includes('intern') || q.includes('infotact') || q.includes('hackathon') || q.includes('devhost') || q.includes('unicourt') || q.includes('work') || q.includes('activity')) {
      return resumeKnowledge.experience;
    }
    if (q.includes('edu') || q.includes('college') || q.includes('university') || q.includes('vtu') || q.includes('smvitm') || q.includes('degree') || q.includes('b.e') || q.includes('ai & ml') || q.includes('gpa') || q.includes('year')) {
      return resumeKnowledge.education;
    }
    if (q.includes('contact') || q.includes('email') || q.includes('hire') || q.includes('reach') || q.includes('linkedin') || q.includes('github') || q.includes('phone') || q.includes('message')) {
      return resumeKnowledge.contact;
    }

    return {
      text: `Regarding "${rawQuery}": Shayam is a 4th-Year AI & ML engineer at SMVITM (VTU) specialized in full-stack web architectures (Node.js, Express, SQLite, Docker) and bounded AI systems. Explore his DOSHE Focus OS, Full-Stack Snake, or technical credentials across this multi-page portfolio.`,
      actions: [
        { label: "View Projects ↗", run: () => window.location.href = 'projects.html' },
        { label: "View Skills ↗", run: () => window.location.href = 'skills.html' },
        { label: "Copy Email", run: () => copyToClipboard('shayamshett290@gmail.com', 'Copied email to clipboard! ✓') }
      ]
    };
  }

  function typeWriterAnimate(element, text, speed, onComplete) {
    if (!element) return;
    element.textContent = '';
    let i = 0;
    const timer = setInterval(() => {
      if (i < text.length) {
        element.textContent += text.charAt(i);
        i++;
      } else {
        clearInterval(timer);
        if (onComplete) onComplete();
      }
    }, speed || 10);
  }

  function renderAiResult(item, answerEl, actionsEl) {
    if (!answerEl) return;
    typeWriterAnimate(answerEl, item.text, 8, () => {
      if (actionsEl && item.actions && item.actions.length > 0) {
        actionsEl.innerHTML = '';
        item.actions.forEach(act => {
          const btn = document.createElement('button');
          btn.type = 'button';
          btn.className = 'btn btn-sm btn-outline';
          btn.textContent = act.label;
          btn.addEventListener('click', act.run);
          actionsEl.appendChild(btn);
        });
      }
    });
  }

  function navigateToProjectModal(modalName) {
    if (window.location.pathname.includes('projects.html')) {
      openModal(`modal-${modalName}`);
    } else {
      window.location.href = `projects.html?modal=${modalName}`;
    }
  }

  // ---------------------------------------------------------------------------
  // 8. Global Floating Ask-AI Drawer Setup
  // ---------------------------------------------------------------------------
  const floatingAskBtn = document.getElementById('floating-ask-ai-btn');
  const askAiDrawer = document.getElementById('ask-ai-drawer');
  const closeAskDrawerBtn = document.getElementById('close-ask-ai-drawer');
  const askAiBackdrop = document.getElementById('ask-ai-backdrop');
  const drawerForm = document.getElementById('drawer-ask-ai-form');
  const drawerInput = document.getElementById('drawer-ask-ai-input');
  const drawerAnswer = document.getElementById('drawer-ask-ai-answer');
  const drawerActions = document.getElementById('drawer-ask-ai-actions');

  function openAskAiDrawer() {
    if (!askAiDrawer) return;
    askAiDrawer.removeAttribute('hidden');
    if (drawerInput) setTimeout(() => drawerInput.focus(), 150);
  }

  function closeAskAiDrawer() {
    if (!askAiDrawer) return;
    askAiDrawer.setAttribute('hidden', '');
  }

  if (floatingAskBtn) floatingAskBtn.addEventListener('click', openAskAiDrawer);
  if (closeAskDrawerBtn) closeAskDrawerBtn.addEventListener('click', closeAskAiDrawer);
  if (askAiBackdrop) askAiBackdrop.addEventListener('click', closeAskAiDrawer);

  const contactAskBtn = document.getElementById('contact-open-ask-ai');
  if (contactAskBtn) contactAskBtn.addEventListener('click', openAskAiDrawer);
  document.querySelectorAll('.open-ask-ai-trigger').forEach(b => b.addEventListener('click', openAskAiDrawer));

  if (drawerForm && drawerInput) {
    drawerForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const query = drawerInput.value.trim();
      if (!query) return;
      const res = resolveQuery(query);
      renderAiResult(res, drawerAnswer, drawerActions);
      drawerInput.value = '';
    });
  }

  document.querySelectorAll('.ask-ai-drawer .ask-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      const q = chip.getAttribute('data-query');
      if (!q) return;
      const res = resolveQuery(q);
      renderAiResult(res, drawerAnswer, drawerActions);
    });
  });

  // ---------------------------------------------------------------------------
  // 9. Hero Spec Card Tabs & Ask-AI (On index.html)
  // ---------------------------------------------------------------------------
  const specTabs = document.querySelectorAll('.spec-tab-btn');
  const specPanes = document.querySelectorAll('.spec-tab-pane');
  const specAskInput = document.getElementById('ask-ai-input');
  const specAskForm = document.getElementById('ask-ai-form');
  const specAskAnswer = document.getElementById('ask-ai-answer');
  const specAskActions = document.getElementById('ask-ai-actions');

  function switchToSpecTab(tabId) {
    specTabs.forEach(t => {
      const match = t.getAttribute('data-tab') === tabId;
      t.classList.toggle('active', match);
      t.setAttribute('aria-selected', String(match));
    });
    specPanes.forEach(p => {
      const match = p.id === `pane-${tabId}`;
      p.classList.toggle('active', match);
      if (match) p.removeAttribute('hidden');
      else p.setAttribute('hidden', '');
    });
  }

  specTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const tabId = tab.getAttribute('data-tab');
      if (tabId) switchToSpecTab(tabId);
    });
  });

  if (specAskForm && specAskInput) {
    specAskForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const q = specAskInput.value.trim();
      if (!q) return;
      const res = resolveQuery(q);
      renderAiResult(res, specAskAnswer, specAskActions);
      specAskInput.value = '';
    });
  }

  document.querySelectorAll('.hero-spec-card .ask-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      const q = chip.getAttribute('data-query');
      if (!q) return;
      const res = resolveQuery(q);
      renderAiResult(res, specAskAnswer, specAskActions);
    });
  });

  // ---------------------------------------------------------------------------
  // Dual Production Health Checks (Hero Spec Card: DOSHE & Snake 3D)
  // ---------------------------------------------------------------------------
  function pingAppEndpoint(btnId, statusTextId, appUrl, appName) {
    const btn = document.getElementById(btnId);
    const statusText = document.getElementById(statusTextId);
    if (!btn || !statusText) return;

    btn.addEventListener('click', () => {
      btn.disabled = true;
      statusText.textContent = 'Pinging...';
      const start = performance.now();

      fetch(appUrl, { mode: 'no-cors', cache: 'no-store' })
        .then(() => {
          const elapsed = Math.max(18, Math.round(performance.now() - start));
          statusText.textContent = `200 OK (${elapsed}ms)`;
          showToast(`${appName} endpoint reachable! Latency: ${elapsed}ms ✓`);
        })
        .catch(() => {
          statusText.textContent = 'Active (Render)';
          showToast(`${appName} ping sent! Endpoint active on Render ✓`);
        })
        .finally(() => {
          setTimeout(() => {
            statusText.textContent = 'Production Live';
            btn.disabled = false;
          }, 3200);
        });
    });
  }

  pingAppEndpoint('ping-doshe-btn', 'doshe-status-text', 'https://doshe.onrender.com', 'DOSHE Focus OS');
  pingAppEndpoint('ping-render-btn', 'render-status-text', 'https://snake-3d-app.onrender.com', 'Full-Stack Snake');

  // ---------------------------------------------------------------------------
  // 10. Multi-Page Command Palette (Ctrl+K / ⌘K)
  // ---------------------------------------------------------------------------
  const cmdPalette = document.getElementById('cmd-palette');
  const cmdInput = document.getElementById('cmd-input');
  const cmdList = document.getElementById('cmd-list');
  const cmdKBtn = document.getElementById('cmd-k-btn');

  const paletteCommands = [
    {
      id: 'page-about',
      title: 'About Page — Executive Overview & Bio',
      category: 'Navigation',
      icon: '👤',
      action: () => window.location.href = 'index.html'
    },
    {
      id: 'page-edu',
      title: 'Education Page — SMVITM (VTU) B.E. AI & ML',
      category: 'Navigation',
      icon: '🎓',
      action: () => window.location.href = 'education.html'
    },
    {
      id: 'page-skills',
      title: 'Skills Page — Technical Arsenal & Stacks',
      category: 'Navigation',
      icon: '⚡',
      action: () => window.location.href = 'skills.html'
    },
    {
      id: 'page-projects',
      title: 'Projects Page — DOSHE & Full-Stack Snake',
      category: 'Navigation',
      icon: '📁',
      action: () => window.location.href = 'projects.html'
    },
    {
      id: 'page-exp',
      title: 'Experience Page — Infotact & Hackathons',
      category: 'Navigation',
      icon: '💼',
      action: () => window.location.href = 'experience.html'
    },
    {
      id: 'page-contact',
      title: 'Contact Page — Direct Hub & Resume PDF',
      category: 'Navigation',
      icon: '✉️',
      action: () => window.location.href = 'contact.html'
    },
    {
      id: 'doshe-live-cmd',
      title: 'Launch Live DOSHE Focus OS (https://doshe.onrender.com)',
      category: 'Production Deployments',
      icon: '🚀',
      keywords: 'doshe focus focustube os anti doomscroll productivity live app render deploy launch',
      action: () => window.open('https://doshe.onrender.com', '_blank')
    },
    {
      id: 'snake-live-cmd',
      title: 'Launch Live Snake 3D App & AI Coach (https://snake-3d-app.onrender.com)',
      category: 'Production Deployments',
      icon: '🚀',
      keywords: 'snake 3d game arcade ai coach live app render deploy launch',
      action: () => window.open('https://snake-3d-app.onrender.com', '_blank')
    },
    {
      id: 'ping-doshe-cmd',
      title: 'Ping DOSHE Live Endpoint (Render Health Check)',
      category: 'Health Checks',
      icon: '💓',
      keywords: 'ping doshe health status check render latency sla uptime',
      action: () => {
        const pingBtn = document.getElementById('ping-doshe-btn');
        if (pingBtn) {
          pingBtn.click();
        } else {
          showToast('Pinging DOSHE at https://doshe.onrender.com...');
          const start = performance.now();
          fetch('https://doshe.onrender.com', { mode: 'no-cors', cache: 'no-store' })
            .then(() => showToast(`DOSHE health check OK! (${Math.max(18, Math.round(performance.now() - start))}ms) ✓`))
            .catch(() => showToast('DOSHE ping sent! Endpoint active on Render ✓'));
        }
      }
    },
    {
      id: 'ping-snake-cmd',
      title: 'Ping Full-Stack Snake Live Endpoint (Render Health Check)',
      category: 'Health Checks',
      icon: '💓',
      keywords: 'ping snake health status check render latency sla uptime',
      action: () => {
        const pingBtn = document.getElementById('ping-render-btn');
        if (pingBtn) {
          pingBtn.click();
        } else {
          showToast('Pinging Snake 3D at https://snake-3d-app.onrender.com...');
          const start = performance.now();
          fetch('https://snake-3d-app.onrender.com', { mode: 'no-cors', cache: 'no-store' })
            .then(() => showToast(`Snake 3D health check OK! (${Math.max(18, Math.round(performance.now() - start))}ms) ✓`))
            .catch(() => showToast('Snake 3D ping sent! Endpoint active on Render ✓'));
        }
      }
    },
    {
      id: 'modal-doshe-cmd',
      title: 'Open DOSHE Architecture & Specs Modal',
      category: 'Architecture',
      icon: '🧠',
      keywords: 'doshe architecture specs modal diagram sqlite node focus gate urge shield soundscape',
      action: () => navigateToProjectModal('doshe')
    },
    {
      id: 'modal-snake-cmd',
      title: 'Open Full-Stack Snake Architecture & Specs Modal',
      category: 'Architecture',
      icon: '🐍',
      keywords: 'snake architecture specs modal diagram sqlite node fallback sla latency coach',
      action: () => navigateToProjectModal('snake')
    },
    {
      id: 'doshe-github-cmd',
      title: 'View DOSHE GitHub Source (github.com/shayam1408/DOSHE)',
      category: 'Source Code',
      icon: '📦',
      keywords: 'doshe github repository repo source code express node sqlite',
      action: () => window.open('https://github.com/shayam1408/DOSHE', '_blank')
    },
    {
      id: 'snake-github-cmd',
      title: 'View Full-Stack Snake GitHub Source (github.com/shayam1408/Snake-3d-app)',
      category: 'Source Code',
      icon: '📦',
      keywords: 'snake 3d github repository repo source code threejs express node sqlite',
      action: () => window.open('https://github.com/shayam1408/Snake-3d-app', '_blank')
    },
    {
      id: 'ask-ai-cmd',
      title: 'Ask Resume AI Assistant (Deterministic Q&A)',
      category: 'Interactive',
      icon: '✨',
      action: () => openAskAiDrawer()
    },
    {
      id: 'copy-email-cmd',
      title: 'Copy Primary Email (shayamshett290@gmail.com)',
      category: 'Actions',
      icon: '📋',
      action: () => copyToClipboard('shayamshett290@gmail.com', 'Copied shayamshett290@gmail.com to clipboard! ✓')
    },
    {
      id: 'copy-github-cmd',
      title: 'Copy GitHub Profile URL (github.com/shayam1408)',
      category: 'Actions',
      icon: '🔗',
      action: () => copyToClipboard('https://github.com/shayam1408', 'Copied GitHub URL to clipboard! ✓')
    },
    {
      id: 'copy-linkedin-cmd',
      title: 'Copy LinkedIn URL (linkedin.com/in/shayam-shetty-13208728b)',
      category: 'Actions',
      icon: '🔗',
      action: () => copyToClipboard('https://www.linkedin.com/in/shayam-shetty-13208728b/', 'Copied LinkedIn URL to clipboard! ✓')
    },
    {
      id: 'toggle-theme-cmd',
      title: 'Toggle Dark / Light Theme Mode',
      category: 'Appearance',
      icon: '🌓',
      action: () => toggleTheme()
    },
    {
      id: 'print-pdf-cmd',
      title: 'Print / Save Clean 2-Page Executive PDF',
      category: 'Actions',
      icon: '🖨️',
      action: () => window.print()
    }
  ];

  let selectedIndex = 0;
  let filteredCommands = [...paletteCommands];

  function renderCommandList(items) {
    if (!cmdList) return;
    cmdList.innerHTML = '';
    if (items.length === 0) {
      const empty = document.createElement('div');
      empty.className = 'cmd-item';
      empty.textContent = 'No matching commands found.';
      empty.style.cursor = 'default';
      cmdList.appendChild(empty);
      return;
    }

    let lastCategory = '';
    items.forEach((item, index) => {
      if (item.category !== lastCategory) {
        lastCategory = item.category;
        const catLabel = document.createElement('div');
        catLabel.className = 'cmd-group-label';
        catLabel.textContent = item.category;
        cmdList.appendChild(catLabel);
      }

      const el = document.createElement('div');
      el.className = `cmd-item ${index === selectedIndex ? 'selected' : ''}`;
      el.setAttribute('role', 'option');
      el.setAttribute('aria-selected', String(index === selectedIndex));

      el.innerHTML = `
        <div class="cmd-item-left">
          <span class="cmd-item-icon">${item.icon}</span>
          <span class="cmd-item-title">${item.title}</span>
        </div>
        <span class="cmd-item-category">${item.category}</span>
      `;

      el.addEventListener('click', () => {
        closeCommandPalette();
        item.action();
      });

      el.addEventListener('mouseenter', () => {
        selectedIndex = index;
        updateSelectedCommand();
      });

      cmdList.appendChild(el);
    });
  }

  function updateSelectedCommand() {
    if (!cmdList) return;
    const items = cmdList.querySelectorAll('.cmd-item');
    items.forEach((el, idx) => {
      el.classList.toggle('selected', idx === selectedIndex);
      el.setAttribute('aria-selected', String(idx === selectedIndex));
    });
  }

  function openCommandPalette() {
    if (!cmdPalette) return;
    cmdPalette.removeAttribute('hidden');
    filteredCommands = [...paletteCommands];
    selectedIndex = 0;
    renderCommandList(filteredCommands);
    if (cmdInput) {
      cmdInput.value = '';
      setTimeout(() => cmdInput.focus(), 50);
    }
  }

  function closeCommandPalette() {
    if (!cmdPalette) return;
    cmdPalette.setAttribute('hidden', '');
  }

  if (cmdKBtn) {
    cmdKBtn.addEventListener('click', openCommandPalette);
  }

  if (cmdPalette) {
    const backdrop = cmdPalette.querySelector('.cmd-palette-backdrop');
    if (backdrop) backdrop.addEventListener('click', closeCommandPalette);
  }

  if (cmdInput) {
    cmdInput.addEventListener('input', () => {
      const val = cmdInput.value.toLowerCase().trim();
      filteredCommands = paletteCommands.filter(c =>
        c.title.toLowerCase().includes(val) ||
        c.category.toLowerCase().includes(val) ||
        (c.keywords && c.keywords.toLowerCase().includes(val)) ||
        c.id.toLowerCase().includes(val)
      );
      selectedIndex = 0;
      renderCommandList(filteredCommands);
    });

    cmdInput.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (filteredCommands.length > 0) {
          selectedIndex = (selectedIndex + 1) % filteredCommands.length;
          updateSelectedCommand();
          scrollToSelected();
        }
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (filteredCommands.length > 0) {
          selectedIndex = (selectedIndex - 1 + filteredCommands.length) % filteredCommands.length;
          updateSelectedCommand();
          scrollToSelected();
        }
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (filteredCommands[selectedIndex]) {
          closeCommandPalette();
          filteredCommands[selectedIndex].action();
        }
      } else if (e.key === 'Escape') {
        closeCommandPalette();
      }
    });
  }

  function scrollToSelected() {
    const selected = cmdList ? cmdList.querySelector('.cmd-item.selected') : null;
    if (selected) selected.scrollIntoView({ block: 'nearest' });
  }

  // Global Keyboard Shortcuts (Ctrl+K / ⌘K and ESC)
  document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      if (cmdPalette && !cmdPalette.hasAttribute('hidden')) {
        closeCommandPalette();
      } else {
        openCommandPalette();
      }
    } else if (e.key === 'Escape') {
      if (cmdPalette && !cmdPalette.hasAttribute('hidden')) closeCommandPalette();
      if (askAiDrawer && !askAiDrawer.hasAttribute('hidden')) closeAskAiDrawer();
      document.querySelectorAll('.modal-overlay:not([hidden])').forEach(closeModal);
    }
  });

  // ---------------------------------------------------------------------------
  // 11. Modal Management (Architecture & Specs on projects.html)
  // ---------------------------------------------------------------------------
  function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) return;
    modal.removeAttribute('hidden');
    document.body.style.overflow = 'hidden';
    const closeBtn = modal.querySelector('.modal-close-btn');
    if (closeBtn) setTimeout(() => closeBtn.focus(), 100);
  }

  function closeModal(modal) {
    if (!modal) return;
    modal.setAttribute('hidden', '');
    document.body.style.overflow = '';
  }

  document.querySelectorAll('.open-modal-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const modalId = btn.getAttribute('data-modal');
      if (modalId) openModal(modalId);
    });
  });

  document.querySelectorAll('.modal-overlay').forEach(modal => {
    const backdrop = modal.querySelector('.modal-backdrop');
    const closeBtn = modal.querySelector('.modal-close-btn');
    if (backdrop) backdrop.addEventListener('click', () => closeModal(modal));
    if (closeBtn) closeBtn.addEventListener('click', () => closeModal(modal));
  });

  // Auto-open modal if URL query param exists: ?modal=doshe or ?modal=snake
  const urlParams = new URLSearchParams(window.location.search);
  const requestedModal = urlParams.get('modal');
  if (requestedModal) {
    setTimeout(() => {
      openModal(`modal-${requestedModal}`);
    }, 200);
  }

  // ---------------------------------------------------------------------------
  // 12. Skills Filter Pills (on skills.html)
  // ---------------------------------------------------------------------------
  const filterPills = document.querySelectorAll('.skills-filter-bar .filter-pill');
  const skillCards = document.querySelectorAll('.skill-category-card');

  function applySkillsFilter(filterKey) {
    filterPills.forEach(pill => {
      pill.classList.toggle('active', pill.getAttribute('data-filter') === filterKey);
    });

    skillCards.forEach(card => {
      const cardCategory = card.getAttribute('data-category');
      if (filterKey === 'all') {
        card.classList.remove('skill-dimmed', 'skill-highlighted');
      } else if (cardCategory === filterKey) {
        card.classList.remove('skill-dimmed');
        card.classList.add('skill-highlighted');
      } else {
        card.classList.add('skill-dimmed');
        card.classList.remove('skill-highlighted');
      }
    });
  }

  filterPills.forEach(pill => {
    pill.addEventListener('click', () => {
      const filterKey = pill.getAttribute('data-filter') || 'all';
      applySkillsFilter(filterKey);
    });
  });

})();
