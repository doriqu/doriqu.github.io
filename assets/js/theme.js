(() => {
  const root = document.documentElement;
  const button = document.querySelector("[data-theme-switch]");
  const normalize = (value) => (value === "light" ? "light" : "dark");
  const readStored = () => {
    try {
      return localStorage.getItem("theme");
    } catch (_) {
      return null;
    }
  };
  const saveStored = (theme) => {
    try {
      localStorage.setItem("theme", theme);
    } catch (_) {}
  };
  const syncButton = (theme) => {
    if (button) button.setAttribute("aria-label", theme === "dark" ? "Switch to light theme" : "Switch to dark theme");
  };
  const applyTheme = (theme) => {
    const applied = normalize(theme);
    root.setAttribute("data-theme", applied);
    syncButton(applied);
    document.dispatchEvent(new Event("themechange"));
  };

  // The head initializer owns first paint; this only synchronizes the control.
  syncButton(normalize(root.getAttribute("data-theme")));
  if (button) {
    button.addEventListener("click", () => {
      const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
      saveStored(next);
      applyTheme(next);
    });
  }
  addEventListener("storage", (event) => {
    if (event.key === "theme") {
      const theme = normalize(event.newValue);
      if (event.newValue !== null && event.newValue !== theme) saveStored(theme);
      applyTheme(theme);
    }
  });
  addEventListener("pageshow", () => {
    const stored = readStored();
    const theme = normalize(stored);
    if (stored !== null && stored !== theme) saveStored(theme);
    applyTheme(theme);
  });
})();
