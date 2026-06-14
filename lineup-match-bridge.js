const BTM_LINEUP_MATCH_BRIDGE_VERSION = "0.40D";
(function () {
  if (window.__BTM_LINEUP_MATCH_BRIDGE_LOADED__) return;
  window.__BTM_LINEUP_MATCH_BRIDGE_LOADED__ = true;

  function playerById(career, id) {
    return Array.isArray(career?.players) ? career.players.find((player) => player.id === id) || null : null;
  }

  function secondaries(player) {
    return Array.isArray(player?.secondaryPositions) ? player.secondaryPositions : [];
  }

  function isMajorOutOfPosition(player, position) {
    if (!player || !position) return false;
    if (player.primaryPosition === position) return false;
    return !secondaries(player).includes(position);
  }

  window.prematchLineupStats = function prematchLineupStats(career) {
    const lineup = career?.lineup || null;
    const starters = Array.isArray(lineup?.starters) ? lineup.starters : [];
    const expectedCount = starters.length || 11;
    let startersCount = 0;
    let totalOverall = 0;
    let totalCondition = 0;
    const warnings = [];

    starters.forEach((slot) => {
      const player = playerById(career, slot.playerId);
      if (!player) {
        warnings.push(`Le poste ${slot.label || slot.position || "?"} est vide.`);
        return;
      }
      startersCount += 1;
      totalOverall += Number(player.overall) || 0;
      totalCondition += Number(player.condition ?? 100) || 100;
      if (isMajorOutOfPosition(player, slot.position)) {
        warnings.push(`${player.name} n'est pas naturel en ${slot.position}.`);
      }
    });

    const divisor = Math.max(1, startersCount);
    return {
      valid: startersCount >= expectedCount,
      formation: lineup?.formation || "—",
      rating: Math.round(totalOverall / divisor),
      condition: Math.round(totalCondition / divisor),
      starters,
      startersCount,
      expectedCount,
      warnings: warnings.slice(0, 5)
    };
  };
})();
