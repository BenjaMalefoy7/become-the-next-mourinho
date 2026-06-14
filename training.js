const BTM_TRAINING_VERSION = "0.29";
(function () {
  const groups = { GK: ["GK"], DEF: ["DD", "DC", "DG"], MID: ["MDC", "MC", "MOC"], ATT: ["AD", "AG", "BU"] };
  const labels = { GK: "Gardiens", DEF: "Défense", MID: "Milieu", ATT: "Attaque" };
  const focuses = { balanced: "Équilibré", physical: "Physique", technical: "Technique", tactical: "Tactique", rest: "Repos" };

  function e(value) {
    if (typeof escapeHtml === "function") return escapeHtml(value);
    return String(value ?? "").replace(/[&<>"]/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[char]));
  }
  function active() {
    const id = typeof getActiveCareerId === "function" ? getActiveCareerId() : null;
    const careers = typeof loadCareers === "function" ? loadCareers() : [];
    const index = careers.findIndex((career) => career.id === id);
    return { careers, index, career: index >= 0 ? careers[index] : null };
  }
  function save(state) {
    if (state.index < 0 || !state.career) return;
    state.career.updatedAt = new Date().toISOString();
    state.careers[state.index] = state.career;
    if (typeof saveCareers === "function") saveCareers(state.careers, { silent: true });
  }
  function ensure(career) {
    career.trainingPlan = career.trainingPlan || { GK: "balanced", DEF: "balanced", MID: "balanced", ATT: "balanced" };
    return career.trainingPlan;
  }
  function pool(career, group) {
    return (career.players || []).filter((player) => (groups[group] || []).includes(player.primaryPosition));
  }
  function dayDiff(before, after) {
    try { return Math.max(0, Math.round((new Date(String(after) + "T12:00:00") - new Date(String(before) + "T12:00:00")) / 86400000)); }
    catch (_) { return 0; }
  }
  function set(group, focus) {
    const state = active();
    if (!state.career) return;
    ensure(state.career)[group] = focus;
    save(state);
    render(state.career);
  }
  function improve(player, focus) {
    if (focus === "rest") {
      player.condition = Math.min(100, (Number(player.condition) || 100) + 3);
      return;
    }
    player.condition = Math.max(55, (Number(player.condition) || 100) - (focus === "physical" ? 3 : 1));
    if (Math.random() > 0.35) return;
    if (focus === "physical") player.physical = Math.min(99, (Number(player.physical) || 60) + 1);
    else if (focus === "technical") player.attack = Math.min(99, (Number(player.attack) || 60) + 1);
    else if (focus === "tactical") player.mental = Math.min(99, (Number(player.mental) || 60) + 1);
    else {
      player.attack = Math.min(99, (Number(player.attack) || 60) + (Math.random() > 0.7 ? 1 : 0));
      player.mental = Math.min(99, (Number(player.mental) || 60) + (Math.random() > 0.7 ? 1 : 0));
    }
  }
  function applyDays(days) {
    const state = active();
    if (!state.career) return;
    const plan = ensure(state.career);
    const total = Math.max(1, Number(days) || 1);
    for (let i = 0; i < total; i += 1) {
      Object.keys(groups).forEach((group) => pool(state.career, group).forEach((player) => improve(player, plan[group] || "balanced")));
    }
    state.career.lastTrainingUpdate = new Date().toISOString();
    save(state);
  }

  function render(career = typeof getResolvedCareer === "function" ? getResolvedCareer() : null) {
    const screen = document.getElementById("training");
    if (!screen) return;
    if (!career) {
      screen.innerHTML = '<div class="section-header"><h3>Entraînement</h3><p>Aucune carrière active.</p></div>';
      return;
    }
    const plan = ensure(career);
    screen.innerHTML = `<div class="section-header"><p class="eyebrow">Entraînement V0.29</p><h3>Plan de la semaine</h3><p>Choisis un focus par groupe. Les effets s’appliquent uniquement quand un jour avance réellement.</p></div><div class="training-v018">${Object.keys(groups).map((group) => {
      const players = pool(career, group);
      const avg = players.length ? Math.round(players.reduce((total, player) => total + (Number(player.condition) || 100), 0) / players.length) : 0;
      return `<article class="training-v018-card"><p class="eyebrow">${e(group)}</p><h3>${e(labels[group])}</h3><p>${players.length} joueur(s) · condition moyenne ${avg}%</p><div class="training-v018-focus">${Object.entries(focuses).map(([key, label]) => `<button data-training-group="${group}" data-training-focus="${key}" class="${plan[group] === key ? "active" : ""}">${e(label)}</button>`).join("")}</div><div class="training-v018-note">Focus actuel : ${e(focuses[plan[group]] || "Équilibré")}</div></article>`;
    }).join("")}</div>`;
    screen.querySelectorAll("[data-training-group]").forEach((button) => button.addEventListener("click", () => set(button.dataset.trainingGroup, button.dataset.trainingFocus)));
  }

  const oldAdvance = window.btmAdvanceSeasonDay;
  window.btmAdvanceSeasonDay = function trainingAdvanceWrapper(days) {
    const before = active().career?.currentDate;
    if (oldAdvance) oldAdvance(days);
    const after = active().career?.currentDate;
    const moved = before && after && before !== after;
    if (moved) {
      applyDays(dayDiff(before, after) || 1);
      if (typeof refreshUI === "function") refreshUI();
    }
  };
  window.btmApplyTrainingDays = applyDays;

  if (typeof window.btmRegisterRender === "function") window.btmRegisterRender("training", render);
  else {
    const previous = typeof refreshUI === "function" ? refreshUI : null;
    refreshUI = function refreshUITrainingFallbackV029() { if (previous) previous(); render(); };
  }

  document.addEventListener("DOMContentLoaded", () => render());
})();