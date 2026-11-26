/*
 * Swarm model: Reynolds (1987) separation/alignment/cohesion with K=7 nearest
 * neighbours (topological interaction, Ballerini et al. 2008). The communication
 * graph is a unit-disk graph of radius R, pruned by the relative-neighbourhood
 * graph rule: retain i-j only if no k has max(d(i,k), d(j,k)) < d(i,j)
 * (Toussaint 1980). Links refresh every third animation frame.
 */
(() => {
  // About has its own ACO simulation; the other pages keep this lightweight swarm layer.
  if (document.querySelector("[data-aco]")) return;
  let canvas = document.querySelector("[data-swarm]");
  const about = Boolean(document.querySelector(".about-editorial"));
  let pageHeader = document.querySelector(".post-header");
  if (!canvas) {
    const band = pageHeader || document.querySelector(".custom-site, .post");
    if (band) {
      canvas = document.createElement("canvas");
      canvas.className = "site-swarm";
      canvas.dataset.swarm = "minimal";
      canvas.setAttribute("aria-hidden", "true");
      band.prepend(canvas);
    }
  }
  if (!canvas) return;
  if (pageHeader && !about) {
    pageHeader.classList.add("swarm-band");
    pageHeader.prepend(canvas);
  }

  const presetName = canvas.dataset.swarm || "flock";
  const presets = window.PORTFOLIO_SWARM_PRESETS || {};
  const preset = presets[presetName] || presets.minimal || {
    count: 24,
    speed: 0.2,
    separation: 0.2,
    alignment: 0.1,
    cohesion: 0.1,
    neighbours_k: 7,
    comm_radius: 110,
    link_prune: "rng",
    link_alpha: 0.2,
  };
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const baseCount = about ? Math.max(55, Math.min(70, preset.count || 64)) : Math.max(20, Math.min(28, preset.count || 24));
  const getCount = () => Math.min(baseCount, matchMedia("(max-width: 600px)").matches ? (about ? 28 : 12) : 70);
  let count = getCount();
  const dotAlpha = 0.52;
  const randomX = (width) => (about ? width * (0.6 + Math.random() * 0.4) : Math.random() * width);
  const getSavedPause = () => {
    try {
      return localStorage.getItem("swarm-paused") === "true";
    } catch (_) {
      return false;
    }
  };

  let width = 0;
  let height = 0;
  let frame = 0;
  let last = 0;
  let frameCount = 0;
  let resizeTimer = 0;
  let visible = false;
  let paused = getSavedPause();
  let pointer = null;
  let points = [];
  let edges = [];
  let readingRects = [];

  const colorChannels = (name) => getComputedStyle(document.documentElement).getPropertyValue(name).trim() || "255,255,255";
  const readingAlpha = (x, y) => {
    let alpha = 1;
    for (const r of readingRects) {
      const dx = Math.max(r.left - x, 0, x - r.right);
      const dy = Math.max(r.top - y, 0, y - r.bottom);
      const distance = Math.hypot(dx, dy);
      if (distance === 0) return 0.12;
      if (distance < 14) {
        const t = distance / 14;
        const smooth = t * t * (3 - 2 * t);
        alpha = Math.min(alpha, 0.12 + 0.88 * smooth);
      }
    }
    return alpha;
  };
  const collectReadingRects = () => {
    const box = canvas.getBoundingClientRect();
    const selectors = "h1, .desc, .post-description, .subtitle, .post-subtitle, .entry-subtitle, .hero-label, .hero-name, .hero-role, p, li";
    readingRects = [...document.querySelectorAll(selectors)]
      .map((el) => el.getBoundingClientRect())
      .filter((r) => r.right >= box.left && r.left <= box.right && r.bottom >= box.top && r.top <= box.bottom)
      .map((r) => ({
        left: Math.max(0, r.left - box.left - 12),
        top: Math.max(0, r.top - box.top - 12),
        right: Math.min(box.width, r.right - box.left + 12),
        bottom: Math.min(box.height, r.bottom - box.top + 12),
      }));
  };
  const makePoints = () =>
    Array.from({ length: count }, () => ({
      x: randomX(width),
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * preset.speed,
      vy: (Math.random() - 0.5) * preset.speed,
    }));
  const recomputeLinks = () => {
    const radius = Math.max(1, preset.comm_radius || 110);
    const candidates = [];
    for (let i = 0; i < points.length; i++) {
      for (let j = i + 1; j < points.length; j++) {
        const a = points[i];
        const b = points[j];
        const distance = Math.hypot(a.x - b.x, a.y - b.y);
        if (distance < radius) candidates.push({ i, j, distance });
      }
    }
    if (preset.link_prune !== "rng") {
      edges = candidates;
      return;
    }
    edges = candidates.filter(({ i, j, distance }) => {
      const a = points[i];
      const b = points[j];
      for (let k = 0; k < points.length; k++) {
        if (k === i || k === j) continue;
        const c = points[k];
        if (Math.max(Math.hypot(a.x - c.x, a.y - c.y), Math.hypot(b.x - c.x, b.y - c.y)) < distance) return false;
      }
      return true;
    });
  };
  const configureCanvas = () => {
    if (about) {
      canvas.style.height = "600px";
      canvas.style.width = "100%";
    } else {
      const header = canvas.closest(".swarm-band");
      const heading = header || canvas.parentElement;
      const headingRect = heading.getBoundingClientRect();
      const titleRect = heading.querySelector("h1")?.getBoundingClientRect();
      const subtitleRect = heading.querySelector(".desc, .post-description")?.getBoundingClientRect();
      const contentHeight = header
        ? headingRect.height
        : Math.max(titleRect?.bottom || headingRect.top, subtitleRect?.bottom || headingRect.top) - headingRect.top;
      canvas.style.height = `${Math.max(160, contentHeight + 24)}px`;
      canvas.style.width = "40%";
    }
  };
  const resize = () => {
    count = getCount();
    configureCanvas();
    const rect = canvas.getBoundingClientRect();
    const dpr = Math.min(devicePixelRatio || 1, 2);
    width = rect.width;
    height = rect.height;
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    points = makePoints();
    collectReadingRects();
    recomputeLinks();
    drawFrame();
  };
  const advance = () => {
    const previous = points.map((point) => ({ x: point.x, y: point.y, vx: point.vx, vy: point.vy }));
    const k = Math.max(1, Math.min(points.length - 1, preset.neighbours_k || 7));
    for (let i = 0; i < points.length; i++) {
      const a = previous[i];
      const next = points[i];
      const nearest = [];
      for (let j = 0; j < previous.length; j++) {
        if (i === j) continue;
        const b = previous[j];
        nearest.push({ b, dx: b.x - a.x, dy: b.y - a.y, distance: Math.hypot(b.x - a.x, b.y - a.y) });
      }
      nearest.sort((x, y) => x.distance - y.distance);
      const neighbours = nearest.slice(0, k);
      let sx = 0, sy = 0, ax = 0, ay = 0, cx = 0, cy = 0;
      for (const n of neighbours) {
        sx -= n.dx / (n.distance || 1);
        sy -= n.dy / (n.distance || 1);
        ax += n.b.vx;
        ay += n.b.vy;
        cx += n.b.x;
        cy += n.b.y;
      }
      let vx = a.vx;
      let vy = a.vy;
      if (neighbours.length) {
        const total = neighbours.length;
        vx += (sx * preset.separation + (ax / total - a.vx) * (preset.alignment || 0) + (cx / total - a.x) * (preset.cohesion || 0) * 0.01) * 0.004;
        vy += (sy * preset.separation + (ay / total - a.vy) * (preset.alignment || 0) + (cy / total - a.y) * (preset.cohesion || 0) * 0.01) * 0.004;
      }
      if (pointer && preset.cursor_attraction) {
        vx += (pointer.x - a.x) * preset.cursor_attraction * 0.0005;
        vy += (pointer.y - a.y) * preset.cursor_attraction * 0.0005;
      }
      if (about) {
        const left = width * 0.6;
        const span = Math.max(1, width - left);
        next.x = left + (((a.x - left + vx) % span) + span) % span;
      } else {
        next.x = (a.x + vx + width) % width;
      }
      next.y = (a.y + vy + height) % height;
      next.vx = vx;
      next.vy = vy;
    }
  };
  function drawFrame() {
    ctx.clearRect(0, 0, width, height);
    const radius = Math.max(1, preset.comm_radius || 110);
    const linkAlpha = Math.min(0.22, Math.max(0, preset.link_alpha ?? 0.2));
    const linkChannels = colorChannels("--swarm-line");
    ctx.lineWidth = 1;
    for (const edge of edges) {
      const a = points[edge.i];
      const b = points[edge.j];
      const distance = Math.hypot(a.x - b.x, a.y - b.y);
      if (distance >= radius) continue;
      const fade = Math.pow(1 - distance / radius, 1.5);
      const steps = Math.max(2, Math.ceil(distance / 8));
      let maskAlpha = 1;
      for (let s = 0; s <= steps; s++) {
        const t = s / steps;
        maskAlpha = Math.min(maskAlpha, readingAlpha(a.x + (b.x - a.x) * t, a.y + (b.y - a.y) * t));
      }
      const alpha = linkAlpha * fade * maskAlpha;
      if (alpha <= 0) continue;
      ctx.strokeStyle = `rgba(${linkChannels},${alpha})`;
      ctx.beginPath();
      ctx.moveTo(a.x, a.y);
      ctx.lineTo(b.x, b.y);
      ctx.stroke();
    }
    const dotChannels = colorChannels("--swarm-dot");
    for (const p of points) {
      ctx.fillStyle = `rgba(${dotChannels},${dotAlpha * readingAlpha(p.x, p.y)})`;
      ctx.beginPath();
      ctx.arc(p.x, p.y, 1.8, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  const staticSettle = () => {
    for (let i = 0; i < 150; i++) {
      advance();
      if (i % 3 === 2) recomputeLinks();
    }
    drawFrame();
  };
  const step = (time) => {
    frame = 0;
    if (!visible || paused || document.hidden) return;
    if (time - last < 16) {
      frame = requestAnimationFrame(step);
      return;
    }
    last = time;
    advance();
    frameCount++;
    if (frameCount % 3 === 0) recomputeLinks();
    drawFrame();
    frame = requestAnimationFrame(step);
  };
  let debugReported = false;
  const reportInit = () => {
    if (debugReported) return;
    debugReported = true;
    console.info("[swarm]", { preset: presetName, count, running: frame !== 0, reducedMotion: reduce, canvasSize: { width, height } });
  };
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible && !paused && !reduce && !frame) frame = requestAnimationFrame(step);
      if (!visible && frame) {
        cancelAnimationFrame(frame);
        frame = 0;
      }
      reportInit();
    });
    observer.observe(canvas);
  } else {
    visible = true;
    if (!paused && !reduce) frame = requestAnimationFrame(step);
    reportInit();
  }
  let resizeDelay = 0;
  addEventListener("resize", () => {
    clearTimeout(resizeDelay);
    resizeDelay = setTimeout(resize, 120);
  });
  document.addEventListener("visibilitychange", () => {
    if (document.hidden && frame) {
      cancelAnimationFrame(frame);
      frame = 0;
    } else if (!document.hidden && visible && !paused && !reduce && !frame) frame = requestAnimationFrame(step);
  });
  canvas.addEventListener("pointermove", (event) => {
    const rect = canvas.getBoundingClientRect();
    pointer = { x: event.clientX - rect.left, y: event.clientY - rect.top };
  });
  canvas.addEventListener("pointerleave", () => (pointer = null));
  document.querySelectorAll("[data-swarm-toggle]").forEach((button) => {
    const update = () => {
      const icon = button.querySelector("[data-swarm-icon]");
      const presetLabel = button.querySelector(".swarm-preset");
      if (icon) icon.textContent = paused ? "▶" : "⏸";
      if (presetLabel) presetLabel.textContent = `· ${presetName}`;
      button.setAttribute("aria-label", paused ? "Resume the background animation" : "Pause the background animation");
      button.setAttribute("aria-pressed", String(paused));
    };
    update();
    button.addEventListener("click", () => {
      paused = !paused;
      try {
        localStorage.setItem("swarm-paused", String(paused));
      } catch (_) {}
      update();
      if (paused && frame) {
        cancelAnimationFrame(frame);
        frame = 0;
        drawFrame();
      } else if (!paused && visible && !reduce && !frame) frame = requestAnimationFrame(step);
    });
  });
  resize();
  if (reduce) staticSettle();
  document.addEventListener("themechange", drawFrame);
})();
