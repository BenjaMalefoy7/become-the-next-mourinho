const MATCHDAY_VERSION = "0.9.2";

function mdEscape(value) {
  if (typeof escapeHtml === "function") return escapeHtml(value);
  return String(value ?? "").replace(/[&<>"]/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[char]));
}

function mdClubById(career, clubId) {
  return Array.isArray(career?.clubs) ? career.clubs.find((club) => club.id === clubId) || null : null;
}

function mdMatchLabel(match) {
  if (!match) return "Saison terminée";
  return (match.homeClubName || "Club") + " vs " + (match.awayClubName || "Club");
}

function mdNeutralStrength(career, match, clubId) {
  const club = mdClubById(career, clubId);
  const homeBonus = match.homeClubId === clubId ? 3 : 0;
  return (Number(club?.reputation) || 68) + homeBonus;
}

function mdNeutralScorerName(clubName) {
  const names = ["Buteur maison", "Attaquant", "Milieu offensif", "Avant-centre", "Joueur décisif"];
  return names[Math.floor(Math.random() * names.length)] + " " + (clubName ? "(" + clubName + ")" : "");
}

function mdBuildNeutralEvents(match, homeGoals, awayGoals) {
  const events = [];
  const add = (count, side) => {
    for (let i = 0; i < count; i += 1) {
      const minute = 4 + Math.floor(Math.random() * 87);
      const clubName = side === "home" ? match.homeClubName : match.awayClubName;
      events.push({ minute, type: "goal", side, text: "But de " + mdNeutralScorerName(clubName) });
    }
  };
  add(homeGoals, "home");
  add(awayGoals, "away");
  events.sort((a, b) => a.minute - b.minute);
  if (!events.length) events.push({ minute: 90, type: "info", side: "neutral", text: "Match fermé, aucune équipe ne trouve la faille." });
  return events;
}

function mdSimulateNeutralMatch(career, match) {
  const homeStrength = mdNeutralStrength(career, match, match.homeClubId);
  const awayStrength = mdNeutralStrength(career, match, match.awayClubId);
  const diff = homeStrength - awayStrength;
  const clamp = typeof simClamp === "function" ? simClamp : (value, min, max) => Math.max(min, Math.min(max, value));
  const roll = typeof simRollGoals === "function" ? simRollGoals : (expected) => Math.round(Math.max(0, Math.min(4, expected + Math.random() - 0.5)));
  const expectedHome = clamp(1.18 + diff / 34 + Math.random() * 0.45, 0.20, 3.4);
  const expectedAway = clamp(1.00 - diff / 36 + Math.random() * 0.45, 0.18, 3.2);
  const homeGoals = roll(expectedHome);
  const awayGoals = roll(expectedAway);
  return {
    homeGoals,
    awayGoals,
    events: mdBuildNeutralEvents(match, homeGoals, awayGoals),
    homeStrength: Math.round(homeStrength),
    awayStrength: Math.round(awayStrength)
  };
}

function mdApplyResultToFixture(match, result) {
  match.played = true;
  match.status = "played";
  match.homeGoals = result.homeGoals;
  match.awayGoals = result.awayGoals;
  match.events = result.events || [];
  match.simulatedAt = new Date().toISOString();
}

function mdCreateUserHistoryItem(career, match, result) {
  const userResult = typeof simResultForUser === "function" ? simResultForUser(career, match, result.homeGoals, result.awayGoals) : "Nul";
  match.resultForUser = userResult;
  return {
    fixtureId: match.id,
    matchday: match.matchday,
    homeClubId: match.homeClubId,
    awayClubId: match.awayClubId,
    homeClubName: match.homeClubName,
    awayClubName: match.awayClubName,
    homeGoals: result.homeGoals,
    awayGoals: result.awayGoals,
    resultForUser: userResult,
    events: result.events || [],
    simulatedAt: match.simulatedAt,
    matchdaySimulated: true
  };
}

function computeDynamicStandings(career) {
  const table = new Map();
  const clubs = Array.isArray(career?.clubs) ? career.clubs : [];
  clubs.forEach((club) => {
    table.set(club.id, {
      clubId: club.id,
      name: club.name,
      shortName: club.shortName || club.name,
      played: 0,
      wins: 0,
      draws: 0,
      losses: 0,
      goalsFor: 0,
      goalsAgainst: 0,
      goalDifference: 0,
      points: 0
    });
  });

  const fixtures = Array.isArray(career?.fixtures) ? career.fixtures : [];
  fixtures.forEach((match) => {
    if (!match.played || match.homeGoals === null || match.awayGoals === null || match.homeGoals === undefined || match.awayGoals === undefined) return;
    const home = table.get(match.homeClubId);
    const away = table.get(match.awayClubId);
    if (!home || !away) return;
    const hg = Number(match.homeGoals) || 0;
    const ag = Number(match.awayGoals) || 0;

    home.played += 1;
    away.played += 1;
    home.goalsFor += hg;
    home.goalsAgainst += ag;
    away.goalsFor += ag;
    away.goalsAgainst += hg;

    if (hg > ag) {
      home.wins += 1;
      away.losses += 1;
      home.points += 3;
    } else if (hg < ag) {
      away.wins += 1;
      home.losses += 1;
      away.points += 3;
    } else {
      home.draws += 1;
      away.draws += 1;
      home.points += 1;
      away.points += 1;
    }
  });

  const rows = Array.from(table.values()).map((row) => ({ ...row, goalDifference: row.goalsFor - row.goalsAgainst }));
  rows.sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points;
    if (b.goalDifference !== a.goalDifference) return b.goalDifference - a.goalDifference;
    if (b.goalsFor !== a.goalsFor) return b.goalsFor - a.goalsFor;
    if (b.wins !== a.wins) return b.wins - a.wins;
    return a.name.localeCompare(b.name);
  });
  return rows.map((row, index) => ({ ...row, rank: index + 1 }));
}

