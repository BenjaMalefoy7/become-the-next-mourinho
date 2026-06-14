const BTM_MAILBOX_ENTRYPOINT_VERSION = "0.21";

(function loadStableMailboxV021() {
  if (typeof window.btmGenerateDailyMail === "function") return;
  if (document.querySelector('script[src*="season-v015.js"]')) return;
  const script = document.createElement("script");
  script.src = "season-v015.js?v=020";
  script.async = false;
  script.onload = () => {
    if (typeof refreshUI === "function") refreshUI();
  };
  document.body.appendChild(script);
})();
