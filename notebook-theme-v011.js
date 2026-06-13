// V0.11.1 — dynamic Coach Notebook theme
(function () {
  const DEFAULT_PRIMARY = "#1f4e79";
  const DEFAULT_SECONDARY = "#f2efe4";

  function isHex(value) {
    return typeof value === "string" && /^#?[0-9a-f]{6}$/i.test(value.trim());
  }

  function normalizeHex(value, fallback) {
    if (!isHex(value)) return fallback;
    const clean = value.trim().replace("#", "");
    return "#" + clean.toLowerCase();
  }

  function hexToRgb(hex) {
    const clean = normalizeHex(hex, DEFAULT_PRIMARY).replace("#", "");
    return {
      r: parseInt(clean.slice(0, 2), 16),
      g: parseInt(clean.slice(2, 4), 16),
      b: parseInt(clean.slice(4, 6), 16)
    };
  }

  function rgbToHex(r, g, b) {
    const toHex = (value) => Math.max(0, Math.min(255, Math.round(value))).toString(16).padStart(2, "0");
    return "#" + toHex(r) + toHex(g) + toHex(b);
  }

  function mix(hexA, hexB, amount) {
    const a = hexToRgb(hexA);
    const b = hexToRgb(hexB);
    return rgbToHex(
      a.r + (b.r - a.r) * amount,
      a.g + (b.g - a.g) * amount,
      a.b + (b.b - a.b) * amount
    );
  }

  function rgba(hex, alpha) {
    const rgb = hexToRgb(hex);
    return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha})`;
  }

  function getCareer() {
    try {
      if (typeof getResolvedCareer === "function") return getResolvedCareer();
    } catch (error) {
      console.warn("Notebook theme: unable to resolve career", error);
    }
    return null;
  }

  function getActiveScreenId() {
    const active = document.querySelector(".screen.active");
    return active ? active.id : "dashboard";
  }

  function getNotebookTabForScreen(screenId) {
    if (["lineup", "match", "training"].includes(screenId)) return "tactical";
    if (screenId === "squad") return "squad";
    if (["standings", "calendar", "finances"].includes(screenId)) return "analysis";
    if (["transfers"].includes(screenId)) return "reports";
    return "tactical";
  }

  function ensureNotebookTabs() {
    const main = document.querySelector(".main-content");
    if (!main || main.querySelector(".notebook-tabs")) return;

    const tabs = document.createElement("div");
    tabs.className = "notebook-tabs";
    tabs.innerHTML = `
      <div class="notebook-tab" data-notebook-tab="tactical">Tactical</div>
      <div class="notebook-tab" data-notebook-tab="squad">Squad</div>
      <div class="notebook-tab" data-notebook-tab="analysis">Analysis</div>
      <div class="notebook-tab" data-notebook-tab="reports">Reports</div>
      <div class="notebook-tab" data-notebook-tab="archive">Archive</div>
    `;
    main.appendChild(tabs);
  }

  function ensureNotebookSticky() {
    const main = document.querySelector(".main-content");
    if (!main || main.querySelector(".notebook-sticky")) return;

    const sticky = document.createElement("div");
    sticky.className = "notebook-sticky";
    sticky.textContent = "Work the details. Win the moments. — JM";
    main.appendChild(sticky);
  }

  function updateNotebookTabs() {
    const activeTab = getNotebookTabForScreen(getActiveScreenId());
    document.querySelectorAll(".notebook-tab").forEach((tab) => {
      tab.classList.toggle("active", tab.dataset.notebookTab === activeTab);
    });
  }

  function updateSidebarFooter(career) {
    const footer = document.querySelector(".sidebar-footer");
    if (!footer) return;
    const clubName = career?.club?.name || "Coach Notebook";
    footer.innerHTML = `“The special one ?<br>No. Just the next one.”<br><strong>${escapeFooter(clubName)}</strong> · V0.11.1`;
  }

  function escapeFooter(value) {
    return String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function updateBrand(career) {
    const badge = document.querySelector(".sidebar .brand-badge");
    if (!badge) return;
    const shortName = career?.club?.shortName || "BTM";
    const badgeText = career?.club?.badge || shortName.slice(0, 3).toUpperCase();
    badge.textContent = badgeText;
  }

  function applyNotebookTheme() {
    const career = getCareer();
    const primary = normalizeHex(career?.club?.primaryColor, DEFAULT_PRIMARY);
    const secondary = normalizeHex(career?.club?.secondaryColor, DEFAULT_SECONDARY);
    const cover = mix(primary, "#07131f", 0.62);
    const coverDeep = mix(primary, "#02060a", 0.82);

    document.body.classList.add("notebook-theme");
    const root = document.documentElement;
    root.style.setProperty("--club-primary", primary);
    root.style.setProperty("--club-secondary", secondary);
    root.style.setProperty("--club-cover", cover);
    root.style.setProperty("--club-cover-deep", coverDeep);
    root.style.setProperty("--club-accent-soft", rgba(primary, 0.14));

    ensureNotebookTabs();
    ensureNotebookSticky();
    updateNotebookTabs();
    updateSidebarFooter(career);
    updateBrand(career);
  }

  const previousRefreshUI = window.refreshUI;
  if (typeof previousRefreshUI === "function") {
    window.refreshUI = function (...args) {
      const result = previousRefreshUI.apply(this, args);
      requestAnimationFrame(applyNotebookTheme);
      return result;
    };
  }

  document.addEventListener("click", () => setTimeout(applyNotebookTheme, 0));
  document.addEventListener("DOMContentLoaded", applyNotebookTheme);
  setTimeout(applyNotebookTheme, 0);

  window.applyNotebookTheme = applyNotebookTheme;
})();
