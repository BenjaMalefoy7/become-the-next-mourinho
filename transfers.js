const BTM_TRANSFERS_ENTRYPOINT_VERSION = "0.22";

(function loadStableTransfersV022() {
  if (typeof window.renderTransfersV017 === "function") return;
  if (document.querySelector('script[src*="transfers-v017.js"]')) return;
  const script = document.createElement("script");
  script.src = "transfers-v017.js?v=022";
  script.async = false;
  script.onload = () => {
    if (typeof refreshUI === "function") refreshUI();
  };
  document.body.appendChild(script);
})();