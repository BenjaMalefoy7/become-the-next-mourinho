(function () {
  const LINEUP_VERSION = "0.5.0";
  const LINEUP_DATA_VERSION = "premier_league_2025_2026_v0_5_0";
  const DEFAULT_FORMATION = "4-3-3";

  const originalRepairCareerIfNeeded = window.repairCareerIfNeeded;
  const originalRefreshUI = window.refreshUI;
  const originalBindButtons = window.bindButtons;

  function formations() {
    if (typeof FORMATIONS !== "undefined" && FORMATIONS && typeof FORMATIONS === "object") return FORMATIONS;
    return {
      "4-3-3": ["GK", "DD", "DC", "DC", "DG", "MC", "MC", "MC", "AD", "BU", "AG"]
    };
  }

  function formationSlots(formationName) {
    const allFormations = formations();
    const formation = allFormations[formationName] ? formationName : DEFAULT_FORMATION;
    const positions = allFormations[formation] || allFormations[DEFAULT_FORMATION] || [];
    const counters = {};

    return positions.map((position, index) => {
      counters[position] = (counters[position] || 0) + 1;
      const total = positions.filter((item) => item === position).length;
      return {
        id: "slot_" + index + "_" + position,
        index,
        position,
        label: total > 1 ? position + " " + counters[position] : position
      };
    });
  }

  function playerById(career, playerId) {
    if (!career || !Array.isArray(career.players) || !playerId) return null;
    return career.players.find((player) => player.id === playerId) || null;
  }

  function compatibility(player, position) {
    if (!player) return { key: "empty", label: "Vide", penalty: 0, className: "empty" };
    if (player.primaryPosition === position) return { key: "natural", label: "Poste naturel", penalty: 0, className: "good" };
    if (Array.isArray(player.secondaryPositions) && player.secondaryPositions.includes(position)) return { key: "secondary", label: "Poste secondaire", penalty: 3, className: "warning" };
    return { key: "bad", label: "Hors poste", penalty: 12, className: "danger" };
  }

  function candidateScore(player, position) {
    const fit = compatibility(player, position);
    const overall = Number(player && player.overall) || 0;
    if (fit.key === "natural") return overall + 200;
    if (fit.key === "secondary") return overall + 120;
    return overall;
  }

  function defaultLineup(career, formationName) {
    const chosenFormation = formations()[formationName] ? formationName : DEFAULT_FORMATION;
    const slots = formationSlots(chosenFormation);
    const players = Array.isArray(career && career.players) ? career.players : [];
    const used = new Set();

    const starters = slots.map((slot) => {
      const candidates = players
        .filter((player) => !used.has(player.id))
        .sort((a, b) => candidateScore(b, slot.position) - candidateScore(a, slot.position));
      const selected = candidates[0] || null;
      if (selected) used.add(selected.id);
      return {
        slotId: slot.id,
        slotIndex: slot.index,
        position: slot.position,
        label: slot.label,
        playerId: selected ? selected.id : ""
      };
    });

    return { formation: chosenFormation, starters, updatedAt: new Date().toISOString() };
  }

  function normalizeLineup(career) {
    if (!career || !career.club) return { lineup: null, changed: false };
    const allFormations = formations();
    const requestedFormation = career.lineup && allFormations[career.lineup.formation] ? career.lineup.formation : DEFAULT_FORMATION;
    const slots = formationSlots(requestedFormation);
    const existing = Array.isArray(career.lineup && career.lineup.starters) ? career.lineup.starters : [];

    if (!career.lineup || existing.length !== slots.length) {
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
      if (!oldStarter || oldStarter.position !== slot.position || oldStarter.label !== slot.label || oldStarter.playerId !== playerId) changed = true;
      return { slotId: slot.id, slotIndex: slot.index, position: slot.position, label: slot.label, playerId };
    });

    return {
      lineup: { formation: requestedFormation, starters, updatedAt: career.lineup.updatedAt || new Date().toISOString() },
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
    container.innerHTML = Object.keys(formations()).map((formation) => `
      <button type="button" class="formation-btn${formation === current ? " active" : ""}" data-formation="${escapeHtml(formation)}">${escapeHtml(formation)}</button>
    `).join("");
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

    const players = sortPlayers(career.players);
    const selected = new Set(selectedPlayerIds(career.lineup));

    container.innerHTML = career.lineup.starters.map((starter) => {
      const currentPlayer = playerById(career, starter.playerId);
      const fit = compatibility(currentPlayer, starter.position);
      const options = [
        `<option value="">Aucun joueur</option>`,
        ...players.map((player) => {
          const disabled = selected.has(player.id) && player.id !== starter.playerId;
          const secondary = Array.isArray(player.secondaryPositions) && player.secondaryPositions.length ? " / " + player.secondaryPositions.join("/") : "";
          return `<option value="${escapeHtml(player.id)}" ${player.id === starter.playerId ? "selected" : ""} ${disabled ? "disabled" : ""}>${escapeHtml(player.name)} — ${escapeHtml(player.primaryPosition + secondary)} — OVR ${safeText(player.overall)}</option>`;
        })
      ].join("");

      return `
        <article class="lineup-slot-card lineup-status-${fit.className}">
          <div class="lineup-slot-header">
            <div><strong>${escapeHtml(starter.label)}</strong><span>${escapeHtml(getPositionLabel(starter.position))}</span></div>
            <span class="lineup-status-pill">${escapeHtml(fit.label)}</span>
          </div>
          <select class="lineup-player-select" data-lineup-slot="${escapeHtml(starter.slotId)}">${options}</select>
          <p>${currentPlayer ? "OVR " + safeText(currentPlayer.overall) + " · " + escapeHtml(currentPlayer.name) : "Aucun titulaire choisi"}</p>
        </article>
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

    const categories = [
      ["AG", "BU", "AD"],
      ["MOC", "MC", "MDC"],
      ["DG", "DC", "DD"],
      ["GK"]
    ];
    const lines = categories.map((positions) => career.lineup.starters.filter((starter) => positions.includes(starter.position))).filter((line) => line.length);

    container.innerHTML = lines.map((line) => `
      <div class="pitch-line lineup-pitch-line">
        ${line.map((starter) => {
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
    if (!formations()[formation]) return;
    updateActiveCareer((career) => {
      career.lineup = defaultLineup(career, formation);
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
        const button = event.target.closest("[data-formation]");
        if (button) changeFormation(button.dataset.formation);
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
