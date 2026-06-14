const BTM_TRAINING_ENTRYPOINT_VERSION = "0.21";

(function loadStableTrainingV021() {
  if (typeof window.btmApplyTrainingDays === "function") return;
  if (document.querySelector('script[src*="training-v018.js"]')) return;
  const script = document.createElement("script");
  script.src = "training-v018.js?v=018";
  script.async = false;
  script.onload = () => {
    if (typeof refreshUI === "function") refreshUI();
  };
  document.body.appendChild(script);
})();
