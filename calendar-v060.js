const CALENDAR_VERSION = "v0_6";
let selectedCalendarMatchday = 1;

function getCareerClubId(career) {
  return career && career.club ? career.club.id : null;
}

function getClubNameById(career, clubId) {
  const club = career && Array.isArray(career.clubs)
    ? career.clubs.find((item) => item.id === clubId)
    : null;
  return club ? club.name : "Club inconnu";
}

function getUserMatchVenue(match, clubId) {
  if (!match || !clubId) return "—";
  if (match.homeClubId === clubId) return "Domicile";
  if (match.awayClubId === clubId) return "Extérieur";
  return "—";
}

function getUserMatchVenueClass(match, clubId) {
  if (!match || !clubId) return "neutral";
  if (match.homeClubId === clubId) return "home";
  if (match.awayClubId === clubId) return "away";
  return "neutral";
}

function createFixtureId(matchday, index, homeId, awayId) {
  return "md" + matchday + "_" + index + "_" + homeId + "_" + awayId;
}

function createRoundRobinFixtures(teams) {
  const clubs = Array.isArray(teams) ? teams.slice() : [];
  if (clubs.length < 2) return [];

  const hasBye = clubs.length % 2 !== 0;
  if (hasBye) clubs.push({ id: "bye", name: "Exempt" });

  let rotating = clubs.slice();
  const firstLeg = [];
  const roundsCount = rotating.length - 1;
  const matchesPerRound = rotating.length / 2;

  for (let roundIndex = 0; roundIndex < roundsCount; roundIndex += 1) {
    const matchday = roundIndex + 1;
    const roundMatches = [];

    for (let pairIndex = 0; pairIndex < matchesPerRound; pairIndex += 1) {
      const teamA = rotating[pairIndex];
      const teamB = rotating[rotating.length - 1 - pairIndex];
      if (!teamA || !teamB || teamA.id === "bye" || teamB.id === "bye") continue;

      const shouldInvert = (roundIndex + pairIndex) % 2 === 1;
      const home = shouldInvert ? teamB : teamA;
      const away = shouldInvert ? teamA : teamB;

      roundMatches.push({
        id: createFixtureId(matchday, pairIndex + 1, home.id, away.id),
        matchday,
        homeClubId: home.id,
        awayClubId: away.id,
        homeClubName: home.name,
        awayClubName: away.name,
        status: "scheduled",
        played: false,
        homeGoals: null,
        awayGoals: null
      });
    }

    firstLeg.push(...roundMatches);

    const fixed = rotating[0];
    const rest = rotating.slice(1);
    rest.unshift(rest.pop());
    rotating = [fixed].concat(rest);
  }

  const secondLeg = firstLeg.map((match, index) => {
    const matchday = match.matchday + roundsCount;
    return {
      id: createFixtureId(matchday, index + 1, match.awayClubId, match.homeClubId),
      matchday,
      homeClubId: match.awayClubId,
      awayClubId: match.homeClubId,
      homeClubName: match.awayClubName,
      awayClubName: match.homeClubName,
      status: "scheduled",
      played: false,
      homeGoals: null,
      awayGoals: null
    };
  });

  return firstLeg.concat(secondLeg);
}

function isCalendarComplete(career) {
  if (!career || !Array.isArray(career.clubs) || career.clubs.length < 2) return false;
  const expectedMatches = (career.clubs.length / 2) * ((career.clubs.length - 1) * 2);
  return Array.isArray(career.fixtures)
    && career.fixtures.length === expectedMatches
    && career.calendarVersion === CALENDAR_VERSION;
}

function getNextCareerMatch(career) {
  const clubId = getCareerClubId(career);
  if (!clubId || !Array.isArray(career?.fixtures)) return null;

  return career.fixtures.find((match) => {
    const involvesClub = match.homeClubId === clubId || match.awayClubId === clubId;
    return involvesClub && !match.played && match.status !== "played";
  }) || null;
}

function getMatchLabel(match) {
  if (!match) return "—";
  return match.homeClubName + " vs " + match.awayClubName;
}

function getUserMatchLabel(match, clubId) {
  if (!match) return "—";
  const venue = getUserMatchVenue(match, clubId);
  return venue !== "—" ? venue + " · " + getMatchLabel(match) : getMatchLabel(match);
}

function renderVenuePill(match, clubId) {
  const venue = getUserMatchVenue(match, clubId);
  const className = getUserMatchVenueClass(match, clubId);
  if (venue === "—") return "";
  return `<span class="calendar-venue-pill ${className}">${venue}</span>`;
}

