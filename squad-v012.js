const SQUAD_DOSSIER_VERSION = "0.12";

(function initSquadDossierV012() {
  const state = { filter: "all", selectedId: null };
  const groups = {
    all: [],
    GK: ["GK"],
    DEF: ["DD", "DC", "DG"],
    MID: ["MDC", "MC", "MOC"],
    ATT: ["AD", "AG", "BU"]
  };

  function sx(value) {
    return typeof escapeHtml === "function" ? escapeHtml(value) : String(value ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  }

  function sm(value, fallback = "—") {
    return typeof safeText === "function" ? safeText(value, fallback) : (value === undefined || value === null || value === "" ? fallback : String(value));
  }

  function money(value) {
    return typeof formatMoney === "function" ? formatMoney(value) : sm(value);
  }

  function posLabel(pos) {
    return typeof getPositionLabel === "function" ? getPositionLabel(pos) : sm(pos);
  }

  function sortedPlayers(career) {
    const players = Array.isArray(career?.players) ? career.players : [];
    return typeof sortPlayers === "function" ? sortPlayers(players) : players.slice();
  }

  function filteredPlayers(players) {
    const allowed = groups[state.filter] || [];
    if (!allowed.length) return players;
    return players.filter((player) => allowed.includes(player.primaryPosition));
  }

  function conditionClass(value) {
    const condition = Number(value) || 0;
    if (condition >= 85) return "Fit";
    if (condition >= 65) return "Correct";
    return "À surveiller";
  }

  function squadNote(player) {
    if (!player) return "Sélectionne un joueur pour ouvrir son dossier.";
    if (player.primaryPosition === "GK") return "Gardien à protéger : relance courte seulement si la défense est stable.";
    if (["DC", "DD", "DG"].includes(player.primaryPosition)) return "Profil défensif : surveiller les duels et la fatigue avant les gros matchs.";
    if (["MDC", "MC", "MOC"].includes(player.primaryPosition)) return "Cœur du jeu : utile pour contrôler le tempo et sécuriser la possession.";
    return "Profil offensif : à utiliser quand il faut accélérer et provoquer des différences.";
  }

  function renderFilters() {
    const items = [
      ["all", "Tous"],
      ["GK", "Gardiens"],
      ["DEF", "Défense"],
      ["MID", "Milieu"],
      ["ATT", "Attaque"]
    ];
    return `<div class="squad-v012-filters">${items.map(([key, label]) => `<button class="squad-v012-filter${state.filter === key ? " active" : ""}" data-squad-filter="${key}">${label}</button>`).join("")}</div>`;
  }

  function renderRow(player, career) {
    const active = player.id === state.selectedId ? " active" : "";
    const secondary = Array.isArray(player.secondaryPositions) && player.secondaryPositions.length ? player.secondaryPositions.join("/") : "—";
    return `
      <button class="squad-v012-row${active}" data-squad-player="${sx(player.id)}" type="button">
        <span class="squad-v012-shirt">${sx(player.primaryPosition || "?")}</span>
        <span class="squad-v012-name"><strong>${sx(player.name)}</strong><span>${sx(posLabel(player.primaryPosition))} · Sec. ${sx(secondary)} · ${sx(player.nationality)}</span></span>
        <span class="squad-v012-cell"><small>OVR</small>${sm(player.overall)}</span>
        <span class="squad-v012-cell"><small>POT</small>${sm(player.potential)}</span>
        <span class="squad-v012-cond">${sm(player.condition, 100)}%</span>
      </button>
    `;
  }

  function renderDossier(player, career) {
    if (!player) {
      return `<article class="squad-v012-dossier squad-v012-empty"><h3>Dossier joueur</h3><p>Aucun joueur dans ce filtre.</p></article>`;
    }

    const secondary = Array.isArray(player.secondaryPositions) && player.secondaryPositions.length ? player.secondaryPositions.join(" / ") : "Aucun";
    const bars = [
      ["Attaque", player.attack],
      ["Défense", player.defense],
      ["Physique", player.physical],
      ["Mental", player.mental]
    ];

    return `
      <article class="squad-v012-dossier">
        <div class="squad-v012-big-rating">${sm(player.overall)}</div>
        <div class="squad-v012-player-top">
          <div class="squad-v012-silhouette" aria-hidden="true"></div>
          <div>
            <p class="eyebrow">Dossier joueur</p>
            <h3>${sx(player.name)}</h3>
            <p class="squad-v012-role">${sx(posLabel(player.primaryPosition))} · ${sx(player.age)} ans · ${sx(player.nationality)}</p>
            <div class="squad-v012-badges">
              <span class="squad-v012-badge">POT ${sm(player.potential)}</span>
              <span class="squad-v012-badge">${sx(conditionClass(player.condition))}</span>
              <span class="squad-v012-badge">${sx(player.injuryStatus || "Disponible")}</span>
            </div>
          </div>
        </div>

        <div class="squad-v012-info-grid">
          <div class="squad-v012-info"><span>Poste principal</span><strong>${sx(player.primaryPosition)}</strong></div>
          <div class="squad-v012-info"><span>Postes secondaires</span><strong>${sx(secondary)}</strong></div>
          <div class="squad-v012-info"><span>Valeur</span><strong>${money(player.value)}</strong></div>
          <div class="squad-v012-info"><span>Salaire</span><strong>${money(player.salary)}</strong></div>
          <div class="squad-v012-info"><span>Contrat</span><strong>${sm(player.contractYears)} an(s)</strong></div>
          <div class="squad-v012-info"><span>Morale</span><strong>${sx(player.morale || "Normal")}</strong></div>
        </div>

        <div class="squad-v012-bars">
          ${bars.map(([label, value]) => `<div class="squad-v012-bar"><span>${label}</span><div class="squad-v012-bar-track"><div class="squad-v012-bar-fill" style="width:${Math.max(0, Math.min(100, Number(value) || 0))}%"></div></div><strong>${sm(value)}</strong></div>`).join("")}
        </div>

        <div class="squad-v012-coach-note"><strong>Note coach</strong><br>${sx(squadNote(player))}</div>
      </article>
    `;
  }

  function render(career = typeof getResolvedCareer === "function" ? getResolvedCareer() : null) {
    const container = document.getElementById("players-preview");
    if (!container) return;

    if (!career) {
      container.innerHTML = `<div class="empty-state compact-empty"><span>👥</span><h4>Aucune carrière active</h4><p>Retourne à l’accueil, crée une partie ou charge une sauvegarde.</p></div>`;
      return;
    }

    const players = sortedPlayers(career);
    const visible = filteredPlayers(players);
    if (!visible.some((player) => player.id === state.selectedId)) state.selectedId = visible[0]?.id || players[0]?.id || null;
    const selected = players.find((player) => player.id === state.selectedId) || visible[0] || players[0] || null;

    container.innerHTML = `
      <div class="squad-v012">
        <article class="squad-v012-board">
          <div class="squad-v012-head">
            <div><p class="eyebrow">Effectif V0.12</p><h3>Liste du groupe</h3></div>
            <div class="squad-v012-note">${sx(career.club?.shortName || career.club?.name || "Club")}<br>observer · trier · décider</div>
          </div>
          ${renderFilters()}
          <div class="squad-v012-list">${visible.map((player) => renderRow(player, career)).join("") || `<div class="squad-v012-empty">Aucun joueur dans ce filtre.</div>`}</div>
        </article>
        ${renderDossier(selected, career)}
      </div>
    `;
  }

  window.renderPlayersPreview = render;

  document.addEventListener("click", (event) => {
    const filter = event.target.closest("[data-squad-filter]");
    if (filter) {
      state.filter = filter.dataset.squadFilter || "all";
      state.selectedId = null;
      render();
      return;
    }

    const playerButton = event.target.closest("[data-squad-player]");
    if (playerButton) {
      state.selectedId = playerButton.dataset.squadPlayer;
      render();
    }
  });

  document.addEventListener("DOMContentLoaded", () => render());
})();

(function initSquadPolishV0121() {
  const flagMap = { "Brésil": "🇧🇷", "France": "🇫🇷", "Angleterre": "🏴", "Espagne": "🇪🇸", "Italie": "🇮🇹", "Allemagne": "🇩🇪", "Portugal": "🇵🇹", "Argentine": "🇦🇷", "Belgique": "🇧🇪", "Pays-Bas": "🇳🇱", "Uruguay": "🇺🇾", "Colombie": "🇨🇴", "Croatie": "🇭🇷", "Maroc": "🇲🇦", "Sénégal": "🇸🇳", "Nigeria": "🇳🇬", "Ghana": "🇬🇭", "Danemark": "🇩🇰", "Suède": "🇸🇪", "Norvège": "🇳🇴", "Écosse": "🏴", "Irlande": "🇮🇪", "Pologne": "🇵🇱" };

  function addSquadPolishStyles() {
    if (document.getElementById("squad-polish-v0121")) return;
    const style = document.createElement("style");
    style.id = "squad-polish-v0121";
    style.textContent = ".squad-v012-list-head{position:relative;display:grid;grid-template-columns:46px 1fr 44px 44px 60px;gap:10px;margin:0 4px 8px 0;padding:0 10px;color:#806542;font-size:.66rem;font-weight:1000;text-transform:uppercase;letter-spacing:.08em}.squad-v012-list-head span:nth-child(n+3){text-align:center}.squad-v012-country{display:inline-flex;gap:4px;align-items:center;white-space:nowrap}";
    document.head.appendChild(style);
  }

  function addHeaders() {
    const board = document.querySelector(".squad-v012-board");
    const list = document.querySelector(".squad-v012-list");
    if (!board || !list || board.querySelector(".squad-v012-list-head")) return;
    const header = document.createElement("div");
    header.className = "squad-v012-list-head";
    header.innerHTML = "<span></span><span>Joueur</span><span>OVR</span><span>POT</span><span>Cond.</span>";
    list.before(header);
  }

  function addFlags() {
    document.querySelectorAll(".squad-v012-name span, .squad-v012-role").forEach((node) => {
      if (node.dataset.flagged === "1") return;
      let html = node.innerHTML;
      Object.entries(flagMap).forEach(([country, flag]) => {
        if (html.includes(country) && !html.includes(flag)) html = html.replace(country, `<span class="squad-v012-country">${flag} ${country}</span>`);
      });
      node.innerHTML = html;
      node.dataset.flagged = "1";
    });
  }

  function polish() {
    addSquadPolishStyles();
    addHeaders();
    addFlags();
  }

  const previousRenderPlayersPreview = window.renderPlayersPreview;
  if (typeof previousRenderPlayersPreview === "function") {
    window.renderPlayersPreview = function renderPlayersPreviewV0121() {
      previousRenderPlayersPreview.apply(this, arguments);
      polish();
    };
  }

  document.addEventListener("DOMContentLoaded", () => setTimeout(polish, 80));
  document.addEventListener("click", (event) => {
    if (event.target.closest("[data-squad-filter], [data-squad-player], .nav-btn")) setTimeout(polish, 40);
  });
})();