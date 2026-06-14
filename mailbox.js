const BTM_MAILBOX_VERSION = "0.40C";
(function () {
  const state = { selectedId: null };

  function e(value) {
    if (typeof escapeHtml === "function") return escapeHtml(value);
    return String(value ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }
  function fr(value) {
    try { return new Intl.DateTimeFormat("fr-FR", { day: "2-digit", month: "short", year: "numeric" }).format(new Date(String(value) + "T12:00:00")); }
    catch (_) { return value; }
  }
  function activeIndex() {
    const id = typeof getActiveCareerId === "function" ? getActiveCareerId() : null;
    const careers = typeof loadCareers === "function" ? loadCareers() : [];
    const index = careers.findIndex((career) => career.id === id);
    return { careers, index, career: index >= 0 ? careers[index] : null };
  }
  function save(careers, index, career) {
    if (index < 0 || !career) return;
    career.updatedAt = new Date().toISOString();
    careers[index] = career;
    if (typeof saveCareers === "function") saveCareers(careers, { silent: true });
  }
  function box(career) { if (career) career.mailbox = Array.isArray(career.mailbox) ? career.mailbox : []; }
  function id(prefix) { return prefix + "_" + Date.now() + "_" + Math.random().toString(16).slice(2); }
  function has(career, date, type) { box(career); return career.mailbox.some((message) => message.date === date && message.type === type); }
  function push(career, message) { box(career); career.mailbox.unshift({ id: id("mail"), read: false, createdAt: new Date().toISOString(), ...message }); }
  function nextInfo(career) { return typeof window.btmNextMatchInfo === "function" ? window.btmNextMatchInfo(career) : { match: null, days: null, label: "Saison terminée" }; }
  function generateDaily(career, currentDate) {
    if (!career) return;
    box(career);
    const next = nextInfo(career);
    const near = next.match && next.days !== null && next.days <= 1;
    if (!near) return;
    if (!has(career, currentDate, "briefing")) push(career, { date: currentDate, type: "briefing", title: next.days === 0 ? "Briefing jour de match" : "Briefing veille de match", body: "Prochain rendez-vous : " + next.label + ". Le staff recommande de vérifier la composition, la condition et le plan de match." });
    if (!has(career, currentDate, "staff") && Math.random() < 0.35) push(career, { date: currentDate, type: "staff", title: "Note du staff", body: "Le groupe est surveillé avant le prochain match. Pense à éviter les joueurs trop fatigués." });
  }
  function generateMatch(career, result) {
    if (!career || !result) return;
    box(career);
    const currentDate = career.currentDate || new Date().toISOString().slice(0, 10);
    if (has(career, currentDate, "match-report")) return;
    push(career, { date: currentDate, type: "match-report", title: "Rapport de match", body: "Résultat : " + result.homeClubName + " " + result.homeGoals + " - " + result.awayGoals + " " + result.awayClubName + "\n\nBilan : " + (result.resultForUser || "Résultat enregistré") + ". Consulte le Match Center pour la timeline et les statistiques." });
  }
  function ensureUi() {
    const nav = document.querySelector(".nav");
    if (nav && !nav.querySelector('[data-screen="mail"]')) {
      const button = document.createElement("button");
      button.className = "nav-item";
      button.dataset.screen = "mail";
      button.type = "button";
      button.textContent = "Courrier";
      button.onclick = () => typeof window.btmShowGameScreen === "function" ? window.btmShowGameScreen("mail") : null;
      nav.insertBefore(button, nav.querySelector('[data-screen="transfers"]') || null);
    }
    const main = document.querySelector(".main-content");
    if (main && !document.getElementById("mail")) {
      const screen = document.createElement("section");
      screen.className = "screen";
      screen.id = "mail";
      main.appendChild(screen);
    }
    try { screenTitles.mail = "Courrier"; } catch (_) {}
  }
  function label(type) { return { briefing: "Staff", staff: "Staff", news: "News", "match-report": "Match", transfer: "Mercato" }[type] || type; }
  function mark(messageId, read, refresh) {
    const active = activeIndex();
    if (!active.career) return;
    box(active.career);
    const message = active.career.mailbox.find((item) => item.id === messageId);
    if (message) message.read = read;
    save(active.careers, active.index, active.career);
    if (refresh && typeof refreshUI === "function") refreshUI();
  }

  function render(career = typeof getResolvedCareer === "function" ? getResolvedCareer() : null) {
    ensureUi();
    const screen = document.getElementById("mail");
    if (!screen) return;
    if (!career) {
      screen.innerHTML = '<div class="section-header"><h3>Courrier</h3><p>Aucune carrière active.</p></div>';
      return;
    }
    box(career);
    const mails = career.mailbox.slice().sort((a, b) => String(b.createdAt || b.date).localeCompare(String(a.createdAt || a.date)));
    if (!state.selectedId || !mails.some((mail) => mail.id === state.selectedId)) state.selectedId = mails[0]?.id || null;
    const selected = mails.find((mail) => mail.id === state.selectedId) || mails[0];
    screen.innerHTML = '<div class="section-header section-header-row"><div><p class="eyebrow">Inbox V0.40C</p><h3>Courrier du manager</h3><p>Messages réduits : seulement match, staff proche échéance et événements importants.</p></div><button class="secondary-btn" id="mail-mark-read">Archiver comme lu</button></div><div class="mail-v015"><div class="mail-v015-list">' + (mails.length ? mails.map((mail) => '<button class="mail-v015-item ' + (mail.read ? '' : 'unread') + '" data-mail-id="' + e(mail.id) + '"><span class="mail-v015-type">' + e(label(mail.type)) + '</span><strong>' + e(mail.title) + '</strong><span>' + e(fr(mail.date)) + '</span></button>').join('') : '<div class="mail-v015-empty">Aucun message utile pour le moment.</div>') + '</div><article class="mail-v015-reader">' + (selected ? '<span class="mail-v015-type">' + e(label(selected.type)) + '</span><h3>' + e(selected.title) + '</h3><p class="save-meta">' + e(fr(selected.date)) + '</p><div class="mail-v015-body">' + e(selected.body) + '</div>' : '<div class="mail-v015-empty">Sélectionne un message.</div>') + '</article></div>';
    screen.querySelectorAll("[data-mail-id]").forEach((button) => button.onclick = () => { state.selectedId = button.dataset.mailId; mark(state.selectedId, true, false); render(); });
    document.getElementById("mail-mark-read")?.addEventListener("click", () => { if (state.selectedId) mark(state.selectedId, true, true); });
  }

  window.btmGenerateDailyMail = generateDaily;
  window.btmGenerateMatchMail = function btmGenerateMatchMail(career, result) {
    const active = activeIndex();
    const targetCareer = active.career || career;
    if (!targetCareer) return;
    generateMatch(targetCareer, result);
    if (active.index >= 0) save(active.careers, active.index, targetCareer);
  };
  window.btmGenerateTransferMail = function btmGenerateTransferMail(career, player, price) {
    const active = activeIndex();
    const targetCareer = active.career || career;
    if (!targetCareer || !player) return;
    const currentDate = targetCareer.currentDate || new Date().toISOString().slice(0, 10);
    push(targetCareer, { date: currentDate, type: "transfer", title: "Transfert finalisé", body: player.name + " rejoint " + (targetCareer.club?.name || "le club") + ". Montant : " + (typeof formatMoney === "function" ? formatMoney(price) : price) + "." });
    if (active.index >= 0) save(active.careers, active.index, targetCareer);
  };

  if (typeof window.btmRegisterRender === "function") window.btmRegisterRender("mailbox", render);
  else {
    const previous = typeof refreshUI === "function" ? refreshUI : null;
    refreshUI = function refreshUIMailboxFallbackV040C() { if (previous) previous(); render(); };
  }

  document.addEventListener("DOMContentLoaded", () => { ensureUi(); render(); });
})();
