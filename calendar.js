const CALENDAR_VERSION = "v0_6";
let selectedCalendarMatchday = 1;

const cHtml = (value) => typeof escapeHtml === "function" ? escapeHtml(value) : String(value ?? "");

function getCareerClubId(career) {
  return career && career.club ? career.club.id : null;
}

function getMatchLabel(match) {
  return match ? match.homeClubName + " vs " + match.awayClubName : "—";
}

function getUserMatchVenue(match, clubId) {
  if (!match || !clubId) return "—";
  return match.homeClubId === clubId ? "Domicile" : match.awayClubId === clubId ? "Extérieur" : "—";
}

function getUserMatchVenueClass(match, clubId) {
  const venue = getUserMatchVenue(match, clubId);
  return venue === "Domicile" ? "home" : venue === "Extérieur" ? "away" : "neutral";
}

function getUserMatchLabel(match, clubId) {
  if (!match) return "—";
  const venue = getUserMatchVenue(match, clubId);
  return venue !== "—" ? venue + " · " + getMatchLabel(match) : getMatchLabel(match);
}

function fixtureId(day, index, home, away) {
  return "md" + day + "_" + index + "_" + home + "_" + away;
}

function createRoundRobinFixtures(teams) {
  const clubs = Array.isArray(teams) ? teams.slice() : [];
  if (clubs.length < 2) return [];
  if (clubs.length % 2) clubs.push({ id: "bye", name: "Exempt" });

  let rotating = clubs.slice();
  const first = [];
  const rounds = rotating.length - 1;

  for (let r = 0; r < rounds; r += 1) {
    const day = r + 1;
    for (let i = 0; i < rotating.length / 2; i += 1) {
      const a = rotating[i];
      const b = rotating[rotating.length - 1 - i];
      if (!a || !b || a.id === "bye" || b.id === "bye") continue;

      const inv = (r + i) % 2 === 1;
      const home = inv ? b : a;
      const away = inv ? a : b;

      first.push({
        id: fixtureId(day, i + 1, home.id, away.id),
        matchday: day,
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

    const fixed = rotating[0];
    const rest = rotating.slice(1);
    rest.unshift(rest.pop());
    rotating = [fixed].concat(rest);
  }

  return first.concat(first.map((m, i) => {
    const day = m.matchday + rounds;
    return {
      id: fixtureId(day, i + 1, m.awayClubId, m.homeClubId),
      matchday: day,
      homeClubId: m.awayClubId,
      awayClubId: m.homeClubId,
      homeClubName: m.awayClubName,
      awayClubName: m.homeClubName,
      status: "scheduled",
      played: false,
      homeGoals: null,
      awayGoals: null
    };
  }));
}

function getNextCareerMatch(career) {
  const clubId = getCareerClubId(career);
  if (!clubId || !Array.isArray(career && career.fixtures)) return null;
  return career.fixtures.find((m) => (m.homeClubId === clubId || m.awayClubId === clubId) && !m.played && m.status !== "played") || null;
}

function persistCalendarCareer(career) {
  if (!career || typeof loadCareers !== "function" || typeof saveCareers !== "function") return;
  const careers = loadCareers();
  const index = careers.findIndex((item) => item.id === career.id);
  if (index < 0) return;
  careers[index] = career;
  saveCareers(careers, { silent: true });
}

function ensureCareerCalendar(career) {
  if (!career || !Array.isArray(career.clubs) || career.clubs.length < 2) return career;

  const expected = (career.clubs.length / 2) * ((career.clubs.length - 1) * 2);
  const ok = Array.isArray(career.fixtures) && career.fixtures.length === expected && career.calendarVersion === CALENDAR_VERSION;
  let changed = false;

  if (!ok) {
    career.fixtures = createRoundRobinFixtures(career.clubs);
    career.calendarVersion = CALENDAR_VERSION;
    changed = true;
  }

  const next = getNextCareerMatch(career);
  if (next && career.nextMatch !== getMatchLabel(next)) {
    career.nextMatch = getMatchLabel(next);
    career.nextMatchday = next.matchday;
    changed = true;
  }

  if (changed) {
    career.updatedAt = new Date().toISOString();
    persistCalendarCareer(career);
  }

  return career;
}

function updateCalendarDashboard(career) {
  if (!career || typeof setText !== "function") return;
  const clubId = getCareerClubId(career);
  const next = getNextCareerMatch(career);
  setText("kpi-next-match", getUserMatchLabel(next, clubId));
  setText("match-preview-title", getMatchLabel(next));
}

function matchesOfDay(career, day) {
  return career && Array.isArray(career.fixtures) ? career.fixtures.filter((m) => m.matchday === day) : [];
}

function renderCalendarV060(career) {
  const screen = document.getElementById("calendar");
  if (!screen) return;

  if (!career) {
    screen.innerHTML = '<div class="calendar-actions"><button class="secondary-btn" id="calendar-prev-day" type="button">Journée précédente</button><button class="secondary-btn" id="calendar-next-day" type="button">Journée suivante</button></div><article class="panel calendar-main-card"><div class="calendar-match-list"><div class="empty-state"><span>📅</span><h4>Aucune carrière active</h4><p>Crée ou charge une carrière pour afficher le calendrier.</p></div></div></article>';
    return;
  }

  ensureCareerCalendar(career);

  const fixtures = Array.isArray(career.fixtures) ? career.fixtures : [];
  const max = Math.max(1, ...fixtures.map((m) => Number(m.matchday) || 1));
  selectedCalendarMatchday = Math.max(1, Math.min(selectedCalendarMatchday || career.nextMatchday || 1, max));

  const clubId = getCareerClubId(career);
  const dayMatches = matchesOfDay(career, selectedCalendarMatchday);

  const matchesHtml = dayMatches.length
    ? dayMatches.map((m) => {
      const mine = m.homeClubId === clubId || m.awayClubId === clubId;
      const score = m.played ? (m.homeGoals + "-" + m.awayGoals) : "À venir";

      return '<div class="calendar-match-row' + (mine ? ' user-match' : '') + '"><span class="calendar-club home">' + cHtml(m.homeClubName) + '</span><span class="calendar-versus">vs</span><span class="calendar-club away">' + cHtml(m.awayClubName) + '</span><span class="calendar-status-stack">' + (mine ? '<span class="calendar-venue-pill ' + getUserMatchVenueClass(m, clubId) + '">' + cHtml(getUserMatchVenue(m, clubId)) + '</span>' : '') + '<span class="calendar-status">' + cHtml(score) + '</span></span></div>';
    }).join("")
    : '<div class="empty-state"><span>📅</span><h4>Aucun match</h4><p>Aucun match n’est prévu pour cette journée.</p></div>';

  screen.innerHTML = '<div class="calendar-actions"><button class="secondary-btn" id="calendar-prev-day" type="button">Journée précédente</button><button class="secondary-btn" id="calendar-next-day" type="button">Journée suivante</button></div><article class="panel calendar-main-card"><div class="calendar-match-list">' + matchesHtml + '</div></article>';

  bindCalendarControls(career, max);
}

function bindCalendarControls(career, max) {
  const prev = document.getElementById("calendar-prev-day");
  const nextDay = document.getElementById("calendar-next-day");

  if (prev) {
    prev.addEventListener("click", () => {
      selectedCalendarMatchday = Math.max(1, selectedCalendarMatchday - 1);
      renderCalendarV060(career);
    });
  }

  if (nextDay) {
    nextDay.addEventListener("click", () => {
      selectedCalendarMatchday = Math.min(max, selectedCalendarMatchday + 1);
      renderCalendarV060(career);
    });
  }
}

function renderStableCalendar(career) {
  let resolved = career || (typeof getResolvedCareer === "function" ? getResolvedCareer() : null);
  if (resolved) resolved = ensureCareerCalendar(resolved);
  if (resolved) updateCalendarDashboard(resolved);
  renderCalendarV060(resolved);
}

(function initCalendar() {
  if (window.__BTM_CALENDAR_ENTRYPOINT_LOADED__) return;
  window.__BTM_CALENDAR_ENTRYPOINT_LOADED__ = true;
  window.ensureCareerCalendar = ensureCareerCalendar;
  window.getNextCareerMatch = getNextCareerMatch;
  window.getMatchLabel = getMatchLabel;
  window.getUserMatchLabel = getUserMatchLabel;
  window.updateCalendarDashboard = updateCalendarDashboard;
  window.renderCalendarV060 = renderCalendarV060;
  if (typeof window.btmRegisterRender === "function") window.btmRegisterRender("calendar", renderStableCalendar);
  document.addEventListener("DOMContentLoaded", () => renderStableCalendar());
})();
