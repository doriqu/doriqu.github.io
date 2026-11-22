(() => {
  const reducedMotion =
    matchMedia('(prefers-reduced-motion: reduce)').matches ||
    getComputedStyle(document.documentElement).getPropertyValue('--motion').trim() === '0';

  const progressBar = document.querySelector('.reading-progress');
  const scrollTopButton = document.querySelector('#portfolio-scroll-to-top');
  const siteFooter = document.querySelector('.portfolio-footer');
  const updateProgress = () => {
    if (progressBar) {
      const scrollableHeight = document.documentElement.scrollHeight - innerHeight;
      progressBar.style.width = `${scrollableHeight > 0 ? (scrollY / scrollableHeight) * 100 : 0}%`;
    }
    if (scrollTopButton) {
      const footerVisible = siteFooter && siteFooter.getBoundingClientRect().top < innerHeight;
      scrollTopButton.classList.toggle('is-visible', scrollY > 320 && !footerVisible);
    }
  };
  addEventListener('scroll', updateProgress, { passive: true });
  updateProgress();
  scrollTopButton?.addEventListener('click', () => {
    scrollTo({ top: 0, behavior: reducedMotion ? 'auto' : 'smooth' });
  });

  if (!reducedMotion && 'IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(
      (entries) => entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.remove('is-hidden');
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }),
      { threshold: 0.12 },
    );
    document.querySelectorAll('.reveal, .surface-card, .timeline-entry, .section-heading').forEach((element, index) => {
      element.classList.add('is-hidden');
      element.style.transitionDelay = `${(index % 4) * 70}ms`;
      revealObserver.observe(element);
    });
  }

  const roleLine = document.querySelector('[data-rotating-phrase]');
  if (roleLine && !reducedMotion) {
    const phrases = [
      'Electrical Engineering student',
      'Embedded systems',
      'Robotics',
      'Swarm robotics',
    ];
    let phraseIndex = 0;
    let phraseTimer;
    const startRotation = () => {
      clearInterval(phraseTimer);
      phraseTimer = setInterval(() => {
        roleLine.style.opacity = '0';
        setTimeout(() => {
          phraseIndex = (phraseIndex + 1) % phrases.length;
          roleLine.textContent = phrases[phraseIndex];
          roleLine.style.opacity = '1';
        }, 250);
      }, 3200);
    };
    roleLine.addEventListener('mouseenter', () => clearInterval(phraseTimer));
    roleLine.addEventListener('mouseleave', startRotation);
    startRotation();
  }

  const previewCards = [...document.querySelectorAll('.project-card')];
  const previewVideos = new Set();
  const motionAllowed = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const activatePreview = async (card) => {
    if (!motionAllowed) return;
    const video = card.querySelector('.project-preview');
    if (!video) return;
    if (!video.src) video.src = video.dataset.src;
    video.classList.add('is-loaded');
    previewVideos.forEach((other) => { if (other !== video) { other.pause(); other.closest('.project-card')?.classList.remove('preview-playing'); } });
    previewVideos.add(video);
    try { await video.play(); card.classList.add('preview-playing'); } catch (_) { /* poster remains visible */ }
  };
  const deactivatePreview = (card) => {
    const video = card.querySelector('.project-preview');
    if (!video) return;
    video.pause();
    card.classList.remove('preview-playing');
  };
  previewCards.forEach((card) => {
    card.addEventListener('mouseenter', () => activatePreview(card));
    card.addEventListener('mouseleave', () => deactivatePreview(card));
    card.addEventListener('focusin', () => activatePreview(card));
    card.addEventListener('focusout', (event) => { if (!card.contains(event.relatedTarget)) deactivatePreview(card); });
  });
  if (motionAllowed && 'IntersectionObserver' in window && matchMedia('(hover: none)').matches) {
    let activeTouchCard = null;
    const touchObserver = new IntersectionObserver((entries) => entries.forEach((entry) => {
      if (entry.intersectionRatio >= 0.6) { activeTouchCard = entry.target; activatePreview(entry.target); }
      else if (activeTouchCard === entry.target) { deactivatePreview(entry.target); activeTouchCard = null; }
    }), { threshold: [0, 0.6, 1] });
    previewCards.forEach((card) => touchObserver.observe(card));
  }

  document.querySelectorAll('[data-project-toggle]').forEach((button) => {
    button.addEventListener('click', () => {
      const expand = button.getAttribute('aria-expanded') !== 'true';
      button.setAttribute('aria-expanded', String(expand));
      document.querySelectorAll('[data-project-extra]').forEach((card) => {
        card.hidden = !expand;
      });
      button.textContent = expand ? 'Show fewer projects ↑' : 'Show more projects ↓';
      if (!expand) {
        document.querySelector('.custom-site')?.scrollIntoView({
          behavior: reducedMotion ? 'auto' : 'smooth',
          block: 'start',
        });
      }
    });
  });

  const canvas = document.querySelector('[data-swarm]');
  if (!canvas || reducedMotion) return;

  const context = canvas.getContext('2d');
  const aboutSection = canvas.closest('.about-editorial');
  let particles = [];
  let sectionVisible = false;
  let animationFrame = 0;
  let previousFrameTime = 0;
  let pointer = null;

  const resizeCanvas = () => {
    const bounds = canvas.getBoundingClientRect();
    const pixelRatio = Math.min(devicePixelRatio || 1, 2);
    canvas.width = bounds.width * pixelRatio;
    canvas.height = bounds.height * pixelRatio;
    context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);

    const particleCount = innerWidth < 600 ? 28 : innerWidth < 900 ? 46 : 72;
    particles = Array.from({ length: particleCount }, () => ({
      x: Math.random() * bounds.width,
      y: Math.random() * bounds.height,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
    }));
  };

  const draw = (time = 0) => {
    animationFrame = 0;
    if (!sectionVisible || document.hidden) return;
    if (time - previousFrameTime < 16) {
      animationFrame = requestAnimationFrame(draw);
      return;
    }
    previousFrameTime = time;

    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    context.clearRect(0, 0, width, height);

    particles.forEach((particle, index) => {
      let neighborCount = 0;
      let alignmentX = 0;
      let alignmentY = 0;
      let cohesionX = 0;
      let cohesionY = 0;

      particles.forEach((neighbor, neighborIndex) => {
        if (index === neighborIndex) return;
        const dx = neighbor.x - particle.x;
        const dy = neighbor.y - particle.y;
        const distance = Math.hypot(dx, dy);
        if (distance >= 65) return;

        neighborCount += 1;
        cohesionX += dx;
        cohesionY += dy;
        alignmentX += neighbor.vx;
        alignmentY += neighbor.vy;
        if (distance < 18) {
          particle.vx -= dx * 0.002;
          particle.vy -= dy * 0.002;
        }
      });

      if (neighborCount) {
        particle.vx += (cohesionX / neighborCount - particle.x) * 0.00025;
        particle.vy += (cohesionY / neighborCount - particle.y) * 0.00025;
        particle.vx += (alignmentX / neighborCount - particle.vx) * 0.025;
        particle.vy += (alignmentY / neighborCount - particle.vy) * 0.025;
      }

      if (pointer) {
        const dx = pointer.x - particle.x;
        const dy = pointer.y - particle.y;
        if (Math.hypot(dx, dy) < 150) {
          particle.vx += dx * 0.000012;
          particle.vy += dy * 0.000012;
        }
      }

      particle.vx = Math.max(-0.55, Math.min(0.55, particle.vx));
      particle.vy = Math.max(-0.55, Math.min(0.55, particle.vy));
      particle.x = (particle.x + particle.vx + width) % width;
      particle.y = (particle.y + particle.vy + height) % height;
      context.fillStyle = 'rgba(225, 225, 225, 0.13)';
      context.beginPath();
      context.arc(particle.x, particle.y, 1.5, 0, Math.PI * 2);
      context.fill();
    });

    animationFrame = requestAnimationFrame(draw);
  };

  aboutSection.addEventListener('pointermove', (event) => {
    const bounds = canvas.getBoundingClientRect();
    pointer = { x: event.clientX - bounds.left, y: event.clientY - bounds.top };
  });
  aboutSection.addEventListener('pointerleave', () => { pointer = null; });

  const sectionObserver = new IntersectionObserver(([entry]) => {
    sectionVisible = entry.isIntersecting;
    if (sectionVisible && !animationFrame) draw();
  });
  sectionObserver.observe(aboutSection);
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden && sectionVisible && !animationFrame) draw();
  });
  resizeCanvas();
  addEventListener('resize', resizeCanvas);
})();
