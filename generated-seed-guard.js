// =====================================================================
// Become the next Mourinho — Generated squad deterministic seed guard
// V0.46I: make generated squad creation deterministic without editing app.js.
// =====================================================================

(function initGeneratedSeedGuard() {
  "use strict";

  if (window.__BTM_GENERATED_SEED_GUARD_LOADED__) return;
  window.__BTM_GENERATED_SEED_GUARD_LOADED__ = true;

  const generateSquadBeforeSeedGuard = window.generateStartingSquad;

  if (typeof generateSquadBeforeSeedGuard !== "function") {
    console.warn("generateStartingSquad indisponible, garde de graine non appliquée.");
    return;
  }

  function hashString(value) {
    const text = String(value || "");
    let hash = 2166136261;
    for (let i = 0; i < text.length; i += 1) {
      hash ^= text.charCodeAt(i);
      hash = Math.imul(hash, 16777619);
    }
    return hash >>> 0;
  }

  function mulberry32(seed) {
    let a = seed >>> 0;
    return function rng() {
      a |= 0;
      a = (a + 0x6D2B79F5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function normalizeSeedPart(value) {
    return String(value || "")
      .trim()
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "_")
      .replace(/^_+|_+$/g, "");
  }

  function createStableSeed(club, difficulty, seedHint) {
    const parts = [
      "btm-generated-squad-v046i",
      seedHint,
      club && club.id,
      club && club.name,
      club && club.shortName,
      club && club.league,
      difficulty
    ].map(normalizeSeedPart);

    return hashString(parts.join("|"));
  }

  function createStableNow(seed) {
    const base = 1700000000000 + (seed % 1000000000);
    let tick = 0;
    return function stableNow() {
      tick += 1;
      return base + tick;
    };
  }

  window.generateStartingSquad = function generateStartingSquadWithStableSeed(club, difficulty, seedHint) {
    const seed = createStableSeed(club || {}, difficulty || "ambitious", seedHint || "");
    const rng = mulberry32(seed);
    const stableNow = createStableNow(seed);

    const originalRandom = Math.random;
    const originalNow = Date.now;

    try {
      Math.random = rng;
      Date.now = stableNow;
      return generateSquadBeforeSeedGuard.call(this, club, difficulty, seedHint);
    } finally {
      Math.random = originalRandom;
      Date.now = originalNow;
    }
  };

  window.BTM_GENERATED_SEED_GUARD_META = Object.freeze({
    version: "0.46I",
    source: "generated-seed-guard",
    deterministicInputs: ["seedHint", "club.id", "club.name", "club.shortName", "club.league", "difficulty"],
    guards: ["Math.random", "Date.now"]
  });
})();
