const BTM_MATCH_CENTER_ENTRYPOINT_VERSION = "0.29";
(function () {
  if (window.__BTM_MC_EXTRACTED__) return;
  window.__BTM_MC_EXTRACTED__ = true;

  const prep = {};

  function e(value) {
    if (typeof escapeHtml === "function") return escapeHtml(value);
    return String(value ?? "").replace(/[&<>"]/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[char]));
  }
  function s(value, fallback = "—") {
    if (typeof safeText === "function") return safeText(value, fallback);
    return value === undefined || value === null || value === "" ? fallback : String(value);
  }
  function nextMatch(career) {
    if (!career) return null;
    if (typeof ensureCareerCalendar === "function") ensureCareerCalendar(career);
    return typeof getNextCareerMatch === "function" ? getNextCareerMatch(career) : null;
  }
  function clubById(career, id) { return Array.isArray(career?.clubs) ? career.clubs.find((club) => club.id === id) || null : null; }
  function matchLabel(match) { return match ? `${match.homeClubName} vs ${match.awayClubName}` : "Saison terminée"; }
  function userVenue(career, match) {
    if (!career?.club || !match) return "—";
    if (match.homeClubId === career.club.id) return "Domicile";
    if (match.awayClubId === career.club.id) return "Extérieur";
    return "—";
  }
  function opponent(career, match) {
    if (!career?.club || !match) return null;
    const id = match.homeClubId === career.club.id ? match.awayClubId : match.homeClubId;
    return clubById(career, id);
  }
  function level(club) {
    const rep = Number(club?.reputation) || 65;
    if (rep >= 88) return "Très fort";
    if (rep >= 78) return "Fort";
    if (rep >= 68) return "Équilibré";
    return "Abordable";
  }
  function lineupStats(career) {
    if (typeof prematchLineupStats === "function") return prematchLineupStats(career);
    return { valid: false, formation: "—", rating: "—", condition: "—", starters: [], startersCount: 0, expectedCount: 11, warnings: ["Composition non disponible."] };
  }
  function player(career, id) { return Array.isArray(career?.players) ? career.players.find((item) => item.id === id) || null : null; }
  function xiHtml(career, stats) {
    const starters = Array.isArray(stats.starters) ? stats.starters : [];
    if (!starters.length) return "<p class='save-meta'>Aucune composition enregistrée.</p>";
    return `<div class="mc-v020-xi">${starters.map((slot) => {
      const p = player(career, slot.playerId);
      return `<div class="mc-v020-row"><b>${e(slot.label || slot.position)}</b><strong>${e(p ? p.name : "Poste vide")}</strong><span>${e(p ? p.primaryPosition : "—")} · ${s(p?.overall)}</span></div>`;
    }).join("")}</div>`;
  }
  function opponentModel(opp) {
    const rep = Number(opp?.reputation) || 70;
    const def = Math.max(52, Math.min(95, rep + Math.round(Math.sin(rep) * 5)));
    const mid = Math.max(52, Math.min(95, rep + Math.round(Math.cos(rep) * 5)));
    const att = Math.max(52, Math.min(95, rep + Math.round(Math.sin(rep / 2) * 6)));
    const arr = [["Défense", def], ["Milieu", mid], ["Attaque", att]].sort((a, b) => b[1] - a[1]);
    return {
      formation: rep > 84 ? "4-3-3" : rep > 75 ? "4-2-3-1" : "4-4-2",
      style: rep > 84 ? "Pressing haut" : rep > 74 ? "Équilibré" : "Bloc compact",
      def,
      mid,
      att,
      strong: arr[0][0],
      weak: arr[2][0],
      form: rep > 82 ? "V - V - N" : rep > 74 ? "V - N - D" : "N - D - V"
    };
  }
  function statPack(career, result) {
    if (result?.matchStats) return result.matchStats;
    const homeGoals = Number(result?.homeGoals) || 0;
    const awayGoals = Number(result?.awayGoals) || 0;
    const home = clubById(career, result?.homeClubId) || {};
    const away = clubById(career, result?.awayClubId) || {};
    const diff = (Number(home.reputation) || 72) - (Number(away.reputation) || 72) + ((homeGoals - awayGoals) * 4);
    const homePossession = Math.max(38, Math.min(64, Math.round(50 + diff / 3)));
    const awayPossession = 100 - homePossession;
    return {
      possession: { home: homePossession, away: awayPossession },
      shots: { home: Math.max(4, Math.round(homeGoals * 4 + 8 + Math.max(0, diff / 5))), away: Math.max(4, Math.round(awayGoals * 4 + 8 + Math.max(0, -diff / 5))) },
      shotsOnTarget: { home: Math.max(homeGoals, Math.round(homeGoals * 3 + 2)), away: Math.max(awayGoals, Math.round(awayGoals * 3 + 2)) },
      xg: { home: Math.round((0.6 + homeGoals * 0.75 + Math.max(0, diff) / 40) * 10) / 10, away: Math.round((0.6 + awayGoals * 0.75 + Math.max(0, -diff) / 40) * 10) / 10 },
      dangerousChances: { home: Math.max(homeGoals, Math.round(homeGoals + 2 + Math.max(0, diff) / 20)), away: Math.max(awayGoals, Math.round(awayGoals + 2 + Math.max(0, -diff) / 20)) }
    };
  }
  function enhanceReport(career) {
    const result = career?.lastMatchResult;
    if (!result) return null;
    if (!result.matchStats) result.matchStats = statPack(career, result);
    if (!Array.isArray(result.events) || !result.events.length) result.events = [{ minute: 90, type: "info", side: "neutral", text: "Match fermé, peu d’espaces." }];
    const hasTempo = result.events.some((event) => event.type !== "goal");
    if (!hasTempo) {
      result.events.push({ minute: 24, type: "chance", side: "neutral", text: "Première période tactique, les deux blocs se testent." });
      result.events.push({ minute: 62, type: "tempo", side: "neutral", text: "Le rythme s’accélère, les espaces apparaissent entre les lignes." });
    }
    result.events.sort((a, b) => (a.minute || 0) - (b.minute || 0));
    if (!result.summary) result.summary = `${result.resultForUser || "Résultat enregistré"} dans un match où la gestion des temps faibles a pesé lourd.`;
    return result;
  }
  window.btmEnhanceLastMatchReport = enhanceReport;

  function badge(team) {
    return `<div class="mc-v020-badge" style="background:${e(team.primaryColor || "#173650")};color:${e(team.secondaryColor || "#fff")}">${e(team.badge || team.shortName || "CLB")}</div>`;
  }
  function reportHtml(career) {
    const result = enhanceReport(career);
    if (!result) return "";
    const home = clubById(career, result.homeClubId) || { name: result.homeClubName, shortName: "HOM" };
    const away = clubById(career, result.awayClubId) || { name: result.awayClubName, shortName: "AWY" };
    const stats = statPack(career, result);
    const row = (label, homeValue, awayValue, suffix = "") => `<div class="mc-v020-stat"><b>${e(homeValue)}${suffix}</b><div><span>${e(label)}</span><div class="mc-v020-track"><div class="mc-v020-fill" style="width:${Math.max(5, Math.min(95, Number(homeValue) || 0))}%"></div></div></div><b>${e(awayValue)}${suffix}</b></div>`;
    return `<article class="mc-v020-card mc-v020-report"><span class="mc-v020-tag">Rapport final</span><div class="mc-v020-score"><div>${badge(home)}<h3>${e(result.homeClubName)}</h3></div><div><strong>${s(result.homeGoals)} - ${s(result.awayGoals)}</strong><p>${e(result.resultForUser || "Résultat")}</p></div><div>${badge(away)}<h3>${e(result.awayClubName)}</h3></div></div><div class="mc-v020-grid"><div><h3>Timeline</h3><div class="mc-v020-timeline">${(result.events || []).map((event) => `<div class="mc-v020-event"><b>${s(event.minute)}'</b><span>${e(event.text)}</span></div>`).join("")}</div></div><div><h3>Stats du match</h3><div class="mc-v020-stats">${row("Possession", stats.possession.home, stats.possession.away, "%")}${row("Tirs", stats.shots.home, stats.shots.away)}${row("Tirs cadrés", stats.shotsOnTarget.home, stats.shotsOnTarget.away)}${row("xG", stats.xg.home, stats.xg.away)}${row("Occasions", stats.dangerousChances.home, stats.dangerousChances.away)}</div><p class="mc-v020-note">Lecture coach : ${e(result.summary)}</p></div></div></article>`;
  }
  function prepKey(match) { return match ? match.id || `${match.matchday}_${match.homeClubId}_${match.awayClubId}` : "none"; }

  function renderMatchCenter(career = typeof getResolvedCareer === "function" ? getResolvedCareer() : null) {
    const screen = document.getElementById("match");
    if (!screen) return;
    if (!career) {
      screen.innerHTML = "<div class='section-header'><h3>Match</h3><p>Aucune carrière active.</p></div>";
      return;
    }
    const match = nextMatch(career);
    const stats = lineupStats(career);
    const gate = typeof window.btmCanPlayMatch === "function" ? window.btmCanPlayMatch(career) : { ok: true, message: "" };
    const canPrepare = gate.ok && stats.valid;
    const key = prepKey(match);
    prep[key] = prep[key] || { lineup: false, plan: false };
    if (!match) {
      screen.innerHTML = `<div class="match-center-v020"><div class="mc-v020-head"><div><span class="mc-v020-tag">Saison terminée</span><h3>Aucun match à jouer</h3></div></div>${reportHtml(career)}</div>`;
      return;
    }
    const opp = opponent(career, match) || {};
    const oppModel = opponentModel(opp);
    const ready = canPrepare && prep[key].lineup && prep[key].plan;
    screen.innerHTML = `<div class="match-center-v020"><div class="mc-v020-head"><div><span class="mc-v020-tag">Matchday Center V0.29</span><h3>${e(matchLabel(match))}</h3><p>Journée ${s(match.matchday)} · ${e(userVenue(career, match))} · Préparer, valider, jouer.</p></div><div class="mc-v020-actions"><button class="secondary-btn" id="mc-edit">Modifier la compo</button><button class="primary-btn" id="prematch-launch" ${ready ? "" : "disabled"}>${ready ? "Lancer le match" : "Préparation incomplète"}</button></div></div>${reportHtml(career)}<div class="mc-v020-board"><article class="mc-v020-club"><span class="mc-v020-tag">Nous</span><h2>${e(career.club?.name || "Ton club")}</h2><p>${e(level(career.club))} · ${e(userVenue(career, match))}</p></article><article class="mc-v020-vs"><strong>VS</strong><span>J${s(match.matchday)}</span></article><article class="mc-v020-club"><span class="mc-v020-tag">Adversaire</span><h2>${e(opp.name || "Adversaire")}</h2><p>${e(oppModel.style)} · réputation ${s(opp.reputation)}</p></article></div><div class="mc-v020-grid"><article class="mc-v020-card"><h3>Notre XI</h3><div class="mc-v020-kpis"><div><span>Formation</span><strong>${e(stats.formation)}</strong></div><div><span>Note XI</span><strong>${s(stats.rating)}</strong></div><div><span>Condition</span><strong>${s(stats.condition)}%</strong></div><div><span>Titulaires</span><strong>${s(stats.startersCount)}/${s(stats.expectedCount)}</strong></div></div>${xiHtml(career, stats)}<div class="mc-v020-toggle"><button class="secondary-btn ${prep[key].lineup ? "active" : ""}" id="mc-ok-lineup">Valider la composition</button></div></article><article class="mc-v020-card"><h3>Analyse adverse</h3><div class="mc-v020-kpis"><div><span>Défense</span><strong>${oppModel.def}</strong></div><div><span>Milieu</span><strong>${oppModel.mid}</strong></div><div><span>Attaque</span><strong>${oppModel.att}</strong></div><div><span>Forme</span><strong>${e(oppModel.form)}</strong></div></div><p><strong>Force :</strong> ${e(oppModel.strong)} · <strong>Faiblesse :</strong> ${e(oppModel.weak)}</p><p><strong>Plan observé :</strong> ${e(oppModel.formation)} · ${e(oppModel.style)}</p><p class="mc-v020-note">Recommandation : exploiter leur ${e(oppModel.weak.toLowerCase())}, rester prudent sur leur ${e(oppModel.strong.toLowerCase())}.</p><div class="mc-v020-toggle"><button class="secondary-btn ${prep[key].plan ? "active" : ""}" id="mc-ok-plan">Valider le plan de match</button></div>${gate.ok ? "" : `<div class="mc-v020-alert">${e(gate.message)}</div>`}${stats.warnings?.length ? `<div class="mc-v020-alert">${stats.warnings.slice(0, 3).map(e).join("<br>")}</div>` : ""}<div id="prematch-launch-note" class="prematch-launch-note"></div></article></div></div>`;
    bindMatchCenter(key);
  }
  function bindMatchCenter(key) {
    document.getElementById("mc-edit")?.addEventListener("click", () => document.querySelector('[data-screen="lineup"]')?.click());
    document.getElementById("mc-ok-lineup")?.addEventListener("click", () => { prep[key].lineup = !prep[key].lineup; renderMatchCenter(); });
    document.getElementById("mc-ok-plan")?.addEventListener("click", () => { prep[key].plan = !prep[key].plan; renderMatchCenter(); });
    const launch = document.getElementById("prematch-launch");
    if (launch && !launch.disabled) {
      launch.addEventListener("click", () => {
        const note = document.getElementById("prematch-launch-note");
        const result = typeof saveSimulatedMatch === "function" ? saveSimulatedMatch() : { ok: false, message: "Simulation indisponible." };
        if (!result.ok) {
          if (note) {
            note.innerHTML = `<strong>Impossible :</strong> ${e(result.message)}`;
            note.classList.add("visible");
          }
          return;
        }
        prep[key] = { lineup: false, plan: false };
        if (typeof refreshUI === "function") refreshUI();
      });
    }
  }

  window.renderMatchCenter = renderMatchCenter;
  if (typeof window.btmRegisterRender === "function") window.btmRegisterRender("match-center", renderMatchCenter);
  else {
    const previous = typeof refreshUI === "function" ? refreshUI : null;
    refreshUI = function refreshUIMatchCenterFallbackV029() { if (previous) previous(); renderMatchCenter(); };
  }

  document.addEventListener("DOMContentLoaded", () => renderMatchCenter());
})();