const BTM_SEASON_FLOW_ENTRYPOINT_VERSION = "0.22";

(function loadStableSeasonFlowV022() {
  if (typeof window.btmCanAdvanceDay === "function") return;
  if (document.querySelector('script[src*="season-v014.js"]')) return;
  const script = document.createElement("script");
  script.src = "season-v014.js?v=022";
  script.async = false;
  script.onload = () => {
    if (typeof refreshUI === "function") refreshUI();
  };
  document.body.appendChild(script);
})();