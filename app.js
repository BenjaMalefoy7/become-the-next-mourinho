const STORAGE_KEYS = {
  careers: "btm_careers_v02",
  activeCareerId: "btm_active_career_id_v02"
};

const APP_VERSION = "0.4";

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

function formatMoney(value) {
  if (typeof value !== "number") return "—";
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0
  }).format(value);
}

function formatDate(value) {
  if (!value) return "—";
  return new Intl.DateTimeFormat("fr-FR", {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(new Date(value));
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
  return String(value || "")
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
  const labels = {
    outsider: "Petit club outsider",
    ambitious: "Club ambitieux",
    giant: "Nouveau géant"
  };
  return labels[value] || value || "—";
}

function getSquadSourceLabel(value) {
  const labels = {
    generated: "Effectif neuf généré",
    replaced_club: "Effectif du club remplacé"
  };
  return labels[value] || labels.generated;
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

function getPremierLeagueClubs() {
  return Array.isArray(PREMIER_LEAGUE_CLUBS) ? PREMIER_LEAGUE_CLUBS : [];
}

function getClubById(clubId) {
  return getPremierLeagueClubs().find(function(club) {
    return club.id === clubId;
  }) || null;
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

function getPositionLabel(position) {
  if (Array.isArray(FOOTBALL_POSITIONS)) {
    const found = FOOTBALL_POSITIONS.find(function(item) {
      return item.id === position;
    });
    if (found) return found.label;
  }
  return position;
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

  return SQUAD_TEMPLATE.map(function(position, index) {
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
      name: name,
      clubId: club.id,
      club: club.name,
      nationality: NATIONALITIES[randomInt(0, NATIONALITIES.length - 1)],
      age: age,
      primaryPosition: position,
      secondaryPositions: getSecondaryPositions(position),
      overall: overall,
      attack: stats.attack,
      defense: stats.defense,
      physical: stats.physical,
      mental: stats.mental,
      potential: potential,
      salary: salary,
      value: value,
      contractYears: randomInt(1, 5),
      morale: "Normal",
      condition: 100,
      injuryStatus: "Disponible"
    };
  });
}

function calculateWageBill(players) {
  if (!Array.isArray(players)) return 0;
  return players.reduce(function(total, player) {
    return total + (Number(player.salary) || 0);
  }, 0);
}

function sortPlayers(players) {
  return players.slice().sort(function(a, b) {
    const aOrder = POSITION_ORDER.indexOf(a.primaryPosition);
    const bOrder = POSITION_ORDER.indexOf(b.primaryPosition);
    return (aOrder === -1 ? 99 : aOrder) - (bOrder === -1 ? 99 : bOrder) || b.overall - a.overall;
  });
}

function createInitialStandings(teams) {
  return teams.map(function(team) {
    return {
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
    };
  });
}

function createLeagueTeams(customClub, replacedClubId) {
  return getPremierLeagueClubs().map(function(club) {
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

function getFirstOpponentName(teams, clubId) {
  const opponent = teams.find(function(team) {
    return team.id !== clubId;
  });
  return opponent ? opponent.name : "Adversaire à définir";
}

function loadCareers() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.careers)) || [];
  } catch (error) {
    console.warn("Impossible de lire les carrières.", error);
    return [];
  }
}

function saveCareers(careers) {
  localStorage.setItem(STORAGE_KEYS.careers, JSON.stringify(careers));
}

function getActiveCareerId() {
  return localStorage.getItem(STORAGE_KEYS.activeCareerId);
}

function setActiveCareerId(id) {
  if (!id) {
    localStorage.removeItem(STORAGE_KEYS.activeCareerId);
    return;
  }
  localStorage.setItem(STORAGE_KEYS.activeCareerId, id);
}

function getActiveCareer() {
  const careers = loadCareers();
  const activeId = getActiveCareerId();
  return careers.find(function(career) {
    return career.id === activeId;
  }) || null;
}

function getCareerToContinue() {
  const careers = loadCareers();
  const activeCareer = getActiveCareer();
  if (activeCareer) return activeCareer;
  return careers[0] || null;
}

function closeCustomSelects(exceptElement) {
  document.querySelectorAll(".custom-select.open").forEach(function(select) {
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
  const matchedOption = options.find(function(option) {
    return option.dataset.value === value;
  });

  const finalValue = value || (matchedOption ? matchedOption.dataset.value : "");
  const finalLabel = label || (matchedOption ? matchedOption.dataset.label || matchedOption.textContent.trim() : finalValue);

  if (hiddenInput) hiddenInput.value = finalValue;
  if (labelNode) labelNode.textContent = finalLabel;

  options.forEach(function(option) {
    option.classList.toggle("active", option.dataset.value === finalValue);
  });
}

function bindCustomSelects() {
  document.querySelectorAll(".custom-select").forEach(function(select) {
    const trigger = select.querySelector(".custom-select-trigger");
    const menu = select.querySelector(".custom-select-menu");
    const inputId = select.dataset.input;
    const hiddenInput = inputId ? document.getElementById(inputId) : null;

    if (trigger) {
      trigger.addEventListener("click", function(event) {
        event.stopPropagation();
        const willOpen = !select.classList.contains("open");
        closeCustomSelects(select);
        select.classList.toggle("open", willOpen);
      });
    }

    if (menu) {
      menu.addEventListener("click", function(event) {
        const option = event.target.closest(".custom-select-option");
        if (!option) return;

        setCustomSelectValue(select.id, option.dataset.value, option.dataset.label || option.textContent.trim());
        select.classList.remove("open");
      });
    }

    const currentValue = hiddenInput ? hiddenInput.value : "";
    if (currentValue) setCustomSelectValue(select.id, currentValue);
  });

  document.addEventListener("click", function() {
    closeCustomSelects(null);
  });

  document.addEventListener("keydown", function(event) {
    if (event.key === "Escape") closeCustomSelects(null);
  });
}

function populateReplacedClubs() {
  const select = document.getElementById("replaced-club-select");
  const menu = select ? select.querySelector(".custom-select-menu") : null;
  const clubs = getPremierLeagueClubs();

  if (!menu) return;

  menu.innerHTML = clubs.map(function(club) {
    return `<button type="button" class="custom-select-option" data-value="${escapeHtml(club.id)}" data-label="${escapeHtml(club.name)}">${escapeHtml(club.name)}</button>`;
  }).join("");

  if (clubs.length) {
    setCustomSelectValue("replaced-club-select", clubs[0].id, clubs[0].name);
  }
}

function resetCareerFormVisualValues() {
  const firstClub = getPremierLeagueClubs()[0];
  setCustomSelectValue("club-badge-select", "🐉", "🐉 Dragon");
  setCustomSelectValue("difficulty-select", "ambitious", "Club ambitieux");
  if (firstClub) setCustomSelectValue("replaced-club-select", firstClub.id, firstClub.name);
  document.getElementById("primary-color").value = "#2ee987";
  document.getElementById("secondary-color").value = "#ffffff";
}

function showMenuScreen(screenId) {
  document.querySelectorAll(".menu-screen").forEach(function(screen) {
    screen.classList.toggle("app-hidden", screen.id !== screenId);
  });

  const appShell = document.getElementById("app-shell");
  if (appShell) appShell.classList.add("app-hidden");

  closeCustomSelects(null);
  refreshUI();
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
  document.querySelectorAll(".menu-screen").forEach(function(screen) {
    screen.classList.add("app-hidden");
  });

  const appShell = document.getElementById("app-shell");
  if (appShell) appShell.classList.remove("app-hidden");

  closeCustomSelects(null);
  refreshUI();
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
  const career = getCareerToContinue();
  const status = document.getElementById("welcome-status");
  const continueButton = document.getElementById("welcome-continue-btn");

  if (continueButton) continueButton.disabled = careers.length === 0;
  if (!status) return;

  if (!career) {
    status.textContent = "Aucune carrière sauvegardée. Lance une nouvelle partie pour commencer.";
    return;
  }

  status.textContent = "Dernière carrière : " + career.careerName + " · " + career.club.name + " · " + getDifficultyLabel(career.difficulty);
}

function showScreen(screenId) {
  document.querySelectorAll(".screen").forEach(function(screen) {
    screen.classList.toggle("active", screen.id === screenId);
  });

  document.querySelectorAll(".nav-btn").forEach(function(button) {
    button.classList.toggle("active", button.dataset.screen === screenId);
  });

  const title = document.getElementById("page-title");
  if (title) title.textContent = screenTitles[screenId] || "Dashboard";
}

function updateDashboard() {
  const career = getActiveCareer();

  if (!career) {
    document.getElementById("dashboard-title").textContent = "Aucune carrière active.";
    document.getElementById("dashboard-description").textContent = "Retourne à l’accueil pour lancer une nouvelle partie ou charger une sauvegarde.";
    document.getElementById("active-career-badge").innerHTML = "<span>PL</span><strong>25/26</strong>";
    document.getElementById("active-career-badge").style.background = "rgba(46, 233, 135, 0.10)";
    document.getElementById("active-career-badge").style.borderColor = "rgba(46, 233, 135, 0.22)";
    document.getElementById("kpi-club").textContent = "Aucune carrière";
    document.getElementById("kpi-money").textContent = "—";
    document.getElementById("kpi-difficulty").textContent = "—";
    document.getElementById("kpi-next-match").textContent = "—";
    document.getElementById("finance-balance").textContent = "—";
    document.getElementById("finance-transfer-budget").textContent = "—";
    const wageBillNode = document.getElementById("finance-wage-bill");
    if (wageBillNode) wageBillNode.textContent = "—";
    updateDemoMatches("Ton club");
    return;
  }

  const leagueName = career.league ? career.league.name : "Premier League";
  const teamsCount = career.clubs ? career.clubs.length : 20;
  const replacedLabel = career.replacedClubName || career.replacedClub || "—";
  const playersCount = Array.isArray(career.players) ? career.players.length : 0;
  const wageBill = career.finances && career.finances.wageBudget ? career.finances.wageBudget : calculateWageBill(career.players);

  document.getElementById("dashboard-title").textContent = career.club.name + " — Saison " + career.season;
  document.getElementById("dashboard-description").textContent = "Manager : " + career.managerName + " · " + leagueName + " · " + teamsCount + " clubs · " + playersCount + " joueurs · Club remplacé : " + replacedLabel;
  document.getElementById("active-career-badge").innerHTML = "<span>" + escapeHtml(career.club.shortName) + "</span><strong>" + escapeHtml(career.club.badge) + "</strong>";
  document.getElementById("active-career-badge").style.background = career.club.primaryColor + "22";
  document.getElementById("active-career-badge").style.borderColor = career.club.primaryColor + "55";
  document.getElementById("kpi-club").textContent = career.club.name;
  document.getElementById("kpi-money").textContent = formatMoney(career.finances.transferBudget);
  document.getElementById("kpi-difficulty").textContent = getDifficultyLabel(career.difficulty);
  document.getElementById("kpi-next-match").textContent = career.nextMatch;
  document.getElementById("finance-balance").textContent = formatMoney(career.finances.balance);
  document.getElementById("finance-transfer-budget").textContent = formatMoney(career.finances.transferBudget);
  const wageBillNode = document.getElementById("finance-wage-bill");
  if (wageBillNode) wageBillNode.textContent = formatMoney(wageBill);
  updateDemoMatches(career.club.name);
}

function updateDemoMatches(clubName) {
  const safeClubName = clubName || "Ton club";
  const matchTitle = document.getElementById("match-preview-title");
  const calendarOne = document.getElementById("calendar-demo-match-1");
  const calendarTwo = document.getElementById("calendar-demo-match-2");
  const calendarThree = document.getElementById("calendar-demo-match-3");

  if (matchTitle) matchTitle.textContent = safeClubName + " vs Arsenal";
  if (calendarOne) calendarOne.textContent = safeClubName + " vs Arsenal";
  if (calendarTwo) calendarTwo.textContent = "Liverpool vs " + safeClubName;
  if (calendarThree) calendarThree.textContent = safeClubName + " vs Manchester City";
}

function renderPlayersPreview() {
  const container = document.getElementById("players-preview");
  if (!container) return;

  const activeCareer = getActiveCareer();
  const careerPlayers = activeCareer && Array.isArray(activeCareer.players) ? activeCareer.players : [];

  if (activeCareer && !careerPlayers.length) {
    container.innerHTML = `
      <div class="empty-state compact-empty">
        <span>👥</span>
        <h4>Aucun effectif sur cette sauvegarde</h4>
        <p>Cette carrière a probablement été créée avant la V0.4. Crée une nouvelle carrière pour générer un effectif de départ.</p>
      </div>
    `;
    return;
  }

  const players = careerPlayers.length ? sortPlayers(careerPlayers) : DEMO_PLAYERS;
  const clubName = activeCareer ? activeCareer.club.name : "Ton club";

  container.innerHTML = players.map(function(player) {
    const secondary = Array.isArray(player.secondaryPositions) && player.secondaryPositions.length
      ? " · Sec. " + player.secondaryPositions.join("/")
      : "";

    return `
      <article class="player-card">
        <h4>${escapeHtml(player.name)}</h4>
        <p>${escapeHtml(clubName)} · ${escapeHtml(getPositionLabel(player.primaryPosition))}${secondary} · ${player.age} ans · ${escapeHtml(player.nationality)}</p>
        <div class="stat-row">
          <span>OVR<br><strong>${player.overall}</strong></span>
          <span>ATT<br><strong>${player.attack}</strong></span>
          <span>DEF<br><strong>${player.defense}</strong></span>
          <span>PHY<br><strong>${player.physical}</strong></span>
          <span>POT<br><strong>${player.potential}</strong></span>
        </div>
        <p class="save-meta">Valeur : ${formatMoney(player.value)} · Salaire : ${formatMoney(player.salary)} · Contrat : ${player.contractYears} an(s) · ${escapeHtml(player.injuryStatus)}</p>
      </article>
    `;
  }).join("");
}

function renderStandingsPreview() {
  const tbody = document.getElementById("standings-preview");
  if (!tbody) return;

  const activeCareer = getActiveCareer();
  const standings = activeCareer && Array.isArray(activeCareer.standings)
    ? activeCareer.standings
    : DEMO_STANDINGS;

  tbody.innerHTML = standings.map(function(team, index) {
    return `
      <tr>
        <td>${index + 1}</td>
        <td>${escapeHtml(team.club)}</td>
        <td>${team.played}</td>
        <td>${team.wins}</td>
        <td>${team.draws}</td>
        <td>${team.losses}</td>
        <td>${team.gd}</td>
        <td>${team.points}</td>
      </tr>
    `;
  }).join("");
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

  container.innerHTML = careers.map(function(career) {
    const activeClass = career.id === activeId ? " active-save" : "";
    const leagueName = career.league ? career.league.name : "Premier League";
    const teamsCount = career.clubs ? career.clubs.length : 20;
    const playersCount = Array.isArray(career.players) ? career.players.length : 0;

    return `
      <article class="save-card${activeClass}">
        <div class="save-main">
          <div class="save-badge" style="background:${career.club.primaryColor}22;border-color:${career.club.primaryColor}66;">
            ${escapeHtml(career.club.badge)}
          </div>
          <div>
            <div class="save-title-row">
              <h4>${escapeHtml(career.careerName)}</h4>
              ${career.id === activeId ? "<span class='status-pill'>Active</span>" : ""}
            </div>
            <p>${escapeHtml(career.club.name)} · ${escapeHtml(career.managerName)} · ${getDifficultyLabel(career.difficulty)}</p>
            <p class="save-meta">${leagueName} · ${teamsCount} clubs · ${playersCount} joueurs · ${getSquadSourceLabel(career.squadSource)} · Objectif : ${career.objective} · Dernière sauvegarde : ${formatDate(career.updatedAt)}</p>
          </div>
        </div>
        <div class="save-actions">
          <button class="secondary-btn" data-load-career="${career.id}">Charger</button>
          <button class="danger-btn" data-delete-career="${career.id}">Supprimer</button>
        </div>
      </article>
    `;
  }).join("");
}

function fillDemoCareer() {
  document.getElementById("career-name").value = "Carrière Dragon FC";
  document.getElementById("manager-name").value = "Benjamin";
  document.getElementById("club-name").value = "Dragon FC";
  document.getElementById("club-short-name").value = "DFC";
  setCustomSelectValue("club-badge-select", "🐉", "🐉 Dragon");
  setCustomSelectValue("difficulty-select", "ambitious", "Club ambitieux");
  document.getElementById("primary-color").value = "#2ee987";
  document.getElementById("secondary-color").value = "#ffffff";
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
    id: slugify(clubName) || createId("custom_club"),
    name: clubName,
    shortName: shortName,
    badge: badge,
    country: "England",
    league: "Premier League",
    reputation: settings.reputation,
    budget: settings.clubBudget,
    primaryColor: primaryColor,
    secondaryColor: secondaryColor,
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
    dataVersion: "premier_league_2025_2026_v0_4",
    careerName: careerName,
    mode: "custom_club",
    managerName: managerName,
    season: PREMIER_LEAGUE.season,
    matchday: 1,
    difficulty: difficulty,
    objective: settings.objective,
    squadLevel: settings.squadLevel,
    squadSource: squadSource,
    replacedClubId: replacedClubId,
    replacedClubName: replacedClub.name,
    nextMatch: clubName + " vs " + nextOpponentName,
    league: PREMIER_LEAGUE,
    clubs: leagueTeams,
    standings: createInitialStandings(leagueTeams),
    fixtures: [],
    players: generatedPlayers,
    club: customClub,
    finances: {
      balance: settings.startMoney,
      transferBudget: settings.transferBudget,
      wageBudget: wageBill
    },
    createdAt: now,
    updatedAt: now
  };

  const careers = loadCareers();
  careers.unshift(career);
  saveCareers(careers);
  setActiveCareerId(career.id);

  document.getElementById("career-form").reset();
  resetCareerFormVisualValues();

  enterApp("dashboard");
}

function loadCareer(careerId) {
  setActiveCareerId(careerId);
  enterApp("dashboard");
}

function deleteCareer(careerId) {
  const career = loadCareers().find(function(item) {
    return item.id === careerId;
  });

  if (!career) return;

  const confirmation = window.confirm("Supprimer la carrière '" + career.careerName + "' ?");
  if (!confirmation) return;

  const remainingCareers = loadCareers().filter(function(item) {
    return item.id !== careerId;
  });

  saveCareers(remainingCareers);

  if (getActiveCareerId() === careerId) {
    setActiveCareerId(remainingCareers[0] ? remainingCareers[0].id : null);
  }

  refreshUI();
}

function bindNavigation() {
  document.querySelectorAll(".nav-btn").forEach(function(button) {
    button.addEventListener("click", function() {
      showScreen(button.dataset.screen);
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
    savesList.addEventListener("click", function(event) {
      const loadButton = event.target.closest("[data-load-career]");
      const deleteButton = event.target.closest("[data-delete-career]");

      if (loadButton) loadCareer(loadButton.dataset.loadCareer);
      if (deleteButton) deleteCareer(deleteButton.dataset.deleteCareer);
    });
  }
}

function refreshUI() {
  updateWelcome();
  updateDashboard();
  renderSaves();
  renderPlayersPreview();
  renderStandingsPreview();
}

function initApp() {
  populateReplacedClubs();
  bindNavigation();
  bindButtons();
  bindCustomSelects();
  refreshUI();
  showWelcome();
}

document.addEventListener("DOMContentLoaded", initApp);