function mdGetUserRank(career) {
  const standings = computeDynamicStandings(career);
  const userClubId = career?.club?.id;
  return standings.find((row) => row.clubId === userClubId) || null;
}

function mdStandingsZone(rank, totalTeams = 20) {
  const relegationStart = Math.max(18, totalTeams - 2);
  if (rank >= 1 && rank <= 4) return { key: "ucl", label: "Ligue des Champions", shortLabel: "C1", className: "standings-zone-ucl" };
  if (rank === 5) return { key: "uel", label: "Europa League", shortLabel: "C3", className: "standings-zone-uel" };
  if (rank === 6) return { key: "uecl", label: "Conference League", shortLabel: "C4", className: "standings-zone-uecl" };
  if (rank >= relegationStart && rank <= totalTeams) return { key: "relegation", label: "Relégation", shortLabel: "REL", className: "standings-zone-relegation" };
  return { key: "neutral", label: "", shortLabel: "—", className: "standings-zone-neutral" };
}

function mdStandingsLegendHtml() {
  return `
    <div class="standings-legend-card panel">
      <div>
        <p class="eyebrow">Légende des zones</p>
        <h3>Qualifications et relégation</h3>
        <p>Règles simplifiées pour cette première version Premier League. Les coupes nationales pourront modifier ces places plus tard.</p>
      </div>
      <div class="standings-zone-legend">
        <div class="standings-legend-item legend-ucl"><strong>C1</strong><span>1er à 4e</span><small>Ligue des Champions</small></div>
        <div class="standings-legend-item legend-uel"><strong>C3</strong><span>5e</span><small>Europa League</small></div>
        <div class="standings-legend-item legend-uecl"><strong>C4</strong><span>6e</span><small>Conference League</small></div>
        <div class="standings-legend-item legend-relegation"><strong>REL</strong><span>18e à 20e</span><small>Relégation</small></div>
      </div>
    </div>
  `;
}

