const BTM_DASHBOARD_STORY_VERSION = "0.42";
(function () {
  if (window.__BTM_DASHBOARD_STORY__) return;
  window.__BTM_DASHBOARD_STORY__ = true;

  function e(value) {
    if (typeof escapeHtml === "function") return escapeHtml(value);
    return String(value ?? "").replace(/[&<>"]/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[char]));
  }
  function text(value, fallback = "—") {
    if (typeof safeText === "function") return safeText(value, fallback);
    return value === undefined || value === null || value === "" ? fallback : String(value);
  }
  function money(value) {
    if (typeof formatMoney === "function") return formatMoney(value);
    return typeof value === "number" ? new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(value) : "—";
  }
  function difficulty(value) {
    if (typeof getDifficultyLabel === "function") return getDifficultyLabel(value);
    return { outsider: "Petit outsider", ambitious: "Club ambitieux", giant: "Nouveau géant" }[value] || text(value);
  }
  function nextInfo(career) {
    if (typeof window.btmNextMatchInfo === "function") return window.btmNextMatchInfo(career);
    const match = typeof getNextCareerMatch === "function" ? getNextCareerMatch(career) : null;
    const label = match ? `${match.homeClubName} vs ${match.awayClubName}` : "Saison terminée";
    return { match, label, days: null };
  }
  function userVenue(career, match) {
    if (!career?.club || !match) return "—";
    if (match.homeClubId === career.club.id) return "Domicile";
    if (match.awayClubId === career.club.id) return "Extérieur";
    return "—";
  }
  function tablePosition(career) {
    const standings = Array.isArray(career?.standings) ? career.standings : [];
    const index = standings.findIndex((row) => row.clubId === career?.club?.id || row.club === career?.club?.name);
    if (index < 0) return "Non classé";
    return `${index + 1}${index === 0 ? "er" : "e"}`;
  }
  function lastResults(career) {
    const history = Array.isArray(career?.matchHistory) ? career.matchHistory.slice(0, 5) : [];
    if (!history.length) return "Aucun match joué";
    return history.map((item) => {
      if (item.resultForUser === "Victoire") return "V";
      if (item.resultForUser === "Défaite") return "D";
      return "N";
    }).join(" - ");
  }
  function bestPlayer(career) {
    const players = Array.isArray(career?.players) ? career.players : [];
    if (!players.length) return null;
    return players.slice().sort((a, b) => (Number(b.overall) || 0) - (Number(a.overall) || 0))[0];
  }
  function squadMood(career) {
    const players = Array.isArray(career?.players) ? career.players : [];
    if (!players.length) return { label: "Vestiaire à découvrir", detail: "Aucun groupe complet enregistré." };
    const avgCondition = Math.round(players.reduce((sum, player) => sum + (Number(player.condition ?? 100) || 100), 0) / players.length);
    if (avgCondition >= 92) return { label: "Groupe frais", detail: `Condition moyenne ${avgCondition}%` };
    if (avgCondition >= 78) return { label: "Vestiaire stable", detail: `Condition moyenne ${avgCondition}%` };
    return { label: "Fatigue à surveiller", detail: `Condition moyenne ${avgCondition}%` };
  }
  function objectiveTone(career) {
    const obj = text(career?.objective || career?.seasonObjective || "Objectif à définir");
    if (/titre|top 4/i.test(obj)) return "La direction attend une saison ambitieuse. Chaque faux pas comptera.";
    if (/maintien/i.test(obj)) return "La priorité est simple : survivre, construire et éviter la panique.";
    return "La saison doit installer une identité claire avant de viser plus haut.";
  }
  function renderCareerEmpty(container) {
    container.innerHTML = `<div class="dashboard-story"><section class="dashboard-story-hero"><p class="eyebrow">Bureau du manager</p><h3>Aucune carrière active</h3><p>Crée un club ou charge une sauvegarde pour ouvrir ton carnet de saison.</p></section></div>`;
  }
  function renderDashboard(career = typeof getResolvedCareer === "function" ? getResolvedCareer() : null) {
    const container = document.getElementById("dashboard");
    if (!container) return;
    if (!career) { renderCareerEmpty(container); return; }

    const club = career.club || {};
    const next = nextInfo(career);
    const nextMatch = next.match;
    const keyPlayer = bestPlayer(career);
    const mood = squadMood(career);
    const unread = Array.isArray(career.mailbox) ? career.mailbox.filter((item) => !item.read).length : 0;
    const budget = Number(career.finances?.transferBudget ?? career.finances?.balance ?? 0);
    const venue = userVenue(career, nextMatch);
    const shortName = text(club.shortName || club.name || "BTM").slice(0, 4).toUpperCase();

    container.innerHTML = `<div class="dashboard-story">
      <section class="dashboard-story-hero">
        <div>
          <p class="eyebrow">Carnet du manager</p>
          <h3>${e(club.name || "Ton club")} — Saison ${e(text(career.season, "2025/2026"))}</h3>
          <p>${e(text(career.managerName, "Manager"))} démarre son ère avec un objectif : ${e(text(career.objective, "construire une identité"))}. ${e(objectiveTone(career))}</p>
        </div>
        <div class="dashboard-club-stamp" style="--stamp-color:${e(club.primaryColor || "#0f4d2f")}">
          <span>${e(shortName)}</span>
          <strong>${e(club.badge || "⚽")}</strong>
        </div>
      </section>

      <section class="dashboard-story-grid dashboard-story-kpis">
        <article><span>Position</span><strong>${e(tablePosition(career))}</strong><small>Classement actuel</small></article>
        <article><span>Forme</span><strong>${e(lastResults(career))}</strong><small>5 derniers matchs</small></article>
        <article><span>Vestiaire</span><strong>${e(mood.label)}</strong><small>${e(mood.detail)}</small></article>
        <article><span>Budget mercato</span><strong>${e(money(budget))}</strong><small>${e(difficulty(career.difficulty))}</small></article>
      </section>

      <section class="dashboard-story-grid dashboard-story-main">
        <article class="dashboard-story-card dashboard-story-next">
          <span class="dashboard-story-tag">Prochain enjeu</span>
          <h3>${e(next.label || "Saison terminée")}</h3>
          <p>${nextMatch ? `${e(venue)} · Journée ${e(nextMatch.matchday)}${Number.isFinite(next.days) ? ` · J-${Math.max(0, next.days)}` : ""}` : "Aucun match restant."}</p>
          <button class="primary-btn" data-dashboard-go="match">Préparer le match</button>
        </article>
        <article class="dashboard-story-card">
          <span class="dashboard-story-tag">Joueur clé</span>
          <h3>${e(keyPlayer ? keyPlayer.name : "Leader à révéler")}</h3>
          <p>${keyPlayer ? `${e(keyPlayer.primaryPosition)} · OVR ${e(keyPlayer.overall)} · POT ${e(keyPlayer.potential)} · ${e(keyPlayer.condition ?? 100)}% condition` : "Aucun joueur disponible."}</p>
        </article>
        <article class="dashboard-story-card">
          <span class="dashboard-story-tag">Vestiaire</span>
          <h3>${e(mood.label)}</h3>
          <p>${e(mood.detail)}. Le groupe doit rester lisible avant d’enchaîner les matchs importants.</p>
        </article>
        <article class="dashboard-story-card">
          <span class="dashboard-story-tag">Bureau</span>
          <h3>${unread ? `${unread} courrier(s) non lu(s)` : "Courrier à jour"}</h3>
          <p>${unread ? "Des messages attendent une lecture avant la suite de la semaine." : "Aucune alerte majeure dans le bureau du manager."}</p>
          <button class="secondary-btn" data-dashboard-go="mail">Ouvrir le courrier</button>
        </article>
      </section>
    </div>`;

    container.querySelectorAll("[data-dashboard-go]").forEach((button) => {
      button.addEventListener("click", () => {
        const screen = button.dataset.dashboardGo;
        if (typeof window.btmShowGameScreen === "function") window.btmShowGameScreen(screen);
        else document.querySelector(`[data-screen="${screen}"]`)?.click();
      });
    });
  }

  window.renderDashboardStory = renderDashboard;
  if (typeof window.btmRegisterRender === "function") window.btmRegisterRender("dashboard-story", renderDashboard);
  else document.addEventListener("DOMContentLoaded", () => renderDashboard());
})();