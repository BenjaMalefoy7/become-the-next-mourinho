const BTM_LINEUP_ENTRYPOINT_VERSION = "0.33";

(function () {
  if (window.__BTM_LINEUP_ENTRYPOINT_LOADED__) return;
  window.__BTM_LINEUP_ENTRYPOINT_LOADED__ = true;

  const DEFAULT_FORMATION = "4-3-3";
  const LINEUP_SCHEMA_VERSION = "lineup_v033";
  let selectedSlotId = "";

  const POSITION_LABELS = {
    GK: "Gardien",
    DC: "Défenseur central",
    DG: "Défenseur gauche",
    DD: "Défenseur droit",
    MDC: "Milieu défensif",
    MC: "Milieu central",
    MOC: "Milieu offensif",
    MG: "Milieu gauche",
    MD: "Milieu droit",
    AG: "Ailier gauche",
    AD: "Ailier droit",
    BU: "Buteur"
  };

  const FORMATIONS = {
    "4-3-3": [
      { name: "Attaque", className: "attack", slots: ["AG", "BU", "AD"] },
      { name: "Milieu", className: "midfield", slots: ["MC", "MDC", "MC"] },
      { name: "Défense", className: "defense", slots: ["DG", "DC", "DC", "DD"] },
      { name: "Gardien", className: "keeper", slots: ["GK"] }
    ],
    "4-2-3-1": [
      { name: "Attaque", className: "attack", slots: ["BU"] },
      { name: "Ligne offensive", className: "support", slots: ["AG", "MOC", "AD"] },
      { name: "Double pivot", className: "midfield", slots: ["MDC", "MDC"] },
      { name: "Défense", className: "defense", slots: ["DG", "DC", "DC", "DD"] },
      { name: "Gardien", className: "keeper", slots: ["GK"] }
    ],
    "4-4-2": [
      { name: "Attaque", className: "attack", slots: ["BU", "BU"] },
      { name: "Milieu à plat", className: "midfield", slots: ["MG", "MC", "MC", "MD"] },
      { name: "Défense", className: "defense", slots: ["DG", "DC", "DC", "DD"] },
      { name: "Gardien", className: "keeper", slots: ["GK"] }
    ],
    "3-5-2": [
      { name: "Attaque", className: "attack", slots: ["BU", "BU"] },
      { name: "Milieu à cinq", className: "midfield", slots: ["MG", "MC", "MDC", "MC", "MD"] },
      { name: "Défense à trois", className: "defense", slots: ["DC", "DC", "DC"] },
      { name: "Gardien", className: "keeper", slots: ["GK"] }
    ],
    "3-4-3": [
      { name: "Attaque", className: "attack", slots: ["AG", "BU", "AD"] },
      { name: "Milieu à quatre", className: "midfield", slots: ["MG", "MC", "MC", "MD"] },
      { name: "Défense à trois", className: "defense", slots: ["DC", "DC", "DC"] },
      { name: "Gardien", className: "keeper", slots: ["GK"] }
    ],
    "5-3-2": [
      { name: "Attaque", className: "attack", slots: ["BU", "BU"] },
      { name: "Milieu", className: "midfield", slots: ["MC", "MDC", "MC"] },
      { name: "Défense à cinq", className: "defense", slots: ["DG", "DC", "DC", "DC", "DD"] },
      { name: "Gardien", className: "keeper", slots: ["GK"] }
    ],
    "4-1-2-1-2": [
      { name: "Attaque", className: "attack", slots: ["BU", "BU"] },
      { name: "Meneur", className: "support", slots: ["MOC"] },
      { name: "Milieu diamant", className: "midfield", slots: ["MC", "MDC", "MC"] },
      { name: "Défense", className: "defense", slots: ["DG", "DC", "DC", "DD"] },
      { name: "Gardien", className: "keeper", slots: ["GK"] }
    ]
  };

  const FORMATION_ORDER = Object.keys(FORMATIONS);
  const previousRepairCareerIfNeeded = window.repairCareerIfNeeded;
  const previousBindButtons = window.bindButtons;

  function esc(value) {
    if (typeof window.escapeHtml === "function") return window.escapeHtml(value);
    return String(value ?? "").replace(/[&<>\"]/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;" }[char]));
  }

  function safe(value, fallback = "—") {
    if (typeof window.safeText === "function") return window.safeText(value, fallback);
    return value ?? fallback;
  }

  function labelFor(position) {
    if (typeof window.getPositionLabel === "function") {
      const label = window.getPositionLabel(position);
      if (label && label !== position) return label;
    }
    return POSITION_LABELS[position] || position;
  }

  function formationLines(name) {
    return FORMATIONS[name] || FORMATIONS[DEFAULT_FORMATION];
  }

  function formationSlots(name) {
    const chosen = FORMATIONS[name] ? name : DEFAULT_FORMATION;
    const totals = {};
    const counters = {};
    formationLines(chosen).forEach((line) => line.slots.forEach((position) => {
      totals[position] = (totals[position] || 0) + 1;
    }));
    const slots = [];
    formationLines(chosen).slice().reverse().forEach((line) => line.slots.forEach((position) => {
      counters[position] = (counters[position] || 0) + 1;
      slots.push({
        id: `slot_${slots.length}_${position}`,
        index: slots.length,
        position,
        label: totals[position] > 1 ? `${position} ${counters[position]}` : position,
        lineName: line.name,
        lineClassName: line.className
      });
    }));
    return slots;
  }

  function equivalentPositions(position) {
    return ({
      MG: ["AG", "MC", "DG"],
      MD: ["AD", "MC", "DD"],
      AG: ["MG", "MOC", "AD"],
      AD: ["MD", "MOC", "AG"],
      MC: ["MDC", "MOC", "MG", "MD"],
      MDC: ["MC", "DC"],
      MOC: ["MC", "AG", "AD", "BU"],
      DG: ["DC", "MG"],
      DD: ["DC", "MD"],
      DC: ["DD", "DG", "MDC"],
      BU: ["AG", "AD", "MOC"],
      GK: []
    })[position] || [];
  }

  function secondaries(player) {
    const list = Array.isArray(player?.secondaryPositions) ? player.secondaryPositions : [];
    const extras = equivalentPositions(player?.primaryPosition).filter((position) => !list.includes(position));
    return list.concat(extras);
  }

  function compatibility(player, position) {
    if (!player) return { key: "empty", label: "Poste vide", penalty: 0, className: "empty" };
    if (player.primaryPosition === position) return { key: "natural", label: "Naturel", penalty: 0, className: "good" };
    if (secondaries(player).includes(position) || equivalentPositions(position).includes(player.primaryPosition)) return { key: "secondary", label: "Compatible", penalty: 3, className: "warning" };
    return { key: "bad", label: "Hors poste", penalty: 12, className: "danger" };
  }

  function playerById(career, id) {
    return Array.isArray(career?.players) ? career.players.find((player) => player.id === id) || null : null;
  }

  function scoreFor(player, position) {
    const fit = compatibility(player, position);
    const overall = Number(player?.overall) || 0;
    if (fit.key === "natural") return overall + 200;
    if (fit.key === "secondary") return overall + 120;
    return overall;
  }

  function sortCandidates(players, position) {
    return players.slice().sort((a, b) => scoreFor(b, position) - scoreFor(a, position) || (Number(b.overall) || 0) - (Number(a.overall) || 0));
  }

  function sortSquad(players) {
    if (typeof window.sortPlayers === "function") return window.sortPlayers(players);
    return players.slice().sort((a, b) => (Number(b.overall) || 0) - (Number(a.overall) || 0));
  }

  function makeDefaultLineup(career, formationName = DEFAULT_FORMATION) {
    const formation = FORMATIONS[formationName] ? formationName : DEFAULT_FORMATION;
    const used = new Set();
    const players = Array.isArray(career?.players) ? career.players : [];
    const starters = formationSlots(formation).map((slot) => {
      const player = sortCandidates(players.filter((candidate) => !used.has(candidate.id)), slot.position)[0] || null;
      if (player) used.add(player.id);
      return { slotId: slot.id, slotIndex: slot.index, position: slot.position, label: slot.label, lineName: slot.lineName, lineClassName: slot.lineClassName, playerId: player ? player.id : "" };
    });
    return { formation, starters, updatedAt: new Date().toISOString(), lineupVersion: LINEUP_SCHEMA_VERSION };
  }

  function normalizeLineup(career) {
    if (!career?.club) return { lineup: null, changed: false };
    const formation = FORMATIONS[career.lineup?.formation] ? career.lineup.formation : DEFAULT_FORMATION;
    const slots = formationSlots(formation);
    const old = Array.isArray(career.lineup?.starters) ? career.lineup.starters : [];
    const validIds = new Set((career.players || []).map((player) => player.id));
    const oldBySlot = new Map(old.map((starter) => [starter.slotId, starter]));
    const oldSignature = old.map((starter) => starter.slotId).join("|");
    const expectedSignature = slots.map((slot) => slot.id).join("|");
    if (!career.lineup || old.length !== slots.length || oldSignature !== expectedSignature || career.lineup.lineupVersion !== LINEUP_SCHEMA_VERSION) {
      return { lineup: makeDefaultLineup(career, formation), changed: true };
    }
    const used = new Set();
    let changed = false;
    const starters = slots.map((slot) => {
      const previous = oldBySlot.get(slot.id);
      let playerId = previous && validIds.has(previous.playerId) && !used.has(previous.playerId) ? previous.playerId : "";
      if (playerId) used.add(playerId);
      if (!previous || previous.position !== slot.position || previous.playerId !== playerId) changed = true;
      return { slotId: slot.id, slotIndex: slot.index, position: slot.position, label: slot.label, lineName: slot.lineName, lineClassName: slot.lineClassName, playerId };
    });
    return { lineup: { formation, starters, updatedAt: career.lineup.updatedAt || new Date().toISOString(), lineupVersion: LINEUP_SCHEMA_VERSION }, changed };
  }

  function selectedIds(lineup) {
    return Array.isArray(lineup?.starters) ? lineup.starters.map((starter) => starter.playerId).filter(Boolean) : [];
  }

  function metrics(career) {
    if (!career?.lineup?.starters) return { completed: 0, score: 0, averageOverall: 0, attack: 0, defense: 0, warnings: [] };
    let completed = 0;
    let raw = 0;
    let adjusted = 0;
    let attack = 0;
    let defense = 0;
    const warnings = [];
    career.lineup.starters.forEach((starter) => {
      const player = playerById(career, starter.playerId);
      if (!player) {
        warnings.push(`Le poste ${starter.label} est vide.`);
        return;
      }
      const fit = compatibility(player, starter.position);
      if (fit.key === "bad") warnings.push(`${player.name} est hors poste en ${starter.position}.`);
      completed += 1;
      raw += Number(player.overall) || 0;
      adjusted += Math.max(1, Math.min(99, (Number(player.overall) || 0) - fit.penalty));
      attack += Number(player.attack) || 0;
      defense += Number(player.defense) || 0;
    });
    const count = Math.max(1, completed);
    return { completed, score: Math.round(adjusted / count), averageOverall: Math.round(raw / count), attack: Math.round(attack / count), defense: Math.round(defense / count), warnings };
  }

  function updateCareer(updater) {
    const active = typeof window.getResolvedCareer === "function" ? window.getResolvedCareer() : null;
    if (!active || typeof window.loadCareers !== "function" || typeof window.saveCareers !== "function") return false;
    const careers = window.loadCareers();
    const index = careers.findIndex((career) => career.id === active.id);
    if (index < 0) return false;
    const repaired = typeof window.repairCareerIfNeeded === "function" ? window.repairCareerIfNeeded(careers[index]).career : careers[index];
    careers[index] = repaired;
    updater(careers[index]);
    careers[index].updatedAt = new Date().toISOString();
    return window.saveCareers(careers, { silent: true });
  }

  window.repairCareerIfNeeded = function (career) {
    const result = typeof previousRepairCareerIfNeeded === "function" ? previousRepairCareerIfNeeded(career) : { career, changed: false };
    const fixed = result.career;
    if (!fixed?.club) return result;
    const normalized = normalizeLineup(fixed);
    const changed = Boolean(result.changed || normalized.changed);
    if (normalized.lineup) fixed.lineup = normalized.lineup;
    return { career: fixed, changed };
  };

  function currentStarter(career) {
    const starters = career?.lineup?.starters || [];
    if (!starters.length) return null;
    const found = starters.find((starter) => starter.slotId === selectedSlotId);
    if (found) return found;
    selectedSlotId = starters[0].slotId;
    return starters[0];
  }

  function groupedStarters(career) {
    const queues = {};
    (career?.lineup?.starters || []).forEach((starter) => {
      if (!queues[starter.position]) queues[starter.position] = [];
      queues[starter.position].push(starter);
    });
    return formationLines(career?.lineup?.formation).map((line) => ({
      name: line.name,
      className: line.className,
      starters: line.slots.map((position) => (queues[position] || []).shift()).filter(Boolean)
    }));
  }

  function renderFormationButtons(career) {
    const container = document.getElementById("formation-buttons");
    if (!container) return;
    const current = career?.lineup?.formation || DEFAULT_FORMATION;
    container.innerHTML = `<div class="formation-list">${FORMATION_ORDER.map((formation) => `<button type="button" class="formation-btn${formation === current ? " active" : ""}" data-formation="${esc(formation)}">${esc(formation)}</button>`).join("")}</div><button type="button" class="secondary-btn lineup-auto-btn" data-lineup-action="auto">Auto-composer</button><button type="button" class="secondary-btn lineup-clear-btn" data-lineup-action="clear">Vider</button>`;
  }

  function renderSummary(career) {
    const container = document.getElementById("lineup-summary");
    if (!container) return;
    const stats = metrics(career);
    container.innerHTML = `<article class="kpi-card"><p>Note du onze</p><strong>${stats.score || "—"}</strong></article><article class="kpi-card"><p>OVR moyen</p><strong>${stats.averageOverall || "—"}</strong></article><article class="kpi-card"><p>Attaque</p><strong>${stats.attack || "—"}</strong></article><article class="kpi-card"><p>Défense</p><strong>${stats.defense || "—"}</strong></article>`;
  }

  function renderWarnings(career) {
    const container = document.getElementById("lineup-warning");
    if (!container) return;
    const warnings = metrics(career).warnings;
    if (!career) {
      container.innerHTML = "";
      container.classList.add("app-hidden");
      return;
    }
    container.classList.remove("app-hidden");
    container.classList.toggle("lineup-warning-danger", Boolean(warnings.length));
    container.innerHTML = warnings.length ? `<strong>À vérifier :</strong> ${warnings.slice(0, 4).map(esc).join(" · ")}` : "<strong>Composition valide :</strong> tous les postes sont remplis sans hors poste majeur.";
  }

  function playerLine(player) {
    if (!player) return "Aucun titulaire choisi";
    const extra = secondaries(player).length ? ` / ${secondaries(player).join("/")}` : "";
    return `${esc(player.primaryPosition + extra)} · OVR ${safe(player.overall)} · Cond. ${safe(player.condition, 100)}%`;
  }

  function renderPitch(career) {
    const container = document.getElementById("lineup-pitch");
    if (!container) return;
    if (!career?.lineup?.starters) {
      container.innerHTML = "";
      return;
    }
    const lines = groupedStarters(career);
    container.innerHTML = `<div class="lineup-pitch-inner">${lines.map((line) => `<div class="pitch-line lineup-pitch-line lineup-pitch-${esc(line.className)}"><span class="lineup-pitch-label">${esc(line.name)}</span>${line.starters.map((starter) => { const player = playerById(career, starter.playerId); const fit = compatibility(player, starter.position); const label = player ? player.name.split(" ").slice(-1)[0] : "Libre"; return `<button type="button" class="lineup-pitch-player lineup-status-${esc(fit.className)}${starter.slotId === selectedSlotId ? " selected" : ""}" data-lineup-pitch-slot="${esc(starter.slotId)}"><small>${esc(starter.label)}</small><strong>${esc(label)}</strong><span>${player ? safe(player.overall) : "—"}</span></button>`; }).join("")}</div>`).join("")}</div>`;
  }

  function renderCandidateCard(player, starter, selected) {
    const fit = compatibility(player, starter.position);
    const usedElsewhere = selected.has(player.id) && player.id !== starter.playerId;
    return `<button type="button" class="lineup-candidate lineup-status-${esc(fit.className)}${player.id === starter.playerId ? " active" : ""}${usedElsewhere ? " disabled" : ""}" data-lineup-select-player="${esc(player.id)}" ${usedElsewhere ? "disabled" : ""}><span><strong>${esc(player.name)}</strong><small>${playerLine(player)}</small><em>${esc(fit.label)}</em></span><b>${safe(player.overall)}</b></button>`;
  }

  function renderPlayerPanel(career) {
    const container = document.getElementById("lineup-slots");
    if (!container) return;
    if (!career?.players?.length || !career?.lineup?.starters) {
      container.innerHTML = `<div class="empty-state compact-empty"><span>📋</span><h4>Composition indisponible</h4><p>Crée ou charge une carrière avec un effectif pour composer ton onze.</p></div>`;
      return;
    }
    const starter = currentStarter(career);
    const current = playerById(career, starter?.playerId);
    const selected = new Set(selectedIds(career.lineup));
    const players = career.players || [];
    const natural = sortCandidates(players, starter.position).filter((player) => compatibility(player, starter.position).key === "natural" && (!selected.has(player.id) || player.id === starter.playerId));
    const compatible = sortCandidates(players, starter.position).filter((player) => compatibility(player, starter.position).key === "secondary" && (!selected.has(player.id) || player.id === starter.playerId));
    const others = sortCandidates(players, starter.position).filter((player) => compatibility(player, starter.position).key === "bad" && (!selected.has(player.id) || player.id === starter.playerId)).slice(0, 8);
    container.innerHTML = `<aside class="lineup-selection-panel panel"><div class="lineup-selection-header"><div><p class="eyebrow">Poste sélectionné</p><h3>${esc(starter.label)} <span>${esc(labelFor(starter.position))}</span></h3></div><span class="lineup-selected-position">${esc(starter.position)}</span></div><div class="lineup-current-player lineup-status-${esc(compatibility(current, starter.position).className)}"><span>Titulaire actuel</span><strong>${current ? esc(current.name) : "Poste vide"}</strong><small>${playerLine(current)}</small><button type="button" class="small-btn" data-lineup-select-player="">Retirer</button></div><div class="lineup-candidate-block"><h4>Recommandés</h4><div class="lineup-candidates">${natural.length ? natural.map((player) => renderCandidateCard(player, starter, selected)).join("") : `<p class="save-meta">Aucun joueur naturel disponible.</p>`}</div></div><div class="lineup-candidate-block"><h4>Peuvent dépanner</h4><div class="lineup-candidates">${compatible.length ? compatible.map((player) => renderCandidateCard(player, starter, selected)).join("") : `<p class="save-meta">Aucun joueur compatible disponible.</p>`}</div></div><details class="lineup-candidate-block"><summary>Voir les autres joueurs</summary><div class="lineup-candidates">${others.length ? others.map((player) => renderCandidateCard(player, starter, selected)).join("") : `<p class="save-meta">Aucun autre joueur disponible.</p>`}</div></details></aside>`;
  }

  function renderBench(career) {
    const container = document.getElementById("lineup-bench");
    if (!container) return;
    const selected = new Set(selectedIds(career?.lineup));
    const bench = sortSquad(career?.players || []).filter((player) => !selected.has(player.id)).slice(0, 9);
    container.innerHTML = bench.length ? bench.map((player) => `<button type="button" class="bench-player" data-lineup-bench-player="${esc(player.id)}"><strong>${esc(player.name)}</strong><span>${esc(player.primaryPosition)} · OVR ${safe(player.overall)} · ${safe(player.condition, 100)}%</span></button>`).join("") : "<p class='save-meta'>Aucun remplaçant disponible.</p>";
  }

  window.renderLineupBuilder = function (career) {
    if (career?.club) {
      const normalized = normalizeLineup(career);
      if (normalized.lineup) career.lineup = normalized.lineup;
    }
    renderFormationButtons(career);
    renderSummary(career);
    renderWarnings(career);
    renderPitch(career);
    renderPlayerPanel(career);
    renderBench(career);
  };

  function refresh() {
    if (typeof window.refreshUI === "function") window.refreshUI();
  }

  function changeFormation(formation) {
    if (!FORMATIONS[formation]) return;
    selectedSlotId = "";
    updateCareer((career) => { career.lineup = makeDefaultLineup(career, formation); });
    refresh();
  }

  function autoCompose() {
    updateCareer((career) => { career.lineup = makeDefaultLineup(career, career.lineup?.formation || DEFAULT_FORMATION); });
    refresh();
  }

  function clearLineup() {
    updateCareer((career) => {
      const normalized = normalizeLineup(career);
      career.lineup = normalized.lineup || makeDefaultLineup(career);
      career.lineup.starters.forEach((starter) => { starter.playerId = ""; });
      career.lineup.updatedAt = new Date().toISOString();
    });
    refresh();
  }

  function changeSlot(slotId, playerId) {
    updateCareer((career) => {
      const normalized = normalizeLineup(career);
      career.lineup = normalized.lineup || makeDefaultLineup(career);
      const starter = career.lineup.starters.find((item) => item.slotId === slotId);
      if (!starter) return;
      const usedElsewhere = new Set(career.lineup.starters.filter((item) => item.slotId !== slotId).map((item) => item.playerId).filter(Boolean));
      starter.playerId = playerId && !usedElsewhere.has(playerId) ? playerId : "";
      career.lineup.updatedAt = new Date().toISOString();
    });
    selectedSlotId = slotId;
    refresh();
  }

  window.bindButtons = function () {
    if (typeof previousBindButtons === "function") previousBindButtons();
    const formationButtons = document.getElementById("formation-buttons");
    const pitch = document.getElementById("lineup-pitch");
    const panel = document.getElementById("lineup-slots");
    const bench = document.getElementById("lineup-bench");

    if (formationButtons && !formationButtons.dataset.boundV033) {
      formationButtons.dataset.boundV033 = "true";
      formationButtons.addEventListener("click", (event) => {
        const formationButton = event.target.closest("[data-formation]");
        const actionButton = event.target.closest("[data-lineup-action]");
        if (formationButton) changeFormation(formationButton.dataset.formation);
        if (actionButton?.dataset.lineupAction === "auto") autoCompose();
        if (actionButton?.dataset.lineupAction === "clear") clearLineup();
      });
    }

    if (pitch && !pitch.dataset.boundV033) {
      pitch.dataset.boundV033 = "true";
      pitch.addEventListener("click", (event) => {
        const slot = event.target.closest("[data-lineup-pitch-slot]");
        if (!slot) return;
        selectedSlotId = slot.dataset.lineupPitchSlot;
        window.renderLineupBuilder(typeof window.getResolvedCareer === "function" ? window.getResolvedCareer() : null);
      });
    }

    if (panel && !panel.dataset.boundV033) {
      panel.dataset.boundV033 = "true";
      panel.addEventListener("click", (event) => {
        const playerButton = event.target.closest("[data-lineup-select-player]");
        if (!playerButton) return;
        const starter = currentStarter(typeof window.getResolvedCareer === "function" ? window.getResolvedCareer() : null);
        if (starter) changeSlot(starter.slotId, playerButton.dataset.lineupSelectPlayer || "");
      });
    }

    if (bench && !bench.dataset.boundV033) {
      bench.dataset.boundV033 = "true";
      bench.addEventListener("click", (event) => {
        const playerButton = event.target.closest("[data-lineup-bench-player]");
        if (!playerButton) return;
        const starter = currentStarter(typeof window.getResolvedCareer === "function" ? window.getResolvedCareer() : null);
        if (starter) changeSlot(starter.slotId, playerButton.dataset.lineupBenchPlayer || "");
      });
    }
  };

  if (typeof window.btmRegisterRender === "function") {
    window.btmRegisterRender("lineup", (career) => window.renderLineupBuilder(career || (typeof window.getResolvedCareer === "function" ? window.getResolvedCareer() : null)));
  } else {
    console.warn("[BTM] Render registry absent: lineup.js V0.33 attend theme.js avant son chargement.");
  }
})();