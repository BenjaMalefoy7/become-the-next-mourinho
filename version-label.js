const BTM_VISIBLE_UI_VERSION = "V0.43 — Accueil premium";
(function () {
  function applyVersionLabel() {
    const footer = document.querySelector(".sidebar-footer");
    if (footer) footer.textContent = BTM_VISIBLE_UI_VERSION;
  }

  if (typeof window.btmRegisterRender === "function") window.btmRegisterRender("version-label", applyVersionLabel);
  document.addEventListener("DOMContentLoaded", applyVersionLabel);
})();