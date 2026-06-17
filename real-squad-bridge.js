// =====================================================================
// Become the next Mourinho — Real squad bridge
// V0.47C: tolerate source-season club mismatches without falling back to generated mode.
// =====================================================================

(function initRealSquadBridge() {
  "use strict";

  if (window.__BTM_REAL_SQUAD_BRIDGE_LOADED__) return;
  window.__BTM_REAL_SQUAD_BRIDGE_LOADED__ = true;

  const MAX_REAL_SQUAD_SIZE = 25;
  const MIN_SAFE_SQUAD_SIZE = 23;
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

  function getClubNameById(clubId) {
    if (typeof window.getClubById !== "function") return "";
    const club = window.getClubById(clubId);
    return club && club.name ? club.name : "";
  }

  function addKeys(target, values) {
    (values || []).forEach((value) => {
      const key = normalizeText(value);
      if (key) target.add(key);
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
      return keys.has(normalizeText(player.clubId)) || keys.has(normalizeText(player.clubName));
    });
  }

  function getFallbackOverallCeiling(replacedClubId) {
    const club = typeof window.getClubById === "function" ? window.getClubById(replacedClubId) : null;
    const reputation = Number(club && club.reputation ? club.reputation : 72);
    return Math.max(74, Math.min(82, reputation + 8));
  }

  function getRealPoolFallback(realPlayers, replacedClubId) {
    const ceiling = getFallbackOverallCeiling(replacedClubId);
    const floor = Math.max(56, ceiling - 18);
    const filtered = realPlayers.filter((player) => {
      if (!player || !player.isPlayableLeague) return false;
      const overall = Number(player.overall || 0);
      return overall >= floor && overall <= ceiling;
    });
    return filtered.length ? filtered : realPlayers.filter((player) => player && player.isPlayableLeague);
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

    const fallbackPlayers = getRealPoolFallback(realPlayers, replacedClubId);
    if (fallbackPlayers.length) {
      console.warn("[BTM] Real player pool fallback used for:", replacedClubId);
    }
    return fallbackPlayers;
  }

  function sortByOverallDesc(a, b) {
    return Number(b.overall || 0) - Number(a.overall || 0);
  }

  function selectBalancedSquad(players) {
    const selected = [];
    const usedIds = new Set();
    const byPosition = new Map();

    players.slice().sort(sortByOverallDesc).forEach((player) => {
      const position = player.primaryPosition || "MC";
      if (!byPosition.has(position)) byPosition.set(position, []);
      byPosition.get(position).push(player);
    });

    Object.entries(POSITION_QUOTAS).forEach(([position, quota]) => {
      const candidates = byPosition.get(position) || [];
      candidates.slice(0, quota).forEach((player) => {
        if (selected.length < MAX_REAL_SQUAD_SIZE && !usedIds.has(player.playerId)) {
          selected.push(player);
          usedIds.add(player.playerId);
        }
      });
    });

    players.slice().sort(sortByOverallDesc).forEach((player) => {
      if (selected.length >= MAX_REAL_SQUAD_SIZE) return;
      if (!usedIds.has(player.playerId)) {
        selected.push(player);
        usedIds.add(player.playerId);
      }
    });

    return selected;
  }

  function normalizeRealPlayer(player, customClub) {
    const playerId = player.playerId || player.id || `real_${Math.random().toString(36).slice(2)}`;
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

  function normalizeGeneratedDepthPlayer(player, customClub, index) {
    const fallbackId = `${customClub && customClub.id ? customClub.id : "custom"}_depth_${index + 1}`;
    const playerId = player.playerId || player.id || fallbackId;

    return Object.assign({}, player, {
      id: `${playerId}_real_depth`,
      playerId: `${playerId}_real_depth`,
      dataSource: "generated",
      squadSource: "real_depth",
      clubId: customClub && customClub.id ? customClub.id : player.clubId,
      clubName: customClub && customClub.name ? customClub.name : player.clubName,
      club: customClub && customClub.name ? customClub.name : player.clubName,
      injuryStatus: player.injury && player.injury.label ? player.injury.label : "Disponible"
    });
  }

  function createDepthPlayers(customClub, difficulty, existingIds, neededCount) {
    if (neededCount <= 0 || typeof window.generateStartingSquad !== "function") return [];

    const generated = window.generateStartingSquad(customClub, difficulty) || [];
    const depthPlayers = [];

    generated.forEach((player) => {
      if (depthPlayers.length >= neededCount) return;
      const sourceId = player.playerId || player.id;
      if (existingIds.has(sourceId)) return;
      const normalized = normalizeGeneratedDepthPlayer(player, customClub, depthPlayers.length);
      depthPlayers.push(normalized);
      existingIds.add(sourceId);
      existingIds.add(normalized.playerId);
    });

    return depthPlayers;
  }

  function generateRealStartingSquad(customClub, replacedClubId, difficulty) {
    const realCandidates = getPlayersFromReplacedClub(replacedClubId);
    if (!realCandidates.length) return [];

    const selectedRealPlayers = selectBalancedSquad(realCandidates).map((player) => normalizeRealPlayer(player, customClub || {}));
    const usedIds = new Set(selectedRealPlayers.map((player) => player.playerId || player.id));
    const neededCount = Math.max(0, MIN_SAFE_SQUAD_SIZE - selectedRealPlayers.length);
    const depthPlayers = createDepthPlayers(customClub || {}, difficulty, usedIds, neededCount);

    return selectedRealPlayers.concat(depthPlayers).slice(0, MAX_REAL_SQUAD_SIZE);
  }

  window.generateRealStartingSquad = generateRealStartingSquad;
  window.BTM_REAL_SQUAD_BRIDGE_META = Object.freeze({
    version: "0.47C",
    source: "BTNM_REAL_PLAYERS",
    contractVersion: "V0.45A",
    fallbackPolicy: "alias_or_source_season_donor_or_real_pool"
  });
})();