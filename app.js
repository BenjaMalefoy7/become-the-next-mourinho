const screenTitles = {
  dashboard: "Dashboard",
  saves: "Sauvegardes",
  club: "Club",
  squad: "Effectif",
  lineup: "Composition",
  calendar: "Calendrier",
  standings: "Classement",
  match: "Match",
  transfers: "Recrutement",
  finances: "Finances",
  training: "Entraînement"
};

function showScreen(screenId) {
  document.querySelectorAll(".screen").forEach(function(screen) {
    screen.classList.toggle("active", screen.id === screenId);
  });

  document.querySelectorAll(".nav-btn").forEach(function(button) {
    button.classList.toggle("active", button.dataset.screen === screenId);
  });

  document.getElementById("page-title").textContent = screenTitles[screenId] || "Dashboard";
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

  tbody.innerHTML = DEMO_STANDINGS.map(function(team, index) {
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

function bindNavigation() {
  document.querySelectorAll(".nav-btn").forEach(function(button) {
    button.addEventListener("click", function() {
      showScreen(button.dataset.screen);
    });
  });
}

function bindDemoButtons() {
  const newCareerButton = document.getElementById("new-career-btn");
  const resetDemoButton = document.getElementById("reset-demo-btn");

  if (newCareerButton) {
    newCareerButton.addEventListener("click", function() {
      showScreen("club");
    });
  }

  if (resetDemoButton) {
    resetDemoButton.addEventListener("click", function() {
      document.getElementById("kpi-club").textContent = "Aucune carrière";
      document.getElementById("kpi-money").textContent = "—";
      document.getElementById("kpi-position").textContent = "—";
      document.getElementById("kpi-next-match").textContent = "—";
      showScreen("dashboard");
    });
  }
}

function initApp() {
  bindNavigation();
  bindDemoButtons();
  renderPlayersPreview();
  renderStandingsPreview();
}

document.addEventListener("DOMContentLoaded", initApp);
