const BTM_MATCH_ENGINE_VERSION = "0.40E";

function simClamp(value, min, max) {
  return Math.max(min, Math.min(max, Number(value) || 0));
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
    const chance = simClamp((Number(expected) * base) / (index + 1.05), 0.02, 0.82);
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

function simHash(value) {
  return String(value || "club").split("").reduce((total, char) => total + char.charCodeAt(0), 0);
}

function simOpponentScorerName(career, match, side, goalIndex = 0) {
  const clubId = side === "home" ? match.homeClubId : match.awayClubId;
  const club = simClubById(career, clubId) || {};
  const firstNames = ["Ethan", "Noah", "Liam", "Mason", "Oliver", "Lucas", "Theo", "Sam", "Daniel", "Isaac", "Leo", "Nathan"];
  const lastNames = ["Walker", "Bennett", "Cole", "Turner", "Morgan", "Wilson", "Reed", "Brooks", "Foster", "Hughes", "Bailey", "Cooper"];
  const seed = simHash(club.id || club.name || club.shortName) + goalIndex * 7;
  const first = firstNames[seed % firstNames.length];
  const last = lastNames[(seed + Math.floor(seed / 3)) % lastNames.length];
  return `${first} ${last}`;
}

function simBuildEvents(career, match, homeGoals, awayGoals) {
  const userClubId = career?.club?.id;
  const events = [];
  const addGoalEvents = (count, side) => {
    for (let i = 0; i < count; i += 1) {
      const minute = 5 + Math.floor(Math.random() * 86);
      const isUserGoal = side === "home" ? match.homeClubId === userClubId : match.awayClubId === userClubId;
      const scorer = isUserGoal ? simScorerName(career) : simOpponentScorerName(career, match, side, i);
      events.push({ minute, type: "goal", side, scorer, text: "But de " + scorer });
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

function btmApplyUserMatchResult(career, match, result) {
  match.played = true;
  match.status = "played";
  match.homeGoals = result.homeGoals;
  match.awayGoals = result.awayGoals;
  match.events = result.events || [];
  match.simulatedAt = new Date().toISOString();
  match.resultForUser = result.resultForUser;

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
    events: result.events || [],
    simulatedAt: match.simulatedAt,
    homeStrength: result.homeStrength,
    awayStrength: result.awayStrength
  };

  career.matchHistory = Array.isArray(career.matchHistory) ? career.matchHistory : [];
  career.matchHistory.unshift(historyItem);
  career.lastMatchResult = historyItem;
  simReduceStarterCondition(career);
  return historyItem;
}

function btmSimulateUserMatch(career, match) {
  if (!career) return { ok: false, message: "Aucune carrière active." };
  const stats = simGetLineupStats(career);
  if (!stats.valid) return { ok: false, message: "Composition invalide." };
  const target = match || simGetNextMatch(career);
  if (!target) return { ok: false, message: "Aucun match à jouer." };
  const result = simulateCurrentMatch(career, target);
  const historyItem = btmApplyUserMatchResult(career, target, result);
  return { ok: true, career, match: target, result: historyItem, rawResult: result, message: "Match simulé." };
}

(function initPureMatchEngineV040E() {
  window.btmSimulateUserMatch = btmSimulateUserMatch;
  window.btmApplyUserMatchResult = btmApplyUserMatchResult;
  window.__BTM_MATCH_ENGINE_PURE__ = true;
  window.__BTM_MATCH_ENGINE_BRIDGE_DISABLED__ = true;
})();