const BTM_UI_COMPAT_VERSION = "0.40C";

(function initUiCompat() {
  if (window.__BTM_UI_COMPAT_LOADED__) return;
  window.__BTM_UI_COMPAT_LOADED__ = true;

  const $ = (id) => document.getElementById(id);

  function setActive(id, active) {
    const node = $(id);
    if (node) node.classList.toggle("active", Boolean(active));
  }

  function showMenu(screenId) {
    setActive("start-screen", screenId === "start-screen");
    setActive("setup-screen", screenId === "setup-screen");
    setActive("load-screen", screenId === "load-screen");
    setActive("game-shell", false);
    if (screenId === "load-screen") renderSaveSlots();
  }

  function showGameScreen(screenId = "dashboard") {
    setActive("start-screen", false);
    setActive("setup-screen", false);
    setActive("load-screen", false);
    setActive("game-shell", true);

    document.querySelectorAll(".screen").forEach((screen) => {
      screen.classList.toggle("active", screen.id === screenId);
    });

    document.querySelectorAll(".nav-item").forEach((button) => {
      button.classList.toggle("active", button.dataset.screen === screenId);
    });

    const title = $("page-title");
    if (title && typeof screenTitles !== "undefined") title.textContent = screenTitles[screenId] || "Dashboard";
    if (typeof refreshUI === "function") refreshUI();
  }

  window.btmShowGameScreen = showGameScreen;
  window.btmShowMenuScreen = showMenu;

  function populateReplacementSelect() {
    const select = $("replace-club-select");
    if (!select || typeof getPremierLeagueClubs !== "function") return;

    const clubs = getPremierLeagueClubs();
    select.innerHTML = clubs.map((club) => `<option value="${escapeHtml(club.id)}">${escapeHtml(club.name)}</option>`).join("");
  }

  function renderSaveSlots() {
    const container = $("save-slots");
    if (!container || typeof loadCareers !== "function") return;

    const careers = loadCareers();
    const validCareers = careers.filter((career) => typeof isValidCareer === "function" ? isValidCareer(career) : career && career.id);

    if (!validCareers.length) {
      container.innerHTML = `<div class="empty-state compact-empty"><span>💾</span><h4>Aucune carrière sauvegardée</h4><p>Crée une carrière pour commencer.</p></div>`;
      return;
    }

    container.innerHTML = validCareers.map((career) => `
      <article class="save-card">
        <div class="save-main">
          <div class="save-badge">${escapeHtml(career.club?.badge || "⚽")}</div>
          <div>
            <h4>${escapeHtml(career.careerName || career.club?.name || "Carrière")}</h4>
            <p>${escapeHtml(career.club?.name || "Club")} · ${escapeHtml(career.managerName || "Manager")}</p>
          </div>
        </div>
        <div class="save-actions">
          <button class="secondary-btn" data-compat-load="${escapeHtml(career.id)}">Charger</button>
          <button class="danger-btn" data-compat-delete="${escapeHtml(career.id)}">Supprimer</button>
        </div>
      </article>
    `).join("");
  }

  window.btmRenderSaveSlots = renderSaveSlots;

  function persistCareer(career) {
    const careers = typeof loadCareers === "function" ? loadCareers() : [];
    careers.unshift(career);
    if (typeof saveCareers === "function" && !saveCareers(careers)) return false;
    if (typeof setActiveCareerId === "function") setActiveCareerId(career.id);
    return true;
  }

  function createCareerFromCurrentForm() {
    if (typeof getDifficultySettings !== "function" || typeof getPremierLeague !== "function") {
      window.alert("Le moteur de carrière n'est pas encore chargé.");
      return;
    }

    const clubName = ($("club-name-input")?.value || "").trim();
    const shortName = ($("club-short-input")?.value || "").trim().toUpperCase();
    const stadiumName = ($("stadium-input")?.value || "Stade à définir").trim();
    const replacedClubId = $("replace-club-select")?.value || getPremierLeagueClubs()[0]?.id;
    const difficulty = $("difficulty-select")?.value || "outsider";
    const replacedClub = typeof getClubById === "function" ? getClubById(replacedClubId) : null;

    if (!clubName || !shortName) {
      window.alert("Remplis au minimum le nom du club et le nom court.");
      return;
    }

    if (!replacedClub) {
      window.alert("Choisis le club remplacé.");
      return;
    }

    const settings = getDifficultySettings(difficulty);
    const league = getPremierLeague();
    const now = new Date().toISOString();
    const customClub = {
      id: typeof makeUniqueCustomClubId === "function" ? makeUniqueCustomClubId(clubName, replacedClubId) : clubName.toLowerCase().replace(/[^a-z0-9]+/g, "_"),
      name: clubName,
      shortName,
      badge: "⚽",
      country: "England",
      league: "Premier League",
      reputation: settings.reputation,
      budget: settings.clubBudget,
      primaryColor: "#2ee987",
      secondaryColor: "#ffffff",
      stadiumName,
      isCustom: true
    };

    const clubs = typeof createLeagueTeams === "function" ? createLeagueTeams(customClub, replacedClubId) : [customClub];
    const players = typeof generateStartingSquad === "function" ? generateStartingSquad(customClub, difficulty) : [];
    const wageBill = typeof calculateWageBill === "function" ? calculateWageBill(players) : 0;
    const nextOpponentName = typeof getFirstOpponentName === "function" ? getFirstOpponentName(clubs, customClub.id) : "Adversaire à définir";

    const career = {
      id: typeof createId === "function" ? createId("career") : "career_" + Date.now(),
      version: typeof APP_VERSION !== "undefined" ? APP_VERSION : "0.4.4",
      dataVersion: typeof DATA_SCHEMA_VERSION !== "undefined" ? DATA_SCHEMA_VERSION : "premier_league_2025_2026_v0_4_4",
      schemaVersion: window.BTM_CAREER_SCHEMA_VERSION || 37,
      careerName: "Carrière " + clubName,
      mode: "custom_club",
      managerName: "Manager",
      season: league.season,
      matchday: 1,
      difficulty,
      objective: settings.objective,
      squadLevel: settings.squadLevel,
      squadSource: "generated",
      replacedClubId,
      replacedClubName: replacedClub.name,
      nextMatch: clubName + " vs " + nextOpponentName,
      league,
      clubs,
      standings: typeof createInitialStandings === "function" ? createInitialStandings(clubs) : [],
      fixtures: [],
      players,
      club: customClub,
      finances: {
        balance: settings.startMoney,
        transferBudget: settings.transferBudget,
        wageBill,
        wageBudget: wageBill
      },
      mailbox: [],
      trainingFocus: {},
      lastMatchResult: null,
      createdAt: now,
      updatedAt: now
    };

    if (typeof window.btmMigrateCareerSave === "function") window.btmMigrateCareerSave(career);
    if (typeof window.ensureCareerCalendar === "function") window.ensureCareerCalendar(career);
    if (!persistCareer(career)) return;

    showGameScreen("dashboard");
  }

  function bindCompatControls() {
    populateReplacementSelect();

    $("new-career-btn")?.addEventListener("click", () => showMenu("setup-screen"));
    $("load-career-btn")?.addEventListener("click", () => showMenu("load-screen"));
    $("setup-back-btn")?.addEventListener("click", () => showMenu("start-screen"));
    $("load-back-btn")?.addEventListener("click", () => showMenu("start-screen"));
    $("create-career-btn")?.addEventListener("click", createCareerFromCurrentForm);
    $("home-btn")?.addEventListener("click", () => showMenu("start-screen"));

    const nav = document.querySelector(".nav");
    nav?.addEventListener("click", (event) => {
      const button = event.target.closest(".nav-item[data-screen]");
      if (button) showGameScreen(button.dataset.screen || "dashboard");
    });

    $("save-slots")?.addEventListener("click", (event) => {
      const loadButton = event.target.closest("[data-compat-load]");
      const deleteButton = event.target.closest("[data-compat-delete]");

      if (loadButton) {
        if (typeof setActiveCareerId === "function") setActiveCareerId(loadButton.dataset.compatLoad);
        showGameScreen("dashboard");
      }

      if (deleteButton && typeof loadCareers === "function" && typeof saveCareers === "function") {
        const id = deleteButton.dataset.compatDelete;
        const careers = loadCareers().filter((career) => career.id !== id);
        saveCareers(careers, { silent: true });
        renderSaveSlots();
      }
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    bindCompatControls();
    showMenu("start-screen");
  });
})();
