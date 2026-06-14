const BTM_FLAT_LOADER_VERSION = "0.21";

(function loadBtmStableModulesV021() {
  const styles = [
    "mailbox.css?v=021",
    "transfers.css?v=021",
    "training.css?v=021"
  ];

  const scripts = [
    "player-db.js?v=021",
    "transfers.js?v=021",
    "training.js?v=021"
  ];

  function hasAsset(selector, file) {
    return Boolean(document.querySelector(`${selector}*="${file}"]`));
  }

  styles.forEach((href) => {
    const file = href.split("?")[0];
    if (hasAsset("link[href", file)) return;
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = href;
    document.head.appendChild(link);
  });

  function loadScript(index) {
    if (index >= scripts.length) {
      if (typeof refreshUI === "function") refreshUI();
      return;
    }

    const src = scripts[index];
    const file = src.split("?")[0];
    if (hasAsset("script[src", file)) {
      loadScript(index + 1);
      return;
    }

    const script = document.createElement("script");
    script.src = src;
    script.async = false;
    script.onload = () => loadScript(index + 1);
    document.body.appendChild(script);
  }

  loadScript(0);
})();