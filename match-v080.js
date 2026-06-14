const MATCH_SIM_VERSION = "0.28A";

function simEscape(value) {
  if (typeof escapeHtml === "function") return escapeHtml(value);
  return String(value ?? "").replace(/[&<>\"]/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[char]));
}

function simClamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function simClubById(career, clubId) {
  return Array.isArray(career?.clubs) ? career.clubs.find((club) => club.id === clubId) || null : null;
}

function simPlayerById(career, playerId) {
  return Array.isArray(career?.players) ? career.players.find((player) => player.id === playerId) || null : null;
}

function simGetNextMatch(career) {
  if (typeof getNextCareerMatch === "function") return getNextCareerMatch(career);
  const clubId = career?.club?.id;
  return Array.isArray(career?.fixtures)
    ? career.fixtures.find((match) => (match.homeClubId === clubId || match.awayClubId === clubId) && !match.played) || null
    : null;
}

function simGetLineupStats(career) {
  if (typeof prematchLineupStats === "function") return prematchLineupStats(career);
  const starters = Array.isArray(career?.lineup?.starters) ? career.lineup.starters : [];
  let total = 0;
  let condition = 0;
  let count = 0;

  starters.forEach((starter) => {
    const player = simPlayerById(career, starter.playerId);
    if (!player) return;
    total += Number(player.overall) || 0;
    condition += Number(player.condition ?? 100) || 100;
    count += 1;
  });

  return {
    valid: count >= 11,
    rating: Math.round(total / (count || 1)),
    condition: Math.round(condition / (count || 1)),
    starters
  };
}

function simTeamStrength(career, match, clubId) {
  const userClubId = career?.club?.id;
  const isHome = match.homeClubId === clubId;
  const homeBonus = isHome ? 3 : 0;

  if (clubId === userClubId) {
    const stats = simGetLineupStats(career);
    const conditionBonus = ((Number(stats.condition) || 85) - 85) / 5;
    return (Number(stats.rating) || 65) + conditionBonus + homeBonus;
  }

  const opponent = simClubById(career, clubId);
  return (Number(opponent?.reputation) || 68) + homeBonus;
}

function simRollGoals(expected) {
  let goals = 0;
  const chances = [0.86, 0.58, 0.36, 0.20, 0.10, 0.04];
  chances.forEach((base, index) => {
    const chance = simClamp((expected * base) / (index + 1.05), 0.02, 0.82);
    if (Math.random() < chance) goals += 1;
  });
  return Math.min(goals, 6);
}

function simScorerName(career) {
  const stats = simGetLineupStats(career);
  const starters = Array.isArray(stats.starters) ? stats.starters : [];
  const candidates = starters.map((starter) => simPlayerById(career, starter.playerId)).filter(Boolean);
  const attackers = candidates.filter((player) => ["BU", "AG", "AD", "MOC"].includes(player.primaryPosition));
  const pool = attackers.length ? attackers : candidates;
  const selected = pool[Math.floor(Math.random() * pool.length)];
  return selected ? selected.name : "Buteur inconnu";
}

function simBuildEvents(career, match, homeGoals, awayGoals) {
  const userClubId = career?.club?.id;
  const events = [];
  const addGoalEvents = (count, side) => {
    for (let i = 0; i < count; i += 1) {
      const minute = 5 + Math.floor(Math.random() * 86);
      const isUserGoal = side === "home" ? match.homeClubId === userClubId : match.awayClubId === userClubId;
      const scorer = isUserGoal ? simScorerName(career) : "Joueur adverse";
      events.push({ minute, type: "goal", side, text: "But de " + scorer });
    }
  };

  addGoalEvents(homeGoals, "home");
  addGoalEvents(awayGoals, "away");
  events.sort((a, b) => a.minute - b.minute);
  if (!events.length) events.push({ minute: 90, type: "info", side: "neutral", text: "Match fermé, aucune équipe ne trouve la faille." });
  return events;
}

function simResultForUser(career, match, homeGoals, awayGoals) {
  const clubId = career?.club?.id;
  const userGoals = match.homeClubId === clubId ? homeGoals : awayGoals;
  const opponentGoals = match.homeClubId === clubId ? awayGoals : homeGoals;
  if (userGoals > opponentGoals) return "Victoire";
  if (userGoals < opponentGoals) return "Défaite";
  return "Nul";
}

function simulateCurrentMatch(career, match) {
  const homeStrength = simTeamStrength(career, match, match.homeClubId);
  const awayStrength = simTeamStrength(career, match, match.awayClubId);
  const diff = homeStrength - awayStrength;
  const expectedHome = simClamp(1.25 + diff / 32 + Math.random() * 0.5, 0.25, 3.6);
  const expectedAway = simClamp(1.05 - diff / 34 + Math.random() * 0.5, 0.20, 3.4);
  const homeGoals = simRollGoals(expectedHome);
  const awayGoals = simRollGoals(expectedAway);
  const events = simBuildEvents(career, match, homeGoals, awayGoals);
  return {
    homeGoals,
    awayGoals,
    events,
    resultForUser: simResultForUser(career, match, homeGoals, awayGoals),
    homeStrength: Math.round(homeStrength),
    awayStrength: Math.round(awayStrength)
  };
}

function simReduceStarterCondition(career) {
  const starters = Array.isArray(career?.lineup?.starters) ? career.lineup.starters : [];
  starters.forEach((starter) => {
    const player = simPlayerById(career, starter.playerId);
    if (!player) return;
    const current = Number(player.condition ?? 100) || 100;
    player.condition = simClamp(current - (6 + Math.floor(Math.random() * 8)), 45, 100);
  });
}

function saveSimulatedMatch() {
  if (typeof loadCareers !== "function" || typeof saveCareers !== "function") return { ok: false, message: "Sauvegarde indisponible." };
  const active = typeof getResolvedCareer === "function" ? getResolvedCareer() : null;
  if (!active) return { ok: false, message: "Aucune carrière active." };

  const careers = loadCareers();
  const index = careers.findIndex((career) => career.id === active.id);
  if (index === -1) return { ok: false, message: "Carrière introuvable." };

  let career = careers[index];
  if (typeof window.repairCareerIfNeeded === "function") career = window.repairCareerIfNeeded(career).career;
  if (typeof ensureCareerCalendar === "function") ensureCareerCalendar(career);

  const stats = simGetLineupStats(career);
  if (!stats.valid) return { ok: false, message: "Composition invalide." };

  const match = simGetNextMatch(career);
  if (!match) return { ok: false, message: "Aucun match à jouer." };

  const result = simulateCurrentMatch(career, match);
  match.played = true;
  match.status = "played";
  match.homeGoals = result.homeGoals;
  match.awayGoals = result.awayGoals;
  match.events = result.events;
  match.simulatedAt = new Date().toISOString();
  match.resultForUser = result.resultForUser;

  simReduceStarterCondition(career);

  const historyItem = {
    fixtureId: match.id,
    matchday: match.matchday,
    homeClubId: match.homeClubId,
    awayClubId: match.awayClubId,
    homeClubName: match.homeClubName,
    awayClubName: match.awayClubName,
    homeGoals: result.homeGoals,
    awayGoals: result.awayGoals,
    resultForUser: result.resultForUser,
    events: result.events,
    simulatedAt: match.simulatedAt
  };

  career.matchHistory = Array.isArray(career.matchHistory) ? career.matchHistory : [];
  career.matchHistory.unshift(historyItem);
  career.lastMatchResult = historyItem;

  const nextMatch = simGetNextMatch(career);
  career.nextMatch = typeof getMatchLabel === "function" ? getMatchLabel(nextMatch) : nextMatch ? nextMatch.homeClubName + " vs " + nextMatch.awayClubName : "Saison terminée";
  career.nextMatchday = nextMatch ? nextMatch.matchday : null;
  career.version = MATCH_SIM_VERSION;
  career.updatedAt = new Date().toISOString();
  careers[index] = career;

  const saved = saveCareers(careers, { silent: true });
  return { ok: Boolean(saved), career, result: historyItem, message: saved ? "Match simulé." : "Sauvegarde impossible." };
}

(function initPureMatchEngineV028A() {
  window.__BTM_MATCH_ENGINE_PURE__ = true;
  window.__BTM_MATCH_LEGACY_RENDERER_DISABLED__ = true;
})();