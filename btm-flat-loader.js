const BTM_FLAT_LOADER_VERSION = "0.21";

(function loadBtmStableModulesV021() {
  const styles = [
    "match-center.css?v=021",
    "season-flow.css?v=021",
    "mailbox.css?v=021",
    "transfers.css?v=021",
    "training.css?v=021"
  ];

  const scripts = [
    "match-center.js?v=021",
    "season-flow.js?v=021",
    "mailbox.js?v=021",
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