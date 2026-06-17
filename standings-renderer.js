const BTM_STANDINGS_RENDERER_VERSION = "0.46S";

(function () {
  function e(value) {
    if (typeof escapeHtml === "function") return escapeHtml(value);
    return String(value ?? "").replace(/[&<>"']/g, (char) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;"
    }[char]));
  }

  function n(value, fallback = 0) {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : fallback;
  }

  function getTeams(career) {
    if (Array.isArray(career?.clubs) && career.clubs.length) return career.clubs;
    if (Array.isArray(career?.standings) && career.standings.length) {
      return career.standings.map((row) => ({
        id: row.clubId,
        name: row.club
      }));
    }
    return [];
  }

  function createRow(team) {
    return {
      clubId: team.id || team.clubId || team.name,
      club: team.name || team.club || "Club inconnu",
      played: 0,
      wins: 0,
      draws: 0,
      losses: 0,
      goalsFor: 0,
      goalsAgainst: 0,
      gd: 0,
      points: 0
    };
  }

  function ensureRow(map, clubId, label) {
    const key = clubId || label || "unknown";
    if (!map.has(key)) {
      map.set(key, createRow({ id: key, name: label || key }));
    }
    return map.get(key);
  }

  function applyMatch(row, goalsFor, goalsAgainst) {
    row.played += 1;
    row.goalsFor += goalsFor;
    row.goalsAgainst += goalsAgainst;
    row.gd = row.goalsFor - row.goalsAgainst;
    if (goalsFor > goalsAgainst) {
      row.wins += 1;
      row.points += 3;
    } else if (goalsFor === goalsAgainst) {
      row.draws += 1;
      row.points += 1;
    } else {
      row.losses += 1;
    }
  }

  function sortRows(rows) {
    return rows.slice().sort((a, b) =>
      n(b.points) - n(a.points) ||
      n(b.gd) - n(a.gd) ||
      n(b.goalsFor) - n(a.goalsFor) ||
      String(a.club || "").localeCompare(String(b.club || ""), "fr")
    );
  }

  function hasPlayedFixtures(career) {
    return Array.isArray(career?.fixtures) && career.fixtures.some((match) => match && (match.played || match.status === "played") && Number.isFinite(Number(match.homeGoals)) && Number.isFinite(Number(match.awayGoals)));
  }

  function computeDynamicStandings(career) {
    if (!career) return [];

    const teams = getTeams(career);
    const map = new Map();
    teams.forEach((team) => {
      const row = createRow(team);
      map.set(row.clubId, row);
    });

    if (hasPlayedFixtures(career)) {
      career.fixtures.forEach((match) => {
        if (!match || !(match.played || match.status === "played")) return;
        const homeGoals = Number(match.homeGoals);
        const awayGoals = Number(match.awayGoals);
        if (!Number.isFinite(homeGoals) || !Number.isFinite(awayGoals)) return;

        const home = ensureRow(map, match.homeClubId, match.homeClubName);
        const away = ensureRow(map, match.awayClubId, match.awayClubName);
        applyMatch(home, homeGoals, awayGoals);
        applyMatch(away, awayGoals, homeGoals);
      });
      return sortRows(Array.from(map.values()));
    }

    const savedStandings = Array.isArray(career.standings) ? career.standings : [];
    if (savedStandings.length) {
      return sortRows(savedStandings.map((row) => ({
        clubId: row.clubId,
        club: row.club,
        played: n(row.played),
        wins: n(row.wins),
        draws: n(row.draws),
        losses: n(row.losses),
        goalsFor: n(row.goalsFor),
        goalsAgainst: n(row.goalsAgainst),
        gd: n(row.gd),
        points: n(row.points)
      })));
    }

    return sortRows(Array.from(map.values()));
  }

  function zoneForPosition(position, total) {
    if (position <= 4) return { key: "ucl", label: "C1" };
    if (position === 5) return { key: "uel", label: "C3" };
    if (position === 6) return { key: "uecl", label: "C4" };
    if (position >= Math.max(1, total - 2)) return { key: "relegation", label: "REL" };
    return { key: "neutral", label: "—" };
  }

  function renderEmpty(container) {
    container.innerHTML = `
      <div class="section-header">
        <h3>Classement</h3>
        <p>Aucune carrière active.</p>
      </div>
      <div class="empty-state compact-empty">
        <span>📊</span>
        <h4>Aucun classement disponible</h4>
        <p>Crée ou charge une carrière pour afficher le classement.</p>
      </div>
    `;
  }

  function renderStandings(career) {
    const container = document.getElementById("standings");
    if (!container) return;

    if (!career) {
      renderEmpty(container);
      return;
    }

    const rows = computeDynamicStandings(career);
    const userClubId = career.club?.id;
    const userIndex = rows.findIndex((row) => row.clubId === userClubId);
    const userRank = userIndex >= 0 ? userIndex + 1 : null;
    const leader = rows[0];
    const userRow = userIndex >= 0 ? rows[userIndex] : null;

    container.innerHTML = `
      <div class="section-header section-header-row standings-header">
        <div>
          <h3>Classement</h3>
          <p>${e(career.league?.name || "Premier League")} · Saison ${e(career.season || career.league?.season || "2025/2026")}</p>
        </div>
        <span class="standings-rank-pill">${userRank ? "Ton club : " + userRank + "e" : "Ton club : —"}</span>
      </div>

      <div class="kpi-grid standings-kpis">
        <article class="kpi-card"><p>Leader</p><strong>${e(leader?.club || "—")}</strong></article>
        <article class="kpi-card"><p>Points de ton club</p><strong>${userRow ? n(userRow.points) : "—"}</strong></article>
        <article class="kpi-card"><p>Matchs joués</p><strong>${userRow ? n(userRow.played) : "—"}</strong></article>
      </div>

      <article class="panel standings-table-card">
        <table aria-label="Classement du championnat">
          <thead>
            <tr>
              <th>#</th>
              <th>Club</th>
              <th>MJ</th>
              <th>V</th>
              <th>N</th>
              <th>D</th>
              <th>BP</th>
              <th>BC</th>
              <th>Diff</th>
              <th>Pts</th>
            </tr>
          </thead>
          <tbody>
            ${rows.map((row, index) => {
              const rank = index + 1;
              const zone = zoneForPosition(rank, rows.length);
              const zoneClass = zone.key !== "neutral" ? " standings-zone-" + zone.key : "";
              const userClass = row.clubId === userClubId ? " standings-user-row" : "";
              return `
                <tr class="${zoneClass.trim()}${userClass}">
                  <td><strong>${rank}</strong></td>
                  <td><span class="standings-zone-pill${zoneClass}">${zone.label}</span> <strong>${e(row.club)}</strong></td>
                  <td>${n(row.played)}</td>
                  <td>${n(row.wins)}</td>
                  <td>${n(row.draws)}</td>
                  <td>${n(row.losses)}</td>
                  <td>${n(row.goalsFor)}</td>
                  <td>${n(row.goalsAgainst)}</td>
                  <td>${n(row.gd)}</td>
                  <td><strong>${n(row.points)}</strong></td>
                </tr>
              `;
            }).join("")}
          </tbody>
        </table>
      </article>
    `;
  }

  window.computeDynamicStandings = computeDynamicStandings;
  window.renderStandingsScreen = renderStandings;

  if (typeof window.btmRegisterRender === "function") {
    window.btmRegisterRender("standings", renderStandings);
  } else {
    document.addEventListener("DOMContentLoaded", () => renderStandings(typeof getResolvedCareer === "function" ? getResolvedCareer() : null));
  }
})();
