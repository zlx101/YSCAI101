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
  }

  // DOM 就绪后初始化
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
