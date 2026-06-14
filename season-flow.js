const BTM_SEASON_FLOW_VERSION = "0.29";
(function () {
  const START = "2025-08-01";
  const FIRST_MATCH = "2025-08-16";

  function e(value) {
    if (typeof escapeHtml === "function") return escapeHtml(value);
    return String(value ?? "").replace(/[&<>"]/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[char]));
  }
  function iso(dateValue) { return dateValue.toISOString().slice(0, 10); }
  function date(value) { return new Date(String(value || START) + "T12:00:00"); }
  function add(value, days) { const d = date(value); d.setDate(d.getDate() + days); return iso(d); }
  function diff(a, b) { return Math.round((date(b) - date(a)) / 86400000); }
  function fr(value) {
    try { return new Intl.DateTimeFormat("fr-FR", { day: "2-digit", month: "short", year: "numeric" }).format(date(value)); }
    catch (_) { return value; }
  }
  function matchDate(matchday) { return add(FIRST_MATCH, (Number(matchday || 1) - 1) * 7); }
  function getNext(career) { return typeof getNextCareerMatch === "function" ? getNextCareerMatch(career) : null; }
  function activeIndex() {
    const id = typeof getActiveCareerId === "function" ? getActiveCareerId() : null;
    const careers = typeof loadCareers === "function" ? loadCareers() : [];
    const index = careers.findIndex((career) => career.id === id);
    return { careers, index, career: index >= 0 ? careers[index] : null };
  }
  function save(careers, index, career) {
    career.updatedAt = new Date().toISOString();
    careers[index] = career;
    if (typeof saveCareers === "function") saveCareers(careers, { silent: true });
  }
  function ensure(career) {
    if (!career) return false;
    let changed = false;
    if (!career.seasonStartDate) { career.seasonStartDate = START; changed = true; }
    if (!career.currentDate) { career.currentDate = START; changed = true; }
    if (!career.seasonDay) { career.seasonDay = diff(START, career.currentDate) + 1; changed = true; }
    return changed;
  }
  function ensurePersist() {
    const active = activeIndex();
    if (!active.career) return null;
    if (ensure(active.career)) save(active.careers, active.index, active.career);
    return active.career;
  }
  function nextInfo(career) {
    const match = getNext(career);
    if (!match) return { match: null, date: null, days: null, label: "Saison terminée" };
    const targetDate = matchDate(match.matchday);
    return { match, date: targetDate, days: diff(career.currentDate, targetDate), label: typeof getMatchLabel === "function" ? getMatchLabel(match) : match.homeClubName + " vs " + match.awayClubName };
  }
  function isMatchDue(career) {
    ensure(career);
    const next = nextInfo(career);
    return Boolean(next.match && next.days <= 0);
  }
  function canPlay(career) {
    if (!career) return { ok: false, message: "Aucune carrière active." };
    ensure(career);
    const next = nextInfo(career);
    if (!next.match) return { ok: false, message: "Aucun match à jouer." };
    if (next.days > 0) return { ok: false, message: "Match prévu le " + fr(next.date) + ". Continue jour par jour." };
    return { ok: true, message: "Match disponible." };
  }
  function canAdvance(career) {
    if (!career) return { ok: false, message: "Aucune carrière active." };
    if (isMatchDue(career)) return { ok: false, message: "Match à jouer aujourd’hui. Va au Matchday Center avant de continuer." };
    return { ok: true, message: "Jour suivant disponible." };
  }
  function recover(career) {
    (Array.isArray(career.players) ? career.players : []).forEach((player) => { player.condition = Math.min(100, (Number(player.condition ?? 100) || 100) + 2); });
  }
  function goMatch() {
    const button = document.querySelector('[data-screen="match"]');
    if (button) button.click();
    else if (typeof showScreen === "function") showScreen("match");
  }
  function advance(days) {
    const active = activeIndex();
    if (!active.career) return;
    ensure(active.career);
    const gate = canAdvance(active.career);
    if (!gate.ok) {
      window.btmSeasonFlowMessage = gate.message;
      if (typeof refreshUI === "function") refreshUI();
      return;
    }
    const total = Math.max(1, Number(days) || 1);
    for (let i = 0; i < total; i += 1) {
      if (isMatchDue(active.career)) {
        window.btmSeasonFlowMessage = "Match à jouer aujourd’hui. Va au Matchday Center.";
        break;
      }
      active.career.currentDate = add(active.career.currentDate, 1);
      active.career.seasonDay = diff(START, active.career.currentDate) + 1;
      recover(active.career);
      if (typeof window.btmGenerateDailyMail === "function") window.btmGenerateDailyMail(active.career, active.career.currentDate);
    }
    save(active.careers, active.index, active.career);
    if (typeof refreshUI === "function") refreshUI();
  }
  function advanceToNext() {
    const career = ensurePersist();
    if (!career) return;
    const next = nextInfo(career);
    if (!next.date) return;
    if (next.days <= 0) { goMatch(); return; }
    window.btmSeasonFlowMessage = "Avance jour par jour. Le match sera accessible le jour même.";
    if (typeof refreshUI === "function") refreshUI();
  }
  function saveSimulatedMatchV029() {
    const active = activeIndex();
    if (!active.career) return { ok: false, message: "Aucune carrière active." };
    let career = active.career;
    if (typeof window.repairCareerIfNeeded === "function") career = window.repairCareerIfNeeded(career).career;
    if (typeof ensureCareerCalendar === "function") ensureCareerCalendar(career);
    ensure(career);
    const gate = canPlay(career);
    if (!gate.ok) return { ok: false, message: gate.message };
    const userMatch = getNext(career);
    if (!userMatch) return { ok: false, message: "Aucun match à jouer." };
    if (typeof window.btmSimulateUserMatch !== "function") return { ok: false, message: "Moteur de match indisponible." };
    const userResult = window.btmSimulateUserMatch(career, userMatch);
    if (!userResult?.ok) return userResult || { ok: false, message: "Simulation impossible." };
    let otherCount = 0;
    if (typeof window.btmSimulateOtherMatches === "function") {
      const leagueResult = window.btmSimulateOtherMatches(career, userMatch.matchday, userMatch.id);
      otherCount = Number(leagueResult?.simulatedMatches) || 0;
    }
    if (typeof window.computeDynamicStandings === "function") career.standings = window.computeDynamicStandings(career);
    const nextMatch = getNext(career);
    career.nextMatch = typeof getMatchLabel === "function" ? getMatchLabel(nextMatch) : nextMatch ? nextMatch.homeClubName + " vs " + nextMatch.awayClubName : "Saison terminée";
    career.nextMatchday = nextMatch ? nextMatch.matchday : null;
    career.version = BTM_SEASON_FLOW_VERSION;
    career.updatedAt = new Date().toISOString();
    if (typeof window.btmEnhanceLastMatchReport === "function") window.btmEnhanceLastMatchReport(career);
    if (typeof window.btmGenerateMatchMail === "function") window.btmGenerateMatchMail(career, userResult.result || career.lastMatchResult);
    save(active.careers, active.index, career);
    return { ok: true, career, result: career.lastMatchResult || userResult.result, matchday: userMatch.matchday, simulatedMatches: 1 + otherCount, message: "Journée simulée." };
  }

  window.btmCanPlayMatch = canPlay;
  window.btmCanAdvanceDay = canAdvance;
  window.btmNextMatchInfo = nextInfo;
  window.btmMatchDate = matchDate;
  window.btmFormatSeasonDate = fr;
  window.btmAdvanceSeasonDay = advance;
  window.btmAdvanceToNextMatch = advanceToNext;
  window.saveSimulatedMatch = saveSimulatedMatchV029;

  function render() {
    const main = document.querySelector(".main-content");
    if (!main) return;
    const career = ensurePersist();
    let box = document.getElementById("season-flow-panel");
    if (!box) {
      box = document.createElement("div");
      box.id = "season-flow-panel";
      box.className = "season-v014 season-flow-panel";
      const top = document.querySelector(".topbar");
      if (top && top.nextSibling) main.insertBefore(box, top.nextSibling);
      else main.prepend(box);
    }
    if (!career) { box.innerHTML = ""; return; }
    const next = nextInfo(career);
    const due = isMatchDue(career);
    const unread = Array.isArray(career.mailbox) ? career.mailbox.filter((message) => !message.read).length : 0;
    const message = window.btmSeasonFlowMessage || "Saison jour par jour active";
    window.btmSeasonFlowMessage = "";
    box.classList.toggle("season-v014-ready", due);
    box.innerHTML = `<div class="season-v014-left"><div class="season-v014-date"><span>Date du jour</span><strong>${e(fr(career.currentDate))}</strong></div><div class="season-v014-next"><span>Prochain match</span><strong>${e(next.label)}</strong><small>${next.date ? ` · ${e(fr(next.date))} · ${due ? "aujourd’hui" : "J-" + Math.max(0, next.days)}` : ""}</small><div class="season-v014-warning">${e(due ? "Match à jouer aujourd’hui" : message)}</div></div></div><div class="season-v014-actions"><button class="secondary-btn" id="season-next-day" ${due ? "disabled" : ""}>${due ? "Match à jouer" : "Passer au jour suivant"}</button><button class="primary-btn" id="season-next-match">${due ? "Aller au match" : "Prochain match plus tard"}</button><button class="secondary-btn" id="season-open-mail">Courrier ${unread ? `<span class='season-v014-mail-pill'>${unread}</span>` : ""}</button></div>`;
    document.getElementById("season-next-day")?.addEventListener("click", () => advance(1));
    document.getElementById("season-next-match")?.addEventListener("click", () => due ? goMatch() : advanceToNext());
    document.getElementById("season-open-mail")?.addEventListener("click", () => document.querySelector('[data-screen="mail"]')?.click());
  }
  function decorateMatchButton() {
    const career = ensurePersist();
    const button = document.getElementById("prematch-launch");
    if (!button || !career) return;
    const gate = canPlay(career);
    if (!gate.ok) { button.disabled = true; button.title = gate.message; }
  }
  function updateCopy() {
    if (typeof setText === "function") setText("dashboard-description", "V0.29 : les modules extraits passent par un registre de rendu au lieu de réécrire refreshUI en cascade.");
    const footer = document.querySelector(".sidebar-footer");
    if (footer) footer.textContent = "V0.29 — Render registry";
  }
  function renderSeasonFlow() {
    render();
    decorateMatchButton();
    updateCopy();
  }

  window.renderSeasonFlowPanel = renderSeasonFlow;
  if (typeof window.btmRegisterRender === "function") window.btmRegisterRender("season-flow", renderSeasonFlow);
  else {
    const previous = typeof refreshUI === "function" ? refreshUI : null;
    refreshUI = function refreshUISeasonFlowFallbackV029() { if (previous) previous(); renderSeasonFlow(); };
  }

  document.addEventListener("DOMContentLoaded", renderSeasonFlow);
})();