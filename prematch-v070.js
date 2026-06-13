const PREMATCH_VERSION = "0.7";

function prematchEscape(value) {
  if (typeof escapeHtml === "function") return escapeHtml(value);
  return String(value ?? "").replace(/[&<>"]/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[char]));
}

function prematchSafe(value, fallback = "—") {
  if (value === null || value === undefined || value === "") return fallback;
  return value;
}

function prematchClubById(career, clubId) {
  if (!career || !Array.isArray(career.clubs)) return null;
  return career.clubs.find((club) => club.id === clubId) || null;
}

function prematchPlayerById(career, playerId) {
  if (!career || !Array.isArray(career.players) || !playerId) return null;
  return career.players.find((player) => player.id === playerId) || null;
}

function prematchPositionCompat(player, position) {
  if (!player) return { key: "empty", label: "Poste vide", penalty: 0, ok: false };
  const equivalent = {
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
  };
  const secondary = Array.isArray(player.secondaryPositions) ? player.secondaryPositions : [];
  if (player.primaryPosition === position) return { key: "natural", label: "Naturel", penalty: 0, ok: true };
  if (secondary.includes(position) || (equivalent[position] || []).includes(player.primaryPosition)) return { key: "secondary", label: "Compatible", penalty: 3, ok: true };
  return { key: "bad", label: "Hors poste", penalty: 12, ok: false };
}

function prematchLineupStats(career) {
  const lineup = career && career.lineup;
  const starters = Array.isArray(lineup && lineup.starters) ? lineup.starters : [];
  const warnings = [];
  const selected = new Set();
  let overall = 0;
  let adjusted = 0;
  let attack = 0;
  let defense = 0;
  let condition = 0;
  let completed = 0;

  starters.forEach((starter) => {
    const player = prematchPlayerById(career, starter.playerId);
    if (!player) {
      warnings.push("Le poste " + prematchSafe(starter.label, starter.position) + " est vide.");
      return;
    }
    if (selected.has(player.id)) warnings.push(player.name + " est sélectionné plusieurs fois.");
    selected.add(player.id);

    const fit = prematchPositionCompat(player, starter.position);
    if (fit.key === "bad") warnings.push(player.name + " est hors poste en " + starter.position + ".");

    completed += 1;
    overall += Number(player.overall) || 0;
    adjusted += Math.max(1, Math.min(99, (Number(player.overall) || 0) - fit.penalty));
    attack += Number(player.attack) || 0;
    defense += Number(player.defense) || 0;
    condition += Number(player.condition ?? 100) || 100;
  });

  const count = completed || 1;
  return {
    formation: lineup && lineup.formation ? lineup.formation : "—",
    startersCount: completed,
    expectedCount: starters.length || 11,
    complete: completed === (starters.length || 11) && completed >= 11,
    valid: warnings.length === 0 && completed >= 11,
    rating: Math.round(adjusted / count),
    overall: Math.round(overall / count),
    attack: Math.round(attack / count),
    defense: Math.round(defense / count),
    condition: Math.round(condition / count),
    warnings,
    starters
  };
}

function prematchGetNextMatch(career) {
  if (typeof getNextCareerMatch === "function") return getNextCareerMatch(career);
  const clubId = career && career.club ? career.club.id : null;
  if (!clubId || !Array.isArray(career && career.fixtures)) return null;
  return career.fixtures.find((match) => (match.homeClubId === clubId || match.awayClubId === clubId) && !match.played && match.status !== "played") || null;
}

function prematchMatchLabel(match) {
  if (!match) return "—";
  return (match.homeClubName || "Club inconnu") + " vs " + (match.awayClubName || "Club inconnu");
}

function prematchOpponentInfo(career, match) {
  if (!career || !career.club || !match) return { opponent: null, venue: "—", isHome: false };
  const clubId = career.club.id;
  const isHome = match.homeClubId === clubId;
  const opponentId = isHome ? match.awayClubId : match.homeClubId;
  return { opponent: prematchClubById(career, opponentId), venue: isHome ? "Domicile" : "Extérieur", isHome };
}

function prematchClubLevel(club) {
  const reputation = Number(club && club.reputation) || 60;
  if (reputation >= 88) return "Très fort";
  if (reputation >= 78) return "Fort";
  if (reputation >= 68) return "Équilibré";
  return "Abordable";
}

function prematchRenderStarters(career, stats) {
  if (!stats.starters.length) return "<p class='save-meta'>Aucune composition enregistrée.</p>";
  return `<div class="prematch-xi-list">${stats.starters.map((starter) => {
    const player = prematchPlayerById(career, starter.playerId);
    const fit = prematchPositionCompat(player, starter.position);
    const status = fit.key === "bad" ? "bad" : fit.key === "secondary" ? "ok" : "good";
    return `<div class="prematch-xi-row prematch-${status}">
      <span>${prematchEscape(starter.label || starter.position)}</span>
      <strong>${player ? prematchEscape(player.name) : "Poste vide"}</strong>
      <em>${player ? prematchEscape(player.primaryPosition) + " · " + prematchSafe(player.overall) : "—"}</em>
    </div>`;
  }).join("")}</div>`;
}

function prematchRender(career) {
  const screen = document.getElementById("match");
  if (!screen) return;

  if (!career) {
    screen.innerHTML = `<div class="section-header"><h3>Match</h3><p>Aucune carrière active.</p></div><div class="empty-state compact-empty"><span>🎙️</span><h4>Aucun match</h4><p>Charge une carrière pour préparer le prochain match.</p></div>`;
    return;
  }

  if (typeof ensureCareerCalendar === "function") ensureCareerCalendar(career);
  const match = prematchGetNextMatch(career);
  const stats = prematchLineupStats(career);

  if (!match) {
    screen.innerHTML = `<div class="section-header"><h3>Match</h3><p>Aucun match à venir.</p></div><div class="empty-state compact-empty"><span>🏁</span><h4>Saison terminée</h4><p>Il n’y a plus de rencontre prévue dans le calendrier actuel.</p></div>`;
    return;
  }

  const info = prematchOpponentInfo(career, match);
  const userClub = career.club || {};
  const opponent = info.opponent || {};
  const statusClass = stats.valid ? "ready" : "warning";
  const statusText = stats.valid ? "Composition valide" : "Composition à vérifier";

  screen.innerHTML = `
    <div class="section-header section-header-row prematch-header">
      <div>
        <h3>Pré-match</h3>
        <p>Journée ${prematchSafe(match.matchday)} · ${prematchEscape(info.venue)} · Vérifie ta composition avant de lancer la simulation.</p>
      </div>
      <div class="prematch-actions">
        <button type="button" class="secondary-btn" id="prematch-edit-lineup">Modifier la compo</button>
        <button type="button" class="primary-btn" id="prematch-launch" ${stats.valid ? "" : "disabled"}>Lancer le match</button>
      </div>
    </div>

    <div class="prematch-scoreboard panel">
      <div class="prematch-club ${info.isHome ? "home" : "away"}">
        <span>${prematchEscape(info.isHome ? "Domicile" : "Extérieur")}</span>
        <h2>${prematchEscape(userClub.name || "Ton club")}</h2>
        <p>${prematchEscape(prematchClubLevel(userClub))}</p>
      </div>
      <div class="prematch-vs">
        <span>J${prematchSafe(match.matchday)}</span>
        <strong>VS</strong>
        <small>${prematchEscape(match.homeClubName)} reçoit ${prematchEscape(match.awayClubName)}</small>
      </div>
      <div class="prematch-club ${info.isHome ? "away" : "home"}">
        <span>${prematchEscape(info.isHome ? "Extérieur" : "Domicile")}</span>
        <h2>${prematchEscape(opponent.name || "Adversaire")}</h2>
        <p>${prematchEscape(prematchClubLevel(opponent))}</p>
      </div>
    </div>

    <div class="prematch-grid">
      <article class="panel prematch-status-card prematch-status-${statusClass}">
        <p class="eyebrow">Statut</p>
        <h3>${statusText}</h3>
        <p>${stats.valid ? "Ton onze est complet. Tu peux lancer le match dès que la simulation sera branchée." : "Corrige les postes vides ou les hors-postes avant de lancer le match."}</p>
        ${stats.warnings.length ? `<div class="prematch-warning-list">${stats.warnings.slice(0, 5).map((warning) => `<span>${prematchEscape(warning)}</span>`).join("")}</div>` : `<div class="prematch-ok">Aucune alerte majeure détectée.</div>`}
      </article>

      <article class="panel prematch-kpis">
        <div class="kpi-grid">
          <article class="kpi-card"><p>Formation</p><strong>${prematchEscape(stats.formation)}</strong></article>
          <article class="kpi-card"><p>Note XI</p><strong>${prematchSafe(stats.rating)}</strong></article>
          <article class="kpi-card"><p>Condition</p><strong>${prematchSafe(stats.condition)}%</strong></article>
          <article class="kpi-card"><p>Titulaires</p><strong>${stats.startersCount}/${stats.expectedCount}</strong></article>
        </div>
      </article>

      <article class="panel prematch-lineup-card">
        <div class="section-header compact-section-header"><h3>Ton onze probable</h3><p>${prematchEscape(stats.formation)} · moyenne ${prematchSafe(stats.overall)} OVR</p></div>
        ${prematchRenderStarters(career, stats)}
      </article>

      <article class="panel prematch-plan-card">
        <div class="section-header compact-section-header"><h3>Plan de match</h3><p>Première base V0.7, les choix tactiques détaillés viendront plus tard.</p></div>
        <div class="prematch-plan-list">
          <span>🎯 Objectif : jouer le prochain match du calendrier</span>
          <span>🧠 Mental : basé sur la note du XI</span>
          <span>⚡ Condition : surveiller les joueurs fatigués</span>
          <span>📊 Simulation : prévue en V0.8</span>
        </div>
      </article>
    </div>

    <div class="prematch-launch-note" id="prematch-launch-note"></div>
  `;

  prematchBindControls();
}

function prematchBindControls() {
  const editButton = document.getElementById("prematch-edit-lineup");
  const launchButton = document.getElementById("prematch-launch");
  const note = document.getElementById("prematch-launch-note");

  if (editButton) {
    editButton.addEventListener("click", () => {
      const lineupButton = document.querySelector('[data-screen="lineup"]');
      if (lineupButton) lineupButton.click();
    });
  }

  if (launchButton) {
    launchButton.addEventListener("click", () => {
      if (note) {
        note.innerHTML = `<strong>Pré-match validé.</strong> La vraie simulation arrive en V0.8. Pour l’instant, aucun score n’est encore généré.`;
        note.classList.add("visible");
      }
    });
  }
}

function prematchUpdateDashboard(career) {
  if (!career) return;
  const match = prematchGetNextMatch(career);
  const stats = prematchLineupStats(career);
  if (typeof setText === "function") {
    setText("match-preview-title", prematchMatchLabel(match));
    setText("dashboard-description", "V0.7 : pré-match actif · " + prematchMatchLabel(match) + " · XI " + (stats.valid ? "valide" : "à vérifier"));
  }
  const panels = document.querySelectorAll("#dashboard .panel h3");
  if (panels[1]) panels[1].textContent = "Prochaine évolution";
  const texts = document.querySelectorAll("#dashboard .panel p");
  if (texts[1]) texts[1].textContent = "V0.8 : lancer la première simulation simple et enregistrer le résultat du match.";
  const footer = document.querySelector(".sidebar-footer");
  if (footer) footer.textContent = "V0.7 — Pré-match";
}

(function initPrematchModule() {
  const originalRefreshUI = typeof refreshUI === "function" ? refreshUI : null;

  refreshUI = function refreshUIV070() {
    if (originalRefreshUI) originalRefreshUI();
    const career = typeof getResolvedCareer === "function" ? getResolvedCareer() : null;
    prematchUpdateDashboard(career);
    prematchRender(career);
  };

  document.addEventListener("DOMContentLoaded", () => {
    const career = typeof getResolvedCareer === "function" ? getResolvedCareer() : null;
    prematchUpdateDashboard(career);
    prematchRender(career);
  });
})();