// V0.12.1 — finition Effectif : headers de colonnes + drapeaux
(function initSquadPolishV0121() {
  const FLAGS = {
    "Brésil": "🇧🇷", Brazil: "🇧🇷",
    France: "🇫🇷",
    Angleterre: "🏴", England: "🏴",
    Espagne: "🇪🇸", Spain: "🇪🇸",
    Italie: "🇮🇹", Italy: "🇮🇹",
    Allemagne: "🇩🇪", Germany: "🇩🇪",
    Portugal: "🇵🇹",
    Argentine: "🇦🇷", Argentina: "🇦🇷",
    Belgique: "🇧🇪", Belgium: "🇧🇪",
    "Pays-Bas": "🇳🇱", Netherlands: "🇳🇱",
    Uruguay: "🇺🇾",
    Colombie: "🇨🇴", Colombia: "🇨🇴",
    Croatie: "🇭🇷", Croatia: "🇭🇷",
    Maroc: "🇲🇦", Morocco: "🇲🇦",
    Sénégal: "🇸🇳", Senegal: "🇸🇳",
    Nigeria: "🇳🇬",
    Ghana: "🇬🇭",
    Danemark: "🇩🇰", Denmark: "🇩🇰",
    Suède: "🇸🇪", Sweden: "🇸🇪",
    Norvège: "🇳🇴", Norway: "🇳🇴",
    Écosse: "🏴", Scotland: "🏴",
    Irlande: "🇮🇪", Ireland: "🇮🇪",
    Pologne: "🇵🇱", Poland: "🇵🇱"
  };

  function flagFor(country) {
    return FLAGS[String(country || "").trim()] || "🏳️";
  }

  function addStyle() {
    if (document.getElementById("squad-v0121-style")) return;
    const style = document.createElement("style");
    style.id = "squad-v0121-style";
    style.textContent = `
      .squad-v012-list-head{position:relative;display:grid;grid-template-columns:46px 1fr 44px 44px 60px;gap:10px;align-items:center;margin:0 4px 8px 0;padding:0 10px;color:#7d6340;font-size:.66rem;font-weight:1000;text-transform:uppercase;letter-spacing:.08em}
      .squad-v012-list-head span:nth-child(n+3){text-align:center}
      .squad-v012-country{display:inline-flex;align-items:center;gap:4px;white-space:nowrap}
    `;
    document.head.appendChild(style);
  }

  function polishSquad() {
    addStyle();
    const board = document.querySelector(".squad-v012-board");
    const list = document.querySelector(".squad-v012-list");
    if (!board || !list) return;

    if (!board.querySelector(".squad-v012-list-head")) {
      const head = document.createElement("div");
      head.className = "squad-v012-list-head";
      head.innerHTML = "<span></span><span>Joueur</span><span>OVR</span><span>POT</span><span>Cond.</span>";
      list.before(head);
    }

    document.querySelectorAll(".squad-v012-name span, .squad-v012-role").forEach((node) => {
      if (node.dataset.flagsDone === "1") return;
      const text = node.textContent || "";
      Object.keys(FLAGS).forEach((country) => {
        if (text.includes(country) && !text.includes(FLAGS[country])) {
          node.innerHTML = node.innerHTML.replace(country, `<span class="squad-v012-country">${flagFor(country)} ${country}</span>`);
        }
      });
      node.dataset.flagsDone = "1";
    });
  }

  const originalRenderPlayersPreview = window.renderPlayersPreview;
  if (typeof originalRenderPlayersPreview === "function") {
    window.renderPlayersPreview = function renderPlayersPreviewV0121() {
      originalRenderPlayersPreview.apply(this, arguments);
      polishSquad();
    };
  }

  document.addEventListener("DOMContentLoaded", () => setTimeout(polishSquad, 80));
  document.addEventListener("click", (event) => {
    if (event.target.closest("[data-squad-filter], [data-squad-player], .nav-btn")) setTimeout(polishSquad, 30);
  });
})();