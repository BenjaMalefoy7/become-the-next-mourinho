const BTM_MATCH_CENTER_ENTRYPOINT_VERSION = "0.21";

(function loadStableMatchCenterV021() {
  if (typeof window.btmEnhanceLastMatchReport === "function") return;
  if (document.querySelector('script[src*="season-v013.js"]')) return;
  const script = document.createElement("script");
  script.src = "season-v013.js?v=020";
  script.async = false;
  script.onload = () => {
    if (typeof refreshUI === "function") refreshUI();
  };
  document.body.appendChild(script);
})();
