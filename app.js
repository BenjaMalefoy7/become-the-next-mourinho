const STORAGE_KEYS = {
  careers: "btm_careers_v02",
  activeCareerId: "btm_active_career_id_v02"
};

const APP_VERSION = "0.4.4";
const DATA_SCHEMA_VERSION = "premier_league_2025_2026_v0_4_4";

const screenTitles = {
  dashboard: "Dashboard",
  squad: "Effectif",
  lineup: "Composition",
  calendar: "Calendrier",
  standings: "Classement",
  match: "Match",
  transfers: "Recrutement",
  finances: "Finances",
  training: "Entraînement"
};

const POSITION_ORDER = ["GK", "DD", "DC", "DG", "MDC", "MC", "MOC", "AD", "AG", "BU"];
const SQUAD_TEMPLATE = [
  "GK", "GK", "GK",
  "DD", "DD", "DC", "DC", "DC", "DC", "DG", "DG",
  "MDC", "MDC", "MC", "MC", "MC", "MC", "MOC",
  "AD", "AD", "AG", "AG", "BU", "BU"
];

const FIRST_NAMES = [
  "Alex", "Noah", "Liam", "Ethan", "Milo", "Lucas", "Nolan", "Isaac", "Oscar", "Aaron",
  "Rayan", "Enzo", "Hugo", "Leo", "Sacha", "Adam", "Ilyes", "Max", "Evan", "Jules",
  "Theo", "Kylian", "Nathan", "Elias", "Tom", "Yanis", "Sam", "Victor", "Mason", "Logan"
];

const LAST_NAMES = [
  "Carter", "Bennett", "Foster", "Hayes", "Morgan", "Reed", "Coleman", "Brooks", "Turner", "Warren",
  "Mercier", "Lemoine", "Moreau", "Rousseau", "Dubois", "Bernard", "Laurent", "Garcia", "Martins", "Costa",
  "Diallo", "Traore", "Mensah", "Okafor", "Silva", "Kovacs", "Petrov", "Novak", "Santos", "Mendes"
];

const NATIONALITIES = [
  "Angleterre", "France", "Belgique", "Pays-Bas", "Espagne", "Portugal", "Italie", "Allemagne",
  "Brésil", "Argentine", "Sénégal", "Côte d’Ivoire", "Ghana", "Maroc", "Croatie", "Danemark"
];

function safeText(value, fallback = "—") {
  return value === undefined || value === null || value === "" ? fallback : String(value);
}

function setText(id, value) {
  const node = document.getElementById(id);
  if (node) node.textContent = safeText(value);
}

function formatMoney(value) {
  if (typeof value !== "number" || Number.isNaN(value)) return "—";
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0
  }).format(value);
}

