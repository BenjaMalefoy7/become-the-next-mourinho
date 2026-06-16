// =====================================================================
// Become the next Mourinho — Generated squad bridge
// V0.45I: route generated squads through BTMGenerator without touching app.js.
// =====================================================================

(function initGeneratedSquadBridge() {
  "use strict";

  if (window.__BTM_GENERATED_SQUAD_BRIDGE_LOADED__) return;
  window.__BTM_GENERATED_SQUAD_BRIDGE_LOADED__ = true;

  const legacyGenerateStartingSquad = window.generateStartingSquad;

  function createBridgeSeed(club, difficulty) {
    const base = [
      club && club.id,
      club && club.name,
      difficulty,
      Date.now(),
      Math.floor(Math.random() * 1000000)
    ].join("|");

    let hash = 2166136261;
    for (let i = 0; i < base.length; i += 1) {
      hash ^= base.charCodeAt(i);
      hash = Math.imul(hash, 16777619);
    }
    return hash >>> 0;
  }

  function getGeneratedClubLevel(difficulty) {
    const fallback = {
      outsider: 62,
      ambitious: 74,
      giant: 88
    };

    if (typeof window.getDifficultySettings === "function") {
      const settings = window.getDifficultySettings(difficulty);
      if (settings && Number.isFinite(Number(settings.reputation))) return Number(settings.reputation);
    }

    return fallback[difficulty] || fallback.ambitious;
  }

  function toGeneratorClub(club) {
    return {
      clubId: club && club.id ? club.id : "custom_club",
      clubName: club && club.name ? club.name : "Custom Club",
      leagueId: "premier_league",
      leagueName: "Premier League",
      isPlayableLeague: true
    };
  }

  function normalizeGeneratedPlayer(player, club) {
    return Object.assign({}, player, {
      id: player.playerId,
      name: player.fullName || player.shortName || player.playerId,
      clubId: club && club.id ? club.id : player.clubId,
      club: club && club.name ? club.name : player.clubName,
      clubName: club && club.name ? club.name : player.clubName,
      injuryStatus: player.injury && player.injury.label ? player.injury.label : "Disponible"
    });
  }

  function generateWithBTMGenerator(club, difficulty) {
    if (!window.BTMGenerator || typeof window.BTMGenerator.createGenerator !== "function") {
      console.warn("BTMGenerator indisponible, retour au générateur historique.");
      return typeof legacyGenerateStartingSquad === "function" ? legacyGenerateStartingSquad(club, difficulty) : [];
    }

    const seed = createBridgeSeed(club, difficulty);
    const generator = window.BTMGenerator.createGenerator(seed);
    const generatorClub = toGeneratorClub(club || {});
    const clubLevel = getGeneratedClubLevel(difficulty);
    const squad = generator.generateSquad(clubLevel, generatorClub);

    return squad.map((player) => normalizeGeneratedPlayer(player, club || {}));
  }

  window.generateStartingSquad = generateWithBTMGenerator;
  window.BTM_GENERATED_SQUAD_BRIDGE_META = Object.freeze({
    version: "0.45I",
    source: "BTMGenerator",
    contractVersion: "V0.45A"
  });
})();