function saveSimulatedMatchdayV090() {
  if (typeof loadCareers !== "function" || typeof saveCareers !== "function") return { ok: false, message: "Sauvegarde indisponible." };
  const active = typeof getResolvedCareer === "function" ? getResolvedCareer() : null;
  if (!active) return { ok: false, message: "Aucune carrière active." };

  const careers = loadCareers();
  const index = careers.findIndex((career) => career.id === active.id);
  if (index === -1) return { ok: false, message: "Carrière introuvable." };

  let career = careers[index];
  if (typeof window.repairCareerIfNeeded === "function") career = window.repairCareerIfNeeded(career).career;
  if (typeof ensureCareerCalendar === "function") ensureCareerCalendar(career);

  const stats = typeof simGetLineupStats === "function" ? simGetLineupStats(career) : { valid: true };
  if (!stats.valid) return { ok: false, message: "Composition invalide." };

  const userMatch = typeof simGetNextMatch === "function" ? simGetNextMatch(career) : null;
  if (!userMatch) return { ok: false, message: "Aucun match à jouer." };

  const matchday = userMatch.matchday;
  const dayMatches = Array.isArray(career.fixtures) ? career.fixtures.filter((match) => match.matchday === matchday && !match.played) : [];
  let userHistoryItem = null;

  dayMatches.forEach((match) => {
    const isUserMatch = match.id === userMatch.id;
    const result = isUserMatch && typeof simulateCurrentMatch === "function" ? simulateCurrentMatch(career, match) : mdSimulateNeutralMatch(career, match);
    mdApplyResultToFixture(match, result);
    if (isUserMatch) {
      userHistoryItem = mdCreateUserHistoryItem(career, match, result);
    }
  });

  if (typeof simReduceStarterCondition === "function") simReduceStarterCondition(career);

  if (userHistoryItem) {
    career.matchHistory = Array.isArray(career.matchHistory) ? career.matchHistory : [];
    career.matchHistory.unshift(userHistoryItem);
    career.lastMatchResult = userHistoryItem;
  }

  career.standings = computeDynamicStandings(career);
  const nextMatch = typeof simGetNextMatch === "function" ? simGetNextMatch(career) : null;
  career.nextMatch = typeof getMatchLabel === "function" ? getMatchLabel(nextMatch) : mdMatchLabel(nextMatch);
  career.nextMatchday = nextMatch ? nextMatch.matchday : null;
  career.version = MATCHDAY_VERSION;
  career.updatedAt = new Date().toISOString();
  careers[index] = career;

  const saved = saveCareers(careers, { silent: true });
  return {
    ok: Boolean(saved),
    career,
    result: userHistoryItem,
    matchday,
    simulatedMatches: dayMatches.length,
    message: saved ? "Journée simulée." : "Sauvegarde impossible."
  };
}