function formatDate(value) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat("fr-FR", {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(date);
}

function createId(prefix) {
  return prefix + "_" + Date.now() + "_" + Math.random().toString(16).slice(2);
}

function slugify(value) {
  return String(value || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_|_$/g, "");
}

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function getDifficultyLabel(value) {
  return {
    outsider: "Petit club outsider",
    ambitious: "Club ambitieux",
    giant: "Nouveau géant"
  }[value] || value || "—";
}

function getSquadSourceLabel(value) {
  return {
    generated: "Effectif neuf généré",
    replaced_club: "Effectif du club remplacé"
  }[value] || "Effectif neuf généré";
}

function getDifficultySettings(value) {
  const settings = {
    outsider: {
      startMoney: 25000000,
      transferBudget: 12000000,
      objective: "Maintien",
      squadLevel: "Faible / moyen",
      reputation: 62,
      clubBudget: 35000000,
      overallMin: 58,
      overallMax: 72,
      potentialBonusMin: 1,
      potentialBonusMax: 8,
      ageMin: 18,
      ageMax: 34
    },
    ambitious: {
      startMoney: 85000000,
      transferBudget: 45000000,
      objective: "Top 10 / Top 8",
      squadLevel: "Correct / ambitieux",
      reputation: 74,
      clubBudget: 90000000,
      overallMin: 65,
      overallMax: 80,
      potentialBonusMin: 1,
      potentialBonusMax: 7,
      ageMin: 19,
      ageMax: 33
    },
    giant: {
      startMoney: 220000000,
      transferBudget: 140000000,
      objective: "Top 4 / Titre",
      squadLevel: "Très fort",
      reputation: 88,
      clubBudget: 220000000,
      overallMin: 75,
      overallMax: 88,
      potentialBonusMin: 0,
      potentialBonusMax: 5,
      ageMin: 20,
      ageMax: 32
    }
  };

  return settings[value] || settings.ambitious;
}

function getPremierLeague() {
  return typeof PREMIER_LEAGUE !== "undefined" ? PREMIER_LEAGUE : {
    id: "premier_league_2025_2026",
    name: "Premier League",
    country: "England",
    season: "2025/2026",
    teamsCount: 20,
    matchdays: 38,
    matchesPerTeam: 38,
    pointsWin: 3,
    pointsDraw: 1,
    pointsLoss: 0
  };
}

function getPremierLeagueClubs() {
  return Array.isArray(PREMIER_LEAGUE_CLUBS) ? PREMIER_LEAGUE_CLUBS : [];
}

function getExpectedTeamsCount() {
  const league = getPremierLeague();
  return Number(league.teamsCount) || getPremierLeagueClubs().length || 20;
}

function getClubById(clubId) {
  return getPremierLeagueClubs().find((club) => club.id === clubId) || null;
}

function getPositionLabel(position) {
  if (typeof POSITION_LABELS !== "undefined" && POSITION_LABELS[position]) return POSITION_LABELS[position];
  return position;
}

function getSecondaryPositions(position) {
  const map = {
    GK: [],
    DC: ["DD", "DG"],
    DD: ["DC", "MDC"],
    DG: ["DC", "MDC"],
    MDC: ["MC", "DC"],
    MC: ["MDC", "MOC"],
    MOC: ["MC", "AG"],
    AG: ["AD", "MOC"],
    AD: ["AG", "MOC"],
    BU: ["AG", "AD"]
  };
  return map[position] || [];
}

function createPlayerName(index) {
  const firstName = FIRST_NAMES[(index + randomInt(0, FIRST_NAMES.length - 1)) % FIRST_NAMES.length];
  const lastName = LAST_NAMES[(index * 3 + randomInt(0, LAST_NAMES.length - 1)) % LAST_NAMES.length];
  return firstName + " " + lastName;
}

function createPlayerStats(position, overall) {
  const profile = {
    GK: { attack: -24, defense: 14, physical: 2, mental: 5 },
    DC: { attack: -12, defense: 12, physical: 8, mental: 3 },
    DD: { attack: -4, defense: 7, physical: 7, mental: 2 },
    DG: { attack: -4, defense: 7, physical: 7, mental: 2 },
    MDC: { attack: -4, defense: 8, physical: 5, mental: 5 },
    MC: { attack: 2, defense: 2, physical: 3, mental: 7 },
    MOC: { attack: 9, defense: -6, physical: 0, mental: 7 },
    AG: { attack: 10, defense: -8, physical: 6, mental: 2 },
    AD: { attack: 10, defense: -8, physical: 6, mental: 2 },
    BU: { attack: 13, defense: -12, physical: 5, mental: 3 }
  }[position] || { attack: 0, defense: 0, physical: 0, mental: 0 };

  return {
    attack: clamp(overall + profile.attack + randomInt(-3, 3), 35, 99),
    defense: clamp(overall + profile.defense + randomInt(-3, 3), 35, 99),
    physical: clamp(overall + profile.physical + randomInt(-4, 4), 35, 99),
    mental: clamp(overall + profile.mental + randomInt(-3, 4), 35, 99)
  };
}

function estimatePlayerValue(overall, potential, age) {
  const base = Math.pow(Math.max(1, overall - 48), 2) * 22000;
  const potentialBonus = Math.max(0, potential - overall) * 450000;
  const ageMultiplier = age <= 23 ? 1.18 : age >= 31 ? 0.72 : 1;
  return Math.round((base + potentialBonus) * ageMultiplier / 50000) * 50000;
}

function estimatePlayerSalary(value, overall) {
  const salary = value * 0.075 + overall * 4500;
  return Math.round(salary / 10000) * 10000;
}

function generateStartingSquad(club, difficulty) {
  const settings = getDifficultySettings(difficulty);
  const usedNames = new Set();

  return SQUAD_TEMPLATE.map((position, index) => {
    let name = createPlayerName(index);
    let guard = 0;

    while (usedNames.has(name) && guard < 10) {
      name = createPlayerName(index + guard + 1);
      guard += 1;
    }

    usedNames.add(name);

    const overall = randomInt(settings.overallMin, settings.overallMax);
    const potential = clamp(overall + randomInt(settings.potentialBonusMin, settings.potentialBonusMax), overall, 94);
    const age = randomInt(settings.ageMin, settings.ageMax);
    const stats = createPlayerStats(position, overall);
    const value = estimatePlayerValue(overall, potential, age);
    const salary = estimatePlayerSalary(value, overall);

    return {
      id: createId("player"),
      name,
      clubId: club.id,
      club: club.name,
      nationality: NATIONALITIES[randomInt(0, NATIONALITIES.length - 1)],
      age,
      primaryPosition: position,
      secondaryPositions: getSecondaryPositions(position),
      overall,
      attack: stats.attack,
      defense: stats.defense,
      physical: stats.physical,
      mental: stats.mental,
      potential,
      salary,
      value,
      contractYears: randomInt(1, 5),
      morale: "Normal",
      condition: 100,
      injuryStatus: "Disponible"
    };
  });
}

function calculateWageBill(players) {
  if (!Array.isArray(players)) return 0;
  return players.reduce((total, player) => total + (Number(player.salary) || 0), 0);
}

function getCareerWageBill(career) {
  if (!career || !career.finances) return calculateWageBill(career ? career.players : []);
  if (typeof career.finances.wageBill === "number") return career.finances.wageBill;
  if (typeof career.finances.wageBudget === "number") return career.finances.wageBudget;
  return calculateWageBill(career.players);
}

function sortPlayers(players) {
  return players.slice().sort((a, b) => {
    const aOrder = POSITION_ORDER.indexOf(a.primaryPosition);
    const bOrder = POSITION_ORDER.indexOf(b.primaryPosition);
    return (aOrder === -1 ? 99 : aOrder) - (bOrder === -1 ? 99 : bOrder) || (b.overall || 0) - (a.overall || 0);
  });
}

function createInitialStandings(teams) {
  return (Array.isArray(teams) ? teams : []).map((team) => ({
    clubId: team.id,
    club: team.name,
    played: 0,
    wins: 0,
    draws: 0,
    losses: 0,
    goalsFor: 0,
    goalsAgainst: 0,
    gd: 0,
    points: 0
  }));
}

function getReservedClubIds(replacedClubId) {
  return new Set(getPremierLeagueClubs()
    .filter((club) => club.id !== replacedClubId)
    .map((club) => club.id));
}

function makeUniqueCustomClubId(clubName, replacedClubId, currentId) {
  const reservedIds = getReservedClubIds(replacedClubId);
  const base = slugify(clubName) || "custom_club";

  if (currentId && !reservedIds.has(currentId)) return currentId;
  if (!reservedIds.has(base)) return base;

  let suffix = 1;
  let candidate = base + "_custom";
  while (reservedIds.has(candidate)) {
    candidate = base + "_custom_" + suffix;
    suffix += 1;
  }
  return candidate;
}

function createLeagueTeams(customClub, replacedClubId) {
  return getPremierLeagueClubs().map((club) => {
    if (club.id === replacedClubId) {
      return Object.assign({}, customClub, {
        replacedClubId: club.id,
        replacedClubName: club.name,
        isCustom: true
      });
    }
    return Object.assign({}, club, { isCustom: false });
  });
}

function getOpponents(career) {
  if (!career || !Array.isArray(career.clubs)) return [];
  return career.clubs.filter((team) => team.id !== career.club.id);
}

function getFirstOpponentName(careerOrTeams, clubId) {
  if (Array.isArray(careerOrTeams)) {
    const opponent = careerOrTeams.find((team) => team.id !== clubId);
    return opponent ? opponent.name : "Adversaire à définir";
  }

  const opponent = getOpponents(careerOrTeams)[0];
  return opponent ? opponent.name : "Adversaire à définir";
}

function readStorage(key) {
  try {
    return localStorage.getItem(key);
  } catch (error) {
    console.warn("Lecture localStorage impossible.", error);
    return null;
  }
}

function writeStorage(key, value, options = {}) {
  try {
    localStorage.setItem(key, value);
    return true;
  } catch (error) {
    console.warn("Écriture localStorage impossible.", error);
    if (!options.silent) {
      window.alert("Impossible d’enregistrer la sauvegarde dans ce navigateur. Le stockage local est peut-être bloqué ou plein.");
    }
    return false;
  }
}

function removeStorage(key) {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.warn("Suppression localStorage impossible.", error);
  }
}

