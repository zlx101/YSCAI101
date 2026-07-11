/* ============================================
   成云杉YSC 个人作品网站 - 交互逻辑
   yscai101.com
   ============================================ */

(function () {
  'use strict';

  /* ---------- 页面加载动画 ---------- */
  function initLoader() {
    const loader = document.querySelector('.page-loader');
    if (!loader) return;

    window.addEventListener('load', () => {
      // 最少显示 400ms，避免闪烁
      setTimeout(() => {
        loader.classList.add('loaded');
      }, 400);
    });

    // 安全兜底：3秒后强制关闭
    setTimeout(() => {
      loader.classList.add('loaded');
    }, 3000);
  }

  /* ---------- 导航栏滚动效果 ---------- */
  function initNavbar() {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;

    const onScroll = () => {
      navbar.classList.toggle('scrolled', window.scrollY > 50);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll(); // 初始状态检查
  }

  /* ---------- 移动端菜单 ---------- */
  function initMobileMenu() {
    const toggle = document.querySelector('.nav-toggle');
    const menu = document.querySelector('.mobile-menu');
    if (!toggle || !menu) return;

    toggle.addEventListener('click', () => {
      toggle.classList.toggle('active');
      menu.classList.toggle('open');
      document.body.style.overflow = menu.classList.contains('open') ? 'hidden' : '';
    });

    // 点击菜单链接后关闭
    menu.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        toggle.classList.remove('active');
        menu.classList.remove('open');
        document.body.style.overflow = '';
      });
    });

    // 点击外部关闭
    document.addEventListener('click', (e) => {
      if (!toggle.contains(e.target) && !menu.contains(e.target)) {
        toggle.classList.remove('active');
        menu.classList.remove('open');
        document.body.style.overflow = '';
      }
    });
  }

  /* ---------- 导航链接高亮 ---------- */
  function initActiveNav() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');

    if (sections.length === 0 || navLinks.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute('id');
            navLinks.forEach((link) => {
              link.classList.toggle(
                'active',
                link.getAttribute('href') === `#${id}`
              );
            });
          }
        });
      },
      { threshold: 0.3, rootMargin: '-80px 0px -50% 0px' }
    );

    sections.forEach((section) => observer.observe(section));
  }

  /* ---------- 作品筛选 ---------- */
  function initFilter() {
    const tags = document.querySelectorAll('.filter-tag');
    const cards = document.querySelectorAll('.work-card');

    if (tags.length === 0 || cards.length === 0) return;

    tags.forEach((tag) => {
      tag.addEventListener('click', () => {
        // 更新标签状态
        tags.forEach((t) => t.classList.remove('active'));
        tag.classList.add('active');

        const filter = tag.dataset.filter;

        cards.forEach((card, index) => {
          const categories = card.dataset.category
            ? card.dataset.category.split(',')
            : [];
          const shouldShow = filter === 'all' || categories.includes(filter);

          // 动画效果
          card.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
          if (shouldShow) {
            card.style.display = '';
            requestAnimationFrame(() => {
              card.style.opacity = '1';
              card.style.transform = 'translateY(0)';
            });
          } else {
            card.style.opacity = '0';
            card.style.transform = 'translateY(10px)';
            setTimeout(() => {
              card.style.display = 'none';
            }, 300);
          }
        });
      });
    });
  }

  /* ---------- 滚动渐入动画 ---------- */
  function initScrollAnimations() {
    const animatedElements = document.querySelectorAll(
      '.fade-in, .fade-in-left, .fade-in-right, .work-card'
    );

    if (animatedElements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target); // 只触发一次
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    animatedElements.forEach((el) => observer.observe(el));
  }

  /* ---------- 返回顶部按钮 ---------- */
  function initBackToTop() {
    const btn = document.querySelector('.back-to-top');
    if (!btn) return;

    const onScroll = () => {
      btn.classList.toggle('visible', window.scrollY > 500);
    };

    window.addEventListener('scroll', onScroll, { passive: true });

    btn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ---------- 平滑锚点滚动 ---------- */
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener('click', (e) => {
        const href = anchor.getAttribute('href');
        if (href === '#') return;

        const target = document.querySelector(href);
        if (!target) return;

        e.preventDefault();
        const navHeight = document.querySelector('.navbar')?.offsetHeight || 72;
        const top = target.getBoundingClientRect().top + window.scrollY - navHeight;
        window.scrollTo({ top, behavior: 'smooth' });
      });
    });
  }

  /* ---------- 统计数字动画 ---------- */
  function initCountUp() {
    const statNumbers = document.querySelectorAll('.stat-number');
    if (statNumbers.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target;
            const target = parseInt(el.dataset.count, 10);
            if (isNaN(target)) return;

            const suffix = el.dataset.suffix || '';
            const duration = 1500;
            const startTime = performance.now();

            function update(currentTime) {
              const elapsed = currentTime - startTime;
              const progress = Math.min(elapsed / duration, 1);
              // easeOutQuart 缓动
              const eased = 1 - Math.pow(1 - progress, 4);
              const current = Math.floor(eased * target);
              el.textContent = current + suffix;

              if (progress < 1) {
                requestAnimationFrame(update);
              } else {
                el.textContent = target + suffix;
              }
            }

            requestAnimationFrame(update);
            observer.unobserve(el);
          }
        });
      },
      { threshold: 0.5 }
    );

    statNumbers.forEach((el) => observer.observe(el));
  }

  /* ---------- 鼠标跟随光晕（仅首页 Hero） ---------- */
  function initCursorGlow() {
    const hero = document.querySelector('.hero');
    if (!hero) return;

    const glow = document.createElement('div');
    glow.style.cssText = `
      position: absolute;
      width: 400px;
      height: 400px;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(99, 102, 241, 0.08), transparent 70%);
      pointer-events: none;
      z-index: 0;
      transform: translate(-50%, -50%);
      transition: left 0.3s ease, top 0.3s ease;
    `;
    hero.appendChild(glow);

    hero.addEventListener('mousemove', (e) => {
      const rect = hero.getBoundingClientRect();
      glow.style.left = e.clientX - rect.left + 'px';
      glow.style.top = e.clientY - rect.top + 'px';
    });
  }

  /* ---------- 首页实时状态 ---------- */
  function initLiveConsole() {
    const signal = document.getElementById('consoleSignal');
    if (!signal) return;

    const messages = [
      '正在整理 FileDev 的下一轮反馈',
      '正在开发 MXMY 与 SayType',
      '正在搭建 AI 内容工作流',
      '开放具体项目与定制合作'
    ];

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let index = 0;
    window.setInterval(() => {
      signal.classList.add('switching');
      window.setTimeout(() => {
        index = (index + 1) % messages.length;
        signal.textContent = messages[index];
        signal.classList.remove('switching');
      }, 220);
    }, 3200);
  }

  /* ---------- 全站快捷入口 ---------- */
  function initQuickAccess() {
    const firstVisitKey = 'yscai101_quick_access_seen_v1';
    const trigger = document.createElement('button');
    trigger.className = 'quick-access-trigger';
    trigger.type = 'button';
    trigger.setAttribute('aria-expanded', 'false');
    trigger.setAttribute('aria-controls', 'quickAccessPanel');
    trigger.innerHTML = '<span>⌘</span><strong>找入口</strong>';

    const overlay = document.createElement('div');
    overlay.className = 'quick-access-overlay';
    overlay.id = 'quickAccessPanel';
    overlay.setAttribute('aria-hidden', 'true');
    overlay.innerHTML = `
      <div class="quick-access-panel" role="dialog" aria-modal="true" aria-labelledby="quickAccessTitle">
        <div class="quick-access-head">
          <div><span>QUICK ACCESS</span><h2 id="quickAccessTitle">你想找什么？</h2></div>
          <button type="button" class="quick-access-close" aria-label="关闭快捷入口">×</button>
        </div>
        <div class="quick-access-links">
          <a href="https://filedev.dev" target="_blank" rel="noopener"><span>01</span><strong>使用 FileDev</strong><em>网站与产品入口 ↗</em></a>
          <a href="/works.html"><span>02</span><strong>查看产品</strong><em>FileDev / MXMY / SayType →</em></a>
          <a href="/contact.html#services"><span>03</span><strong>找 AI 定制服务</strong><em>Skill / 知识库 / 工作流 →</em></a>
          <a href="https://t.zsxq.com/VqloN" target="_blank" rel="noopener"><span>04</span><strong>加入免费社区</strong><em>实践记录与交流 ↗</em></a>
          <a href="/about.html"><span>05</span><strong>了解成云杉</strong><em>经历与个人业务 →</em></a>
          <a href="/contact.html"><span>06</span><strong>联系合作</strong><em>微信 / 邮箱 →</em></a>
        </div>
      </div>
    `;

    document.body.append(trigger, overlay);

    const panel = overlay.querySelector('.quick-access-panel');
    const closeButton = overlay.querySelector('.quick-access-close');

    const hasSeenQuickAccess = () => {
      try {
        return window.localStorage.getItem(firstVisitKey) === '1';
      } catch (error) {
        return document.cookie.split('; ').includes(`${firstVisitKey}=1`);
      }
    };

    const rememberQuickAccess = () => {
      try {
        window.localStorage.setItem(firstVisitKey, '1');
      } catch (error) {
        document.cookie = `${firstVisitKey}=1; max-age=31536000; path=/; SameSite=Lax`;
      }
    };

    const open = () => {
      overlay.classList.add('open');
      overlay.setAttribute('aria-hidden', 'false');
      trigger.setAttribute('aria-expanded', 'true');
      document.body.classList.add('quick-access-open');
      closeButton.focus();
    };

    const close = () => {
      overlay.classList.remove('open');
      overlay.setAttribute('aria-hidden', 'true');
      trigger.setAttribute('aria-expanded', 'false');
      document.body.classList.remove('quick-access-open');
      trigger.focus();
    };

    trigger.addEventListener('click', () => {
      rememberQuickAccess();
      open();
    });
    closeButton.addEventListener('click', close);
    overlay.addEventListener('click', (event) => {
      if (!panel.contains(event.target)) close();
    });
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && overlay.classList.contains('open')) close();
    });

    if (!hasSeenQuickAccess()) {
      const showFirstVisitAccess = () => {
        window.setTimeout(() => {
          if (hasSeenQuickAccess()) return;
          rememberQuickAccess();
          open();
        }, 850);
      };

      if (document.readyState === 'complete') {
        showFirstVisitAccess();
      } else {
        window.addEventListener('load', showFirstVisitAccess, { once: true });
      }
    }
  }

  /* ---------- 微信联系卡 ---------- */
  function initWechatHoverCards() {
    const wechatText = '微信：3087465343';
    const directNumber = '3087465343';
    const textNodes = [];
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);

    while (walker.nextNode()) {
      const node = walker.currentNode;
      const value = node.nodeValue || '';
      const parent = node.parentElement;
      if (!parent || parent.closest('script, style, .wechat-hover')) continue;

      const hasFullLabel = value.includes(wechatText);
      const isDirectWechatNumber =
        value.trim() === directNumber && parent.closest('.direct-line');

      if (hasFullLabel || isDirectWechatNumber) {
        textNodes.push({ node, label: hasFullLabel ? wechatText : directNumber });
      }
    }

    if (textNodes.length === 0) return;

    const cards = [];

    const createCard = (label, index) => {
      const wrapper = document.createElement('span');
      const tooltipId = `wechatContactCard${index}`;
      wrapper.className = 'wechat-hover';
      wrapper.tabIndex = 0;
      wrapper.setAttribute('role', 'button');
      wrapper.setAttribute('aria-expanded', 'false');
      wrapper.setAttribute('aria-describedby', tooltipId);
      wrapper.append(document.createTextNode(label));

      const popover = document.createElement('span');
      popover.className = 'wechat-popover';
      popover.id = tooltipId;
      popover.setAttribute('role', 'tooltip');

      const image = document.createElement('img');
      image.src = 'assets/wechat-contact-card.png';
      image.alt = '成云杉微信联系卡与二维码';
      image.loading = 'lazy';
      image.decoding = 'async';
      popover.append(image);
      wrapper.append(popover);
      cards.push(wrapper);
      return wrapper;
    };

    textNodes.forEach(({ node, label }, index) => {
      const value = node.nodeValue || '';
      const position = value.indexOf(label);
      const fragment = document.createDocumentFragment();

      if (position > 0) fragment.append(document.createTextNode(value.slice(0, position)));
      fragment.append(createCard(label, index));
      if (position + label.length < value.length) {
        fragment.append(document.createTextNode(value.slice(position + label.length)));
      }
      node.replaceWith(fragment);
    });

    const closeAll = (except) => {
      cards.forEach((card) => {
        if (card === except) return;
        card.classList.remove('active');
        card.setAttribute('aria-expanded', 'false');
      });
    };

    cards.forEach((card) => {
      const toggle = (event) => {
        event.stopPropagation();
        const willOpen = !card.classList.contains('active');
        closeAll(card);
        card.classList.toggle('active', willOpen);
        card.setAttribute('aria-expanded', String(willOpen));
      };

      card.addEventListener('click', toggle);
      card.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          toggle(event);
        }
      });
    });

    document.addEventListener('click', () => closeAll());
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') closeAll();
    });
  }

  /* ---------- 社群二维码原图预览 ---------- */
  function initCommunityImagePreview() {
    const thumbnails = document.querySelectorAll('.community-card > img');
    if (thumbnails.length === 0) return;

    const overlay = document.createElement('div');
    overlay.className = 'community-preview-overlay';
    overlay.setAttribute('aria-hidden', 'true');
    overlay.innerHTML = `
      <div class="community-preview-panel" role="dialog" aria-modal="true" aria-label="社群二维码原图预览">
        <button type="button" class="community-preview-close" aria-label="关闭原图预览">×</button>
        <img src="" alt="">
      </div>
    `;
    document.body.append(overlay);

    const previewImage = overlay.querySelector('img');
    const closeButton = overlay.querySelector('.community-preview-close');
    let pinned = false;
    let hoverTimer;

    const show = (thumbnail, shouldPin) => {
      previewImage.src = thumbnail.currentSrc || thumbnail.src;
      previewImage.alt = thumbnail.alt || '社群二维码原图';
      pinned = shouldPin;
      overlay.classList.toggle('pinned', pinned);
      overlay.classList.add('open');
      overlay.setAttribute('aria-hidden', 'false');
      document.body.classList.toggle('community-preview-open', pinned);
      if (pinned) closeButton.focus();
    };

    const hide = (force = false) => {
      if (pinned && !force) return;
      window.clearTimeout(hoverTimer);
      pinned = false;
      overlay.classList.remove('open', 'pinned');
      overlay.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('community-preview-open');
    };

    thumbnails.forEach((thumbnail) => {
      thumbnail.tabIndex = 0;
      thumbnail.setAttribute('role', 'button');
      thumbnail.setAttribute('aria-label', `${thumbnail.alt || '社群图片'}，查看可扫码原图`);
      thumbnail.title = '悬停或点击查看可扫码原图';

      thumbnail.addEventListener('mouseenter', () => {
        if (!window.matchMedia('(hover: hover)').matches) return;
        hoverTimer = window.setTimeout(() => show(thumbnail, false), 180);
      });
      thumbnail.addEventListener('mouseleave', () => hide());
      thumbnail.addEventListener('click', (event) => {
        event.preventDefault();
        event.stopPropagation();
        show(thumbnail, true);
      });
      thumbnail.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          event.stopPropagation();
          show(thumbnail, true);
        }
      });
    });

    closeButton.addEventListener('click', () => hide(true));
    overlay.addEventListener('click', (event) => {
      if (event.target === overlay) hide(true);
    });
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && overlay.classList.contains('open')) hide(true);
    });
  }

  /* ---------- 初始化所有模块 ---------- */
  function init() {
    initLoader();
    initNavbar();
    initMobileMenu();
    initActiveNav();
    initFilter();
    initScrollAnimations();
    initBackToTop();
    initSmoothScroll();
    initCountUp();
    initCursorGlow();
    initLiveConsole();
    initWechatHoverCards();
    initCommunityImagePreview();
    initQuickAccess();
  }

  // DOM 就绪后初始化
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
