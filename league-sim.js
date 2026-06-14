const BTM_LEAGUE_SIM_ENTRYPOINT_VERSION = "0.28A";
(function () {
  if (window.__BTM_LEAGUE_SIM_LOADED__) return;
  window.__BTM_LEAGUE_SIM_LOADED__ = true;
  if (document.querySelector('script[src*="matchday-v090.js"]')) return;

  const script = document.createElement("script");
  script.src = "matchday-v090.js?v=028A";
  script.async = false;
  script.onerror = () => console.error("[BTM] Impossible de charger matchday-v090.js depuis league-sim.js");
  script.onload = () => {
    if (typeof window.renderDynamicStandings === "function") {
      window.renderDynamicStandings(typeof getResolvedCareer === "function" ? getResolvedCareer() : null);
    }
  };
  document.body.appendChild(script);
})();