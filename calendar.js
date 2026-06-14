const BTM_CALENDAR_ENTRYPOINT_VERSION = "0.31";

(function initStableCalendarEntrypoint() {
  if (window.__BTM_CALENDAR_ENTRYPOINT_LOADED__) return;
  window.__BTM_CALENDAR_ENTRYPOINT_LOADED__ = true;

  const baseRefresh = window.refreshUI;

  function registerCalendar() {
    if (window.__BTM_CALENDAR_REGISTERED__) return;
    window.__BTM_CALENDAR_REGISTERED__ = true;

    if (window.refreshUI !== baseRefresh) {
      window.refreshUI = baseRefresh;
      console.info("[BTM] V0.31: legacy calendar refreshUI wrapper neutralized.");
    }

    if (typeof window.btmRegisterRender === "function" && typeof window.renderCalendarV060 === "function") {
      window.btmRegisterRender("calendar", function renderStableCalendar(career) {
        let resolvedCareer = career || (typeof window.getResolvedCareer === "function" ? window.getResolvedCareer() : null);
        if (resolvedCareer && typeof window.ensureCareerCalendar === "function") {
          resolvedCareer = window.ensureCareerCalendar(resolvedCareer);
        }
        if (resolvedCareer && typeof window.updateCalendarDashboard === "function") {
          window.updateCalendarDashboard(resolvedCareer);
        }
        window.renderCalendarV060(resolvedCareer);
      });
    } else {
      console.warn("[BTM] V0.31: calendar registry skipped because required globals are missing.");
    }
  }

  if (typeof window.renderCalendarV060 === "function") {
    registerCalendar();
    if (typeof window.refreshUI === "function") window.refreshUI();
    return;
  }

  const script = document.createElement("script");
  script.src = "calendar-v060.js?v=031";
  script.async = false;
  script.onload = function onCalendarLoaded() {
    registerCalendar();
    if (typeof window.refreshUI === "function") window.refreshUI();
  };
  script.onerror = function onCalendarLoadError() {
    console.error("[BTM] Impossible de charger calendar-v060.js depuis calendar.js V0.31.");
  };
  document.body.appendChild(script);
})();
