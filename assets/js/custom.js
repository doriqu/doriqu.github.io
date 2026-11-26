(() => {
  const reducedMotion =
    matchMedia("(prefers-reduced-motion: reduce)").matches || getComputedStyle(document.documentElement).getPropertyValue("--motion").trim() === "0";

  const progressBar = document.querySelector(".reading-progress");
  const scrollTopButton = document.querySelector("#portfolio-scroll-to-top");
  const siteFooter = document.querySelector(".portfolio-footer");
  const updateProgress = () => {
    if (progressBar) {
      const scrollableHeight = document.documentElement.scrollHeight - innerHeight;
      progressBar.style.width = `${scrollableHeight > 0 ? (scrollY / scrollableHeight) * 100 : 0}%`;
    }
    if (scrollTopButton) {
      const footerVisible = siteFooter && siteFooter.getBoundingClientRect().top < innerHeight;
      scrollTopButton.classList.toggle("is-visible", scrollY > 320 && !footerVisible);
    }
  };
  addEventListener("scroll", updateProgress, { passive: true });
  updateProgress();
  scrollTopButton?.addEventListener("click", () => {
    scrollTo({ top: 0, behavior: reducedMotion ? "auto" : "smooth" });
  });

  if (!reducedMotion && "IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.remove("is-hidden");
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }),
      { threshold: 0.12 }
    );
    document.querySelectorAll(".reveal, .surface-card, .timeline-entry, .section-heading").forEach((element, index) => {
      element.classList.add("is-hidden");
      element.style.transitionDelay = `${(index % 4) * 70}ms`;
      revealObserver.observe(element);
    });
  }

  const roleLine = document.querySelector("[data-rotating-phrase]");
  if (roleLine && !reducedMotion) {
    const phrases = ["Electrical Engineering student", "Embedded systems", "Robotics", "Swarm robotics"];
    let phraseIndex = 0;
    let phraseTimer;
    const startRotation = () => {
      clearInterval(phraseTimer);
      phraseTimer = setInterval(() => {
        roleLine.style.opacity = "0";
        setTimeout(() => {
          phraseIndex = (phraseIndex + 1) % phrases.length;
          roleLine.textContent = phrases[phraseIndex];
          roleLine.style.opacity = "1";
        }, 250);
      }, 3200);
    };
    roleLine.addEventListener("mouseenter", () => clearInterval(phraseTimer));
    roleLine.addEventListener("mouseleave", startRotation);
    startRotation();
  }

  const previewCards = [...document.querySelectorAll(".project-card")];
  const previewVideos = new Set();
  const motionAllowed = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const activatePreview = async (card) => {
    if (!motionAllowed) return;
    const video = card.querySelector(".project-preview");
    if (!video) return;
    if (!video.src) video.src = video.dataset.src;
    video.classList.add("is-loaded");
    previewVideos.forEach((other) => {
      if (other !== video) {
        other.pause();
        other.closest(".project-card")?.classList.remove("preview-playing");
      }
    });
    previewVideos.add(video);
    try {
      await video.play();
      card.classList.add("preview-playing");
    } catch (_) {
      /* poster remains visible */
    }
  };
  const deactivatePreview = (card) => {
    const video = card.querySelector(".project-preview");
    if (!video) return;
    video.pause();
    card.classList.remove("preview-playing");
  };
  previewCards.forEach((card) => {
    card.addEventListener("mouseenter", () => activatePreview(card));
    card.addEventListener("mouseleave", () => deactivatePreview(card));
    card.addEventListener("focusin", () => activatePreview(card));
    card.addEventListener("focusout", (event) => {
      if (!card.contains(event.relatedTarget)) deactivatePreview(card);
    });
  });
  if (motionAllowed && "IntersectionObserver" in window && matchMedia("(hover: none)").matches) {
    let activeTouchCard = null;
    const touchObserver = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (entry.intersectionRatio >= 0.6) {
            activeTouchCard = entry.target;
            activatePreview(entry.target);
          } else if (activeTouchCard === entry.target) {
            deactivatePreview(entry.target);
            activeTouchCard = null;
          }
        }),
      { threshold: [0, 0.6, 1] }
    );
    previewCards.forEach((card) => touchObserver.observe(card));
  }

  document.querySelectorAll("[data-project-toggle]").forEach((button) => {
    button.addEventListener("click", () => {
      const expand = button.getAttribute("aria-expanded") !== "true";
      button.setAttribute("aria-expanded", String(expand));
      document.querySelectorAll("[data-project-extra]").forEach((card) => {
        card.hidden = !expand;
      });
      button.textContent = expand ? "Show fewer projects ↑" : "Show more projects ↓";
      if (!expand) {
        document.querySelector(".custom-site")?.scrollIntoView({
          behavior: reducedMotion ? "auto" : "smooth",
          block: "start",
        });
      }
    });
  });

})();
