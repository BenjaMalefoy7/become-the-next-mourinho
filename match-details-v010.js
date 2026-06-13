const MATCH_DETAILS_VERSION = "0.10";

function detailEscape(value) {
  if (typeof escapeHtml === "function") return escapeHtml(value);
  return String(value ?? "").replace(/[&<>"]/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[char]));
}

function detailClamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function detailRoundDecimal(value, digits = 1) {
  const factor = Math.pow(10, digits);
  return Math.round(value * factor) / factor;
}

function detailPlayerById(career, playerId) {
  return Array.isArray(career?.players) ? career.players.find((player) => player.id === playerId) || null : null;
}

function detailUserStarters(career) {
  const starters = Array.isArray(career?.lineup?.starters) ? career.lineup.starters : [];
  return starters.map((starter) => detailPlayerById(career, starter.playerId)).filter(Boolean);
}

function detailPickUserPlayer(career, preferredPositions = []) {
  const starters = detailUserStarters(career);
  const preferred = starters.filter((player) => preferredPositions.includes(player.primaryPosition));
  const pool = preferred.length ? preferred : starters;
  if (!pool.length) return "Joueur du match";
  const sorted = pool.slice().sort((a, b) => (Number(b.overall) || 0) - (Number(a.overall) || 0));
  const top = sorted.slice(0, Math.min(5, sorted.length));
  return top[Math.floor(Math.random() * top.length)].name;
}

function detailBuildStats(career, match, result) {
  const userClubId = career?.club?.id;
  const userIsHome = match.homeClubId === userClubId;
  const homeStrength = Number(result.homeStrength) || 68;
  const awayStrength = Number(result.awayStrength) || 68;
  const diff = homeStrength - awayStrength;
  const homeGoals = Number(result.homeGoals) || 0;
  const awayGoals = Number(result.awayGoals) || 0;

  const homePossession = detailClamp(Math.round(50 + diff * 0.55 + (Math.random() * 10 - 5)), 34, 66);
  const awayPossession = 100 - homePossession;

  const homeXg = detailClamp(0.45 + homeGoals * 0.55 + homeStrength / 95 + Math.random() * 0.6 + Math.max(diff, -20) / 55, 0.2, 4.4);
  const awayXg = detailClamp(0.40 + awayGoals * 0.55 + awayStrength / 100 + Math.random() * 0.6 - Math.min(diff, 20) / 58, 0.2, 4.2);

  const homeShots = detailClamp(Math.round(homeXg * 4.6 + homePossession / 11 + Math.random() * 3), homeGoals + 3, 24);
  const awayShots = detailClamp(Math.round(awayXg * 4.5 + awayPossession / 12 + Math.random() * 3), awayGoals + 3, 23);
  const homeOnTarget = detailClamp(Math.round(homeShots * (0.32 + Math.random() * 0.13)) + homeGoals, homeGoals, homeShots);
  const awayOnTarget = detailClamp(Math.round(awayShots * (0.32 + Math.random() * 0.13)) + awayGoals, awayGoals, awayShots);

  const userGoals = userIsHome ? homeGoals : awayGoals;
  const opponentGoals = userIsHome ? awayGoals : homeGoals;
  const userShots = userIsHome ? homeShots : awayShots;
  const opponentShots = userIsHome ? awayShots : homeShots;
  const userPossession = userIsHome ? homePossession : awayPossession;

  let momentum = "Match équilibré";
  if (userGoals > opponentGoals && userShots >= opponentShots) momentum = "Victoire maîtrisée";
  else if (userGoals > opponentGoals) momentum = "Victoire efficace";
  else if (userGoals < opponentGoals && userPossession >= 52) momentum = "Défaite frustrante";
  else if (userGoals < opponentGoals) momentum = "Match compliqué";
  else if (Math.abs(userShots - opponentShots) <= 2) momentum = "Nul logique";

  return {
    possession: { home: homePossession, away: awayPossession },
    shots: { home: homeShots, away: awayShots },
    shotsOnTarget: { home: homeOnTarget, away: awayOnTarget },
    xg: { home: detailRoundDecimal(homeXg), away: detailRoundDecimal(awayXg) },
    dangerousChances: {
      home: detailClamp(Math.round(homeXg * 1.7 + Math.random() * 2), homeGoals, 8),
      away: detailClamp(Math.round(awayXg * 1.7 + Math.random() * 2), awayGoals, 8)
    },
    momentum,
    userPossession,
    userShots,
    opponentShots
  };
}

function detailBuildExtraEvents(career, match, result, stats) {
  const events = Array.isArray(result.events) ? result.events.slice() : [];
  const userIsHome = match.homeClubId === career?.club?.id;
  const userSide = userIsHome ? "home" : "away";
  const opponentSide = userIsHome ? "away" : "home";
  const userShots = userIsHome ? stats.shots.home : stats.shots.away;
  const opponentShots = userIsHome ? stats.shots.away : stats.shots.home;

  if (userShots >= opponentShots + 4) {
    events.push({ minute: 28 + Math.floor(Math.random() * 25), type: "chance", side: userSide, text: "Grosse période de domination, plusieurs occasions s’enchaînent." });
  }
  if (opponentShots >= userShots + 4) {
    events.push({ minute: 34 + Math.floor(Math.random() * 25), type: "danger", side: opponentSide, text: "L’adversaire met la pression et force la défense à reculer." });
  }
  if ((stats.xg.home + stats.xg.away) >= 3.2) {
    events.push({ minute: 65 + Math.floor(Math.random() * 18), type: "tempo", side: "neutral", text: "Le match s’ouvre, les deux équipes trouvent plus d’espaces." });
  } else if ((Number(result.homeGoals) || 0) + (Number(result.awayGoals) || 0) <= 1) {
    events.push({ minute: 72 + Math.floor(Math.random() * 14), type: "tempo", side: "neutral", text: "Le rythme retombe, chaque perte de balle devient importante." });
  }

  events.sort((a, b) => a.minute - b.minute);
  return events;
}

function detailManOfMatch(career, match, result) {
  const userIsHome = match.homeClubId === career?.club?.id;
  const userGoals = userIsHome ? result.homeGoals : result.awayGoals;
  const opponentGoals = userIsHome ? result.awayGoals : result.homeGoals;
  if (userGoals > opponentGoals) return detailPickUserPlayer(career, ["BU", "AG", "AD", "MOC", "MC"]);
  if (userGoals === opponentGoals) return detailPickUserPlayer(career, ["GK", "DC", "MDC", "MC"]);
  return "Joueur adverse";
}

function detailSummary(career, match, result, stats) {
  const clubName = career?.club?.name || "Ton équipe";
  const userIsHome = match.homeClubId === career?.club?.id;
  const userGoals = userIsHome ? result.homeGoals : result.awayGoals;
  const opponentGoals = userIsHome ? result.awayGoals : result.homeGoals;
  const resultText = userGoals > opponentGoals ? "s’impose" : userGoals < opponentGoals ? "s’incline" : "arrache un nul";
  const controlText = stats.userPossession >= 55 ? "en ayant davantage le ballon" : stats.userPossession <= 45 ? "en subissant de longues séquences" : "dans un match assez équilibré";
  const shotText = stats.userShots > stats.opponentShots ? "L’équipe a créé plus de situations dangereuses que son adversaire." : stats.userShots < stats.opponentShots ? "L’adversaire a davantage frappé au but." : "Les deux équipes ont eu un volume d’occasions proche.";
  return `${clubName} ${resultText} ${controlText}. ${shotText}`;
}

(function initMatchDetailsV010() {
  const originalSimulateCurrentMatch = typeof simulateCurrentMatch === "function" ? simulateCurrentMatch : null;
  const originalMdCreateUserHistoryItem = typeof mdCreateUserHistoryItem === "function" ? mdCreateUserHistoryItem : null;

  if (originalSimulateCurrentMatch) {
    simulateCurrentMatch = function simulateCurrentMatchV010(career, match) {
      const result = originalSimulateCurrentMatch(career, match);
      const stats = detailBuildStats(career, match, result);
      result.matchStats = stats;
      result.events = detailBuildExtraEvents(career, match, result, stats);
      result.manOfMatch = detailManOfMatch(career, match, result);
      result.summary = detailSummary(career, match, result, stats);
      result.detailsVersion = MATCH_DETAILS_VERSION;
      return result;
    };
  }

  if (originalMdCreateUserHistoryItem) {
    mdCreateUserHistoryItem = function mdCreateUserHistoryItemV010(career, match, result) {
      const item = originalMdCreateUserHistoryItem(career, match, result);
      item.matchStats = result.matchStats || null;
      item.manOfMatch = result.manOfMatch || null;
      item.summary = result.summary || null;
      item.detailsVersion = result.detailsVersion || MATCH_DETAILS_VERSION;
      return item;
    };
  }

  function scoreLine(result) {
    return `${result.homeClubName} ${result.homeGoals} - ${result.awayGoals} ${result.awayClubName}`;
  }

  function statRow(label, home, away, suffix = "") {
    return `<div class="details-stat-row"><span>${detailEscape(home)}${suffix}</span><strong>${detailEscape(label)}</strong><span>${detailEscape(away)}${suffix}</span></div>`;
  }

  function renderMatchDetails(career) {
    const screen = document.getElementById("match");
    if (!screen || !career || !career.lastMatchResult) return;
    screen.querySelectorAll(".match-details-card").forEach((item) => item.remove());

    const result = career.lastMatchResult;
    const stats = result.matchStats;
    if (!stats) return;

    const card = document.createElement("article");
    card.className = "panel match-details-card";
    card.innerHTML = `
      <div class="details-header">
        <div>
          <p class="eyebrow">Analyse du match V0.10</p>
          <h3>${detailEscape(scoreLine(result))}</h3>
          <p>${detailEscape(result.summary || "Résumé indisponible.")}</p>
        </div>
        <div class="details-motm"><span>Homme du match</span><strong>${detailEscape(result.manOfMatch || "—")}</strong></div>
      </div>

      <div class="details-stats-grid">
        ${statRow("Possession", stats.possession.home, stats.possession.away, "%")}
        ${statRow("Tirs", stats.shots.home, stats.shots.away)}
        ${statRow("Tirs cadrés", stats.shotsOnTarget.home, stats.shotsOnTarget.away)}
        ${statRow("xG", stats.xg.home, stats.xg.away)}
        ${statRow("Occasions dangereuses", stats.dangerousChances.home, stats.dangerousChances.away)}
      </div>

      <div class="details-events">
        ${(Array.isArray(result.events) ? result.events : []).map((event) => `<span class="details-event details-event-${detailEscape(event.type || "info")}"><b>${event.minute}'</b> ${detailEscape(event.text)}</span>`).join("")}
      </div>
    `;

    const lastResult = screen.querySelector(".match-result-card");
    if (lastResult && lastResult.nextSibling) screen.insertBefore(card, lastResult.nextSibling);
    else if (lastResult) lastResult.after(card);
    else screen.appendChild(card);
  }

  function updateTextsV010(career) {
    const footer = document.querySelector(".sidebar-footer");
    if (footer) footer.textContent = "V0.10 — Match enrichi";
    if (typeof setText === "function") setText("dashboard-description", "V0.10 : résultats enrichis avec possession, tirs, xG simplifié et résumé de match.");
    const panels = document.querySelectorAll("#dashboard .panel h3");
    const texts = document.querySelectorAll("#dashboard .panel p");
    if (panels[0]) panels[0].textContent = "Statut V0.10";
    if (texts[0]) texts[0].textContent = "Les résultats de match affichent maintenant des stats, un résumé et un homme du match.";
    if (panels[1]) panels[1].textContent = "Prochaine évolution";
    if (texts[1]) texts[1].textContent = "V0.11 : améliorer la fatigue, la forme et la morale après les matchs.";
  }

  const originalRefreshUI = typeof refreshUI === "function" ? refreshUI : null;
  refreshUI = function refreshUIV010() {
    if (originalRefreshUI) originalRefreshUI();
    const career = typeof getResolvedCareer === "function" ? getResolvedCareer() : null;
    updateTextsV010(career);
    renderMatchDetails(career);
  };

  document.addEventListener("DOMContentLoaded", () => {
    const career = typeof getResolvedCareer === "function" ? getResolvedCareer() : null;
    updateTextsV010(career);
    renderMatchDetails(career);
  });
})();