function persistCalendarCareer(career) {
  if (!career || typeof loadCareers !== "function" || typeof saveCareers !== "function") return;
  const careers = loadCareers();
  const index = careers.findIndex((item) => item.id === career.id);
  if (index === -1) return;
  careers[index] = career;
  saveCareers(careers, { silent: true });
}

function ensureCareerCalendar(career) {
  if (!career || !Array.isArray(career.clubs) || career.clubs.length < 2) return career;

  let changed = false;
  if (!isCalendarComplete(career)) {
    career.fixtures = createRoundRobinFixtures(career.clubs);
    career.calendarVersion = CALENDAR_VERSION;
    changed = true;
  }

  const nextMatch = getNextCareerMatch(career);
  const nextMatchLabel = getMatchLabel(nextMatch);
  if (nextMatch && career.nextMatch !== nextMatchLabel) {
    career.nextMatch = nextMatchLabel;
    career.nextMatchday = nextMatch.matchday;
    changed = true;
  }

  if (changed) {
    career.updatedAt = new Date().toISOString();
    persistCalendarCareer(career);
  }

  return career;
}

function updateCalendarDashboard(career) {
  if (!career) return;
  const clubId = getCareerClubId(career);
  const nextMatch = getNextCareerMatch(career);
  const nextLabel = getUserMatchLabel(nextMatch, clubId);
  if (typeof setText === "function") {
    setText("kpi-next-match", nextLabel);
    setText("match-preview-title", getMatchLabel(nextMatch));
    setText("dashboard-description", "Manager : " + safeText(career.managerName) + " · " + safeText(career.league?.name, "Premier League") + " · Journée " + safeText(nextMatch?.matchday, career.matchday || 1) + " · " + safeText(getUserMatchVenue(nextMatch, clubId), "Match à venir"));
  }

  const statusPanels = document.querySelectorAll("#dashboard .panel h3");
  if (statusPanels[0]) statusPanels[0].textContent = "Statut V0.7.1";
  const firstPanelText = document.querySelector("#dashboard .panel p");
  if (firstPanelText) firstPanelText.textContent = "La carrière possède un calendrier complet de 38 journées, avec indication domicile/extérieur.";

  if (statusPanels[1]) statusPanels[1].textContent = "Prochaine évolution";
  const panelTexts = document.querySelectorAll("#dashboard .panel p");
  if (panelTexts[1]) panelTexts[1].textContent = "V0.8 : lancer la première simulation simple et enregistrer le résultat du match.";
}

function getMatchdayMatches(career, matchday) {
  if (!career || !Array.isArray(career.fixtures)) return [];
  return career.fixtures.filter((match) => match.matchday === matchday);
}

