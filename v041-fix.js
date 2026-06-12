// V0.4.1 hotfix
// Corrige les cas où l'onglet Effectif retombait sur les 3 joueurs de démonstration
// au lieu d'afficher ou générer l'effectif complet de carrière.

const BTM_PATCH_VERSION = "0.4.1";

function btmRepairActiveCareerSquad() {
  const careers = loadCareers();
  if (!careers.length) return null;

  let activeId = getActiveCareerId();
  if (!activeId) {
    activeId = careers[0].id;
    setActiveCareerId(activeId);
  }

  const careerIndex = careers.findIndex(function(career) {
    return career.id === activeId;
  });

  if (careerIndex === -1) return null;

  const career = careers[careerIndex];
  const shouldUseGeneratedSquad = !career.squadSource || career.squadSource === "generated";
  const hasIncompleteSquad = !Array.isArray(career.players) || career.players.length < SQUAD_TEMPLATE.length;

  if (shouldUseGeneratedSquad && hasIncompleteSquad && career.club) {
    career.players = generateStartingSquad(career.club, career.difficulty || "ambitious");
    career.finances = career.finances || {};
    career.finances.wageBudget = calculateWageBill(career.players);
    career.version = BTM_PATCH_VERSION;
    career.updatedAt = new Date().toISOString();
    careers[careerIndex] = career;
    saveCareers(careers);
  }

  return career;
}

const btmOriginalRefreshUI = refreshUI;
refreshUI = function() {
  btmRepairActiveCareerSquad();
  btmOriginalRefreshUI();
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