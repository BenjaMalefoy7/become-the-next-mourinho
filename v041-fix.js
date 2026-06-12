// V0.4.2 hotfix
// Corrige la désynchronisation entre l'interface manager et la carrière active.
// Si l'ID actif est absent ou invalide, le jeu reprend une sauvegarde valide.
// Il répare aussi les effectifs incomplets créés avant la V0.4.1.

const BTM_PATCH_VERSION = "0.4.2";

function btmGetBestCareerFallback(careers) {
  if (!Array.isArray(careers) || !careers.length) return null;

  return careers.slice().sort(function(a, b) {
    return new Date(b.updatedAt || b.createdAt || 0) - new Date(a.updatedAt || a.createdAt || 0);
  })[0];
}

function btmRepairCareerSquad(career) {
  if (!career || !career.club) return career;

  const shouldUseGeneratedSquad = !career.squadSource || career.squadSource === "generated";
  const expectedSquadSize = Array.isArray(SQUAD_TEMPLATE) ? SQUAD_TEMPLATE.length : 24;
  const hasIncompleteSquad = !Array.isArray(career.players) || career.players.length < expectedSquadSize;

  if (shouldUseGeneratedSquad && hasIncompleteSquad) {
    career.players = generateStartingSquad(career.club, career.difficulty || "ambitious");
    career.finances = career.finances || {};
    career.finances.wageBudget = calculateWageBill(career.players);
    career.version = BTM_PATCH_VERSION;
    career.updatedAt = new Date().toISOString();
    return Object.assign({}, career, { __btmRepaired: true });
  }

  return career;
}

function btmRepairActiveCareerSquad() {
  const careers = loadCareers();
  if (!careers.length) {
    setActiveCareerId(null);
    return null;
  }

  let activeId = getActiveCareerId();
  let careerIndex = careers.findIndex(function(career) {
    return career.id === activeId;
  });

  if (careerIndex === -1) {
    const fallbackCareer = btmGetBestCareerFallback(careers);
    if (!fallbackCareer) {
      setActiveCareerId(null);
      return null;
    }

    activeId = fallbackCareer.id;
    setActiveCareerId(activeId);
    careerIndex = careers.findIndex(function(career) {
      return career.id === activeId;
    });
  }

  if (careerIndex === -1) return null;

  const repairedCareer = btmRepairCareerSquad(careers[careerIndex]);

  if (repairedCareer && repairedCareer.__btmRepaired) {
    delete repairedCareer.__btmRepaired;
    careers[careerIndex] = repairedCareer;
    saveCareers(careers);
    return repairedCareer;
  }

  return careers[careerIndex];
}

const btmOriginalGetActiveCareer = getActiveCareer;
getActiveCareer = function() {
  const career = btmOriginalGetActiveCareer();
  if (career) return career;
  return btmRepairActiveCareerSquad();
};

const btmOriginalRefreshUI = refreshUI;
refreshUI = function() {
  btmRepairActiveCareerSquad();
  btmOriginalRefreshUI();
};

const btmOriginalEnterApp = enterApp;
enterApp = function(screenId) {
  btmRepairActiveCareerSquad();
  btmOriginalEnterApp(screenId || "dashboard");
};

renderPlayersPreview = function() {
  const container = document.getElementById("players-preview");
  if (!container) return;

  const activeCareer = btmRepairActiveCareerSquad() || getActiveCareer();

  if (!activeCareer) {
    container.innerHTML = `
      <div class="empty-state compact-empty">
        <span>👥</span>
        <h4>Aucune carrière active</h4>
        <p>Retourne à l’accueil, crée une nouvelle partie ou charge une sauvegarde.</p>
      </div>
    `;
    return;
  }

  const careerPlayers = Array.isArray(activeCareer.players) ? activeCareer.players : [];

  if (!careerPlayers.length) {
    container.innerHTML = `
      <div class="empty-state compact-empty">
        <span>👥</span>
        <h4>Aucun effectif disponible</h4>
        <p>Cette sauvegarde utilise peut-être une option d’effectif qui n’est pas encore branchée.</p>
      </div>
    `;
    return;
  }

  const players = sortPlayers(careerPlayers);
  const clubName = activeCareer.club ? activeCareer.club.name : "Ton club";

  container.innerHTML = players.map(function(player) {
    const secondary = Array.isArray(player.secondaryPositions) && player.secondaryPositions.length
      ? " · Sec. " + player.secondaryPositions.join("/")
      : "";

    return `
      <article class="player-card">
        <h4>${escapeHtml(player.name)}</h4>
        <p>${escapeHtml(clubName)} · ${escapeHtml(getPositionLabel(player.primaryPosition))}${secondary} · ${player.age} ans · ${escapeHtml(player.nationality)}</p>
        <div class="stat-row">
          <span>OVR<br><strong>${player.overall}</strong></span>
          <span>ATT<br><strong>${player.attack}</strong></span>
          <span>DEF<br><strong>${player.defense}</strong></span>
          <span>PHY<br><strong>${player.physical}</strong></span>
          <span>POT<br><strong>${player.potential}</strong></span>
        </div>
        <p class="save-meta">Valeur : ${formatMoney(player.value)} · Salaire : ${formatMoney(player.salary)} · Contrat : ${player.contractYears} an(s) · ${escapeHtml(player.injuryStatus)}</p>
      </article>
    `;
  }).join("");
};
