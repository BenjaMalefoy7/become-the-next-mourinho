// Données temporaires V0.1.
// La vraie base Premier League 2025/2026 sera ajoutée plus tard.

const DEMO_PLAYERS = [
  {
    id: "demo_1",
    name: "Alex Moreau",
    club: "Ton club",
    nationality: "France",
    age: 22,
    primaryPosition: "BU",
    secondaryPositions: ["AD"],
    overall: 72,
    attack: 76,
    defense: 34,
    physical: 71,
    mental: 68,
    potential: 82,
    salary: 22000,
    value: 6500000,
    contractYears: 3,
    morale: "Bon",
    condition: 96,
    injuryStatus: null
  },
  {
    id: "demo_2",
    name: "Noah Van Dijk",
    club: "Ton club",
    nationality: "Netherlands",
    age: 26,
    primaryPosition: "DC",
    secondaryPositions: ["MDC"],
    overall: 75,
    attack: 39,
    defense: 79,
    physical: 77,
    mental: 72,
    potential: 78,
    salary: 28000,
    value: 9000000,
    contractYears: 2,
    morale: "Normal",
    condition: 88,
    injuryStatus: null
  },
  {
    id: "demo_3",
    name: "Milan Costa",
    club: "Ton club",
    nationality: "Portugal",
    age: 20,
    primaryPosition: "MC",
    secondaryPositions: ["MOC", "MDC"],
    overall: 70,
    attack: 68,
    defense: 61,
    physical: 69,
    mental: 74,
    potential: 86,
    salary: 18000,
    value: 7200000,
    contractYears: 4,
    morale: "Excellent",
    condition: 100,
    injuryStatus: null
  }
];

const DEMO_STANDINGS = [
  { club: "Arsenal", played: 0, wins: 0, draws: 0, losses: 0, gd: 0, points: 0 },
  { club: "Liverpool", played: 0, wins: 0, draws: 0, losses: 0, gd: 0, points: 0 },
  { club: "Manchester City", played: 0, wins: 0, draws: 0, losses: 0, gd: 0, points: 0 },
  { club: "Ton club", played: 0, wins: 0, draws: 0, losses: 0, gd: 0, points: 0 }
];
