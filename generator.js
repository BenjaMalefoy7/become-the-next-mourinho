// =====================================================================
// Become the next Mourinho — Générateur de joueurs
// Module "joueurs générés" / régens.  Sortie : format V0.45A.
// Respecte l'addendum de dérivation (deriveHouseStats copiée à l'identique).
// =====================================================================

// ---------- utilitaires ----------
function clamp(n, lo, hi) { return Math.max(lo, Math.min(hi, n)); }
function r(n) { return Math.round(n); }

// RNG déterministe (mulberry32) : même graine -> même résultat.
function mulberry32(a) {
  return function () {
    a |= 0; a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
function randInt(rng, lo, hi) { return lo + Math.floor(rng() * (hi - lo + 1)); }
function pick(rng, arr) { return arr[Math.floor(rng() * arr.length)]; }
function pad6(n) { return String(n).padStart(6, "0"); }

// =====================================================================
// 1. FONCTION PARTAGÉE — copiée VERBATIM de l'addendum §2. Ne pas modifier.
// =====================================================================
function deriveHouseStats(p) {
  if (p.primaryPosition === "GK") {
    return {
      attack:   clamp(r(0.65 * p.gkKicking + 0.35 * p.passing), 1, 99),
      defense:  clamp(r(0.35 * p.gkReflexes + 0.25 * p.gkDiving + 0.25 * p.gkPositioning + 0.15 * p.gkHandling), 1, 99),
      physical: clamp(r(0.45 * p.gkDiving + 0.35 * p.physic + 0.20 * p.gkSpeed), 1, 99),
      mental:   clamp(r(0.50 * p.gkPositioning + 0.30 * p.gkHandling + 0.20 * p.gkReflexes), 1, 99)
    };
  }
  return {
    attack:   clamp(r(0.45 * p.shooting + 0.25 * p.dribbling + 0.15 * p.passing + 0.15 * p.pace), 1, 99),
    defense:  clamp(r(0.75 * p.defending + 0.25 * p.physic), 1, 99),
    physical: clamp(r(0.60 * p.physic + 0.40 * p.pace), 1, 99),
    mental:   clamp(r(0.50 * p.passing + 0.30 * p.defending + 0.20 * p.dribbling), 1, 99)
  };
}

// =====================================================================
// 2. potential / value / salary — addendum §4 et §6
// =====================================================================
function rollPotential(rng, overall, age) {
  let lo, hi;
  if (age <= 18)      { lo = 6; hi = 12; }
  else if (age <= 21) { lo = 4; hi = 9;  }
  else if (age <= 24) { lo = 1; hi = 5;  }
  else if (age <= 28) { lo = 0; hi = 2;  }
  else                { lo = 0; hi = 0;  }
  const margin = lo + Math.floor(rng() * (hi - lo + 1));
  return clamp(Math.max(overall, overall + margin), 35, 99);
}
function estimateValue(overall, potential, age) {
  const base = Math.pow((overall - 30) / 60, 3.2) * 120000000;
  const ageFactor = age <= 23 ? 1.25 : age <= 28 ? 1.0 : age <= 31 ? 0.65 : 0.35;
  const potFactor = 1 + Math.max(0, potential - overall) * 0.04;
  return clamp(Math.round(base * ageFactor * potFactor / 100000) * 100000, 0, 250000000);
}
function estimateSalary(value) {
  return clamp(Math.round(value * 0.0015 / 1000) * 1000, 2000, 600000);
}

// =====================================================================
// 3. Profils de poste (deltas) — addendum §5
//    ordre : [pace, shooting, passing, dribbling, defending, physic]
// =====================================================================
const DELTAS = {
  BU:  { pace: 6,  shooting: 12, passing: -6, dribbling: 4,  defending: -22, physic: 4  },
  AG:  { pace: 12, shooting: 2,  passing: -2, dribbling: 12, defending: -18, physic: -6 },
  AD:  { pace: 12, shooting: 2,  passing: -2, dribbling: 12, defending: -18, physic: -6 },
  MOC: { pace: 2,  shooting: 4,  passing: 12, dribbling: 10, defending: -12, physic: -6 },
  MC:  { pace: -2, shooting: -4, passing: 12, dribbling: 4,  defending: 2,   physic: 4  },
  MDC: { pace: -6, shooting: -12,passing: 4,  dribbling: -4, defending: 12,  physic: 10 },
  DC:  { pace: -4, shooting: -24,passing: -8, dribbling: -16,defending: 16,  physic: 12 },
  DD:  { pace: 10, shooting: -16,passing: 2,  dribbling: 2,  defending: 8,   physic: 2  },
  DG:  { pace: 10, shooting: -16,passing: 2,  dribbling: 2,  defending: 8,   physic: 2  }
};

// Postes secondaires plausibles — cahier §6
const SECONDARY = {
  GK: [], DC: ["MDC"], DD: ["DG", "AD"], DG: ["DD", "AG"],
  MDC: ["MC", "DC"], MC: ["MDC", "MOC"], MOC: ["MC", "AG", "AD"],
  AG: ["AD", "MOC", "BU"], AD: ["AG", "MOC", "BU"], BU: ["MOC", "AG", "AD"]
};

// Gabarit d'effectif (25) — cahier §3
const SQUAD_TEMPLATE = [
  "GK","GK","GK",
  "DC","DC","DC","DC",
  "DD","DD","DG","DG",
  "MDC","MDC",
  "MC","MC","MC","MC",
  "MOC","MOC",
  "AD","AD","AG","AG",
  "BU","BU"
];

const POSITION_ORDER = ["GK","DC","DD","DG","MDC","MC","MOC","AD","AG","BU"];

// =====================================================================
// 4. Noms par nationalité
// =====================================================================
const NAMES = {
  England:     { code: "ENG", first: ["Jack","Harry","George","Oliver","Charlie","Tom","Jacob","Alfie","Lewis","Mason","Callum","Ryan","Reece","Ollie","Dexter","Marcus"], last: ["Smith","Walker","Carter","Mills","Hughes","Turner","Reid","Ward","Cooper","Bennett","Hayes","Shaw","Knight","Palmer","Webb","Rowe"] },
  France:      { code: "FRA", first: ["Lucas","Hugo","Théo","Nathan","Enzo","Maxime","Antoine","Mathis","Clément","Romain","Léo","Adrien","Florian","Kylian","Ousmane","Aurélien"], last: ["Martin","Bernard","Dubois","Moreau","Laurent","Lefebvre","Girard","Faure","Rousseau","Mercier","Garnier","Chevalier","Renard","Camara","Diallo","Lemoine"] },
  Spain:       { code: "ESP", first: ["Sergio","Carlos","Javier","Pablo","Álvaro","Marco","Iker","Rubén","Hugo","Diego","Adrián","Mateo","Nico","Gerard","Dani","Pau"], last: ["García","Martínez","López","Sánchez","Romero","Torres","Ramos","Navarro","Molina","Herrera","Vargas","Castro","Iglesias","Serra","Vidal","Soler"] },
  Portugal:    { code: "PRT", first: ["João","Diogo","Rúben","Bruno","Gonçalo","Tiago","Rafael","André","Nuno","Fábio","Pedro","Vitinha","Bernardo","Gonzalo","Henrique","Tomás"], last: ["Silva","Santos","Ferreira","Costa","Pereira","Oliveira","Carvalho","Gomes","Lopes","Marques","Fonseca","Pinto","Ramos","Neves","Cardoso","Moreira"] },
  Brazil:      { code: "BRA", first: ["Gabriel","Lucas","Matheus","Bruno","Rodrigo","Vinícius","Pedro","Thiago","Felipe","Caio","Endrick","Raphael","Éder","Igor","Murilo","Wesley"], last: ["Silva","Souza","Oliveira","Santos","Ferreira","Lima","Costa","Ribeiro","Almeida","Barbosa","Rocha","Carvalho","Gomes","Martins","Nascimento","Araújo"] },
  Argentina:   { code: "ARG", first: ["Lautaro","Julián","Enzo","Alexis","Nicolás","Thiago","Franco","Exequiel","Gonzalo","Emiliano","Cristian","Matías","Facundo","Valentín","Joaquín","Bruno"], last: ["González","Rodríguez","Fernández","Álvarez","Romero","Martínez","Paredes","Acuña","Molina","Correa","Mac Allister","Lo Celso","Otamendi","Palacios","Garnacho","Simeone"] },
  Netherlands: { code: "NLD", first: ["Daan","Sem","Lars","Bram","Tijn","Cody","Frenkie","Jurriën","Xavi","Micky","Teun","Joey","Noa","Quinten","Ryan","Wout"], last: ["de Jong","van Dijk","Bakker","de Vries","Janssen","Visser","Smit","Meijer","Mulder","de Boer","van den Berg","Koopmans","Timber","Dumfries","Gakpo","Reijnders"] },
  Germany:     { code: "DEU", first: ["Leon","Florian","Jamal","Niclas","Kai","Pascal","Robin","Jonas","Felix","Maximilian","Lukas","Marvin","Nico","Tim","Julian","David"], last: ["Müller","Schmidt","Wagner","Fischer","Weber","Becker","Hofmann","Koch","Richter","Klein","Wolf","Schäfer","Brandt","Gündogan","Havertz","Wirtz"] },
  Belgium:     { code: "BEL", first: ["Romelu","Youri","Leandro","Charles","Amadou","Dodi","Arthur","Jérémy","Lois","Maxim","Senne","Aster","Roméo","Wout","Loïs","Orel"], last: ["Lukaku","Tielemans","Trossard","De Ketelaere","Onana","Lukebakio","Theate","Doku","Openda","De Cuyper","Lavia","Vanaken","Mangala","Faes","Carrasco","Vermeeren"] },
  Italy:       { code: "ITA", first: ["Marco","Lorenzo","Alessandro","Federico","Davide","Nicolò","Matteo","Riccardo","Gianluca","Sandro","Giacomo","Wilfried","Samuele","Andrea","Cesare","Destiny"], last: ["Rossi","Ferrari","Esposito","Bianchi","Romano","Colombo","Greco","Conti","De Luca","Mancini","Barella","Tonali","Scamacca","Locatelli","Bastoni","Frattesi"] },
  Nigeria:     { code: "NGA", first: ["Victor","Samuel","Ademola","Joe","Calvin","Alex","Kelechi","Taiwo","Frank","Bright","Paul","Cyriel","Raphael","Gift","Emmanuel","Tolu"], last: ["Osimhen","Chukwueze","Lookman","Aribo","Bassey","Iwobi","Iheanacho","Awoniyi","Onyeka","Dele","Aina","Simon","Onuachu","Sanusi","Ndidi","Boniface"] },
  Senegal:     { code: "SEN", first: ["Sadio","Idrissa","Ismaïla","Nicolas","Boulaye","Pape","Habib","Krépin","Cheikhou","Iliman","Lamine","Abdou","Moussa","Formose","Nampalys","Pathé"], last: ["Mané","Gueye","Sarr","Jackson","Dia","Sané","Diallo","Diatta","Kouyaté","Ndiaye","Camara","Mendy","Niakhaté","Ciss","Jakobs","Diao"] },
  Norway:      { code: "NOR", first: ["Erling","Martin","Alexander","Sander","Fredrik","Kristian","Patrick","Leo","Ola","Jens","Andreas","Emil","Oscar","Mathias","Birk","Antonio"], last: ["Haaland","Ødegaard","Sørloth","Berge","Aursnes","Thorstvedt","Bobb","Nusa","Larsen","Ryerson","Hauge","Østigård","Solbakken","Vetlesen","Schjelderup","Nilsen"] },
  Denmark:     { code: "DNK", first: ["Mikkel","Rasmus","Christian","Andreas","Jonas","Joakim","Pierre","Victor","Morten","Anders","Thomas","Mathias","Gustav","Oliver","Frederik","Kasper"], last: ["Hjulmand","Højlund","Eriksen","Olsen","Wind","Mæhle","Højbjerg","Kristensen","Andersen","Damsgaard","Bah","Nørgaard","Isaksen","Dorgu","Vestergaard","Schmeichel"] }
};
const NAT_LIST = Object.keys(NAMES);
const NAT_WEIGHTS = {
  England: 0.30, France: 0.12, Spain: 0.09, Brazil: 0.08, Portugal: 0.06,
  Netherlands: 0.06, Germany: 0.05, Belgium: 0.05, Argentina: 0.05, Italy: 0.04,
  Nigeria: 0.04, Senegal: 0.03, Norway: 0.02, Denmark: 0.01
};
function pickNationality(rng) {
  let x = rng(), acc = 0;
  for (const nat of NAT_LIST) {
    acc += (NAT_WEIGHTS[nat] || 0);
    if (x <= acc) return nat;
  }
  return NAT_LIST[0];
}

// =====================================================================
// 5. Génération d'un joueur (format V0.45A complet)
// =====================================================================
const SEASON_YEAR = 2025;

function buildStats(rng, position, L) {
  const s = {};
  if (position === "GK") {
    for (const k of ["gkDiving","gkHandling","gkKicking","gkPositioning","gkReflexes"]) {
      s[k] = clamp(r(L + randInt(rng, -4, 4)), 0, 99);
    }
    s.gkSpeed = clamp(r(L - 10 + randInt(rng, -4, 4)), 0, 99);
    s.physic  = clamp(r(L - 8 + randInt(rng, -3, 3)), 1, 99);
    s.passing = clamp(r(L - 20 + randInt(rng, -3, 3)), 1, 99);
    s.pace = randInt(rng, 8, 18); s.shooting = randInt(rng, 8, 18);
    s.dribbling = randInt(rng, 8, 18); s.defending = randInt(rng, 8, 18);
  } else {
    const d = DELTAS[position];
    for (const k of ["pace","shooting","passing","dribbling","defending","physic"]) {
      s[k] = clamp(r(L + d[k] + randInt(rng, -3, 3)), 1, 99);
    }
    for (const k of ["gkDiving","gkHandling","gkKicking","gkPositioning","gkReflexes"]) {
      s[k] = randInt(rng, 6, 14);
    }
    s.gkSpeed = 0;
  }
  return s;
}

function buildSecondary(rng, position) {
  const pool = SECONDARY[position] || [];
  if (pool.length === 0) return [];
  const roll = rng();
  let n = roll < 0.50 ? 0 : roll < 0.85 ? 1 : 2;
  n = Math.min(n, pool.length);
  const copy = pool.slice(), out = [];
  while (out.length < n && copy.length) {
    out.push(copy.splice(Math.floor(rng() * copy.length), 1)[0]);
  }
  return out;
}

function generatePlayer(rng, opts) {
  const { position, overall, age, club, idNum, dataSource = "generated", year = SEASON_YEAR } = opts;
  const O = clamp(overall, 35, 99);
  const stats = buildStats(rng, position, O);
  const tmp = Object.assign({ primaryPosition: position }, stats);
  const house = deriveHouseStats(tmp);

  const nat = pickNationality(rng);
  const nd = NAMES[nat];
  const first = pick(rng, nd.first);
  const last = pick(rng, nd.last);
  const potential = rollPotential(rng, O, age);
  const value = estimateValue(O, potential, age);
  const salary = estimateSalary(value);

  const idStr = dataSource === "regen"
    ? `regen_${year}_${pad6(idNum)}`
    : `gen_${pad6(idNum)}`;

  return {
    playerId: idStr,
    dataSource: dataSource,
    sourceRef: "generator_v1",
    dataQualityFlags: [],
    shortName: `${first[0]}. ${last}`,
    fullName: `${first} ${last}`,
    age: age,
    bornYear: year - age,
    nationality: nat,
    nationalityCode: nd.code,
    clubId: club.clubId,
    clubName: club.clubName,
    leagueId: club.leagueId,
    leagueName: club.leagueName,
    isPlayableLeague: club.isPlayableLeague !== false,
    isTransferMarketEligible: true,
    primaryPosition: position,
    secondaryPositions: buildSecondary(rng, position),
    overall: O,
    potential: potential,
    pace: stats.pace, shooting: stats.shooting, passing: stats.passing,
    dribbling: stats.dribbling, defending: stats.defending, physic: stats.physic,
    gkDiving: stats.gkDiving, gkHandling: stats.gkHandling, gkKicking: stats.gkKicking,
    gkPositioning: stats.gkPositioning, gkReflexes: stats.gkReflexes, gkSpeed: stats.gkSpeed,
    attack: house.attack, defense: house.defense, physical: house.physical, mental: house.mental,
    value: value,
    salary: salary,
    contractYears: randInt(rng, 1, 5),
    morale: "normal",
    condition: 100,
    injury: null
  };
}

// =====================================================================
// 6. Génération d'un effectif (25) — cahier §3
// =====================================================================
function buildTargetOveralls(rng, C) {
  const out = [];
  out.push(clamp(C + randInt(rng, 6, 7), 35, 99));                                 // 1 star
  for (let i = 0; i < 10; i++) out.push(clamp(C + randInt(rng, -1, 4), 35, 99));   // cadres
  for (let i = 0; i < 8; i++)  out.push(clamp(C + randInt(rng, -5, -1), 35, 99));  // rotation
  for (let i = 0; i < 6; i++)  out.push(clamp(C + randInt(rng, -12, -5), 35, 99)); // fin de banc
  return out; // 25
}
function buildAges(rng) {
  const ages = [];
  for (let i = 0; i < 2; i++) ages.push(randInt(rng, 31, 34));
  for (let i = 0; i < 4; i++) ages.push(randInt(rng, 28, 30));
  for (let i = 0; i < 8; i++) ages.push(randInt(rng, 25, 27));
  for (let i = 0; i < 7; i++) ages.push(randInt(rng, 21, 24));
  for (let i = 0; i < 4; i++) ages.push(randInt(rng, 16, 20)); // prospects
  return ages; // 25, prospects = 4 derniers
}
// ordre de slots en "round-robin" par poste -> chaque poste reçoit un cadre
function slotOrder() {
  const byPos = {};
  SQUAD_TEMPLATE.forEach(p => { (byPos[p] = byPos[p] || []).push(p); });
  const maxR = Math.max(...Object.values(byPos).map(a => a.length));
  const order = [];
  for (let round = 0; round < maxR; round++) {
    for (const pos of POSITION_ORDER) {
      if (byPos[pos] && round < byPos[pos].length) order.push(pos);
    }
  }
  return order; // 25 positions
}

function generateSquad(rng, clubLevel, club, startId) {
  const positions = slotOrder();                          // 25 postes, cadres en tête
  const overalls = buildTargetOveralls(rng, clubLevel)    // 25 notes triées desc
    .sort((a, b) => b - a);
  const agePool = buildAges(rng);
  const prospectAges = agePool.slice(21);                 // 4 derniers = prospects
  const otherAges = agePool.slice(0, 21);
  for (let i = otherAges.length - 1; i > 0; i--) {        // mélange des âges non-prospects
    const j = Math.floor(rng() * (i + 1));
    [otherAges[i], otherAges[j]] = [otherAges[j], otherAges[i]];
  }

  const slots = positions.map((pos, i) => ({ position: pos, overall: overalls[i] }));
  const byOverallAsc = slots.slice().sort((a, b) => a.overall - b.overall);
  byOverallAsc.forEach((slot, i) => {                     // prospects (jeunes) sur les plus faibles
    slot.age = i < 4 ? prospectAges[i] : otherAges[i - 4];
  });

  let id = startId;
  const squad = slots.map(slot => generatePlayer(rng, {
    position: slot.position, overall: slot.overall, age: slot.age,
    club, idNum: id++
  }));
  return { squad, nextId: id };
}

function generateLeague(rng, clubs, startId) {
  let id = startId;
  const out = [];
  for (const entry of clubs) {
    const res = generateSquad(rng, entry.clubLevel, entry.club, id);
    id = res.nextId;
    out.push({ club: entry.club, clubLevel: entry.clubLevel, squad: res.squad });
  }
  return { league: out, nextId: id };
}

// =====================================================================
// 7. API publique
// =====================================================================
function createGenerator(seed) {
  const rng = mulberry32((seed >>> 0) || 1);
  let counter = 1;
  return {
    deriveHouseStats,
    generatePlayer(opts) {
      const o = Object.assign({ idNum: counter++ }, opts);
      return generatePlayer(rng, o);
    },
    generateSquad(clubLevel, club) {
      const res = generateSquad(rng, clubLevel, club, counter);
      counter = res.nextId;
      return res.squad;
    },
    generateLeague(clubs) {
      const res = generateLeague(rng, clubs, counter);
      counter = res.nextId;
      return res.league;
    }
  };
}

const BTMGenerator = { createGenerator, deriveHouseStats };
if (typeof module !== "undefined" && module.exports) module.exports = BTMGenerator;
if (typeof window !== "undefined") window.BTMGenerator = BTMGenerator;
