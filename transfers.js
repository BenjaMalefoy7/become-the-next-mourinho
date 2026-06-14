const BTM_TRANSFERS_ENTRYPOINT_VERSION = "0.21";

(function loadStableTransfersV021() {
  if (typeof window.renderTransfersV017 === "function") return;
  if (document.querySelector('script[src*="transfers-v017.js"]')) return;
  const script = document.createElement("script");
  script.src = "transfers-v017.js?v=017";
  script.async = false;
  script.onload = () => {
    if (typeof refreshUI === "function") refreshUI();
  };
  document.body.appendChild(script);
})();
