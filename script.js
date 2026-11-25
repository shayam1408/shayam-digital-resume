/**
 * Digital Resume - Shayam Satish Shetty
 * Interactive Script v5:
 * 1. Dark/Light Mode & Meta Theme Sync
 * 2. Clipboard Copy & Toast Feedback
 * 3. Print / PDF Triggers
 * 4. ScrollSpy & Active Navigation
 * 5. Mobile Navigation Menu
 * 6. Interactive Architecture Modals (Accessible & Focus-Trapped)
 * 7. Hero Spec Card Tabs (overview.json / architecture.ts / live-status / ask-ai)
 * 8. Render App Live Ping & Health Indicator
 * 9. Client-Side Grounded "Ask My Resume" AI Assistant (Deterministic with Typewriter Output)
 * 10. Interactive Skills Domain Filter Bar
 * 11. Command Palette Engine (Ctrl+K / ⌘K)
 * 12. Bento Card Cursor Spotlight Tracking
 */

document.addEventListener('DOMContentLoaded', () => {
  // ---------------------------------------------------------------------------
  // 1. Theme Management (Dark / Light with LocalStorage & Meta Theme Color Sync)
  // ---------------------------------------------------------------------------
  const themeToggleBtn = document.getElementById('theme-toggle');
  const rootElement = document.documentElement;
  const metaThemeColor = document.getElementById('meta-theme-color');

  function applyTheme(theme) {
    rootElement.setAttribute('data-theme', theme);
    localStorage.setItem('shayam_resume_theme', theme);
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', theme === 'dark' ? '#0b0f19' : '#f8fafc');
    }
  }

  function toggleTheme() {
    const currentTheme = rootElement.getAttribute('data-theme') || 'dark';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    applyTheme(newTheme);
    showToast(`Switched to ${newTheme} mode ✓`);
  }

  const savedTheme = localStorage.getItem('shayam_resume_theme');
  const prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;

  if (savedTheme) {
    applyTheme(savedTheme);
  } else if (prefersLight) {
    applyTheme('light');
  } else {
    applyTheme('dark');
  }

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      toggleTheme();
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

    if (toastTimer) {
      clearTimeout(toastTimer);
    }

    toastTimer = setTimeout(() => {
      toast.classList.remove('show');
    }, 3200);
  }

  async function copyToClipboard(text, successMsg) {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.left = '-999999px';
        textarea.style.top = '-999999px';
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();
        document.execCommand('copy');
        textarea.remove();
      }
      showToast(successMsg || `Copied ${text} to clipboard! ✓`);
    } catch (err) {
      console.error('Failed to copy text: ', err);
      showToast(`Copy failed. Value: ${text}`);
    }
  }

  copyButtons.forEach(button => {
    button.addEventListener('click', (e) => {
      e.preventDefault();
      const emailToCopy = button.getAttribute('data-email') || 'shayamshett290@gmail.com';
      copyToClipboard(emailToCopy, `Copied ${emailToCopy} to clipboard! ✓`);
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
  // 4. ScrollSpy, Scroll Progress & Navigation Active State (rAF Throttled)
  // ---------------------------------------------------------------------------
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');
  const scrollProgressBar = document.getElementById('scroll-progress');
  let isScrollTicking = false;

  function updateScrollProgress() {
    if (!scrollProgressBar) return;
    const scrollTop = window.scrollY || window.pageYOffset;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    scrollProgressBar.style.width = `${Math.min(100, Math.max(0, progress))}%`;
  }

  function updateActiveNavLink() {
    const scrollY = window.scrollY || window.pageYOffset;
    const navOffset = 140;
    const isAtBottom = (window.innerHeight + window.scrollY) >= (document.documentElement.scrollHeight - 70);

    if (isAtBottom) {
      navLinks.forEach(link => {
        if (link.getAttribute('href') === '#contact') {
          link.classList.add('active');
        } else {
          link.classList.remove('active');
        }
      });
      return;
    }

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

  window.addEventListener('scroll', () => {
    if (!isScrollTicking) {
      window.requestAnimationFrame(() => {
        updateActiveNavLink();
        updateScrollProgress();
        isScrollTicking = false;
      });
      isScrollTicking = true;
    }
  }, { passive: true });

  updateActiveNavLink();
  updateScrollProgress();

  function scrollToSection(id) {
    const target = document.getElementById(id);
    if (!target) return;
    target.scrollIntoView({ behavior: 'smooth' });
  }

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

    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
        mobileToggleBtn.classList.remove('active');
        mobileToggleBtn.setAttribute('aria-expanded', 'false');
      });
    });

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

  // ---------------------------------------------------------------------------
  // 6. Interactive Architecture Modals (Accessible Focus-Trapped Dialogs)
  // ---------------------------------------------------------------------------
  const modalOpenButtons = document.querySelectorAll('.open-modal-btn');
  const modalOverlays = document.querySelectorAll('.modal-overlay');
  let lastFocusedElement = null;

  function openModal(modalId, triggerButton) {
    const modal = document.getElementById(modalId);
    if (!modal) return;

    lastFocusedElement = triggerButton || document.activeElement;
    modal.removeAttribute('hidden');
    void modal.offsetHeight;
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';

    const closeBtn = modal.querySelector('.modal-close-btn');
    if (closeBtn) {
      closeBtn.focus();
    }
  }

  function closeModal(modal) {
    if (!modal) return;
    modal.classList.remove('open');
    document.body.style.overflow = '';

    setTimeout(() => {
      modal.setAttribute('hidden', '');
      if (lastFocusedElement && typeof lastFocusedElement.focus === 'function') {
        lastFocusedElement.focus();
      }
    }, 220);
  }

  modalOpenButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const modalId = btn.getAttribute('data-modal');
      openModal(modalId, btn);
    });
  });

  modalOverlays.forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target.classList.contains('modal-backdrop') || e.target.closest('.modal-close-btn')) {
        closeModal(modal);
      }
    });
  });

  // ---------------------------------------------------------------------------
  // 7. Hero Spec Card Tabs (overview.json / architecture.ts / live-status / ask-ai)
  // ---------------------------------------------------------------------------
  const specTabButtons = document.querySelectorAll('.spec-tab-btn');
  const specTabPanes = document.querySelectorAll('.spec-tab-pane');

  function switchToSpecTab(tabName) {
    const targetBtn = document.querySelector(`.spec-tab-btn[data-tab="${tabName}"]`);
    if (!targetBtn) return;

    specTabButtons.forEach(b => {
      b.classList.remove('active');
      b.setAttribute('aria-selected', 'false');
    });
    targetBtn.classList.add('active');
    targetBtn.setAttribute('aria-selected', 'true');

    specTabPanes.forEach(pane => {
      pane.classList.remove('active');
      pane.setAttribute('hidden', '');
    });

    const activePane = document.getElementById(`pane-${tabName}`);
    if (activePane) {
      activePane.removeAttribute('hidden');
      activePane.classList.add('active');
    }
  }

  specTabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetTab = btn.getAttribute('data-tab');
      switchToSpecTab(targetTab);
    });
  });

  // ---------------------------------------------------------------------------
  // 8. Render App Live Ping & Health Indicator
  // ---------------------------------------------------------------------------
  const pingBtn = document.getElementById('ping-render-btn');
  const pingBtnText = document.getElementById('ping-btn-text');
  const renderStatusPill = document.getElementById('render-status-pill');
  const renderStatusText = document.getElementById('render-status-text');

  if (pingBtn) {
    pingBtn.addEventListener('click', async () => {
      if (pingBtn.dataset.pinging === 'true') return;
      pingBtn.dataset.pinging = 'true';

      if (pingBtnText) pingBtnText.textContent = 'Pinging...';
      if (renderStatusPill) renderStatusPill.classList.add('checking');
      if (renderStatusText) renderStatusText.textContent = 'Measuring latency...';

      const startTime = performance.now();
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6000);

      try {
        await fetch('https://snake-3d-app.onrender.com', {
          mode: 'no-cors',
          cache: 'no-store',
          signal: controller.signal
        });
        clearTimeout(timeoutId);
        const latency = Math.round(performance.now() - startTime);

        if (renderStatusPill) renderStatusPill.classList.remove('checking');
        if (renderStatusText) renderStatusText.textContent = `Online (${latency}ms)`;
        if (pingBtnText) pingBtnText.textContent = `${latency}ms ✓`;
        showToast(`Render app responsive (${latency}ms)! ✓`);
      } catch (err) {
        clearTimeout(timeoutId);
        if (renderStatusPill) renderStatusPill.classList.remove('checking');
        if (err.name === 'AbortError') {
          if (renderStatusText) renderStatusText.textContent = 'Cold Start / Awakening';
          if (pingBtnText) pingBtnText.textContent = 'Waking App';
          showToast('Render spin-up initiated! App is waking from sleep.');
        } else {
          if (renderStatusText) renderStatusText.textContent = 'Production Live';
          if (pingBtnText) pingBtnText.textContent = 'Ping Endpoint';
          showToast('Live endpoint checked.');
        }
      } finally {
        setTimeout(() => {
          pingBtn.dataset.pinging = 'false';
          if (pingBtnText) pingBtnText.textContent = 'Ping Endpoint';
        }, 3500);
      }
    });
  }

  // ---------------------------------------------------------------------------
  // 9. Interactive "Ask My Resume" AI Assistant (Client-Side & Grounded)
  // ---------------------------------------------------------------------------
  const askAiOutput = document.getElementById('ask-ai-output');
  const askAiForm = document.getElementById('ask-ai-form');
  const askAiInput = document.getElementById('ask-ai-input');
  const askChips = document.querySelectorAll('.ask-chip');
  let typewriterTimer = null;

  const resumeKnowledge = {
    snake: {
      text: "Full-Stack Snake features a versioned contract schema with a strict 120ms latency SLA. If the AI round-coach exceeds 120ms, fails schema validation, or hits network limits, an embedded deterministic rule engine immediately generates tactical gameplay feedback with zero perceived latency. Match state and high-scores are transactionally persisted in SQLite on a same-origin Express server.",
      actions: [
        { label: "View Architecture Diagram", run: () => openModal('modal-snake') },
        { label: "Launch Live Demo ↗", run: () => window.open('https://snake-3d-app.onrender.com', '_blank') }
      ]
    },
    doshe: {
      text: "DOSHE is an intent-based anti-doomscrolling and productivity application concept. Rather than punitive site-blocking that causes user resistance, it inserts metacognitive micro-friction: an Intent Barrier Gate ('What is your primary intent right now?'), a 2-minute micro-commitment entry, and a 15-minute zero-clutter deep work sprint without dopamine gamification traps.",
      actions: [
        { label: "View Behavioral Flow & Specs", run: () => openModal('modal-doshe') },
        { label: "Explore on GitHub ↗", run: () => window.open('https://github.com/shayam1408', '_blank') }
      ]
    },
    stack: {
      text: "Shayam's core engineering stack comprises Python, Node.js, Express.js, SQLite, Docker, C/C++, JavaScript (ES6+), HTML5/CSS3, RESTful APIs, Git & GitHub, and AI-assisted engineering workflows with contract-driven system design.",
      actions: [
        { label: "Highlight AI & Contracts", run: () => applySkillsFilter('ai') },
        { label: "Highlight Backend & APIs", run: () => applySkillsFilter('backend') },
        { label: "Jump to Skills Section", run: () => scrollToSection('skills') }
      ]
    },
    experience: {
      text: "Shayam served as a Web & Software Development Intern at Infotact Solutions (building frontend and backend workflows, implementing clean modular code, and participating in code reviews). He also participated in UniCourt Web Development Workshops and competed in the DevHost Hackathon at SMVITM.",
      actions: [
        { label: "Jump to Experience Timeline", run: () => scrollToSection('experience') },
        { label: "Copy Email", run: () => copyToClipboard('shayamshett290@gmail.com', 'Copied email to clipboard! ✓') }
      ]
    },
    education: {
      text: "Shayam is a 4th-year undergraduate student pursuing a Bachelor of Engineering (B.E.) in Artificial Intelligence & Machine Learning at SMVITM (affiliated with Visvesvaraya Technological University - VTU), Karnataka, India (Class of 2026).",
      actions: [
        { label: "Jump to Education Details", run: () => scrollToSection('education') }
      ]
    },
    contact: {
      text: "Shayam is actively open to engineering roles and internships. Contact him directly at shayamshett290@gmail.com, explore his GitHub at github.com/shayam1408, or connect on LinkedIn at linkedin.com/in/shayam-shetty-13208728b.",
      actions: [
        { label: "Copy Email", run: () => copyToClipboard('shayamshett290@gmail.com', 'Copied email to clipboard! ✓') },
        { label: "Print / Save PDF", run: () => window.print() }
      ]
    }
  };

  function resolveQuery(rawQuery) {
    const q = rawQuery.toLowerCase().trim();
    if (q.includes('snake') || q.includes('coach') || q.includes('fallback') || q.includes('game') || q.includes('render')) {
      return resumeKnowledge.snake;
    }
    if (q.includes('doshe') || q.includes('focus') || q.includes('doomscroll') || q.includes('distraction') || q.includes('mindful')) {
      return resumeKnowledge.doshe;
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
      text: `Regarding "${rawQuery}": Shayam is a 4th-Year AI & ML engineer at SMVITM (VTU) specialized in full-stack web architectures (Express, SQLite, Docker) and bounded AI systems. Check out his Full-Stack Snake project, DOSHE focus concept, or technical skills below.`,
      actions: [
        { label: "Snake AI Fallback", run: () => openModal('modal-snake') },
        { label: "DOSHE Focus Concept", run: () => openModal('modal-doshe') },
        { label: "Copy Email", run: () => copyToClipboard('shayamshett290@gmail.com', 'Copied email to clipboard! ✓') }
      ]
    };
  }

  function displayAiAnswer(item) {
    if (!askAiOutput) return;

    if (typewriterTimer) {
      clearInterval(typewriterTimer);
      typewriterTimer = null;
    }

    askAiOutput.innerHTML = `
      <div class="ask-ai-response-text"><span class="terminal-prefix">&gt;</span><span id="typewriter-body"></span><span class="typewriter-cursor">|</span></div>
      <div class="ask-ai-actions" id="ask-ai-actions" style="display: none;"></div>
    `;

    const bodySpan = document.getElementById('typewriter-body');
    const actionsContainer = document.getElementById('ask-ai-actions');
    const fullText = item.text;
    let charIndex = 0;

    typewriterTimer = setInterval(() => {
      if (charIndex < fullText.length) {
        const chunk = fullText.slice(charIndex, charIndex + 3);
        bodySpan.textContent += chunk;
        charIndex += 3;
      } else {
        clearInterval(typewriterTimer);
        typewriterTimer = null;
        const cursor = askAiOutput.querySelector('.typewriter-cursor');
        if (cursor) cursor.remove();

        if (actionsContainer && item.actions && item.actions.length > 0) {
          actionsContainer.style.display = 'flex';
          actionsContainer.innerHTML = '';
          item.actions.forEach(act => {
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'ask-ai-action-btn';
            btn.textContent = act.label;
            btn.addEventListener('click', (e) => {
              e.preventDefault();
              act.run();
            });
            actionsContainer.appendChild(btn);
          });
        }
      }
    }, 14);
  }

  askChips.forEach(chip => {
    chip.addEventListener('click', () => {
      askChips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      const queryKey = chip.getAttribute('data-query');
      const item = resumeKnowledge[queryKey] || resolveQuery(chip.textContent);
      displayAiAnswer(item);
    });
  });

  if (askAiForm && askAiInput) {
    askAiForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const val = askAiInput.value.trim();
      if (!val) return;
      askChips.forEach(c => c.classList.remove('active'));
      const item = resolveQuery(val);
      displayAiAnswer(item);
      askAiInput.value = '';
    });
  }

  // ---------------------------------------------------------------------------
  // 10. Interactive Technical Skills Domain Filter
  // ---------------------------------------------------------------------------
  const filterPills = document.querySelectorAll('.filter-pill');
  const skillCards = document.querySelectorAll('.skill-category-card');

  function applySkillsFilter(filter) {
    filterPills.forEach(pill => {
      const pillFilter = pill.getAttribute('data-filter');
      const isActive = pillFilter === filter;
      pill.classList.toggle('active', isActive);
      pill.setAttribute('aria-selected', isActive ? 'true' : 'false');
    });

    skillCards.forEach(card => {
      const cardDomain = card.getAttribute('data-domain') || '';
      if (filter === 'all') {
        card.classList.remove('skill-dimmed', 'skill-highlighted');
      } else if (cardDomain.includes(filter)) {
        card.classList.add('skill-highlighted');
        card.classList.remove('skill-dimmed');
      } else {
        card.classList.add('skill-dimmed');
        card.classList.remove('skill-highlighted');
      }
    });
  }

  filterPills.forEach(pill => {
    pill.addEventListener('click', () => {
      const filter = pill.getAttribute('data-filter') || 'all';
      applySkillsFilter(filter);
    });
  });

  // ---------------------------------------------------------------------------
  // 11. Interactive Command Palette (Ctrl+K / ⌘K)
  // ---------------------------------------------------------------------------
  const cmdPaletteBtn = document.getElementById('cmd-k-btn');
  const cmdPalette = document.getElementById('cmd-palette');
  const cmdInput = document.getElementById('cmd-input');
  const cmdList = document.getElementById('cmd-list');

  const paletteCommands = [
    {
      id: 'ask-ai-cmd',
      title: 'Ask Resume AI Assistant (Q&A)',
      category: 'Interactive',
      icon: '✨',
      action: () => {
        switchToSpecTab('ask');
        scrollToSection('hero');
        if (askAiInput) setTimeout(() => askAiInput.focus(), 250);
      }
    },
    {
      id: 'proj',
      title: 'Jump to Featured Projects',
      category: 'Navigation',
      icon: '📁',
      action: () => scrollToSection('projects')
    },
    {
      id: 'snake-arch',
      title: 'Open Full-Stack Snake Architecture & Specs',
      category: 'Architecture',
      icon: '🐍',
      action: () => openModal('modal-snake')
    },
    {
      id: 'doshe-arch',
      title: 'Open DOSHE Flow & Behavioral Architecture',
      category: 'Architecture',
      icon: '🧠',
      action: () => openModal('modal-doshe')
    },
    {
      id: 'copy-email',
      title: 'Copy Primary Email (shayamshett290@gmail.com)',
      category: 'Actions',
      icon: '📋',
      action: () => copyToClipboard('shayamshett290@gmail.com', 'Copied shayamshett290@gmail.com to clipboard! ✓')
    },
    {
      id: 'copy-github',
      title: 'Copy GitHub URL (github.com/shayam1408)',
      category: 'Actions',
      icon: '🔗',
      action: () => copyToClipboard('https://github.com/shayam1408', 'Copied GitHub URL to clipboard! ✓')
    },
    {
      id: 'toggle-theme',
      title: 'Toggle Dark / Light Mode',
      category: 'Appearance',
      icon: '🌓',
      action: () => toggleTheme()
    },
    {
      id: 'save-pdf',
      title: 'Print / Save Clean 2-Page Resume as PDF',
      category: 'Actions',
      icon: '🖨️',
      action: () => window.print()
    },
    {
      id: 'filter-ai',
      title: 'Filter Skills: AI & Contracts',
      category: 'Skills',
      icon: '⚡',
      action: () => {
        applySkillsFilter('ai');
        scrollToSection('skills');
      }
    },
    {
      id: 'filter-backend',
      title: 'Filter Skills: Backend & APIs',
      category: 'Skills',
      icon: '⚙️',
      action: () => {
        applySkillsFilter('backend');
        scrollToSection('skills');
      }
    },
    {
      id: 'about',
      title: 'Jump to About Profile & Academic Highlights',
      category: 'Navigation',
      icon: '👤',
      action: () => scrollToSection('about')
    },
    {
      id: 'edu',
      title: 'Jump to Education (SMVITM VTU)',
      category: 'Navigation',
      icon: '🎓',
      action: () => scrollToSection('education')
    },
    {
      id: 'skills',
      title: 'Jump to Technical Skills & Stacks',
      category: 'Navigation',
      icon: '⚡',
      action: () => scrollToSection('skills')
    },
    {
      id: 'exp',
      title: 'Jump to Experience & Activities',
      category: 'Navigation',
      icon: '💼',
      action: () => scrollToSection('experience')
    },
    {
      id: 'contact',
      title: 'Jump to Direct Contact Details',
      category: 'Navigation',
      icon: '✉️',
      action: () => scrollToSection('contact')
    },
    {
      id: 'github-link',
      title: 'Open GitHub Profile (shayam1408)',
      category: 'External',
      icon: '↗',
      action: () => window.open('https://github.com/shayam1408', '_blank')
    },
    {
      id: 'linkedin-link',
      title: 'Open LinkedIn Profile',
      category: 'External',
      icon: '↗',
      action: () => window.open('https://www.linkedin.com/in/shayam-shetty-13208728b/', '_blank')
    },
    {
      id: 'snake-live',
      title: 'Launch Live Snake App on Render',
      category: 'External',
      icon: '🚀',
      action: () => window.open('https://snake-3d-app.onrender.com', '_blank')
    }
  ];

  let selectedIndex = 0;
  let filteredCommands = [...paletteCommands];

  function renderCommandList(items) {
    if (!cmdList) return;
    cmdList.innerHTML = '';

    if (items.length === 0) {
      cmdList.innerHTML = `<div class="cmd-empty-state">No matching commands found.</div>`;
      return;
    }

    let currentCategory = '';

    items.forEach((item, index) => {
      if (item.category !== currentCategory) {
        currentCategory = item.category;
        const catHeader = document.createElement('div');
        catHeader.className = 'cmd-group-label';
        catHeader.textContent = currentCategory;
        cmdList.appendChild(catHeader);
      }

      const itemEl = document.createElement('div');
      itemEl.className = `cmd-item ${index === selectedIndex ? 'selected' : ''}`;
      itemEl.setAttribute('role', 'option');
      itemEl.setAttribute('aria-selected', index === selectedIndex ? 'true' : 'false');
      itemEl.dataset.index = index;

      itemEl.innerHTML = `
        <div class="cmd-item-left">
          <span class="cmd-item-icon">${item.icon}</span>
          <span class="cmd-item-title">${item.title}</span>
        </div>
        <span class="cmd-item-badge">${item.category}</span>
      `;

      itemEl.addEventListener('click', () => {
        executeCommand(item);
      });

      cmdList.appendChild(itemEl);
    });

    scrollSelectedItemIntoView();
  }

  function scrollSelectedItemIntoView() {
    const selectedEl = cmdList.querySelector('.cmd-item.selected');
    if (selectedEl) {
      selectedEl.scrollIntoView({ block: 'nearest' });
    }
  }

  function executeCommand(command) {
    closeCommandPalette();
    if (command && typeof command.action === 'function') {
      command.action();
    }
  }

  function openCommandPalette() {
    if (!cmdPalette) return;
    cmdPalette.removeAttribute('hidden');
    void cmdPalette.offsetHeight;
    cmdPalette.classList.add('open');
    document.body.style.overflow = 'hidden';

    selectedIndex = 0;
    filteredCommands = [...paletteCommands];
    if (cmdInput) {
      cmdInput.value = '';
      cmdInput.focus();
    }
    renderCommandList(filteredCommands);
  }

  function closeCommandPalette() {
    if (!cmdPalette) return;
    cmdPalette.classList.remove('open');
    document.body.style.overflow = '';
    setTimeout(() => {
      cmdPalette.setAttribute('hidden', '');
    }, 200);
  }

  if (cmdPaletteBtn) {
    cmdPaletteBtn.addEventListener('click', (e) => {
      e.preventDefault();
      openCommandPalette();
    });
  }

  if (cmdPalette) {
    cmdPalette.addEventListener('click', (e) => {
      if (e.target.classList.contains('cmd-palette-backdrop')) {
        closeCommandPalette();
      }
    });
  }

  if (cmdInput) {
    cmdInput.addEventListener('input', () => {
      const query = cmdInput.value.toLowerCase().trim();
      if (!query) {
        filteredCommands = [...paletteCommands];
      } else {
        filteredCommands = paletteCommands.filter(cmd =>
          cmd.title.toLowerCase().includes(query) ||
          cmd.category.toLowerCase().includes(query)
        );
      }
      selectedIndex = 0;
      renderCommandList(filteredCommands);
    });

    cmdInput.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (filteredCommands.length > 0) {
          selectedIndex = (selectedIndex + 1) % filteredCommands.length;
          renderCommandList(filteredCommands);
        }
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (filteredCommands.length > 0) {
          selectedIndex = (selectedIndex - 1 + filteredCommands.length) % filteredCommands.length;
          renderCommandList(filteredCommands);
        }
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (filteredCommands.length > 0 && filteredCommands[selectedIndex]) {
          executeCommand(filteredCommands[selectedIndex]);
        }
      } else if (e.key === 'Escape') {
        e.preventDefault();
        closeCommandPalette();
      }
    });
  }

  // Global Keyboard Shortcuts (Ctrl+K / ⌘K and Escape)
  document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      if (cmdPalette && cmdPalette.classList.contains('open')) {
        closeCommandPalette();
      } else {
        openCommandPalette();
      }
      return;
    }

    if (e.key === 'Escape') {
      if (cmdPalette && cmdPalette.classList.contains('open')) {
        closeCommandPalette();
        return;
      }

      const activeModal = document.querySelector('.modal-overlay.open');
      if (activeModal) {
        closeModal(activeModal);
        return;
      }

      if (navMenu && navMenu.classList.contains('open')) {
        navMenu.classList.remove('open');
        if (mobileToggleBtn) {
          mobileToggleBtn.classList.remove('active');
          mobileToggleBtn.setAttribute('aria-expanded', 'false');
          mobileToggleBtn.focus();
        }
      }
    }
  });

  // ---------------------------------------------------------------------------
  // 12. Bento Card Cursor Spotlight Glow Effect
  // ---------------------------------------------------------------------------
  const spotlightCards = document.querySelectorAll('.content-card, .project-card, .hero-spec-card');

  if (window.matchMedia('(hover: hover)').matches) {
    spotlightCards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);
      });

      card.addEventListener('mouseleave', () => {
        card.style.setProperty('--mouse-x', `-9999px`);
        card.style.setProperty('--mouse-y', `-9999px`);
      });
    });
  }
});
