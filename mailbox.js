const BTM_MAILBOX_ENTRYPOINT_VERSION = "0.22";

(function loadStableMailboxV022() {
  if (typeof window.btmGenerateDailyMail === "function") return;
  if (document.querySelector('script[src*="season-v015.js"]')) return;
  const script = document.createElement("script");
  script.src = "season-v015.js?v=022";
  script.async = false;
  script.onload = () => {
    if (typeof refreshUI === "function") refreshUI();
  };
  document.body.appendChild(script);
})();