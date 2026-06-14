const BTM_SQUAD_ENTRYPOINT_VERSION = "0.29";
(function () {
  function ensureRenderRegistry() {
    if (window.btmRegisterRender && window.btmRunRegisteredRenders) return;

    const baseRefreshUI = typeof window.refreshUI === "function" ? window.refreshUI : null;
    const renderers = new Map();

    window.btmRegisterRender = function btmRegisterRender(name, renderer) {
      if (!name || typeof renderer !== "function") return;
      renderers.set(name, renderer);
    };

    window.btmUnregisterRender = function btmUnregisterRender(name) {
      renderers.delete(name);
    };

    window.btmRunRegisteredRenders = function btmRunRegisteredRenders(career) {
      const resolvedCareer = career || (typeof getResolvedCareer === "function" ? getResolvedCareer() : null);
      renderers.forEach((renderer, name) => {
        try {
          renderer(resolvedCareer);
        } catch (error) {
          console.error("[BTM render registry] Renderer failed:", name, error);
        }
      });
    };

    window.refreshUI = function refreshUIV029Registry() {
      if (baseRefreshUI) baseRefreshUI();
      window.btmRunRegisteredRenders();
    };
  }

  ensureRenderRegistry();

  const state = { filter: "all", selectedId: null };
  const groups = { all: [], GK: ["GK"], DEF: ["DD", "DC", "DG"], MID: ["MDC", "MC", "MOC"], ATT: ["AD", "AG", "BU"] };

  function e(value) {
    if (typeof escapeHtml === "function") return escapeHtml(value);
    return String(value ?? "").replace(/[&<>"]/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[char]));
  }

  function s(value, fallback = "—") {
    if (typeof safeText === "function") return safeText(value, fallback);
    return value === undefined || value === null || value === "" ? fallback : String(value);
  }

  function money(value) { return typeof formatMoney === "function" ? formatMoney(value) : s(value); }
  function pos(position) { return typeof getPositionLabel === "function" ? getPositionLabel(position) : s(position); }
  function sorted(career) {
    const players = Array.isArray(career?.players) ? career.players : [];
    return typeof sortPlayers === "function" ? sortPlayers(players) : players.slice();
  }
  function visible(players) {
    const allowed = groups[state.filter] || [];
    return allowed.length ? players.filter((player) => allowed.includes(player.primaryPosition)) : players;
  }
  function tag(nationality) {
    const country = s(nationality);
    const code = country.slice(0, 3).toUpperCase();
    return `<span class="squad-v012-country"><span class="squad-v012-country-code">${e(code)}</span>${e(country)}</span>`;
  }
  function filters() {
    return `<div class="squad-v012-filters">${[["all", "Tous"], ["GK", "Gardiens"], ["DEF", "Défense"], ["MID", "Milieu"], ["ATT", "Attaque"]].map(([key, label]) => `<button class="squad-v012-filter${state.filter === key ? " active" : ""}" data-squad-filter="${key}">${label}</button>`).join("")}</div>`;
  }
  function row(player) {
    const secondary = Array.isArray(player.secondaryPositions) && player.secondaryPositions.length ? player.secondaryPositions.join("/") : "—";
    return `<button class="squad-v012-row${player.id === state.selectedId ? " active" : ""}" data-squad-player="${e(player.id)}" type="button"><span class="squad-v012-shirt">${e(player.primaryPosition || "?")}</span><span class="squad-v012-name"><strong>${e(player.name)}</strong><span>${e(pos(player.primaryPosition))} · Sec. ${e(secondary)} · ${tag(player.nationality)}</span></span><span class="squad-v012-cell"><small>OVR</small>${s(player.overall)}</span><span class="squad-v012-cell"><small>POT</small>${s(player.potential)}</span><span class="squad-v012-cond">${s(player.condition, 100)}%</span></button>`;
  }
  function dossier(player) {
    if (!player) return `<article class="squad-v012-dossier squad-v012-empty"><h3>Dossier joueur</h3><p>Aucun joueur dans ce filtre.</p></article>`;
    const secondary = Array.isArray(player.secondaryPositions) && player.secondaryPositions.length ? player.secondaryPositions.join(" / ") : "Aucun";
    const bars = [["Attaque", player.attack], ["Défense", player.defense], ["Physique", player.physical], ["Mental", player.mental]];
    return `<article class="squad-v012-dossier"><div class="squad-v012-big-rating">${s(player.overall)}</div><div class="squad-v012-player-top"><div class="squad-v012-silhouette" aria-hidden="true"></div><div><p class="eyebrow">Dossier joueur</p><h3>${e(player.name)}</h3><p class="squad-v012-role">${e(pos(player.primaryPosition))} · ${e(player.age)} ans · ${tag(player.nationality)}</p><div class="squad-v012-badges"><span class="squad-v012-badge">POT ${s(player.potential)}</span><span class="squad-v012-badge">${s(player.condition, 100)}% condition</span><span class="squad-v012-badge">${e(player.injuryStatus || "Disponible")}</span></div></div></div><div class="squad-v012-info-grid"><div class="squad-v012-info"><span>Poste principal</span><strong>${e(player.primaryPosition)}</strong></div><div class="squad-v012-info"><span>Postes secondaires</span><strong>${e(secondary)}</strong></div><div class="squad-v012-info"><span>Valeur</span><strong>${money(player.value)}</strong></div><div class="squad-v012-info"><span>Salaire</span><strong>${money(player.salary)}</strong></div><div class="squad-v012-info"><span>Contrat</span><strong>${s(player.contractYears)} an(s)</strong></div><div class="squad-v012-info"><span>Morale</span><strong>${e(player.morale || "Normal")}</strong></div></div><div class="squad-v012-bars">${bars.map(([label, value]) => `<div class="squad-v012-bar"><span>${label}</span><div class="squad-v012-bar-track"><div class="squad-v012-bar-fill" style="width:${Math.max(0, Math.min(100, Number(value) || 0))}%"></div></div><strong>${s(value)}</strong></div>`).join("")}</div><div class="squad-v012-coach-note"><strong>Note coach</strong><br>Profil à surveiller selon la forme, la fatigue et les besoins tactiques du prochain match.</div></article>`;
  }

  function render(career = typeof getResolvedCareer === "function" ? getResolvedCareer() : null) {
    const container = document.getElementById("players-preview");
    if (!container) return;
    if (!career) {
      container.innerHTML = `<div class="empty-state compact-empty"><span>👥</span><h4>Aucune carrière active</h4><p>Crée ou charge une carrière.</p></div>`;
      return;
    }
    const players = sorted(career);
    const shownPlayers = visible(players);
    if (!shownPlayers.some((player) => player.id === state.selectedId)) state.selectedId = shownPlayers[0]?.id || players[0]?.id || null;
    const selected = players.find((player) => player.id === state.selectedId) || shownPlayers[0] || players[0] || null;
    container.innerHTML = `<div class="squad-v012"><article class="squad-v012-board"><div class="squad-v012-head"><div><p class="eyebrow">Effectif V0.29</p><h3>Liste du groupe</h3></div><div class="squad-v012-note">${e(career.club?.shortName || career.club?.name || "Club")}<br>observer · trier · décider</div></div>${filters()}<div class="squad-v012-list-head"><span></span><span>Joueur</span><span>OVR</span><span>POT</span><span>Cond.</span></div><div class="squad-v012-list">${shownPlayers.map(row).join("") || `<div class="squad-v012-empty">Aucun joueur dans ce filtre.</div>`}</div></article>${dossier(selected)}</div>`;
  }

  window.renderPlayersPreview = render;
  window.btmRegisterRender("squad", render);

  document.addEventListener("click", (event) => {
    const filterButton = event.target.closest("[data-squad-filter]");
    if (filterButton) {
      state.filter = filterButton.dataset.squadFilter || "all";
      state.selectedId = null;
      render();
      return;
    }
    const playerButton = event.target.closest("[data-squad-player]");
    if (playerButton) {
      state.selectedId = playerButton.dataset.squadPlayer;
      render();
    }
  });

  document.addEventListener("DOMContentLoaded", () => render());
})();