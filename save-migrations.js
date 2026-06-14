const BTM_SAVE_MIGRATIONS_VERSION = "0.37";

(function () {
  if (window.__BTM_SAVE_MIGRATIONS_LOADED__) return;
  window.__BTM_SAVE_MIGRATIONS_LOADED__ = true;

  const CAREER_SCHEMA_VERSION = 37;
  const DATA_VERSION = "premier_league_2025_2026_v0_4_4";
  const APP_VERSION_VALUE = "0.4.4";
  const originalLoadCareers = window.loadCareers;
  const originalSaveCareers = window.saveCareers;
  const originalRepairCareerIfNeeded = window.repairCareerIfNeeded;

  function now() {
    return new Date().toISOString();
  }

  function fallbackId(prefix) {
    return prefix + "_" + Date.now() + "_" + Math.random().toString(16).slice(2);
  }

  function ensureObject(value) {
    return value && typeof value === "object" ? value : {};
  }

  function ensureArray(value) {
    return Array.isArray(value) ? value : [];
  }

  function difficultySettings(value) {
    if (typeof window.getDifficultySettings === "function") return window.getDifficultySettings(value || "ambitious");
    return { startMoney: 85000000, transferBudget: 45000000, objective: "Top 10 / Top 8", squadLevel: "Correct / ambitieux", reputation: 74, clubBudget: 90000000 };
  }

  function makeClubId(career) {
    if (career.club?.id) return career.club.id;
    const name = career.club?.name || career.careerName || "custom_club";
    if (typeof window.makeUniqueCustomClubId === "function") return window.makeUniqueCustomClubId(name, career.replacedClubId);
    return String(name).toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "_").replace(/^_|_$/g, "") || "custom_club";
  }

  function migratePlayer(player, career) {
    const p = ensureObject(player);
    const club = ensureObject(career.club);
    let changed = false;
    function set(key, value) {
      if (p[key] === undefined || p[key] === null || p[key] === "") {
        p[key] = value;
        changed = true;
      }
    }
    set("id", typeof window.createId === "function" ? window.createId("player") : fallbackId("player"));
    set("name", "Joueur sans nom");
    set("clubId", club.id || makeClubId(career));
    set("club", club.name || career.club?.name || "Club inconnu");
    set("nationality", "Angleterre");
    set("primaryPosition", "MC");
    if (!Array.isArray(p.secondaryPositions)) {
      p.secondaryPositions = typeof window.getSecondaryPositions === "function" ? window.getSecondaryPositions(p.primaryPosition) : [];
      changed = true;
    }
    set("age", 24);
    set("overall", 65);
    set("potential", Math.max(Number(p.overall) || 65, Number(p.potential) || 68));
    set("attack", Number(p.overall) || 65);
    set("defense", Number(p.overall) || 65);
    set("physical", Number(p.overall) || 65);
    set("mental", Number(p.overall) || 65);
    set("value", 1000000);
    set("salary", 500000);
    set("contractYears", 3);
    set("morale", "Normal");
    set("condition", 100);
    set("injuryStatus", "Disponible");
    return { player: p, changed };
  }

  function migrateCareerSave(career) {
    if (!career || typeof career !== "object") return { career, changed: false };
    let changed = false;
    const settings = difficultySettings(career.difficulty);
    const timestamp = now();

    function set(key, value) {
      if (career[key] === undefined || career[key] === null || career[key] === "") {
        career[key] = value;
        changed = true;
      }
    }

    set("id", typeof window.createId === "function" ? window.createId("career") : fallbackId("career"));
    set("careerName", career.club?.name ? "Carrière " + career.club.name : "Carrière sans nom");
    set("managerName", "Manager");
    set("mode", "custom_club");
    set("difficulty", "ambitious");
    set("objective", settings.objective || "Top 10 / Top 8");
    set("squadLevel", settings.squadLevel || "Correct / ambitieux");
    set("squadSource", "generated");
    set("season", "2025/2026");
    set("matchday", 1);
    set("fixtures", []);
    set("mailbox", []);
    set("trainingFocus", {});
    set("lastMatchResult", career.lastMatchResult || null);
    set("createdAt", timestamp);
    set("updatedAt", timestamp);

    career.club = ensureObject(career.club);
    if (!career.club.name) { career.club.name = career.careerName || "Club sans nom"; changed = true; }
    if (!career.club.id) { career.club.id = makeClubId(career); changed = true; }
    if (!career.club.shortName) { career.club.shortName = String(career.club.name).slice(0, 4).toUpperCase(); changed = true; }
    if (!career.club.badge) { career.club.badge = "⚽"; changed = true; }
    if (!career.club.country) { career.club.country = "England"; changed = true; }
    if (!career.club.league) { career.club.league = "Premier League"; changed = true; }
    if (!career.club.primaryColor) { career.club.primaryColor = "#2ee987"; changed = true; }
    if (!career.club.secondaryColor) { career.club.secondaryColor = "#ffffff"; changed = true; }
    if (!career.club.stadiumName) { career.club.stadiumName = "Stade à définir"; changed = true; }
    if (!career.club.reputation) { career.club.reputation = settings.reputation || 74; changed = true; }
    if (!career.club.budget) { career.club.budget = settings.clubBudget || 90000000; changed = true; }

    if (!career.league && typeof window.getPremierLeague === "function") { career.league = window.getPremierLeague(); changed = true; }
    if (!career.replacedClubName && career.replacedClubId && typeof window.getClubById === "function") {
      const replaced = window.getClubById(career.replacedClubId);
      if (replaced?.name) { career.replacedClubName = replaced.name; changed = true; }
    }
    if ((!Array.isArray(career.clubs) || !career.clubs.length) && typeof window.createLeagueTeams === "function") {
      career.clubs = window.createLeagueTeams(career.club, career.replacedClubId);
      changed = true;
    }
    if ((!Array.isArray(career.standings) || !career.standings.length) && Array.isArray(career.clubs) && typeof window.createInitialStandings === "function") {
      career.standings = window.createInitialStandings(career.clubs);
      changed = true;
    }

    career.players = ensureArray(career.players).map((player) => {
      const result = migratePlayer(player, career);
      if (result.changed) changed = true;
      return result.player;
    });

    career.finances = ensureObject(career.finances);
    if (typeof career.finances.balance !== "number") { career.finances.balance = settings.startMoney || 85000000; changed = true; }
    if (typeof career.finances.transferBudget !== "number") { career.finances.transferBudget = settings.transferBudget || 45000000; changed = true; }
    const wageBill = typeof window.calculateWageBill === "function" ? window.calculateWageBill(career.players) : career.players.reduce((total, p) => total + (Number(p.salary) || 0), 0);
    if (career.finances.wageBill !== wageBill) { career.finances.wageBill = wageBill; changed = true; }
    if (career.finances.wageBudget !== wageBill) { career.finances.wageBudget = wageBill; changed = true; }

    if (career.version !== APP_VERSION_VALUE) { career.version = APP_VERSION_VALUE; changed = true; }
    if (career.dataVersion !== DATA_VERSION) { career.dataVersion = DATA_VERSION; changed = true; }
    if (career.schemaVersion !== CAREER_SCHEMA_VERSION) { career.schemaVersion = CAREER_SCHEMA_VERSION; changed = true; }
    if (changed) career.updatedAt = timestamp;
    return { career, changed };
  }

  function migrateCareers(careers) {
    let changed = false;
    const migrated = ensureArray(careers).map((career) => {
      const result = migrateCareerSave(career);
      if (result.changed) changed = true;
      return result.career;
    });
    return { careers: migrated, changed };
  }

  window.btmMigrateCareerSave = migrateCareerSave;
  window.btmMigrateCareers = migrateCareers;
  window.BTM_CAREER_SCHEMA_VERSION = CAREER_SCHEMA_VERSION;

  if (typeof originalLoadCareers === "function") {
    window.loadCareers = function loadCareersWithMigrations() {
      const loaded = originalLoadCareers();
      const result = migrateCareers(loaded);
      if (result.changed && typeof originalSaveCareers === "function") originalSaveCareers(result.careers, { silent: true });
      return result.careers;
    };
  }

  if (typeof originalSaveCareers === "function") {
    window.saveCareers = function saveCareersWithMigrations(careers, options = {}) {
      return originalSaveCareers(migrateCareers(careers).careers, options);
    };
  }

  if (typeof originalRepairCareerIfNeeded === "function") {
    window.repairCareerIfNeeded = function repairCareerWithMigrations(career) {
      const before = migrateCareerSave(career);
      const repaired = originalRepairCareerIfNeeded(before.career);
      const after = migrateCareerSave(repaired.career);
      return { career: after.career, changed: Boolean(before.changed || repaired.changed || after.changed) };
    };
  }
})();
