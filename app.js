const STORAGE_KEYS = {
  careers: "btm_careers_v02",
  activeCareerId: "btm_active_career_id_v02"
};

const screenTitles = {
  dashboard: "Dashboard",
  saves: "Sauvegardes",
  club: "Nouvelle carrière",
  squad: "Effectif",
  lineup: "Composition",
  calendar: "Calendrier",
  standings: "Classement",
  match: "Match",
  transfers: "Recrutement",
  finances: "Finances",
  training: "Entraînement"
};

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

function getDifficultyLabel(value) {
  const labels = {
    outsider: "Petit club outsider",
    ambitious: "Club ambitieux",
    giant: "Nouveau géant"
  };
  return labels[value] || value || "—";
}

function getDifficultySettings(value) {
  const settings = {
    outsider: {
      startMoney: 25000000,
      transferBudget: 12000000,
      objective: "Maintien",
      squadLevel: "Faible / moyen"
    },
    ambitious: {
      startMoney: 85000000,
      transferBudget: 45000000,
      objective: "Top 10 / Top 8",
      squadLevel: "Correct / ambitieux"
    },
    giant: {
      startMoney: 220000000,
      transferBudget: 140000000,
      objective: "Top 4 / Titre",
      squadLevel: "Très fort"
    }
  };

  return settings[value] || settings.ambitious;
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

function showWelcome() {
  const welcomeScreen = document.getElementById("welcome-screen");
  const appShell = document.getElementById("app-shell");

  if (welcomeScreen) welcomeScreen.classList.remove("app-hidden");
  if (appShell) appShell.classList.add("app-hidden");

  updateWelcome();
}

function enterApp(screenId) {
  const welcomeScreen = document.getElementById("welcome-screen");
  const appShell = document.getElementById("app-shell");

  if (welcomeScreen) welcomeScreen.classList.add("app-hidden");
  if (appShell) appShell.classList.remove("app-hidden");

  refreshUI();
  showScreen(screenId || "dashboard");
}

function continueCareer() {
  const career = getCareerToContinue();

  if (!career) {
    enterApp("saves");
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

  if (continueButton) {
    continueButton.disabled = careers.length === 0;
  }

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

  document.getElementById("page-title").textContent = screenTitles[screenId] || "Dashboard";
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
    updateDemoMatches("Ton club");
    return;
  }

  document.getElementById("dashboard-title").textContent = career.club.name + " — Saison " + career.season;
  document.getElementById("dashboard-description").textContent = "Manager : " + career.managerName + " · Objectif : " + career.objective + " · Club remplacé : " + career.replacedClub;
  document.getElementById("active-career-badge").innerHTML = "<span>" + career.club.shortName + "</span><strong>" + career.club.badge + "</strong>";
  document.getElementById("active-career-badge").style.background = career.club.primaryColor + "22";
  document.getElementById("active-career-badge").style.borderColor = career.club.primaryColor + "55";
  document.getElementById("kpi-club").textContent = career.club.name;
  document.getElementById("kpi-money").textContent = formatMoney(career.finances.transferBudget);
  document.getElementById("kpi-difficulty").textContent = getDifficultyLabel(career.difficulty);
  document.getElementById("kpi-next-match").textContent = career.nextMatch;
  document.getElementById("finance-balance").textContent = formatMoney(career.finances.balance);
  document.getElementById("finance-transfer-budget").textContent = formatMoney(career.finances.transferBudget);
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

  container.innerHTML = DEMO_PLAYERS.map(function(player) {
    return `
      <article class="player-card">
        <h4>${player.name}</h4>
        <p>${player.primaryPosition} · ${player.age} ans · ${player.nationality}</p>
        <div class="stat-row">
          <span>OVR<br><strong>${player.overall}</strong></span>
          <span>ATT<br><strong>${player.attack}</strong></span>
          <span>DEF<br><strong>${player.defense}</strong></span>
          <span>PHY<br><strong>${player.physical}</strong></span>
          <span>POT<br><strong>${player.potential}</strong></span>
        </div>
      </article>
    `;
  }).join("");
}

function renderStandingsPreview() {
  const tbody = document.getElementById("standings-preview");
  if (!tbody) return;

  const activeCareer = getActiveCareer();
  const clubName = activeCareer ? activeCareer.club.name : "Ton club";

  const standings = DEMO_STANDINGS.map(function(team) {
    if (team.club === "Ton club") {
      return Object.assign({}, team, { club: clubName });
    }
    return team;
  });

  tbody.innerHTML = standings.map(function(team, index) {
    return `
      <tr>
        <td>${index + 1}</td>
        <td>${team.club}</td>
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
        <p>Crée ta première carrière depuis l’accueil ou via Nouvelle carrière.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = careers.map(function(career) {
    const activeClass = career.id === activeId ? " active-save" : "";
    return `
      <article class="save-card${activeClass}">
        <div class="save-main">
          <div class="save-badge" style="background:${career.club.primaryColor}22;border-color:${career.club.primaryColor}66;">
            ${career.club.badge}
          </div>
          <div>
            <div class="save-title-row">
              <h4>${career.careerName}</h4>
              ${career.id === activeId ? "<span class='status-pill'>Active</span>" : ""}
            </div>
            <p>${career.club.name} · ${career.managerName} · ${getDifficultyLabel(career.difficulty)}</p>
            <p class="save-meta">Objectif : ${career.objective} · Dernière sauvegarde : ${formatDate(career.updatedAt)}</p>
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

function populateReplacedClubs() {
  const select = document.getElementById("replaced-club");
  if (!select) return;

  select.innerHTML = PREMIER_LEAGUE_CLUBS.map(function(club) {
    return `<option value="${club}">${club}</option>`;
  }).join("");
}

function fillDemoCareer() {
  document.getElementById("career-name").value = "Carrière Dragon FC";
  document.getElementById("manager-name").value = "Benjamin";
  document.getElementById("club-name").value = "Dragon FC";
  document.getElementById("club-short-name").value = "DFC";
  document.getElementById("club-badge").value = "🐉";
  document.getElementById("difficulty").value = "ambitious";
  document.getElementById("primary-color").value = "#2ee987";
  document.getElementById("secondary-color").value = "#ffffff";
}

function createCareerFromForm(event) {
  event.preventDefault();

  const careerName = document.getElementById("career-name").value.trim();
  const managerName = document.getElementById("manager-name").value.trim();
  const clubName = document.getElementById("club-name").value.trim();
  const shortName = document.getElementById("club-short-name").value.trim().toUpperCase();
  const badge = document.getElementById("club-badge").value.trim() || "⚽";
  const replacedClub = document.getElementById("replaced-club").value;
  const difficulty = document.getElementById("difficulty").value;
  const primaryColor = document.getElementById("primary-color").value;
  const secondaryColor = document.getElementById("secondary-color").value;
  const settings = getDifficultySettings(difficulty);
  const now = new Date().toISOString();

  const career = {
    id: createId("career"),
    version: "0.2.1",
    careerName: careerName,
    mode: "custom_club",
    managerName: managerName,
    season: "2025/2026",
    matchday: 1,
    difficulty: difficulty,
    objective: settings.objective,
    squadLevel: settings.squadLevel,
    replacedClub: replacedClub,
    nextMatch: clubName + " vs Arsenal",
    club: {
      id: clubName.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_|_$/g, ""),
      name: clubName,
      shortName: shortName,
      badge: badge,
      country: "England",
      league: "Premier League",
      primaryColor: primaryColor,
      secondaryColor: secondaryColor,
      stadiumName: "Stade à définir"
    },
    finances: {
      balance: settings.startMoney,
      transferBudget: settings.transferBudget,
      wageBudget: 0
    },
    createdAt: now,
    updatedAt: now
  };

  const careers = loadCareers();
  careers.unshift(career);
  saveCareers(careers);
  setActiveCareerId(career.id);

  document.getElementById("career-form").reset();
  document.getElementById("primary-color").value = "#2ee987";
  document.getElementById("secondary-color").value = "#ffffff";

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
  const homeButton = document.getElementById("home-btn");
  const newCareerButton = document.getElementById("new-career-btn");
  const createFromSavesButton = document.getElementById("create-from-saves-btn");
  const goSavesButton = document.getElementById("go-saves-btn");
  const fillDemoButton = document.getElementById("fill-demo-career-btn");
  const careerForm = document.getElementById("career-form");
  const savesList = document.getElementById("saves-list");

  if (welcomeNewButton) welcomeNewButton.addEventListener("click", function() { enterApp("club"); });
  if (welcomeContinueButton) welcomeContinueButton.addEventListener("click", continueCareer);
  if (welcomeSavesButton) welcomeSavesButton.addEventListener("click", function() { enterApp("saves"); });
  if (homeButton) homeButton.addEventListener("click", showWelcome);
  if (newCareerButton) newCareerButton.addEventListener("click", function() { showScreen("club"); });
  if (createFromSavesButton) createFromSavesButton.addEventListener("click", function() { showScreen("club"); });
  if (goSavesButton) goSavesButton.addEventListener("click", function() { showScreen("saves"); });
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
  renderStandingsPreview();
}

function initApp() {
  populateReplacedClubs();
  bindNavigation();
  bindButtons();
  renderPlayersPreview();
  refreshUI();
  showWelcome();
}

document.addEventListener("DOMContentLoaded", initApp);
