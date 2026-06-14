const BTM_PLAYER_DB_ENTRYPOINT_VERSION = "0.22";

(function loadStablePlayerDatabaseV022() {
  if (typeof window.btmEnsurePlayerDatabase === "function") return;
  if (document.querySelector('script[src*="player-db-v016.js"]')) return;
  const script = document.createElement("script");
  script.src = "player-db-v016.js?v=022";
  script.async = false;
  script.onload = () => {
    if (typeof refreshUI === "function") refreshUI();
  };
  document.body.appendChild(script);
})();