function loadCareers() {
  try {
    const parsed = JSON.parse(readStorage(STORAGE_KEYS.careers));
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.warn("Impossible de lire les carrières.", error);
    return [];
  }
}

function saveCareers(careers, options = {}) {
  const value = JSON.stringify(Array.isArray(careers) ? careers : []);
  return writeStorage(STORAGE_KEYS.careers, value, options);
}

function getActiveCareerId() {
  return readStorage(STORAGE_KEYS.activeCareerId);
}

function setActiveCareerId(id) {
  if (!id) {
    removeStorage(STORAGE_KEYS.activeCareerId);
    return true;
  }
  return writeStorage(STORAGE_KEYS.activeCareerId, id, { silent: true });
}

function isValidCareer(career) {
  return Boolean(career && typeof career === "object" && career.id && career.club && career.club.name);
}

function getBestCareerFallback(careers) {
  const validCareers = (Array.isArray(careers) ? careers : []).filter(isValidCareer);
  if (!validCareers.length) return null;
  return validCareers.slice().sort((a, b) => new Date(b.updatedAt || b.createdAt || 0) - new Date(a.updatedAt || a.createdAt || 0))[0];
}

function repairCareerIfNeeded(career) {
  if (!isValidCareer(career)) return { career, changed: false };

  let changed = false;
  career.finances = career.finances || {};
  career.squadSource = career.squadSource || "generated";

  const oldClubId = career.club.id;
  const fixedClubId = makeUniqueCustomClubId(career.club.name, career.replacedClubId, oldClubId);
  if (fixedClubId !== oldClubId) {
    career.club.id = fixedClubId;
    if (Array.isArray(career.players)) {
      career.players.forEach((player) => {
        if (!player.clubId || player.clubId === oldClubId) player.clubId = fixedClubId;
        if (!player.club || player.club === career.club.name) player.club = career.club.name;
      });
    }
    if (Array.isArray(career.standings)) {
      career.standings.forEach((team) => {
        if (team.clubId === oldClubId) team.clubId = fixedClubId;
      });
    }
    changed = true;
  }

  const shouldUseGeneratedSquad = career.squadSource === "generated";
  const hasNoSquad = !Array.isArray(career.players) || career.players.length === 0;

  if (shouldUseGeneratedSquad && hasNoSquad) {
    career.players = generateStartingSquad(career.club, career.difficulty || "ambitious");
    changed = true;
  }

  if (!career.league && getPremierLeague()) {
    career.league = getPremierLeague();
    changed = true;
  }

  const expectedTeamsCount = getExpectedTeamsCount();
  if (!Array.isArray(career.clubs) || career.clubs.length !== expectedTeamsCount || !career.clubs.some((club) => club.id === career.club.id)) {
    career.clubs = createLeagueTeams(career.club, career.replacedClubId);
    changed = true;
  }

  if (!Array.isArray(career.standings) || !career.standings.length) {
    career.standings = createInitialStandings(career.clubs);
    changed = true;
  }

  const wageBill = calculateWageBill(career.players);
  if (career.finances.wageBill !== wageBill || career.finances.wageBudget !== wageBill) {
    career.finances.wageBill = wageBill;
    career.finances.wageBudget = wageBill;
    changed = true;
  }

  if (career.version !== APP_VERSION) {
    career.version = APP_VERSION;
    changed = true;
  }

  if (career.dataVersion !== DATA_SCHEMA_VERSION) {
    career.dataVersion = DATA_SCHEMA_VERSION;
    changed = true;
  }

  if (changed) career.updatedAt = new Date().toISOString();
  return { career, changed };
}

