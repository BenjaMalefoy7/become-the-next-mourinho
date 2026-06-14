const BTM_THEME_ENTRYPOINT_VERSION = "0.29B";

(function () {
  function ensureRenderRegistry() {
    if (window.btmRegisterRender && window.btmRunRegisteredRenders) return;

    const baseRefreshUI = typeof window.refreshUI === "function" ? window.refreshUI : null;
    const renderers = new Map();

    window.btmRegisterRender = function btmRegisterRender(name, renderer) {
      if (!name || typeof renderer !== "function") return;
      renderers.set(name, renderer);
    };

    window.btmUnregisterRender = function btmUnregisterRender(name) {
      renderers.delete(name);
    };

    window.btmRunRegisteredRenders = function btmRunRegisteredRenders(career) {
      const resolvedCareer = career || (typeof getResolvedCareer === "function" ? getResolvedCareer() : null);
      renderers.forEach((renderer, name) => {
        try {
          renderer(resolvedCareer);
        } catch (error) {
          console.error("[BTM render registry] Renderer failed:", name, error);
        }
      });
    };

    window.refreshUI = function refreshUIV029BRegistry() {
      if (baseRefreshUI) baseRefreshUI();
      window.btmRunRegisteredRenders();
    };
  }

  function hex(value, fallback) {
    const v = String(value || "").trim();
    if (/^#[0-9a-fA-F]{6}$/.test(v)) return v;
    if (/^#[0-9a-fA-F]{3}$/.test(v)) return "#" + v.slice(1).split("").map((char) => char + char).join("");
    return fallback;
  }

  function rgb(color) {
    const normalized = hex(color, "#173650").slice(1);
    return {
      r: parseInt(normalized.slice(0, 2), 16),
      g: parseInt(normalized.slice(2, 4), 16),
      b: parseInt(normalized.slice(4, 6), 16)
    };
  }

  function readable(primary, secondary) {
    const fallbackSecondary = hex(secondary, "#f8f3e8");
    if (fallbackSecondary.toLowerCase() !== primary.toLowerCase()) return fallbackSecondary;
    const color = rgb(primary);
    const luminance = (.299 * color.r + .587 * color.g + .114 * color.b) / 255;
    return luminance > .55 ? "#111820" : "#f8f3e8";
  }

  function apply(career) {
    const resolvedCareer = career || (typeof getResolvedCareer === "function" ? getResolvedCareer() : null);
    const club = resolvedCareer?.club || {};
    const primary = hex(club.primaryColor, "#173650");
    const secondary = readable(primary, club.secondaryColor || "#f8f3e8");
    const color = rgb(primary);

    document.documentElement.style.setProperty("--club-primary", primary);
    document.documentElement.style.setProperty("--club-secondary", secondary);
    document.documentElement.style.setProperty("--club-primary-rgb", `${color.r}, ${color.g}, ${color.b}`);

    const badge = document.querySelector(".brand-badge");
    if (badge && club.shortName) badge.textContent = String(club.shortName).slice(0, 3).toUpperCase();

    const footer = document.querySelector(".sidebar-footer");
    if (footer) footer.textContent = "V0.29B — Render registry centralisé";
  }

  ensureRenderRegistry();
  window.btmRegisterRender("theme", apply);
  document.addEventListener("DOMContentLoaded", () => apply());
  document.addEventListener("click", (event) => {
    if (event.target.closest(".nav-btn")) setTimeout(() => apply(), 0);
  });
})();
