/*
 * Small Ant System (ACO) illustration for the About page.
 * Ants repeatedly travel between a nest and food on two fixed candidate paths.
 * They prefer paths with more pheromone and shorter length; completed trips
 * reinforce their route while pheromone evaporates at 2% per second.
 * This is a schematic algorithm demo, not a recording of real ants.
 */
(() => {
  const canvas = document.querySelector("[data-aco]");
  if (!canvas) return;

  const ctx = canvas.getContext("2d", { alpha: true });
  if (!ctx) return;
  const stage = canvas.closest(".aco-stage");
  const status = stage?.querySelector("[data-aco-status]");
  const pauseButton = document.querySelector("[data-swarm-toggle]");
  const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const routeDefs = [
    { name: "short", points: [[0.08, 0.52], [0.24, 0.52], [0.34, 0.28], [0.54, 0.22], [0.72, 0.34], [0.84, 0.52], [0.92, 0.52]] },
    { name: "alternative", points: [[0.08, 0.52], [0.24, 0.52], [0.31, 0.80], [0.48, 0.90], [0.66, 0.87], [0.82, 0.65], [0.92, 0.52]] },
  ];
  let routes = [];
  let ants = [];
  let width = 0;
  let height = 0;
  let dpr = 1;
  let trailCanvas = document.createElement("canvas");
  let trailCtx = trailCanvas.getContext("2d", { alpha: true });
  let frame = 0;
  let lastFrame = 0;
  let statusClock = 0;
  let visible = false;
  let paused = false;
  let pheromone = [0.04, 0.04];

  const readPaused = () => {
    try {
      return localStorage.getItem("swarm-paused") === "true";
    } catch (_) {
      return false;
    }
  };
  paused = readPaused();

  const channels = (name, fallback) => getComputedStyle(document.documentElement).getPropertyValue(name).trim() || fallback;
  const color = (name, alpha, fallback) => `rgba(${channels(name, fallback)},${alpha})`;
  const pointAt = (route, distance) => {
    const d = Math.max(0, Math.min(route.length, distance));
    let index = 1;
    while (index < route.cumulative.length && route.cumulative[index] < d) index++;
    const start = route.points[index - 1];
    const end = route.points[Math.min(index, route.points.length - 1)];
    const segment = route.cumulative[index] - route.cumulative[index - 1] || 1;
    const t = Math.max(0, Math.min(1, (d - route.cumulative[index - 1]) / segment));
    return { x: start.x + (end.x - start.x) * t, y: start.y + (end.y - start.y) * t };
  };

  const chooseRoute = () => {
    const shortest = Math.min(...routes.map((route) => route.length));
    const weights = routes.map((route, i) => Math.max(0.001, pheromone[i]) * Math.pow(shortest / route.length, 1.35));
    const total = weights[0] + weights[1];
    return Math.random() * total < weights[0] ? 0 : 1;
  };
  const makeAnt = (routeIndex, distance = 0) => ({ routeIndex, distance, previous: null });

  const resize = () => {
    const rect = canvas.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    dpr = Math.min(devicePixelRatio || 1, 2);
    width = rect.width;
    height = rect.height;
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    trailCanvas.width = canvas.width;
    trailCanvas.height = canvas.height;
    trailCtx = trailCanvas.getContext("2d", { alpha: true });
    trailCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
    routes = routeDefs.map((definition) => {
      const points = definition.points.map(([x, y]) => ({ x: x * width, y: y * height }));
      const cumulative = [0];
      for (let i = 1; i < points.length; i++) {
        cumulative.push(cumulative[i - 1] + Math.hypot(points[i].x - points[i - 1].x, points[i].y - points[i - 1].y));
      }
      return { ...definition, points, cumulative, length: cumulative[cumulative.length - 1] };
    });
    const count = matchMedia("(max-width: 600px)").matches ? 32 : 84;
    ants = Array.from({ length: count }, (_, i) => {
      const routeIndex = i % 2;
      return makeAnt(routeIndex, Math.random() * routes[routeIndex].length);
    });
    draw();
  };

  const strokeRoute = (route, i) => {
    const intensity = Math.min(0.52, 0.055 + Math.log1p(pheromone[i] * 12) * 0.22);
    ctx.beginPath();
    route.points.forEach((point, index) => (index ? ctx.lineTo(point.x, point.y) : ctx.moveTo(point.x, point.y)));
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.lineWidth = 2.2;
    ctx.strokeStyle = color("--swarm-line", intensity, "255,255,255");
    ctx.stroke();
  };

  const draw = () => {
    ctx.clearRect(0, 0, width, height);
    routes.forEach(strokeRoute);
    ctx.font = "9px 'JetBrains Mono', monospace";
    ctx.textAlign = "center";
    ctx.fillStyle = color("--muted", 0.78, "160,160,160");
    ctx.fillText("SHORT ROUTE", width * 0.53, height * 0.16);
    ctx.fillText("LONGER ALTERNATIVE", width * 0.51, height * 0.97);
    if (trailCanvas.width) ctx.drawImage(trailCanvas, 0, 0, width, height);

    const nest = { x: width * 0.08, y: height * 0.52 };
    const food = { x: width * 0.92, y: height * 0.52 };
    for (const [point, label, align] of [[nest, "NEST", "left"], [food, "FOOD", "right"]]) {
      ctx.beginPath();
      ctx.arc(point.x, point.y, 6, 0, Math.PI * 2);
      ctx.fillStyle = color("--swarm-dot", 0.9, "255,255,255");
      ctx.fill();
      ctx.font = "10px 'JetBrains Mono', monospace";
      ctx.textAlign = align;
      ctx.fillStyle = color("--text-soft", 0.82, "220,220,220");
      ctx.fillText(label, point.x + (align === "left" ? 10 : -10), point.y - 11);
    }
    for (const ant of ants) {
      const route = routes[ant.routeIndex];
      const distance = ant.returning ? route.length - ant.distance : ant.distance;
      const point = pointAt(route, distance);
      ctx.beginPath();
      ctx.arc(point.x, point.y, 1.7, 0, Math.PI * 2);
      ctx.fillStyle = color("--swarm-dot", 0.78, "255,255,255");
      ctx.fill();
    }
  };

  const updateStatus = () => {
    if (!status) return;
    const upperIsStronger = pheromone[0] >= pheromone[1];
    status.textContent = upperIsStronger ? "Short route gaining pheromone" : "Alternative route gaining pheromone";
  };

  const tick = (time) => {
    frame = 0;
    if (!visible || paused || document.hidden || reducedMotion) return;
    const dt = Math.min(0.05, Math.max(0, (time - (lastFrame || time)) / 1000));
    lastFrame = time;
    const fade = Math.pow(0.98, dt);
    pheromone = pheromone.map((value) => value * fade);
    trailCtx.globalCompositeOperation = "destination-out";
    trailCtx.fillStyle = `rgba(0,0,0,${1 - fade})`;
    trailCtx.fillRect(0, 0, width, height);
    trailCtx.globalCompositeOperation = "source-over";

    for (const ant of ants) {
      const route = routes[ant.routeIndex];
      const wasReturning = Boolean(ant.returning);
      const oldDistance = wasReturning ? 2 * route.length - ant.distance : ant.distance;
      ant.distance += (width * 0.22) * dt;
      if (!wasReturning && ant.distance >= route.length) {
        ant.distance = route.length;
        ant.returning = true;
      } else if (wasReturning && ant.distance >= 2 * route.length) {
        pheromone[ant.routeIndex] = Math.min(2.5, pheromone[ant.routeIndex] + 0.00045);
        ant.distance = 0;
        ant.returning = false;
        ant.routeIndex = chooseRoute();
      }
      const newDistance = ant.returning ? 2 * route.length - ant.distance : ant.distance;
      const from = pointAt(route, oldDistance);
      const to = pointAt(route, newDistance);
      trailCtx.beginPath();
      trailCtx.moveTo(from.x, from.y);
      trailCtx.lineTo(to.x, to.y);
      trailCtx.lineWidth = 1.7;
      trailCtx.lineCap = "round";
      trailCtx.strokeStyle = color("--swarm-line", 0.32, "255,255,255");
      trailCtx.stroke();
    }
    draw();
    statusClock += dt;
    if (statusClock > 1.25) {
      statusClock = 0;
      updateStatus();
    }
    frame = requestAnimationFrame(tick);
  };

  const syncPauseButton = () => {
    if (!pauseButton) return;
    const icon = pauseButton.querySelector("[data-swarm-icon]");
    const presetLabel = pauseButton.querySelector(".swarm-preset");
    if (icon) icon.textContent = paused ? "▶" : "⏸";
    if (presetLabel) presetLabel.textContent = "· ACO";
    pauseButton.setAttribute("aria-label", paused ? "Resume the ant colony simulation" : "Pause the ant colony simulation");
    pauseButton.setAttribute("aria-pressed", String(paused));
  };
  pauseButton?.addEventListener("click", () => {
    paused = !paused;
    try {
      localStorage.setItem("swarm-paused", String(paused));
    } catch (_) {}
    syncPauseButton();
    if (paused && frame) {
      cancelAnimationFrame(frame);
      frame = 0;
      draw();
    } else if (!paused && visible && !reducedMotion && !frame) {
      frame = requestAnimationFrame(tick);
    }
  });
  syncPauseButton();

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible && !paused && !reducedMotion && !frame) frame = requestAnimationFrame(tick);
      if (!visible && frame) {
        cancelAnimationFrame(frame);
        frame = 0;
      }
    });
    observer.observe(canvas);
  } else {
    visible = true;
    if (!paused && !reducedMotion) frame = requestAnimationFrame(tick);
  }
  let resizeTimer = 0;
  addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(resize, 120);
  });
  document.addEventListener("visibilitychange", () => {
    if (document.hidden && frame) {
      cancelAnimationFrame(frame);
      frame = 0;
    } else if (!document.hidden && visible && !paused && !reducedMotion && !frame) {
      frame = requestAnimationFrame(tick);
    }
  });
  document.addEventListener("themechange", draw);
  resize();
  updateStatus();
})();