function renderStandingsV090(career) {
  const screen = document.getElementById("standings");
  if (!screen) return;

  if (!career) {
    screen.innerHTML = `<div class="section-header"><h3>Classement</h3><p>Aucune carrière active.</p></div>`;
    return;
  }

  const standings = computeDynamicStandings(career);
  const totalTeams = standings.length || 20;
  const userClubId = career?.club?.id;
  const userRow = standings.find((row) => row.clubId === userClubId);
  const playedMatchdays = Math.max(0, ...((Array.isArray(career.fixtures) ? career.fixtures : []).filter((match) => match.played).map((match) => Number(match.matchday) || 0)));

  screen.innerHTML = `
    <div class="section-header section-header-row standings-header">
      <div>
        <h3>Classement</h3>
        <p>Classement calculé automatiquement à partir des matchs joués.</p>
      </div>
      <div class="standings-rank-pill">${userRow ? `${userRow.rank}e / ${standings.length}` : "—"}</div>
    </div>

    ${mdStandingsLegendHtml()}

    <div class="kpi-grid standings-kpis">
      <article class="kpi-card"><p>Journées jouées</p><strong>${playedMatchdays}/38</strong></article>
      <article class="kpi-card"><p>Ton rang</p><strong>${userRow ? userRow.rank + "e" : "—"}</strong></article>
      <article class="kpi-card"><p>Points</p><strong>${userRow ? userRow.points : 0}</strong></article>
      <article class="kpi-card"><p>Différence</p><strong>${userRow && userRow.goalDifference > 0 ? "+" : ""}${userRow ? userRow.goalDifference : 0}</strong></article>
    </div>

    <div class="table-card standings-table-card">
      <table>
        <thead><tr><th>#</th><th>Club</th><th>Zone</th><th>J</th><th>V</th><th>N</th><th>D</th><th>BP</th><th>BC</th><th>Diff</th><th>Pts</th></tr></thead>
        <tbody>
          ${standings.map((row) => {
            const zone = mdStandingsZone(row.rank, totalTeams);
            const classes = [zone.className, row.clubId === userClubId ? "standings-user-row" : ""].filter(Boolean).join(" ");
            return `
              <tr class="${classes}">
                <td>${row.rank}</td>
                <td><strong>${mdEscape(row.name)}</strong></td>
                <td><span class="standings-zone-pill ${zone.className}" title="${mdEscape(zone.label || "Milieu de tableau")}">${mdEscape(zone.shortLabel)}</span></td>
                <td>${row.played}</td>
                <td>${row.wins}</td>
                <td>${row.draws}</td>
                <td>${row.losses}</td>
                <td>${row.goalsFor}</td>
                <td>${row.goalsAgainst}</td>
                <td>${row.goalDifference > 0 ? "+" : ""}${row.goalDifference}</td>
                <td><strong>${row.points}</strong></td>
              </tr>
            `;
          }).join("")}
        </tbody>
      </table>
    </div>
  `;
}

function decorateV090SimulationButton() {
  const button = document.getElementById("prematch-launch");
  if (!button || button.disabled) return;
  button.textContent = "Simuler la journée";
}

function updateV090Texts(career) {
  const footer = document.querySelector(".sidebar-footer");
  if (footer) footer.textContent = "V0.9.2 — Légende classement";
  const rank = career ? mdGetUserRank(career) : null;
  if (typeof setText === "function") {
    const rankText = rank ? ` · rang ${rank.rank}/${computeDynamicStandings(career).length}` : "";
    setText("dashboard-description", "V0.9.2 : classement dynamique avec légende des zones" + rankText + ".");
  }
  const panels = document.querySelectorAll("#dashboard .panel h3");
  const texts = document.querySelectorAll("#dashboard .panel p");
  if (panels[0]) panels[0].textContent = "Statut V0.9.2";
  if (texts[0]) texts[0].textContent = "Le classement affiche une légende claire pour les places européennes et la relégation.";
  if (panels[1]) panels[1].textContent = "Prochaine évolution";
  if (texts[1]) texts[1].textContent = "V1.0 : enrichir le moteur avec stats de match, tirs, possession et résumé plus vivant.";
}

(function initMatchdayV090() {
  try { saveSimulatedMatch = saveSimulatedMatchdayV090; } catch (error) { window.saveSimulatedMatch = saveSimulatedMatchdayV090; }

  const originalRefreshUI = typeof refreshUI === "function" ? refreshUI : null;
  refreshUI = function refreshUIV090() {
    if (originalRefreshUI) originalRefreshUI();
    const career = typeof getResolvedCareer === "function" ? getResolvedCareer() : null;
    renderStandingsV090(career);
    updateV090Texts(career);
    decorateV090SimulationButton();
  };

  document.addEventListener("DOMContentLoaded", () => {
    const career = typeof getResolvedCareer === "function" ? getResolvedCareer() : null;
    renderStandingsV090(career);
    updateV090Texts(career);
    decorateV090SimulationButton();
  });
})();