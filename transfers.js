const BTM_TRANSFERS_ENTRYPOINT_VERSION = "0.35";

(function () {
  if (window.__BTM_TRANSFERS_LOADED__) return;
  window.__BTM_TRANSFERS_LOADED__ = true;

  const state = { q: "", pos: "ALL", selectedId: null, note: "" };
  const positions = ["GK", "DD", "DC", "DG", "MDC", "MC", "MOC", "AD", "AG", "BU"];

  function esc(value) {
    if (typeof escapeHtml === "function") return escapeHtml(value);
    return String(value ?? "").replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  }

  function txt(value, fallback = "—") {
    if (typeof safeText === "function") return safeText(value, fallback);
    return value === null || value === undefined || value === "" ? fallback : String(value);
  }

  function money(value) {
    return typeof formatMoney === "function" ? formatMoney(value) : txt(value);
  }

  function posLabel(position) {
    return typeof getPositionLabel === "function" ? getPositionLabel(position) : txt(position);
  }

  function getActiveBundle() {
    const activeId = typeof getActiveCareerId === "function" ? getActiveCareerId() : null;
    const careers = typeof loadCareers === "function" ? loadCareers() : [];
    const index = careers.findIndex(career => career.id === activeId);
    return { careers, index, career: index >= 0 ? careers[index] : null };
  }

  function saveBundle(bundle) {
    if (!bundle || bundle.index < 0 || !bundle.career) return false;
    bundle.career.updatedAt = new Date().toISOString();
    bundle.careers[bundle.index] = bundle.career;
    return typeof saveCareers === "function" ? saveCareers(bundle.careers, { silent: true }) : false;
  }

  function ensureMarket(career) {
    if (!career) return [];
    if (typeof window.btmEnsurePlayerDatabase === "function") {
      return window.btmEnsurePlayerDatabase(career, 240) || [];
    }
    career.playerDatabase = Array.isArray(career.playerDatabase) ? career.playerDatabase : [];
    return career.playerDatabase;
  }

  function visiblePlayers(career) {
    const market = ensureMarket(career);
    const ownedIds = new Set((career.players || []).map(player => player.id));
    const q = state.q.trim().toLowerCase();

    return market
      .filter(player => player && !ownedIds.has(player.id))
      .filter(player => player.clubId !== career.club?.id)
      .filter(player => !player.transferred)
      .filter(player => state.pos === "ALL" || player.primaryPosition === state.pos)
      .filter(player => !q || String(player.name).toLowerCase().includes(q) || String(player.club).toLowerCase().includes(q) || String(player.nationality).toLowerCase().includes(q))
      .sort((a, b) => (Number(b.overall) || 0) - (Number(a.overall) || 0));
  }

  function buyPlayer(playerId) {
    const bundle = getActiveBundle();
    const career = bundle.career;
    if (!career || !playerId) return;

    const market = ensureMarket(career);
    const target = market.find(player => player.id === playerId);
    if (!target) return;

    career.finances = career.finances || {};
    const price = Number(target.listedPrice || target.value) || 0;
    const budget = Number(career.finances.transferBudget) || 0;

    if (price > budget) {
      state.note = "Budget insuffisant pour finaliser ce transfert.";
      renderTransfers(career);
      return;
    }

    const ownedCopy = {
      ...target,
      id: typeof createId === "function" ? createId("player") : `${target.id}_owned`,
      clubId: career.club?.id,
      club: career.club?.name,
      contractYears: Math.max(2, Number(target.contractYears) || 3),
      condition: 100,
      morale: "Normal",
      injuryStatus: "Disponible"
    };

    career.players = Array.isArray(career.players) ? career.players : [];
    career.players.push(ownedCopy);
    career.finances.transferBudget = Math.max(0, budget - price);
    career.finances.balance = Math.max(0, (Number(career.finances.balance) || budget) - price);

    target.transferred = true;
    target.clubId = career.club?.id;
    target.club = career.club?.name;

    state.selectedId = null;
    state.note = `Transfert finalisé : ${target.name} rejoint ${career.club?.name || "le club"}.`;

    if (typeof window.btmGenerateTransferMail === "function") {
      window.btmGenerateTransferMail(career, target, price);
    }

    saveBundle(bundle);
    if (typeof refreshUI === "function") refreshUI();
  }

  function renderPlayerRow(player) {
    return `<button class="transfers-v017-row" data-transfer-id="${esc(player.id)}">
      <span class="transfers-v017-pos">${esc(player.primaryPosition)}</span>
      <span><strong>${esc(player.name)}</strong><small>${esc(posLabel(player.primaryPosition))} · ${txt(player.age)} ans · ${esc(player.nationality)} · ${esc(player.club)} · OVR ${txt(player.overall)} / POT ${txt(player.potential)}</small></span>
      <span class="transfers-v017-price">${money(player.listedPrice || player.value)}</span>
    </button>`;
  }

  function renderSelectedPlayer(player) {
    if (!player) return "<p>Sélectionne un joueur.</p>";
    return `<p class="eyebrow">Dossier cible</p>
      <h3>${esc(player.name)}</h3>
      <p>${esc(posLabel(player.primaryPosition))} · ${txt(player.age)} ans · ${esc(player.nationality)}</p>
      <div class="transfers-v017-kpis"><div><span>OVR</span><strong>${txt(player.overall)}</strong></div><div><span>POT</span><strong>${txt(player.potential)}</strong></div><div><span>Scout</span><strong>${txt(player.scoutLevel)}%</strong></div></div>
      <p>Club actuel : <strong>${esc(player.club)}</strong></p>
      <p>Prix demandé : <strong>${money(player.listedPrice || player.value)}</strong></p>
      <p>Salaire estimé : <strong>${money(player.salary)}</strong></p>
      <div class="transfers-v017-actions"><button class="primary-btn" id="transfer-buy">Acheter au prix demandé</button></div>`;
  }

  function bindTransfers(screen) {
    screen.querySelector("#transfer-search")?.addEventListener("input", event => {
      state.q = String(event.target.value || "");
      renderTransfers();
    });

    screen.querySelector("#transfer-pos")?.addEventListener("change", event => {
      state.pos = event.target.value || "ALL";
      state.selectedId = null;
      renderTransfers();
    });

    screen.querySelectorAll("[data-transfer-id]").forEach(button => {
      button.addEventListener("click", () => {
        state.selectedId = button.dataset.transferId;
        renderTransfers();
      });
    });

    screen.querySelector("#transfer-buy")?.addEventListener("click", () => buyPlayer(state.selectedId));
  }

  function renderTransfers(career = typeof getResolvedCareer === "function" ? getResolvedCareer() : null) {
    const screen = document.getElementById("transfers");
    if (!screen) return;

    if (!career) {
      screen.innerHTML = "<div class='section-header'><h3>Recrutement</h3><p>Aucune carrière active.</p></div>";
      return;
    }

    const players = visiblePlayers(career);
    if (!state.selectedId || !players.some(player => player.id === state.selectedId)) {
      state.selectedId = players[0]?.id || null;
    }
    const selected = players.find(player => player.id === state.selectedId) || players[0];

    screen.innerHTML = `<div class="section-header section-header-row"><div><p class="eyebrow">Marché V0.35</p><h3>Recrutement</h3><p>Marché stable : chercher, filtrer et acheter un joueur au prix demandé.</p></div><div class="transfers-v017-price">Budget : ${money(career.finances?.transferBudget)}</div></div>
      <div class="transfers-v017"><article class="transfers-v017-board"><div class="transfers-v017-toolbar"><input id="transfer-search" placeholder="Rechercher joueur, club ou nationalité" value="${esc(state.q)}"><select id="transfer-pos"><option value="ALL">Tous postes</option>${positions.map(position => `<option value="${position}" ${state.pos === position ? "selected" : ""}>${position}</option>`).join("")}</select></div><div class="transfers-v017-list">${players.slice(0, 80).map(renderPlayerRow).join("") || "<p>Aucun joueur trouvé.</p>"}</div></article><article class="transfers-v017-side">${renderSelectedPlayer(selected)}${state.note ? `<div class="transfers-v017-note">${esc(state.note)}</div>` : ""}</article></div>`;

    bindTransfers(screen);
  }

  window.renderTransfersV017 = renderTransfers;
  window.renderTransfers = renderTransfers;

  if (typeof window.btmRegisterRender === "function") {
    window.btmRegisterRender("transfers", renderTransfers);
  } else {
    document.addEventListener("DOMContentLoaded", () => renderTransfers());
  }
})();