function getResolvedCareer() {
  const careers = loadCareers();

  if (!careers.length) {
    setActiveCareerId(null);
    return null;
  }

  let activeId = getActiveCareerId();
  let index = careers.findIndex((career) => career.id === activeId && isValidCareer(career));

  if (index === -1) {
    const fallback = getBestCareerFallback(careers);
    if (!fallback) {
      setActiveCareerId(null);
      return null;
    }
    activeId = fallback.id;
    setActiveCareerId(activeId);
    index = careers.findIndex((career) => career.id === activeId && isValidCareer(career));
  }

  if (index === -1) return null;

  const result = repairCareerIfNeeded(careers[index]);
  if (result.changed) {
    careers[index] = result.career;
    saveCareers(careers, { silent: true });
  }

  return result.career;
}

function getCareerToContinue() {
  return getResolvedCareer();
}

function closeCustomSelects(exceptElement) {
  document.querySelectorAll(".custom-select.open").forEach((select) => {
    if (select !== exceptElement) select.classList.remove("open");
  });
}

function setCustomSelectValue(selectId, value, label) {
  const select = document.getElementById(selectId);
  if (!select) return;

  const inputId = select.dataset.input;
  const hiddenInput = inputId ? document.getElementById(inputId) : null;
  const labelNode = select.querySelector("[data-selected-label]");
  const options = Array.from(select.querySelectorAll(".custom-select-option"));
  const matchedOption = options.find((option) => option.dataset.value === value);
  const finalValue = value || (matchedOption ? matchedOption.dataset.value : "");
  const finalLabel = label || (matchedOption ? matchedOption.dataset.label || matchedOption.textContent.trim() : finalValue);

  if (hiddenInput) hiddenInput.value = finalValue;
  if (labelNode) labelNode.textContent = finalLabel;

  options.forEach((option) => option.classList.toggle("active", option.dataset.value === finalValue));
}

function bindCustomSelects() {
  document.querySelectorAll(".custom-select").forEach((select) => {
    const trigger = select.querySelector(".custom-select-trigger");
    const menu = select.querySelector(".custom-select-menu");
    const inputId = select.dataset.input;
    const hiddenInput = inputId ? document.getElementById(inputId) : null;

    if (trigger) {
      trigger.addEventListener("click", (event) => {
        event.stopPropagation();
        const willOpen = !select.classList.contains("open");
        closeCustomSelects(select);
        select.classList.toggle("open", willOpen);
      });
    }

    if (menu) {
      menu.addEventListener("click", (event) => {
        const option = event.target.closest(".custom-select-option");
        if (!option) return;
        setCustomSelectValue(select.id, option.dataset.value, option.dataset.label || option.textContent.trim());
        select.classList.remove("open");
      });
    }

    const currentValue = hiddenInput ? hiddenInput.value : "";
    if (currentValue) setCustomSelectValue(select.id, currentValue);
  });

  document.addEventListener("click", () => closeCustomSelects(null));
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeCustomSelects(null);
  });
}

