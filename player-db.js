const BTM_PLAYER_DB_ENTRYPOINT_VERSION = "0.34";
const BTM_PLAYER_DATABASE_VERSION = "0.34";

(function () {
  if (window.__BTM_PLAYER_DB_LOADED__) return;
  window.__BTM_PLAYER_DB_LOADED__ = true;

  const firstNames = ["Adam", "Alex", "André", "Ben", "Daniel", "Diego", "Elias", "Enzo", "Felix", "Hugo", "Isaac", "Ivan", "Jules", "Leo", "Lucas", "Malo", "Mateo", "Milan", "Nico", "Oscar", "Rayan", "Sam", "Theo", "Victor"];
  const lastNames = ["Araujo", "Bakker", "Costa", "Diallo", "Fernandes", "Garcia", "Hansen", "Ito", "Kovacs", "Lemoine", "Martins", "Moreau", "Novak", "Okafor", "Petrov", "Reed", "Santos", "Silva", "Traore", "Turner", "Varela", "Warren"];
  const nationalities = ["Angleterre", "France", "Belgique", "Pays-Bas", "Espagne", "Portugal", "Italie", "Allemagne", "Brésil", "Argentine", "Sénégal", "Côte d’Ivoire", "Ghana", "Maroc", "Croatie", "Danemark"];
  const positions = ["GK", "DD", "DC", "DG", "MDC", "MC", "MOC", "AD", "AG", "BU"];

  function randomInt(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }
  function clamp(value, min, max) { return Math.max(min, Math.min(max, value)); }
  function pick(list) { return list[randomInt(0, list.length - 1)]; }
  function createDbId(prefix) { return `${prefix}_${Date.now()}_${Math.random().toString(16).slice(2)}`; }

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

  function makePlayer(career, index) {
    const primaryPosition = positions[index % positions.length];
    const tier = Math.random();
    const overall = tier > 0.92 ? randomInt(80, 88) : tier > 0.72 ? randomInt(74, 81) : tier > 0.38 ? randomInt(67, 75) : randomInt(58, 68);
    const age = randomInt(18, 34);
    const potential = clamp(overall + randomInt(0, age <= 22 ? 10 : age >= 30 ? 3 : 7), overall, 94);
    const clubPool = (career?.clubs || []).filter((club) => club.id !== career?.club?.id);
    const club = clubPool.length && Math.random() > 0.18 ? pick(clubPool) : null;
    const value = estimateValue(overall, potential, age);

    return {
      id: createDbId("dbp"),
      name: `${pick(firstNames)} ${pick(lastNames)}`,
      clubId: club ? club.id : "free_agent",
      club: club ? club.name : "Libre",
      nationality: pick(nationalities),
      age,
      primaryPosition,
      secondaryPositions: getSecondary(primaryPosition),
      overall,
      potential,
      ...buildStats(primaryPosition, overall),
      value,
      salary: estimateSalary(value, overall),
      contractYears: club ? randomInt(1, 5) : 0,
      morale: "Normal",
      condition: 100,
      injuryStatus: "Disponible",
      listedPrice: Math.round(value * (0.85 + Math.random() * 0.55) / 50000) * 50000,
      scoutLevel: randomInt(35, 85),
      databaseVersion: BTM_PLAYER_DATABASE_VERSION
    };
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
    while (career.playerDatabase.length < target) {
      career.playerDatabase.push(makePlayer(career, career.playerDatabase.length));
    }
    career.playerDatabaseVersion = BTM_PLAYER_DATABASE_VERSION;
    return career.playerDatabase;
  }

  function ensureActivePlayerDatabase(count = 240) {
    const context = getActiveContext();
    if (!context.career) return null;
    const before = Array.isArray(context.career.playerDatabase) ? context.career.playerDatabase.length : 0;
    const database = ensurePlayerDatabase(context.career, count);
    if (!before || before < (Number(count) || 240) || context.career.playerDatabaseVersion !== BTM_PLAYER_DATABASE_VERSION) saveContext(context);
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