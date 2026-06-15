const BTM_VISIBLE_UI_VERSION = "V0.44D - Home identity pass";

(function () {
  function applyVersionLabel() {
    const footer = document.querySelector(".sidebar-footer");
    if (footer) footer.textContent = BTM_VISIBLE_UI_VERSION;

    const homeFooter = document.querySelector(".home-footer p");
    if (homeFooter) homeFooter.textContent = "Private build · V0.44D";
  }

  if (typeof window.btmRegisterRender === "function") window.btmRegisterRender("version-label", applyVersionLabel);
  document.addEventListener("DOMContentLoaded", applyVersionLabel);
})();