function populateReplacedClubs() {
  const select = document.getElementById("replaced-club-select");
  const menu = select ? select.querySelector(".custom-select-menu") : null;
  const clubs = getPremierLeagueClubs();
  if (!menu) return;

  menu.innerHTML = clubs.map((club) => `
    <button type="button" class="custom-select-option" data-value="${escapeHtml(club.id)}" data-label="${escapeHtml(club.name)}">${escapeHtml(club.name)}</button>
  `).join("");

  if (clubs.length) setCustomSelectValue("replaced-club-select", clubs[0].id, clubs[0].name);
}

function resetCareerFormVisualValues() {
  const firstClub = getPremierLeagueClubs()[0];
  setCustomSelectValue("club-badge-select", "🐉", "🐉 Dragon");
  setCustomSelectValue("difficulty-select", "ambitious", "Club ambitieux");
  if (firstClub) setCustomSelectValue("replaced-club-select", firstClub.id, firstClub.name);

  const primaryColor = document.getElementById("primary-color");
  const secondaryColor = document.getElementById("secondary-color");
  if (primaryColor) primaryColor.value = "#2ee987";
  if (secondaryColor) secondaryColor.value = "#ffffff";
}

function showMenuScreen(screenId) {
  document.querySelectorAll(".menu-screen").forEach((screen) => {
    screen.classList.toggle("app-hidden", screen.id !== screenId);
  });

  const appShell = document.getElementById("app-shell");
  if (appShell) appShell.classList.add("app-hidden");

  closeCustomSelects(null);
  updateWelcome();
  renderSaves();
}

function showWelcome() {
  showMenuScreen("welcome-screen");
}

function showCreateCareerMenu() {
  showMenuScreen("career-setup-screen");
}

function showSavesMenu() {
  showMenuScreen("saves-menu-screen");
}

function enterApp(screenId) {
  const career = getResolvedCareer();
  if (!career) {
    showSavesMenu();
    return;
  }

  document.querySelectorAll(".menu-screen").forEach((screen) => screen.classList.add("app-hidden"));

  const appShell = document.getElementById("app-shell");
  if (appShell) appShell.classList.remove("app-hidden");

  closeCustomSelects(null);
  showScreen(screenId || "dashboard");
}

function continueCareer() {
  const career = getCareerToContinue();
  if (!career) {
    showSavesMenu();
    return;
  }
  setActiveCareerId(career.id);
  enterApp("dashboard");
}

function updateWelcome() {
  const careers = loadCareers();
  const validCareers = careers.filter(isValidCareer);
  const career = getCareerToContinue();
  const status = document.getElementById("welcome-status");
  const continueButton = document.getElementById("welcome-continue-btn");

  if (continueButton) continueButton.disabled = validCareers.length === 0;
  if (!status) return;

  if (!career) {
    const invalidCount = careers.length - validCareers.length;
    status.textContent = invalidCount > 0
      ? "Aucune carrière valide à continuer. Certaines sauvegardes semblent corrompues."
      : "Aucune carrière sauvegardée. Lance une nouvelle partie pour commencer.";
    return;
  }

  status.textContent = "Dernière carrière : " + safeText(career.careerName) + " · " + safeText(career.club?.name) + " · " + getDifficultyLabel(career.difficulty);
}

function showScreen(screenId) {
  document.querySelectorAll(".screen").forEach((screen) => screen.classList.toggle("active", screen.id === screenId));
  document.querySelectorAll(".nav-btn").forEach((button) => button.classList.toggle("active", button.dataset.screen === screenId));

  const title = document.getElementById("page-title");
  if (title) title.textContent = screenTitles[screenId] || "Dashboard";

  refreshUI();
}

function updateDashboard(career = getResolvedCareer()) {
  if (!career) {
    setText("dashboard-title", "Aucune carrière active.");
    setText("dashboard-description", "Retourne à l’accueil pour lancer une nouvelle partie ou charger une sauvegarde.");
    setText("kpi-club", "Aucune carrière");
    setText("kpi-money", "—");
    setText("kpi-difficulty", "—");
    setText("kpi-next-match", "—");
    setText("finance-balance", "—");
    setText("finance-transfer-budget", "—");
    setText("finance-wage-bill", "—");
    updateDemoMatches(null);
    return;
  }

  const leagueName = career.league ? career.league.name : "Premier League";
  const teamsCount = Array.isArray(career.clubs) ? career.clubs.length : getExpectedTeamsCount();
  const replacedLabel = career.replacedClubName || career.replacedClub || "—";
  const playersCount = Array.isArray(career.players) ? career.players.length : 0;
  const wageBill = getCareerWageBill(career);

  setText("dashboard-title", career.club.name + " — Saison " + safeText(career.season, getPremierLeague().season));
  setText("dashboard-description", "Manager : " + safeText(career.managerName) + " · " + leagueName + " · " + teamsCount + " clubs · " + playersCount + " joueurs · Club remplacé : " + replacedLabel);
  setText("kpi-club", career.club.name);
  setText("kpi-money", formatMoney(career.finances?.transferBudget));
  setText("kpi-difficulty", getDifficultyLabel(career.difficulty));
  setText("kpi-next-match", career.nextMatch);
  setText("finance-balance", formatMoney(career.finances?.balance));
  setText("finance-transfer-budget", formatMoney(career.finances?.transferBudget));
  setText("finance-wage-bill", formatMoney(wageBill));

  const badge = document.getElementById("active-career-badge");
  if (badge) {
    badge.innerHTML = "<span>" + escapeHtml(career.club.shortName) + "</span><strong>" + escapeHtml(career.club.badge) + "</strong>";
    badge.style.background = career.club.primaryColor + "22";
    badge.style.borderColor = career.club.primaryColor + "55";
  }

  updateDemoMatches(career);
}

