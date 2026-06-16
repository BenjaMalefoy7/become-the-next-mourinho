const BTM_PLAYER_DB_ENTRYPOINT_VERSION = "0.45L";
const BTM_PLAYER_DATABASE_VERSION = "0.45L";

(function () {
  if (window.__BTM_PLAYER_DB_LOADED__) return;
  window.__BTM_PLAYER_DB_LOADED__ = true;

  const legacyFirstNames = ["Adam", "Alex", "André", "Ben", "Daniel", "Diego", "Elias", "Enzo", "Felix", "Hugo", "Isaac", "Ivan", "Jules", "Leo", "Lucas", "Malo", "Mateo", "Milan", "Nico", "Oscar", "Rayan", "Sam", "Theo", "Victor"];
  const legacyLastNames = ["Araujo", "Bakker", "Costa", "Diallo", "Fernandes", "Garcia", "Hansen", "Ito", "Kovacs", "Lemoine", "Martins", "Moreau", "Novak", "Okafor", "Petrov", "Reed", "Santos", "Silva", "Traore", "Turner", "Varela", "Warren"];
  const legacyNationalities = ["Angleterre", "France", "Belgique", "Pays-Bas", "Espagne", "Portugal", "Italie", "Allemagne", "Brésil", "Argentine", "Sénégal", "Côte d’Ivoire", "Ghana", "Maroc", "Croatie", "Danemark"];
  const positions = ["GK", "DD", "DC", "DG", "MDC", "MC", "MOC", "AD", "AG", "BU"];

  function randomInt(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }
  function clamp(value, min, max) { return Math.max(min, Math.min(max, value)); }
  function pick(list) { return list[randomInt(0, list.length - 1)]; }
  function createDbId(prefix) { return `${prefix}_${Date.now()}_${Math.random().toString(16).slice(2)}`; }

  function hashSeed(parts) {
    const text = parts.filter(value => value !== null && value !== undefined).join("|");
    let hash = 2166136261;
    for (let i = 0; i < text.length; i += 1) {
      hash ^= text.charCodeAt(i);
      hash = Math.imul(hash, 16777619);
    }
    return hash >>> 0;
  }

  function getSecondary(position) {
    if (typeof getSecondaryPositions === "function") return getSecondaryPositions(position);
    const map = { GK: [], DC: ["DD", "DG", "MDC"], DD: ["DC", "AD"], DG: ["DC", "AG"], MDC: ["MC", "DC"], MC: ["MDC", "MOC"], MOC: ["MC", "AD", "AG"], AD: ["AG", "MOC", "BU"], AG: ["AD", "MOC", "BU"], BU: ["AD", "AG", "MOC"] };
    return map[position] || [];
  }

  function buildStats(position, overall) {
    const mod = { GK: [-24, 14, 2, 5], DC: [-12, 12, 8, 3], DD: [-4, 7, 7, 2], DG: [-4, 7, 7, 2], MDC: [-4, 8, 5, 5], MC: [2, 2, 3, 7], MOC: [9, -6, 0, 7], AG: [10, -8, 6, 2], AD: [10, -8, 6, 2], BU: [13, -12, 5, 3] }[position] || [0, 0, 0, 0];
    return {
      attack: clamp(overall + mod[0] + randomInt(-3, 3), 35, 99),
      defense: clamp(overall + mod[1] + randomInt(-3, 3), 35, 99),
      physical: clamp(overall + mod[2] + randomInt(-3, 3), 35, 99),
      mental: clamp(overall + mod[3] + randomInt(-3, 3), 35, 99)
    };
  }

  function estimateValue(overall, potential, age) {
    const base = Math.pow(Math.max(1, overall - 48), 2) * 22000;
    const upside = Math.max(0, potential - overall) * 450000;
    const ageMultiplier = age <= 23 ? 1.18 : age >= 31 ? 0.72 : 1;
    return Math.round((base + upside) * ageMultiplier / 50000) * 50000;
  }

  function estimateSalary(value, overall) {
    return Math.round((value * 0.075 + overall * 4500) / 10000) * 10000;
  }

  function getMarketClub(career) {
    const clubPool = (career?.clubs || []).filter((club) => club.id !== career?.club?.id);
    return clubPool.length && Math.random() > 0.18 ? pick(clubPool) : null;
  }

  function toGeneratorClub(club) {
    return {
      clubId: club?.id || "free_agent",
      clubName: club?.name || "Libre",
      leagueId: "premier_league",
      leagueName: "Premier League",
      isPlayableLeague: Boolean(club)
    };
  }

  function rollMarketOverall() {
    const tier = Math.random();
    if (tier > 0.92) return randomInt(80, 88);
    if (tier > 0.72) return randomInt(74, 81);
    if (tier > 0.38) return randomInt(67, 75);
    return randomInt(58, 68);
  }

  function normalizeGeneratedMarketPlayer(player, career, club) {
    const value = Number(player.value) || estimateValue(Number(player.overall) || 60, Number(player.potential) || Number(player.overall) || 60, Number(player.age) || 25);
    return Object.assign({}, player, {
      id: createDbId("dbp"),
      name: player.fullName || player.shortName || player.playerId,
      clubId: club ? club.id : "free_agent",
      club: club ? club.name : "Libre",
      clubName: club ? club.name : "Libre",
      isTransferMarketEligible: true,
      secondaryPositions: Array.isArray(player.secondaryPositions) ? player.secondaryPositions : getSecondary(player.primaryPosition),
      injuryStatus: player.injury && player.injury.label ? player.injury.label : "Disponible",
      listedPrice: Math.round(value * (0.85 + Math.random() * 0.55) / 50000) * 50000,
      scoutLevel: randomInt(35, 85),
      databaseVersion: BTM_PLAYER_DATABASE_VERSION,
      marketSource: "BTMGenerator"
    });
  }

  function makeGeneratedPlayer(career, index, generator) {
    const primaryPosition = positions[index % positions.length];
    const overall = rollMarketOverall();
    const age = randomInt(18, 34);
    const club = getMarketClub(career);
    const generatorClub = toGeneratorClub(club);

    const player = generator.generatePlayer({
      position: primaryPosition,
      overall,
      age,
      club: generatorClub,
      dataSource: "generated",
      year: 2025
    });

    return normalizeGeneratedMarketPlayer(player, career, club);
  }

  function makeLegacyPlayer(career, index) {
    const primaryPosition = positions[index % positions.length];
    const overall = rollMarketOverall();
    const age = randomInt(18, 34);
    const potential = clamp(overall + randomInt(0, age <= 22 ? 10 : age >= 30 ? 3 : 7), overall, 94);
    const club = getMarketClub(career);
    const value = estimateValue(overall, potential, age);

    return {
      id: createDbId("dbp"),
      name: `${pick(legacyFirstNames)} ${pick(legacyLastNames)}`,
      clubId: club ? club.id : "free_agent",
      club: club ? club.name : "Libre",
      nationality: pick(legacyNationalities),
      age,
      primaryPosition,
      secondaryPositions: getSecondary(primaryPosition),
      overall,
      potential,
      ...buildStats(primaryPosition, overall),
      value,
      salary: estimateSalary(value, overall),
      contractYears: club ? randomInt(1, 5) : 0,
      morale: "normal",
      condition: 100,
      injuryStatus: "Disponible",
      listedPrice: Math.round(value * (0.85 + Math.random() * 0.55) / 50000) * 50000,
      scoutLevel: randomInt(35, 85),
      databaseVersion: BTM_PLAYER_DATABASE_VERSION,
      marketSource: "legacy-fallback"
    };
  }

  function createMarketGenerator(career, count) {
    if (!window.BTMGenerator || typeof window.BTMGenerator.createGenerator !== "function") return null;
    const seed = hashSeed([career?.id, career?.club?.id, career?.createdAt, career?.playerDatabase?.length || 0, count, Date.now(), Math.random()]);
    return window.BTMGenerator.createGenerator(seed);
  }

  function applyNameQuality(players, career) {
    const quality = window.BTMGeneratedNameQuality;
    if (!quality || typeof quality.improveGeneratedNames !== "function") return players;
    return quality.improveGeneratedNames(players, { id: "transfer_market", name: career?.club?.name || "Marché" }, "market");
  }

  function getActiveContext() {
    const activeId = typeof getActiveCareerId === "function" ? getActiveCareerId() : null;
    const careers = typeof loadCareers === "function" ? loadCareers() : [];
    const index = careers.findIndex((career) => career.id === activeId);
    return { careers, index, career: index >= 0 ? careers[index] : null };
  }

  function saveContext(context) {
    if (!context || context.index < 0 || !context.career) return false;
    context.career.updatedAt = new Date().toISOString();
    context.careers[context.index] = context.career;
    if (typeof saveCareers === "function") return saveCareers(context.careers, { silent: true });
    return false;
  }

  function ensurePlayerDatabase(career, count = 240) {
    if (!career) return null;
    career.playerDatabase = Array.isArray(career.playerDatabase) ? career.playerDatabase : [];

    const target = Number(count) || 240;
    const missing = Math.max(0, target - career.playerDatabase.length);
    if (!missing) return career.playerDatabase;

    const generator = createMarketGenerator(career, target);
    const generated = [];

    for (let i = 0; i < missing; i += 1) {
      const index = career.playerDatabase.length + i;
      generated.push(generator ? makeGeneratedPlayer(career, index, generator) : makeLegacyPlayer(career, index));
    }

    const polished = generator ? applyNameQuality(generated, career) : generated;
    career.playerDatabase.push(...polished);
    career.playerDatabaseVersion = BTM_PLAYER_DATABASE_VERSION;
    career.playerDatabaseSource = generator ? (career.playerDatabase.length > polished.length ? "mixed" : "BTMGenerator") : "legacy-fallback";
    return career.playerDatabase;
  }

  function ensureActivePlayerDatabase(count = 240) {
    const context = getActiveContext();
    if (!context.career) return null;

    const before = Array.isArray(context.career.playerDatabase) ? context.career.playerDatabase.length : 0;
    const database = ensurePlayerDatabase(context.career, count);
    const after = Array.isArray(database) ? database.length : before;

    if (after > before) saveContext(context);
    return database;
  }

  window.btmEnsurePlayerDatabase = ensurePlayerDatabase;
  window.btmEnsurePlayerDatabasePersisted = ensureActivePlayerDatabase;
  window.BTM_PLAYER_DATABASE_VERSION = BTM_PLAYER_DATABASE_VERSION;

  if (typeof window.btmRegisterRender === "function") {
    window.btmRegisterRender("player-db", () => ensureActivePlayerDatabase(160));
  } else {
    document.addEventListener("DOMContentLoaded", () => ensureActivePlayerDatabase(160));
  }
})();