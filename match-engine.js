const BTM_MATCH_ENGINE_ENTRYPOINT_VERSION = "0.28A";
(function () {
  if (window.__BTM_MATCH_ENGINE_LOADED__) return;
  window.__BTM_MATCH_ENGINE_LOADED__ = true;
  if (document.querySelector('script[src*="match-v080.js"]')) return;

  const script = document.createElement("script");
  script.src = "match-v080.js?v=028A";
  script.async = false;
  script.onerror = () => console.error("[BTM] Impossible de charger match-v080.js depuis match-engine.js");
  document.body.appendChild(script);
})();