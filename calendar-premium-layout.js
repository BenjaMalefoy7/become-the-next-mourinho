const CALENDAR_PREMIUM_LAYOUT_VERSION = "0.47B";
let premiumCalendarDay = 1;

function calendarPremiumEscape(value) {
  return typeof escapeHtml === "function" ? escapeHtml(value) : String(value ?? "");
}

function calendarPremiumClubId(career) {
  return career && career.club ? career.club.id : null;
}

function calendarPremiumMatchesOfDay(career, day) {
  return career && Array.isArray(career.fixtures) ? career.fixtures.filter((match) => match.matchday === day) : [];
}

function calendarPremiumVenue(match, clubId) {
  if (!match || !clubId) return "—";
  if (match.homeClubId === clubId) return "Domicile";
  if (match.awayClubId === clubId) return "Extérieur";
  return "—";
}

function calendarPremiumVenueClass(match, clubId) {
  const venue = calendarPremiumVenue(match, clubId);
  return venue === "Domicile" ? "home" : venue === "Extérieur" ? "away" : "neutral";
}

function calendarPremiumScore(match) {
  return match && match.played ? match.homeGoals + "-" + match.awayGoals : "À venir";
}

function calendarPremiumRow(match, clubId) {
  const mine = match.homeClubId === clubId || match.awayClubId === clubId;
  return '<div class="calendar-match-row' + (mine ? ' user-match' : '') + '"><span class="calendar-club home">' + calendarPremiumEscape(match.homeClubName) + '</span><span class="calendar-versus">vs</span><span class="calendar-club away">' + calendarPremiumEscape(match.awayClubName) + '</span><span class="calendar-status-stack">' + (mine ? '<span class="calendar-venue-pill ' + calendarPremiumVenueClass(match, clubId) + '">' + calendarPremiumEscape(calendarPremiumVenue(match, clubId)) + '</span>' : '') + '<span class="calendar-status">' + calendarPremiumEscape(calendarPremiumScore(match)) + '</span></span></div>';
}

function calendarPremiumFeatured(match, clubId) {
  if (!match) {
    return '<section class="calendar-featured-match calendar-featured-empty"><p class="calendar-featured-kicker">Ton match</p><h3>Aucun match pour ton club</h3><p>Cette journée ne contient pas de match impliquant ton équipe.</p></section>';
  }

  return '<section class="calendar-featured-match"><div class="calendar-featured-copy"><p class="calendar-featured-kicker">Ton match</p><div class="calendar-featured-teams"><span>' + calendarPremiumEscape(match.homeClubName) + '</span><strong>vs</strong><span>' + calendarPremiumEscape(match.awayClubName) + '</span></div></div><div class="calendar-featured-meta"><span class="calendar-venue-pill ' + calendarPremiumVenueClass(match, clubId) + '">' + calendarPremiumEscape(calendarPremiumVenue(match, clubId)) + '</span><span class="calendar-status">' + calendarPremiumEscape(calendarPremiumScore(match)) + '</span></div></section>';
}

function renderCalendarPremiumLayout(career) {
  const screen = document.getElementById("calendar");
  if (!screen) return;

  const resolved = career || (typeof getResolvedCareer === "function" ? getResolvedCareer() : null);
  if (!resolved) {
    screen.innerHTML = '<div class="calendar-wide-shell"><div class="calendar-matchday-bar"><button class="secondary-btn" id="calendar-prev-day" type="button">Journée précédente</button><div class="calendar-matchday-chip"><span>Matchday</span><strong>—</strong></div><button class="secondary-btn" id="calendar-next-day" type="button">Journée suivante</button></div><article class="panel calendar-main-card calendar-premium-board"><div class="empty-state"><span>📅</span><h4>Aucune carrière active</h4><p>Crée ou charge une carrière pour afficher le calendrier.</p></div></article></div>';
    return;
  }

  const careerWithCalendar = typeof ensureCareerCalendar === "function" ? ensureCareerCalendar(resolved) : resolved;
  const fixtures = Array.isArray(careerWithCalendar.fixtures) ? careerWithCalendar.fixtures : [];
  const max = Math.max(1, ...fixtures.map((match) => Number(match.matchday) || 1));
  premiumCalendarDay = Math.max(1, Math.min(premiumCalendarDay || careerWithCalendar.nextMatchday || 1, max));

  const clubId = calendarPremiumClubId(careerWithCalendar);
  const dayMatches = calendarPremiumMatchesOfDay(careerWithCalendar, premiumCalendarDay);
  const userMatch = dayMatches.find((match) => match.homeClubId === clubId || match.awayClubId === clubId) || null;
  const otherMatches = dayMatches.filter((match) => match !== userMatch);
  const otherHtml = otherMatches.length ? otherMatches.map((match) => calendarPremiumRow(match, clubId)).join("") : '<div class="empty-state calendar-empty-compact"><span>📅</span><h4>Aucun autre match</h4><p>Seul ton match est prévu sur cette journée.</p></div>';

  screen.innerHTML = '<div class="calendar-wide-shell"><div class="calendar-matchday-bar"><button class="secondary-btn" id="calendar-prev-day" type="button">Journée précédente</button><div class="calendar-matchday-chip"><span>Matchday</span><strong>Journée ' + calendarPremiumEscape(premiumCalendarDay) + '</strong></div><button class="secondary-btn" id="calendar-next-day" type="button">Journée suivante</button></div><article class="panel calendar-main-card calendar-premium-board">' + calendarPremiumFeatured(userMatch, clubId) + '<section class="calendar-other-matches"><div class="calendar-section-title"><span>Autres matchs de la journée</span><em>' + calendarPremiumEscape(otherMatches.length) + ' affichés</em></div><div class="calendar-match-list">' + otherHtml + '</div></section></article></div>';

  const prev = document.getElementById("calendar-prev-day");
  const next = document.getElementById("calendar-next-day");
  if (prev) prev.addEventListener("click", () => { premiumCalendarDay = Math.max(1, premiumCalendarDay - 1); renderCalendarPremiumLayout(careerWithCalendar); });
  if (next) next.addEventListener("click", () => { premiumCalendarDay = Math.min(max, premiumCalendarDay + 1); renderCalendarPremiumLayout(careerWithCalendar); });
}

(function initCalendarPremiumLayout() {
  if (window.__BTM_CALENDAR_PREMIUM_LAYOUT__) return;
  window.__BTM_CALENDAR_PREMIUM_LAYOUT__ = true;
  window.renderCalendarPremiumLayout = renderCalendarPremiumLayout;
  if (typeof window.btmRegisterRender === "function") window.btmRegisterRender("calendar", renderCalendarPremiumLayout);
  document.addEventListener("DOMContentLoaded", () => renderCalendarPremiumLayout());
})();