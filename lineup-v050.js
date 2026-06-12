(function () {
  const LINEUP_VERSION = "0.5.2";
  const LINEUP_DATA_VERSION = "premier_league_2025_2026_v0_5_2";
  const DEFAULT_FORMATION = "4-3-3";

  const originalRepairCareerIfNeeded = window.repairCareerIfNeeded;
  const originalRefreshUI = window.refreshUI;
  const originalBindButtons = window.bindButtons;

  const POSITION_LABELS_LOCAL = {
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

  const FORMATION_BLUEPRINTS = {
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

  const FORMATION_ORDER = Object.keys(FORMATION_BLUEPRINTS);
  const LINE_ORDER = ["Gardien", "Défense", "Défense à trois", "Défense à cinq", "Double pivot", "Milieu", "Milieu diamant", "Milieu à plat", "Milieu à quatre", "Milieu à cinq", "Meneur", "Ligne offensive", "Attaque"];

  function labelForPosition(position) {
    if (typeof getPositionLabel === "function") {
      const label = getPositionLabel(position);
      if (label && label !== position) return label;
    }
    return POSITION_LABELS_LOCAL[position] || position;
  }

  function auditedFormations() {
    Object.keys(FORMATION_BLUEPRINTS).forEach((formation) => {
      const count = FORMATION_BLUEPRINTS[formation].reduce((sum, line) => sum + line.slots.length, 0);
      if (count !== 11) console.warn("Formation invalide", formation, count);
    });
    return FORMATION_BLUEPRINTS;
  }

  function formationNames() {
    auditedFormations();
    return FORMATION_ORDER;
  }

  function blueprint(formationName) {
    return FORMATION_BLUEPRINTS[formationName] || FORMATION_BLUEPRINTS[DEFAULT_FORMATION];
  }

  function formationSlots(formationName) {
    const chosen = FORMATION_BLUEPRINTS[formationName] ? formationName : DEFAULT_FORMATION;
    const lines = blueprint(chosen);
    const counters = {};
    const totals = {};

    lines.forEach((line) => {
      line.slots.forEach((position) => {
        totals[position] = (totals[position] || 0) + 1;
      });
    });

    const slots = [];
    lines.slice().reverse().forEach((line) => {
      line.slots.forEach((position) => {
        counters[position] = (counters[position] || 0) + 1;
        slots.push({
          id: "slot_" + slots.length + "_" + position,
          index: slots.length,
          position,
          label: totals[position] > 1 ? position + " " + counters[position] : position,
          lineName: line.name,
          lineClassName: line.className
        });
      });
    });

    return slots;
  }

  function pitchLines(formationName, starters) {
    const byPositionQueue = {};
    (Array.isArray(starters) ? starters : []).forEach((starter) => {
      if (!byPositionQueue[starter.position]) byPositionQueue[starter.position] = [];
      byPositionQueue[starter.position].push(starter);
    });

    return blueprint(formationName).map((line) => ({
      name: line.name,
      className: line.className,
      starters: line.slots.map((position) => {
        const queue = byPositionQueue[position] || [];
        return queue.shift() || null;
      }).filter(Boolean)
    }));
  }

  function playerById(career, playerId) {
    if (!career || !Array.isArray(career.players) || !playerId) return null;
    return career.players.find((player) => player.id === playerId) || null;
  }

  function equivalentPositions(position) {
    const map = {
      MG: ["AG", "MC", "DG"],
      MD: ["AD", "MC", "DD"],
      AG: ["MG", "MOC", "AD"],
      AD: ["MD", "MOC", "AG"],
      MC: ["MDC", "MOC", "MG", "MD"],
      MDC: ["MC", "DC"],
      MOC: ["MC", "AG", "AD"],
      DG: ["DC", "MG"],
      DD: ["DC", "MD"],
      DC: ["DD", "DG", "MDC"],
      BU: ["AG", "AD", "MOC"],
      GK: []
    };
    return map[position] || [];
  }

  function playerSecondaryPositions(player) {
    const list = Array.isArray(player && player.secondaryPositions) ? player.secondaryPositions : [];
    const extras = equivalentPositions(player && player.primaryPosition).filter((position) => !list.includes(position));
    return list.concat(extras);
  }

  function compatibility(player, position) {
    if (!player) return { key: "empty", label: "Vide", penalty: 0, className: "empty" };
    if (player.primaryPosition === position) return { key: "natural", label: "Poste naturel", penalty: 0, className: "good" };
    if (playerSecondaryPositions(player).includes(position)) return { key: "secondary", label: "Compatible", penalty: 3, className: "warning" };
    if (equivalentPositions(position).includes(player.primaryPosition)) return { key: "secondary", label: "Compatible", penalty: 3, className: "warning" };
    return { key: "bad", label: "Hors poste", penalty: 12, className: "danger" };
  }

  function candidateScore(player, position) {
    const fit = compatibility(player, position);
    const overall = Number(player && player.overall) || 0;
    if (fit.key === "natural") return overall + 200;
    if (fit.key === "secondary") return overall + 120;
    return overall;
  }

  function sortCandidates(players, position) {
    return players.slice().sort((a, b) => {
      const scoreDiff = candidateScore(b, position) - candidateScore(a, position);
      if (scoreDiff !== 0) return scoreDiff;
      return (Number(b.overall) || 0) - (Number(a.overall) || 0);
    });
  }

  function defaultLineup(career, formationName) {
    const chosenFormation = FORMATION_BLUEPRINTS[formationName] ? formationName : DEFAULT_FORMATION;
    const slots = formationSlots(chosenFormation);
    const players = Array.isArray(career && career.players) ? career.players : [];
    const used = new Set();

    const starters = slots.map((slot) => {
      const candidates = sortCandidates(players.filter((player) => !used.has(player.id)), slot.position);
      const selected = candidates[0] || null;
      if (selected) used.add(selected.id);
      return {
        slotId: slot.id,
        slotIndex: slot.index,
        position: slot.position,
        label: slot.label,
        lineName: slot.lineName,
        lineClassName: slot.lineClassName,
        playerId: selected ? selected.id : ""
      };
    });

    return { formation: chosenFormation, starters, updatedAt: new Date().toISOString(), lineupVersion: LINEUP_VERSION };
  }

  function slotSignature(slots) {
    return slots.map((slot) => slot.slotId || slot.id).join("|");
  }

  function normalizeLineup(career) {
    if (!career || !career.club) return { lineup: null, changed: false };
    const requestedFormation = career.lineup && FORMATION_BLUEPRINTS[career.lineup.formation] ? career.lineup.formation : DEFAULT_FORMATION;
    const slots = formationSlots(requestedFormation);
    const existing = Array.isArray(career.lineup && career.lineup.starters) ? career.lineup.starters : [];
    const expectedSignature = slotSignature(slots);
    const existingSignature = slotSignature(existing);

    if (!career.lineup || existing.length !== slots.length || existingSignature !== expectedSignature || career.lineup.lineupVersion !== LINEUP_VERSION) {
      return { lineup: defaultLineup(career, requestedFormation), changed: true };
    }

    const validPlayerIds = new Set((Array.isArray(career.players) ? career.players : []).map((player) => player.id));
    const existingBySlot = new Map(existing.map((starter) => [starter.slotId, starter]));
    const used = new Set();
    let changed = false;

    const starters = slots.map((slot) => {
      const oldStarter = existingBySlot.get(slot.id);
      let playerId = oldStarter && validPlayerIds.has(oldStarter.playerId) && !used.has(oldStarter.playerId) ? oldStarter.playerId : "";
      if (playerId) used.add(playerId);
      if (!oldStarter || oldStarter.position !== slot.position || oldStarter.label !== slot.label || oldStarter.lineName !== slot.lineName || oldStarter.playerId !== playerId) changed = true;
      return { slotId: slot.id, slotIndex: slot.index, position: slot.position, label: slot.label, lineName: slot.lineName, lineClassName: slot.lineClassName, playerId };
    });

    return {
      lineup: { formation: requestedFormation, starters, updatedAt: career.lineup.updatedAt || new Date().toISOString(), lineupVersion: LINEUP_VERSION },
      changed
    };
  }

  function selectedPlayerIds(lineup) {
    if (!lineup || !Array.isArray(lineup.starters)) return [];
    return lineup.starters.map((starter) => starter.playerId).filter(Boolean);
  }

  function benchPlayers(career) {
    const selected = new Set(selectedPlayerIds(career.lineup));
    const players = Array.isArray(career.players) ? sortPlayers(career.players) : [];
    return players.filter((player) => !selected.has(player.id)).slice(0, 9);
  }

  function lineupMetrics(career) {
    if (!career || !career.lineup || !Array.isArray(career.lineup.starters)) {
      return { completed: 0, score: 0, averageOverall: 0, attack: 0, defense: 0, warnings: [] };
    }

    let completed = 0;
    let adjustedOverall = 0;
    let rawOverall = 0;
    let attack = 0;
    let defense = 0;
    const warnings = [];

    career.lineup.starters.forEach((starter) => {
      const player = playerById(career, starter.playerId);
      if (!player) {
        warnings.push("Le poste " + starter.label + " est vide.");
        return;
      }
      const fit = compatibility(player, starter.position);
      if (fit.key === "bad") warnings.push(player.name + " est hors poste en " + starter.position + ".");
      completed += 1;
      rawOverall += Number(player.overall) || 0;
      adjustedOverall += clamp((Number(player.overall) || 0) - fit.penalty, 1, 99);
      attack += Number(player.attack) || 0;
      defense += Number(player.defense) || 0;
    });

    const count = completed || 1;
    return {
      completed,
      score: Math.round(adjustedOverall / count),
      averageOverall: Math.round(rawOverall / count),
      attack: Math.round(attack / count),
      defense: Math.round(defense / count),
      warnings
    };
  }

  function updateCareerById(careerId, updater) {
    const careers = loadCareers();
    const index = careers.findIndex((career) => career.id === careerId && isValidCareer(career));
    if (index === -1) return false;

    const repaired = window.repairCareerIfNeeded(careers[index]);
    careers[index] = repaired.career;
    updater(careers[index]);
    careers[index].updatedAt = new Date().toISOString();
    return saveCareers(careers, { silent: true });
  }

  function updateActiveCareer(updater) {
    const career = getResolvedCareer();
    if (!career) return false;
    return updateCareerById(career.id, updater);
  }

  window.repairCareerIfNeeded = function (career) {
    const result = typeof originalRepairCareerIfNeeded === "function"
      ? originalRepairCareerIfNeeded(career)
      : { career, changed: false };

    const fixedCareer = result.career;
    if (!fixedCareer || !fixedCareer.club) return result;

    let changed = Boolean(result.changed);
    const normalized = normalizeLineup(fixedCareer);
    if (normalized.changed) {
      fixedCareer.lineup = normalized.lineup;
      changed = true;
    }

    if (fixedCareer.version !== LINEUP_VERSION) {
      fixedCareer.version = LINEUP_VERSION;
      changed = true;
    }

    if (fixedCareer.dataVersion !== LINEUP_DATA_VERSION) {
      fixedCareer.dataVersion = LINEUP_DATA_VERSION;
      changed = true;
    }

    if (changed) fixedCareer.updatedAt = new Date().toISOString();
    return { career: fixedCareer, changed };
  };

  function renderFormationButtons(career) {
    const container = document.getElementById("formation-buttons");
    if (!container) return;
    const current = (career && career.lineup && career.lineup.formation) || DEFAULT_FORMATION;
    const buttons = formationNames().map((formation) => `
      <button type="button" class="formation-btn${formation === current ? " active" : ""}" data-formation="${escapeHtml(formation)}">${escapeHtml(formation)}</button>
    `).join("");

    container.innerHTML = `
      <div class="formation-list">${buttons}</div>
      <button type="button" class="secondary-btn lineup-auto-btn" data-lineup-action="auto">Auto-composer</button>
    `;
  }

  function renderSummary(career) {
    const container = document.getElementById("lineup-summary");
    if (!container) return;
    if (!career) {
      container.innerHTML = "";
      return;
    }
    const metrics = lineupMetrics(career);
    container.innerHTML = `
      <article class="kpi-card"><p>Note du onze</p><strong>${metrics.score || "—"}</strong></article>
      <article class="kpi-card"><p>OVR moyen</p><strong>${metrics.averageOverall || "—"}</strong></article>
      <article class="kpi-card"><p>Attaque</p><strong>${metrics.attack || "—"}</strong></article>
      <article class="kpi-card"><p>Défense</p><strong>${metrics.defense || "—"}</strong></article>
    `;
  }

  function renderWarnings(career) {
    const container = document.getElementById("lineup-warning");
    if (!container) return;
    if (!career) {
      container.innerHTML = "";
      container.classList.add("app-hidden");
      return;
    }
    const metrics = lineupMetrics(career);
    if (!metrics.warnings.length) {
      container.innerHTML = "<strong>Composition valide :</strong> tous les postes sont remplis sans hors poste majeur.";
      container.classList.remove("app-hidden", "lineup-warning-danger");
      return;
    }
    container.innerHTML = "<strong>À vérifier :</strong> " + metrics.warnings.slice(0, 4).map(escapeHtml).join(" · ");
    container.classList.remove("app-hidden");
    container.classList.add("lineup-warning-danger");
  }

  function playerLine(player) {
    if (!player) return "Aucun titulaire choisi";
    const secondary = playerSecondaryPositions(player).length ? " / " + playerSecondaryPositions(player).join("/") : "";
    return escapeHtml(player.name) + " · " + escapeHtml(player.primaryPosition + secondary) + " · OVR " + safeText(player.overall);
  }

  function optionLabel(player, targetPosition) {
    const fit = compatibility(player, targetPosition);
    const marker = fit.key === "natural" ? "✓" : fit.key === "secondary" ? "~" : "!";
    const secondary = playerSecondaryPositions(player).length ? " / " + playerSecondaryPositions(player).join("/") : "";
    return marker + " " + player.name + " — " + player.primaryPosition + secondary + " — OVR " + safeText(player.overall);
  }

  function renderSlots(career) {
    const container = document.getElementById("lineup-slots");
    if (!container) return;

    if (!career || !career.lineup || !Array.isArray(career.players) || !career.players.length) {
      container.innerHTML = `
        <div class="empty-state compact-empty">
          <span>📋</span>
          <h4>Composition indisponible</h4>
          <p>Crée ou charge une carrière avec un effectif pour composer ton onze.</p>
        </div>
      `;
      return;
    }

    const players = Array.isArray(career.players) ? career.players : [];
    const selected = new Set(selectedPlayerIds(career.lineup));
    const startersByLine = new Map();

    career.lineup.starters.forEach((starter) => {
      const key = starter.lineName || "Autres";
      if (!startersByLine.has(key)) startersByLine.set(key, []);
      startersByLine.get(key).push(starter);
    });

    container.innerHTML = LINE_ORDER.filter((lineName) => startersByLine.has(lineName)).map((lineName) => {
      const starters = startersByLine.get(lineName);
      return `
        <section class="lineup-editor-group">
          <h4>${escapeHtml(lineName)}</h4>
          <div class="lineup-editor-rows">
            ${starters.map((starter) => {
              const currentPlayer = playerById(career, starter.playerId);
              const fit = compatibility(currentPlayer, starter.position);
              const candidates = sortCandidates(players, starter.position);
              const options = [
                `<option value="">Aucun joueur</option>`,
                ...candidates.map((player) => {
                  const disabled = selected.has(player.id) && player.id !== starter.playerId;
                  return `<option value="${escapeHtml(player.id)}" ${player.id === starter.playerId ? "selected" : ""} ${disabled ? "disabled" : ""}>${escapeHtml(optionLabel(player, starter.position))}</option>`;
                })
              ].join("");

              return `
                <article class="lineup-row lineup-status-${fit.className}">
                  <div class="lineup-row-position">
                    <strong>${escapeHtml(starter.label)}</strong>
                    <span>${escapeHtml(labelForPosition(starter.position))}</span>
                  </div>
                  <div class="lineup-row-player">
                    <strong>${currentPlayer ? escapeHtml(currentPlayer.name) : "Poste vide"}</strong>
                    <span>${playerLine(currentPlayer)}</span>
                  </div>
                  <select class="lineup-player-select" data-lineup-slot="${escapeHtml(starter.slotId)}">${options}</select>
                  <span class="lineup-status-pill">${escapeHtml(fit.label)}</span>
                </article>
              `;
            }).join("")}
          </div>
        </section>
      `;
    }).join("");
  }

  function renderPitch(career) {
    const container = document.getElementById("lineup-pitch");
    if (!container) return;
    if (!career || !career.lineup || !Array.isArray(career.lineup.starters)) {
      container.innerHTML = "";
      return;
    }

    const lines = pitchLines(career.lineup.formation, career.lineup.starters);
    container.innerHTML = lines.map((line) => `
      <div class="pitch-line lineup-pitch-line lineup-pitch-${escapeHtml(line.className)}">
        <span class="lineup-pitch-label">${escapeHtml(line.name)}</span>
        ${line.starters.map((starter) => {
          const player = playerById(career, starter.playerId);
          const fit = compatibility(player, starter.position);
          const label = player ? player.name.split(" ").slice(-1)[0] : "Libre";
          return `<span class="lineup-pitch-player lineup-status-${fit.className}"><small>${escapeHtml(starter.position)}</small>${escapeHtml(label)}</span>`;
        }).join("")}
      </div>
    `).join("");
  }

  function renderBench(career) {
    const container = document.getElementById("lineup-bench");
    if (!container) return;
    if (!career) {
      container.innerHTML = "";
      return;
    }
    const bench = benchPlayers(career);
    if (!bench.length) {
      container.innerHTML = "<p class='save-meta'>Aucun remplaçant disponible.</p>";
      return;
    }
    container.innerHTML = bench.map((player) => `
      <div class="bench-player"><strong>${escapeHtml(player.name)}</strong><span>${escapeHtml(player.primaryPosition)} · OVR ${safeText(player.overall)} · ${safeText(player.condition, 100)}%</span></div>
    `).join("");
  }

  window.renderLineupBuilder = function (career) {
    if (career && career.club) {
      const normalized = normalizeLineup(career);
      if (normalized.lineup) career.lineup = normalized.lineup;
    }
    renderFormationButtons(career);
    renderSummary(career);
    renderWarnings(career);
    renderSlots(career);
    renderPitch(career);
    renderBench(career);
  };

  window.refreshUI = function () {
    if (typeof originalRefreshUI === "function") originalRefreshUI();
    const career = getResolvedCareer();
    window.renderLineupBuilder(career);
  };

  function changeFormation(formation) {
    if (!FORMATION_BLUEPRINTS[formation]) return;
    updateActiveCareer((career) => {
      career.lineup = defaultLineup(career, formation);
      career.lineup.updatedAt = new Date().toISOString();
    });
    window.refreshUI();
  }

  function autoComposeLineup() {
    updateActiveCareer((career) => {
      const currentFormation = career.lineup && FORMATION_BLUEPRINTS[career.lineup.formation] ? career.lineup.formation : DEFAULT_FORMATION;
      career.lineup = defaultLineup(career, currentFormation);
      career.lineup.updatedAt = new Date().toISOString();
    });
    window.refreshUI();
  }

  function changeSlot(slotId, playerId) {
    updateActiveCareer((career) => {
      const normalized = normalizeLineup(career);
      career.lineup = normalized.lineup;
      const starter = career.lineup.starters.find((item) => item.slotId === slotId);
      if (!starter) return;
      const selectedElsewhere = new Set(career.lineup.starters.filter((item) => item.slotId !== slotId).map((item) => item.playerId).filter(Boolean));
      starter.playerId = playerId && !selectedElsewhere.has(playerId) ? playerId : "";
      career.lineup.updatedAt = new Date().toISOString();
    });
    window.refreshUI();
  }

  window.bindButtons = function () {
    if (typeof originalBindButtons === "function") originalBindButtons();

    const formationButtons = document.getElementById("formation-buttons");
    const lineupSlots = document.getElementById("lineup-slots");

    if (formationButtons && !formationButtons.dataset.bound) {
      formationButtons.dataset.bound = "true";
      formationButtons.addEventListener("click", (event) => {
        const formationButton = event.target.closest("[data-formation]");
        const actionButton = event.target.closest("[data-lineup-action]");
        if (formationButton) changeFormation(formationButton.dataset.formation);
        if (actionButton && actionButton.dataset.lineupAction === "auto") autoComposeLineup();
      });
    }

    if (lineupSlots && !lineupSlots.dataset.bound) {
      lineupSlots.dataset.bound = "true";
      lineupSlots.addEventListener("change", (event) => {
        const select = event.target.closest("[data-lineup-slot]");
        if (select) changeSlot(select.dataset.lineupSlot, select.value);
      });
    }
  };
})();