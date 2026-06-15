const BTM_VISIBLE_UI_VERSION = "V0.43D - Desk details polish";
(function () {
  function ensureLandingStyle() {
    if (document.getElementById("btm-v043c-style")) return;
    const style = document.createElement("style");
    style.id = "btm-v043c-style";
    style.textContent = ".desk-copy{color:rgb(23,63,49);background:rgba(255,243,216,.80);border:1px solid rgba(180,141,61,.35);padding:30px;border-radius:32px}.desk-kicker{background:rgba(255,248,229,.92);border-color:rgba(191,142,38,.44);color:rgb(154,111,23)}.desk-copy h1{color:rgb(23,63,49);opacity:1;text-shadow:none}.desk-copy h1 span{color:rgb(189,140,31)}.desk-lead{color:rgb(80,71,52);opacity:1;font-weight:760}.desk-quote{background:rgba(255,248,229,.72);color:rgb(106,80,48);opacity:1}";
    document.head.appendChild(style);
  }

  function applyVersionLabel() {
    ensureLandingStyle();
    const footer = document.querySelector(".sidebar-footer");
    if (footer) footer.textContent = BTM_VISIBLE_UI_VERSION;
  }

  if (typeof window.btmRegisterRender === "function") window.btmRegisterRender("version-label", applyVersionLabel);
  document.addEventListener("DOMContentLoaded", applyVersionLabel);
})();