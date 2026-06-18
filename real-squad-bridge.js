// =====================================================================
// Become the next Mourinho — Real squad bridge
// V0.47E: real squads use real players only; no generated depth fill.
// =====================================================================

(function initRealSquadBridge() {
  "use strict";

  if (window.__BTM_REAL_SQUAD_BRIDGE_LOADED__) return;
  window.__BTM_REAL_SQUAD_BRIDGE_LOADED__ = true;

  const MAX_REAL_SQUAD_SIZE = 25;
  const POSITION_QUOTAS = {
    GK: 3,
    DC: 5,
    DG: 2,
    DD: 2,
    MDC: 3,
    MC: 4,
    MOC: 2,
    AG: 2,
    AD: 2,
    BU: 3
  };

  const CLUB_SOURCE_ALIASES = {
    bournemouth: ["afc_bournemouth", "AFC Bournemouth"],
    brighton: ["brighton_hove_albion", "Brighton & Hove Albion"],
    fulham: ["fulham_fc", "Fulham FC", "Fulham"],
    newcastle_united: ["newcastle", "Newcastle United"],
    nottingham_forest: ["nottingham", "Nottingham Forest"],
    tottenham_hotspur: ["tottenham", "Tottenham Hotspur"],
    west_ham_united: ["west_ham", "West Ham United"],
    wolverhampton_wanderers: ["wolverhampton", "Wolverhampton Wanderers", "wolves", "Wolves"]
  };

  const SOURCE_SEASON_DONORS = {
    burnley: ["leicester_city", "Leicester City", "southampton", "Southampton"],
    leeds_united: ["leicester_city", "Leicester City", "southampton", "Southampton", "ipswich_town", "Ipswich Town"],
    sunderland: ["ipswich_town", "Ipswich Town", "southampton", "Southampton", "leicester_city", "Leicester City"]
  };

  function getRealPlayers() {
    return Array.isArray(window.BTNM_REAL_PLAYERS) ? window.BTNM_REAL_PLAYERS : [];
  }

  function normalizeText(value) {
    return String(value || "")
      .trim()
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "_")
      .replace(/^_+|_+$/g, "");
  }

  function stripClubSuffix(value) {
    return normalizeText(value)
      .replace(/_football_club$/g, "")
      .replace(/_fc$/g, "");
  }

  function getPlayerNameKey(player) {
    return normalizeText(player && (player.shortName || player.fullName || player.name || player.playerId || player.id));
  }

  function getClubNameById(clubId) {
    if (typeof window.getClubById !== "function") return "";
    const club = window.getClubById(clubId);
    return club && club.name ? club.name : "";
  }

  function addKeys(target, values) {
    (values || []).forEach((value) => {
      const key = normalizeText(value);
      if (key) target.add(key);
      const strippedKey = stripClubSuffix(key);
      if (strippedKey) target.add(strippedKey);
    });
  }

  function getExactSourceKeys(replacedClubId) {
    const clubId = normalizeText(replacedClubId);
    const clubName = getClubNameById(replacedClubId);
    const keys = new Set();
    addKeys(keys, [replacedClubId, clubName]);
    addKeys(keys, CLUB_SOURCE_ALIASES[clubId]);
    addKeys(keys, CLUB_SOURCE_ALIASES[normalizeText(clubName)]);
    return keys;
  }

  function getDonorSourceKeys(replacedClubId) {
    const clubId = normalizeText(replacedClubId);
    const clubName = normalizeText(getClubNameById(replacedClubId));
    const keys = new Set();
    addKeys(keys, SOURCE_SEASON_DONORS[clubId]);
    addKeys(keys, SOURCE_SEASON_DONORS[clubName]);
    return keys;
  }

  function filterPlayersByClubKeys(realPlayers, keys) {
    if (!keys || !keys.size) return [];
    return realPlayers.filter((player) => {
      if (!player || !player.isPlayableLeague) return false;
      const playerClubId = normalizeText(player.clubId);
      const playerClubName = normalizeText(player.clubName);
      const strippedClubId = stripClubSuffix(playerClubId);
      const strippedClubName = stripClubSuffix(playerClubName);
      return keys.has(playerClubId) || keys.has(playerClubName) || keys.has(strippedClubId) || keys.has(strippedClubName);
    });
  }

  function getPlayersFromReplacedClub(replacedClubId) {
    const realPlayers = getRealPlayers();
    const exactPlayers = filterPlayersByClubKeys(realPlayers, getExactSourceKeys(replacedClubId));
    if (exactPlayers.length) return exactPlayers;

    const donorPlayers = filterPlayersByClubKeys(realPlayers, getDonorSourceKeys(replacedClubId));
    if (donorPlayers.length) {
      console.warn("[BTM] Real squad source-season donor used for:", replacedClubId);
      return donorPlayers;
    }

    console.error("[BTM] No exact real squad source found for:", replacedClubId);
    return [];
  }

  function sortByOverallDesc(a, b) {
    return Number(b.overall || 0) - Number(a.overall || 0);
  }

  function selectBalancedSquad(players) {
    const selected = [];
    const usedIds = new Set();
    const usedNames = new Set();
    const byPosition = new Map();

    function tryAddPlayer(player) {
      if (!player || selected.length >= MAX_REAL_SQUAD_SIZE) return false;
      const playerId = player.playerId || player.id;
      const playerNameKey = getPlayerNameKey(player);
      if (playerId && usedIds.has(playerId)) return false;
      if (playerNameKey && usedNames.has(playerNameKey)) return false;
      selected.push(player);
      if (playerId) usedIds.add(playerId);
      if (playerNameKey) usedNames.add(playerNameKey);
      return true;
    }

    players.slice().sort(sortByOverallDesc).forEach((player) => {
      const position = player.primaryPosition || "MC";
      if (!byPosition.has(position)) byPosition.set(position, []);
      byPosition.get(position).push(player);
    });

    Object.entries(POSITION_QUOTAS).forEach(([position, quota]) => {
      const candidates = byPosition.get(position) || [];
      candidates.slice(0, quota).forEach((player) => {
        tryAddPlayer(player);
      });
    });

    players.slice().sort(sortByOverallDesc).forEach((player) => {
      tryAddPlayer(player);
    });

    return selected;
  }

  function normalizeRealPlayer(player, customClub) {
    const playerId = player.playerId || player.id || `real_${getPlayerNameKey(player) || "unknown"}`;
    const displayName = player.shortName || player.fullName || player.name || playerId;

    return Object.assign({}, player, {
      id: playerId,
      playerId,
      name: displayName,
      shortName: player.shortName || displayName,
      fullName: player.fullName || displayName,
      dataSource: "real",
      squadSource: "real",
      originalClubId: player.clubId || null,
      originalClubName: player.clubName || player.club || null,
      clubId: customClub && customClub.id ? customClub.id : player.clubId,
      clubName: customClub && customClub.name ? customClub.name : player.clubName,
      club: customClub && customClub.name ? customClub.name : player.clubName,
      isTransferMarketEligible: false,
      injuryStatus: player.injury && player.injury.label ? player.injury.label : "Disponible"
    });
  }

  function generateRealStartingSquad(customClub, replacedClubId) {
    const realCandidates = getPlayersFromReplacedClub(replacedClubId);
    if (!realCandidates.length) return [];

    return selectBalancedSquad(realCandidates)
      .map((player) => normalizeRealPlayer(player, customClub || {}))
      .slice(0, MAX_REAL_SQUAD_SIZE);
  }

  window.generateRealStartingSquad = generateRealStartingSquad;
  window.BTM_REAL_SQUAD_BRIDGE_META = Object.freeze({
    version: "0.47E",
    source: "BTNM_REAL_PLAYERS",
    contractVersion: "V0.45A",
    fallbackPolicy: "alias_or_source_season_donor_only_real_players_only"
  });
})();