function updateDemoMatches(career) {
  const clubName = career && career.club ? career.club.name : "Ton club";
  const opponents = getOpponents(career);
  const opponentA = opponents[0]?.name || "Arsenal";
  const opponentB = opponents[1]?.name || "Liverpool";
  const opponentC = opponents[2]?.name || "Manchester City";

  setText("match-preview-title", clubName + " vs " + opponentA);
  setText("calendar-demo-match-1", clubName + " vs " + opponentA);
  setText("calendar-demo-match-2", opponentB + " vs " + clubName);
  setText("calendar-demo-match-3", clubName + " vs " + opponentC);
}

function renderPlayersPreview(career = getResolvedCareer()) {
  const container = document.getElementById("players-preview");
  if (!container) return;

  if (!career) {
    container.innerHTML = `
      <div class="empty-state compact-empty">
        <span>👥</span>
        <h4>Aucune carrière active</h4>
        <p>Retourne à l’accueil, crée une nouvelle partie ou charge une sauvegarde.</p>
      </div>
    `;
    return;
  }

  const players = Array.isArray(career.players) ? sortPlayers(career.players) : [];

  if (!players.length) {
    container.innerHTML = `
      <div class="empty-state compact-empty">
        <span>👥</span>
        <h4>Aucun effectif disponible</h4>
        <p>Cette sauvegarde utilise peut-être une option d’effectif qui n’est pas encore branchée.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = players.map((player) => {
    const secondary = Array.isArray(player.secondaryPositions) && player.secondaryPositions.length
      ? " · Sec. " + player.secondaryPositions.join("/")
      : "";

    return `
      <article class="player-card">
        <h4>${escapeHtml(player.name)}</h4>
        <p>${escapeHtml(career.club.name)} · ${escapeHtml(getPositionLabel(player.primaryPosition))}${secondary} · ${safeText(player.age)} ans · ${escapeHtml(player.nationality)}</p>
        <div class="stat-row">
          <span>OVR<br><strong>${safeText(player.overall)}</strong></span>
          <span>ATT<br><strong>${safeText(player.attack)}</strong></span>
          <span>DEF<br><strong>${safeText(player.defense)}</strong></span>
          <span>PHY<br><strong>${safeText(player.physical)}</strong></span>
          <span>POT<br><strong>${safeText(player.potential)}</strong></span>
        </div>
        <p class="save-meta">Valeur : ${formatMoney(player.value)} · Salaire : ${formatMoney(player.salary)} · Contrat : ${safeText(player.contractYears)} an(s) · ${escapeHtml(player.injuryStatus || "Disponible")}</p>
      </article>
    `;
  }).join("");
}

function renderStandingsPreview(career = getResolvedCareer()) {
  const tbody = document.getElementById("standings-preview");
  if (!tbody) return;

  const standings = career && Array.isArray(career.standings) ? career.standings : [];

  if (!standings.length) {
    tbody.innerHTML = "<tr><td colspan='8'>Aucun classement disponible.</td></tr>";
    return;
  }

  tbody.innerHTML = standings.map((team, index) => `
    <tr>
      <td>${index + 1}</td>
      <td>${escapeHtml(team.club)}</td>
      <td>${safeText(team.played, 0)}</td>
      <td>${safeText(team.wins, 0)}</td>
      <td>${safeText(team.draws, 0)}</td>
      <td>${safeText(team.losses, 0)}</td>
      <td>${safeText(team.gd, 0)}</td>
      <td>${safeText(team.points, 0)}</td>
    </tr>
  `).join("");
}

function renderSaves() {
  const container = document.getElementById("saves-list");
  if (!container) return;

  const careers = loadCareers();
  const activeId = getActiveCareerId();

  if (!careers.length) {
    container.innerHTML = `
      <div class="empty-state compact-empty">
        <span>💾</span>
        <h4>Aucune carrière sauvegardée</h4>
        <p>Crée ta première carrière depuis Nouvelle partie.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = careers.map((career) => {
    if (!isValidCareer(career)) {
      return `
        <article class="save-card broken-save">
          <div class="save-main">
            <div class="save-badge">⚠️</div>
            <div>
              <div class="save-title-row"><h4>Sauvegarde illisible</h4><span class='status-pill'>Corrompue</span></div>
              <p>Cette sauvegarde ne contient pas les données minimales du club.</p>
              <p class="save-meta">ID : ${escapeHtml(career?.id || "inconnu")}</p>
            </div>
          </div>
          <div class="save-actions">
            ${career?.id ? `<button class="danger-btn" data-delete-career="${escapeHtml(career.id)}">Supprimer</button>` : ""}
          </div>
        </article>
      `;
    }

    const activeClass = career.id === activeId ? " active-save" : "";
    const leagueName = career.league ? career.league.name : "Premier League";
    const teamsCount = Array.isArray(career.clubs) ? career.clubs.length : getExpectedTeamsCount();
    const playersCount = Array.isArray(career.players) ? career.players.length : 0;

    return `
      <article class="save-card${activeClass}">
        <div class="save-main">
          <div class="save-badge" style="background:${escapeHtml(career.club.primaryColor || "#2ee987")}22;border-color:${escapeHtml(career.club.primaryColor || "#2ee987")}66;">
            ${escapeHtml(career.club.badge || "⚽")}
          </div>
          <div>
            <div class="save-title-row">
              <h4>${escapeHtml(career.careerName)}</h4>
              ${career.id === activeId ? "<span class='status-pill'>Active</span>" : ""}
            </div>
            <p>${escapeHtml(career.club.name)} · ${escapeHtml(career.managerName)} · ${getDifficultyLabel(career.difficulty)}</p>
            <p class="save-meta">${escapeHtml(leagueName)} · ${teamsCount} clubs · ${playersCount} joueurs · ${getSquadSourceLabel(career.squadSource)} · Objectif : ${escapeHtml(career.objective)} · Dernière sauvegarde : ${formatDate(career.updatedAt)}</p>
          </div>
        </div>
        <div class="save-actions">
          <button class="secondary-btn" data-load-career="${escapeHtml(career.id)}">Charger</button>
          <button class="danger-btn" data-delete-career="${escapeHtml(career.id)}">Supprimer</button>
        </div>
      </article>
    `;
  }).join("");
}

function fillDemoCareer() {
  const fields = {
    "career-name": "Carrière Dragon FC",
    "manager-name": "Benjamin",
    "club-name": "Dragon FC",
    "club-short-name": "DFC"
  };

  Object.entries(fields).forEach(([id, value]) => {
    const node = document.getElementById(id);
    if (node) node.value = value;
  });

  setCustomSelectValue("club-badge-select", "🐉", "🐉 Dragon");
  setCustomSelectValue("difficulty-select", "ambitious", "Club ambitieux");

  const primary = document.getElementById("primary-color");
  const secondary = document.getElementById("secondary-color");
  if (primary) primary.value = "#2ee987";
  if (secondary) secondary.value = "#ffffff";
}

function createCareerFromForm(event) {
  event.preventDefault();

  const careerName = document.getElementById("career-name").value.trim();
  const managerName = document.getElementById("manager-name").value.trim();
  const clubName = document.getElementById("club-name").value.trim();
  const shortName = document.getElementById("club-short-name").value.trim().toUpperCase();
  const badge = document.getElementById("club-badge").value || "⚽";
  const replacedClubId = document.getElementById("replaced-club").value;
  const replacedClub = getClubById(replacedClubId);
  const difficulty = document.getElementById("difficulty").value || "ambitious";
  const squadSourceInput = document.querySelector('input[name="squadSource"]:checked');
  const squadSource = squadSourceInput ? squadSourceInput.value : "generated";
  const primaryColor = document.getElementById("primary-color").value;
  const secondaryColor = document.getElementById("secondary-color").value;
  const settings = getDifficultySettings(difficulty);
  const league = getPremierLeague();
  const now = new Date().toISOString();

  if (!careerName || !managerName || !clubName || !shortName) {
    window.alert("Remplis les champs obligatoires avant de créer la carrière.");
    return;
  }

  if (!replacedClub) {
    window.alert("Choisis le club de Premier League que ton club remplace.");
    return;
  }

  const customClub = {
    id: makeUniqueCustomClubId(clubName, replacedClubId),
    name: clubName,
    shortName,
    badge,
    country: "England",
    league: "Premier League",
    reputation: settings.reputation,
    budget: settings.clubBudget,
    primaryColor,
    secondaryColor,
    stadiumName: "Stade à définir",
    isCustom: true
  };

  const leagueTeams = createLeagueTeams(customClub, replacedClubId);
  const nextOpponentName = getFirstOpponentName(leagueTeams, customClub.id);
  const generatedPlayers = squadSource === "generated" ? generateStartingSquad(customClub, difficulty) : [];
  const wageBill = calculateWageBill(generatedPlayers);

  const career = {
    id: createId("career"),
    version: APP_VERSION,
    dataVersion: DATA_SCHEMA_VERSION,
    careerName,
    mode: "custom_club",
    managerName,
    season: league.season,
    matchday: 1,
    difficulty,
    objective: settings.objective,
    squadLevel: settings.squadLevel,
    squadSource,
    replacedClubId,
    replacedClubName: replacedClub.name,
    nextMatch: clubName + " vs " + nextOpponentName,
    league,
    clubs: leagueTeams,
    standings: createInitialStandings(leagueTeams),
    fixtures: [],
    players: generatedPlayers,
    club: customClub,
    finances: {
      balance: settings.startMoney,
      transferBudget: settings.transferBudget,
      wageBill,
      wageBudget: wageBill
    },
    createdAt: now,
    updatedAt: now
  };

  const careers = loadCareers();
  careers.unshift(career);
  if (!saveCareers(careers)) return;
  setActiveCareerId(career.id);

  document.getElementById("career-form").reset();
  resetCareerFormVisualValues();
  enterApp("dashboard");
}

function loadCareer(careerId) {
  const careers = loadCareers();
  const career = careers.find((item) => item.id === careerId);
  if (!isValidCareer(career)) {
    window.alert("Cette sauvegarde semble corrompue et ne peut pas être chargée.");
    renderSaves();
    return;
  }
  setActiveCareerId(careerId);
  enterApp("dashboard");
}

function deleteCareer(careerId) {
  const careers = loadCareers();
  const career = careers.find((item) => item.id === careerId);
  if (!career) return;

  const label = isValidCareer(career) ? career.careerName : "cette sauvegarde illisible";
  const confirmation = window.confirm("Supprimer la carrière '" + label + "' ?");
  if (!confirmation) return;

  const remainingCareers = careers.filter((item) => item.id !== careerId);
  if (!saveCareers(remainingCareers)) return;

  if (getActiveCareerId() === careerId) {
    const fallback = getBestCareerFallback(remainingCareers);
    setActiveCareerId(fallback ? fallback.id : null);
  }

  refreshUI();
}

function bindNavigation() {
  document.querySelectorAll(".nav-btn").forEach((button) => {
    button.addEventListener("click", () => showScreen(button.dataset.screen));
  });
}

function bindModeCards() {
  document.querySelectorAll(".mode-card input[type='radio']").forEach((radio) => {
    radio.addEventListener("change", () => {
      const name = radio.name;
      document.querySelectorAll(".mode-card input[name='" + name + "']").forEach((input) => {
        input.closest(".mode-card")?.classList.toggle("active", input.checked);
      });
    });
  });
}

function bindButtons() {
  const welcomeNewButton = document.getElementById("welcome-new-career-btn");
  const welcomeContinueButton = document.getElementById("welcome-continue-btn");
  const welcomeSavesButton = document.getElementById("welcome-saves-btn");
  const backFromCreateButton = document.getElementById("back-from-create-btn");
  const backFromSavesButton = document.getElementById("back-from-saves-btn");
  const homeButton = document.getElementById("home-btn");
  const createFromSavesButton = document.getElementById("create-from-saves-btn");
  const fillDemoButton = document.getElementById("fill-demo-career-btn");
  const careerForm = document.getElementById("career-form");
  const savesList = document.getElementById("saves-list");

  if (welcomeNewButton) welcomeNewButton.addEventListener("click", showCreateCareerMenu);
  if (welcomeContinueButton) welcomeContinueButton.addEventListener("click", continueCareer);
  if (welcomeSavesButton) welcomeSavesButton.addEventListener("click", showSavesMenu);
  if (backFromCreateButton) backFromCreateButton.addEventListener("click", showWelcome);
  if (backFromSavesButton) backFromSavesButton.addEventListener("click", showWelcome);
  if (homeButton) homeButton.addEventListener("click", showWelcome);
  if (createFromSavesButton) createFromSavesButton.addEventListener("click", showCreateCareerMenu);
  if (fillDemoButton) fillDemoButton.addEventListener("click", fillDemoCareer);
  if (careerForm) careerForm.addEventListener("submit", createCareerFromForm);

  if (savesList) {
    savesList.addEventListener("click", (event) => {
      const loadButton = event.target.closest("[data-load-career]");
      const deleteButton = event.target.closest("[data-delete-career]");
      if (loadButton) loadCareer(loadButton.dataset.loadCareer);
      if (deleteButton) deleteCareer(deleteButton.dataset.deleteCareer);
    });
  }
}

function refreshUI() {
  const career = getResolvedCareer();
  updateWelcome();
  updateDashboard(career);
  renderSaves();
  renderPlayersPreview(career);
  renderStandingsPreview(career);
}

function initApp() {
  populateReplacedClubs();
  bindNavigation();
  bindButtons();
  bindModeCards();
  bindCustomSelects();
  resetCareerFormVisualValues();
  refreshUI();
  showWelcome();
}

document.addEventListener("DOMContentLoaded", initApp);