function renderCalendarV060(career) {
  const screen = document.getElementById("calendar");
  if (!screen) return;

  if (!career) {
    screen.innerHTML = `
      <div class="section-header"><h3>Calendrier</h3><p>Aucune carrière active.</p></div>
      <div class="empty-state compact-empty"><span>📅</span><h4>Aucun calendrier</h4><p>Charge une carrière ou crée une nouvelle partie.</p></div>
    `;
    return;
  }

  ensureCareerCalendar(career);
  const fixtures = Array.isArray(career.fixtures) ? career.fixtures : [];
  const maxMatchday = Math.max(1, ...fixtures.map((match) => Number(match.matchday) || 1));
  selectedCalendarMatchday = Math.max(1, Math.min(selectedCalendarMatchday || career.nextMatchday || 1, maxMatchday));

  const clubId = getCareerClubId(career);
  const matches = getMatchdayMatches(career, selectedCalendarMatchday);
  const userMatch = matches.find((match) => match.homeClubId === clubId || match.awayClubId === clubId);
  const nextMatch = getNextCareerMatch(career);

  screen.innerHTML = `
    <div class="section-header section-header-row calendar-topbar">
      <div>
        <h3>Calendrier</h3>
        <p>Premier League ${escapeHtml(career.season || "2025/2026")} · 38 journées générées automatiquement · domicile/extérieur visible pour ton club.</p>
      </div>
      <div class="calendar-actions">
        <button class="secondary-btn" id="calendar-prev-day" type="button">← Journée précédente</button>
        <button class="primary-btn" id="calendar-next-match" type="button">Prochain match</button>
        <button class="secondary-btn" id="calendar-next-day" type="button">Journée suivante →</button>
      </div>
    </div>

    <div class="calendar-kpis kpi-grid">
      <article class="kpi-card"><p>Journée affichée</p><strong>${selectedCalendarMatchday}/38</strong></article>
      <article class="kpi-card"><p>Lieu de ton match</p><strong>${escapeHtml(userMatch ? getUserMatchVenue(userMatch, clubId) : "Repos")}</strong></article>
      <article class="kpi-card"><p>Prochain match</p><strong>${escapeHtml(getUserMatchLabel(nextMatch, clubId))}</strong></article>
      <article class="kpi-card"><p>Matchs journée</p><strong>${matches.length}</strong></article>
    </div>

    <div class="calendar-layout">
      <article class="panel calendar-main-card">
        <div class="calendar-day-header">
          <div>
            <p class="eyebrow">Journée ${selectedCalendarMatchday}</p>
            <h3>${escapeHtml(userMatch ? getMatchLabel(userMatch) : "Aucun match pour ton club")}</h3>
            <div class="calendar-user-venue">${userMatch ? renderVenuePill(userMatch, clubId) : `<span class="calendar-venue-pill neutral">Repos</span>`}</div>
          </div>
          <span class="status-pill">À venir</span>
        </div>
        <div class="calendar-match-list">
          ${matches.map((match) => {
            const isUserMatch = match.homeClubId === clubId || match.awayClubId === clubId;
            return `
              <div class="calendar-match-row${isUserMatch ? " user-match" : ""}">
                <span class="calendar-club home">${escapeHtml(match.homeClubName)}</span>
                <span class="calendar-versus">vs</span>
                <span class="calendar-club away">${escapeHtml(match.awayClubName)}</span>
                <span class="calendar-status-stack">
                  ${isUserMatch ? renderVenuePill(match, clubId) : ""}
                  <span class="calendar-status">${match.played ? "Joué" : "À venir"}</span>
                </span>
              </div>
            `;
          }).join("")}
        </div>
      </article>

      <aside class="panel calendar-side-card">
        <h3>Tes 5 prochains matchs</h3>
        <div class="calendar-next-list">
          ${fixtures.filter((match) => (match.homeClubId === clubId || match.awayClubId === clubId) && !match.played).slice(0, 5).map((match) => `
            <button type="button" class="calendar-next-item" data-calendar-day="${match.matchday}">
              <span>J${match.matchday}</span>
              <strong><em class="calendar-next-venue ${getUserMatchVenueClass(match, clubId)}">${escapeHtml(getUserMatchVenue(match, clubId))}</em>${escapeHtml(getMatchLabel(match))}</strong>
            </button>
          `).join("")}
        </div>
      </aside>
    </div>
  `;

  bindCalendarControls(career, maxMatchday, nextMatch);
}

function bindCalendarControls(career, maxMatchday, nextMatch) {
  const prev = document.getElementById("calendar-prev-day");
  const next = document.getElementById("calendar-next-day");
  const nextMatchButton = document.getElementById("calendar-next-match");
  const screen = document.getElementById("calendar");

  if (prev) prev.disabled = selectedCalendarMatchday <= 1;
  if (next) next.disabled = selectedCalendarMatchday >= maxMatchday;

  if (prev) prev.addEventListener("click", () => {
    selectedCalendarMatchday = Math.max(1, selectedCalendarMatchday - 1);
    renderCalendarV060(career);
  });

  if (next) next.addEventListener("click", () => {
    selectedCalendarMatchday = Math.min(maxMatchday, selectedCalendarMatchday + 1);
    renderCalendarV060(career);
  });

  if (nextMatchButton) nextMatchButton.addEventListener("click", () => {
    selectedCalendarMatchday = nextMatch ? nextMatch.matchday : 1;
    renderCalendarV060(career);
  });

  if (screen) {
    screen.querySelectorAll("[data-calendar-day]").forEach((button) => {
      button.addEventListener("click", () => {
        selectedCalendarMatchday = Number(button.dataset.calendarDay) || selectedCalendarMatchday;
        renderCalendarV060(career);
      });
    });
  }
}

(function initCalendarModule() {
  const originalRefreshUI = typeof refreshUI === "function" ? refreshUI : null;

  refreshUI = function refreshUIV060() {
    let career = typeof getResolvedCareer === "function" ? getResolvedCareer() : null;
    if (career) career = ensureCareerCalendar(career);

    if (originalRefreshUI) originalRefreshUI();

    const freshCareer = typeof getResolvedCareer === "function" ? getResolvedCareer() : career;
    if (freshCareer) updateCalendarDashboard(freshCareer);
    renderCalendarV060(freshCareer);
  };

  document.addEventListener("DOMContentLoaded", () => {
    const career = typeof getResolvedCareer === "function" ? getResolvedCareer() : null;
    if (career) {
      ensureCareerCalendar(career);
      updateCalendarDashboard(career);
    }
    renderCalendarV060(career);
  });
})();