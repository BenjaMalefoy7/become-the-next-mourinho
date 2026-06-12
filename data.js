// Données V0.3.
// Base structurée pour la Premier League 2025/2026.
// Les budgets et réputations sont des valeurs de gameplay provisoires, pas des chiffres officiels.

const PREMIER_LEAGUE = {
  id: "premier_league_2025_2026",
  name: "Premier League",
  country: "England",
  season: "2025/2026",
  teamsCount: 20,
  matchdays: 38,
  matchesPerTeam: 38,
  pointsWin: 3,
  pointsDraw: 1,
  pointsLoss: 0
};

const POSITION_LABELS = {
  GK: "Gardien",
  DC: "Défenseur central",
  DG: "Défenseur gauche",
  DD: "Défenseur droit",
  MDC: "Milieu défensif",
  MC: "Milieu central",
  MOC: "Milieu offensif",
  AG: "Ailier gauche",
  AD: "Ailier droit",
  BU: "Buteur"
};

const FORMATIONS = {
  "4-3-3": ["GK", "DD", "DC", "DC", "DG", "MC", "MC", "MC", "AD", "BU", "AG"],
  "4-2-3-1": ["GK", "DD", "DC", "DC", "DG", "MDC", "MDC", "AD", "MOC", "AG", "BU"],
  "4-4-2": ["GK", "DD", "DC", "DC", "DG", "MC", "MC", "AG", "AD", "BU", "BU"],
  "3-5-2": ["GK", "DC", "DC", "DC", "MDC", "MC", "MC", "MOC", "MOC", "BU", "BU"],
  "3-4-3": ["GK", "DC", "DC", "DC", "MC", "MC", "AG", "AD", "AG", "BU", "AD"],
  "5-3-2": ["GK", "DD", "DC", "DC", "DC", "DG", "MDC", "MC", "MC", "BU", "BU"],
  "4-1-2-1-2": ["GK", "DD", "DC", "DC", "DG", "MDC", "MC", "MC", "MOC", "BU", "BU"]
};

const PREMIER_LEAGUE_CLUBS = [
  {
    id: "arsenal",
    name: "Arsenal",
    shortName: "ARS",
    country: "England",
    league: "Premier League",
    reputation: 91,
    budget: 180000000,
    primaryColor: "#EF0107",
    secondaryColor: "#FFFFFF",
    stadiumName: "Emirates Stadium"
  },
  {
    id: "aston_villa",
    name: "Aston Villa",
    shortName: "AVL",
    country: "England",
    league: "Premier League",
    reputation: 82,
    budget: 90000000,
    primaryColor: "#95BFE5",
    secondaryColor: "#670E36",
    stadiumName: "Villa Park"
  },
  {
    id: "bournemouth",
    name: "Bournemouth",
    shortName: "BOU",
    country: "England",
    league: "Premier League",
    reputation: 73,
    budget: 45000000,
    primaryColor: "#DA291C",
    secondaryColor: "#000000",
    stadiumName: "Vitality Stadium"
  },
  {
    id: "brentford",
    name: "Brentford",
    shortName: "BRE",
    country: "England",
    league: "Premier League",
    reputation: 74,
    budget: 50000000,
    primaryColor: "#E30613",
    secondaryColor: "#FFFFFF",
    stadiumName: "Gtech Community Stadium"
  },
  {
    id: "brighton",
    name: "Brighton & Hove Albion",
    shortName: "BHA",
    country: "England",
    league: "Premier League",
    reputation: 80,
    budget: 85000000,
    primaryColor: "#0057B8",
    secondaryColor: "#FFFFFF",
    stadiumName: "Amex Stadium"
  },
  {
    id: "burnley",
    name: "Burnley",
    shortName: "BUR",
    country: "England",
    league: "Premier League",
    reputation: 69,
    budget: 35000000,
    primaryColor: "#6C1D45",
    secondaryColor: "#99D6EA",
    stadiumName: "Turf Moor"
  },
  {
    id: "chelsea",
    name: "Chelsea",
    shortName: "CHE",
    country: "England",
    league: "Premier League",
    reputation: 88,
    budget: 160000000,
    primaryColor: "#034694",
    secondaryColor: "#FFFFFF",
    stadiumName: "Stamford Bridge"
  },
  {
    id: "crystal_palace",
    name: "Crystal Palace",
    shortName: "CRY",
    country: "England",
    league: "Premier League",
    reputation: 75,
    budget: 55000000,
    primaryColor: "#1B458F",
    secondaryColor: "#C4122E",
    stadiumName: "Selhurst Park"
  },
  {
    id: "everton",
    name: "Everton",
    shortName: "EVE",
    country: "England",
    league: "Premier League",
    reputation: 76,
    budget: 65000000,
    primaryColor: "#003399",
    secondaryColor: "#FFFFFF",
    stadiumName: "Hill Dickinson Stadium"
  },
  {
    id: "fulham",
    name: "Fulham",
    shortName: "FUL",
    country: "England",
    league: "Premier League",
    reputation: 74,
    budget: 50000000,
    primaryColor: "#FFFFFF",
    secondaryColor: "#000000",
    stadiumName: "Craven Cottage"
  },
  {
    id: "leeds_united",
    name: "Leeds United",
    shortName: "LEE",
    country: "England",
    league: "Premier League",
    reputation: 72,
    budget: 45000000,
    primaryColor: "#FFCD00",
    secondaryColor: "#1D428A",
    stadiumName: "Elland Road"
  },
  {
    id: "liverpool",
    name: "Liverpool",
    shortName: "LIV",
    country: "England",
    league: "Premier League",
    reputation: 93,
    budget: 190000000,
    primaryColor: "#C8102E",
    secondaryColor: "#00B2A9",
    stadiumName: "Anfield"
  },
  {
    id: "manchester_city",
    name: "Manchester City",
    shortName: "MCI",
    country: "England",
    league: "Premier League",
    reputation: 94,
    budget: 220000000,
    primaryColor: "#6CABDD",
    secondaryColor: "#FFFFFF",
    stadiumName: "Etihad Stadium"
  },
  {
    id: "manchester_united",
    name: "Manchester United",
    shortName: "MUN",
    country: "England",
    league: "Premier League",
    reputation: 89,
    budget: 170000000,
    primaryColor: "#DA291C",
    secondaryColor: "#FBE122",
    stadiumName: "Old Trafford"
  },
  {
    id: "newcastle_united",
    name: "Newcastle United",
    shortName: "NEW",
    country: "England",
    league: "Premier League",
    reputation: 84,
    budget: 120000000,
    primaryColor: "#241F20",
    secondaryColor: "#FFFFFF",
    stadiumName: "St James' Park"
  },
  {
    id: "nottingham_forest",
    name: "Nottingham Forest",
    shortName: "NFO",
    country: "England",
    league: "Premier League",
    reputation: 75,
    budget: 55000000,
    primaryColor: "#DD0000",
    secondaryColor: "#FFFFFF",
    stadiumName: "City Ground"
  },
  {
    id: "sunderland",
    name: "Sunderland",
    shortName: "SUN",
    country: "England",
    league: "Premier League",
    reputation: 70,
    budget: 40000000,
    primaryColor: "#EB172B",
    secondaryColor: "#FFFFFF",
    stadiumName: "Stadium of Light"
  },
  {
    id: "tottenham_hotspur",
    name: "Tottenham Hotspur",
    shortName: "TOT",
    country: "England",
    league: "Premier League",
    reputation: 86,
    budget: 130000000,
    primaryColor: "#132257",
    secondaryColor: "#FFFFFF",
    stadiumName: "Tottenham Hotspur Stadium"
  },
  {
    id: "west_ham_united",
    name: "West Ham United",
    shortName: "WHU",
    country: "England",
    league: "Premier League",
    reputation: 77,
    budget: 65000000,
    primaryColor: "#7A263A",
    secondaryColor: "#1BB1E7",
    stadiumName: "London Stadium"
  },
  {
    id: "wolverhampton_wanderers",
    name: "Wolverhampton Wanderers",
    shortName: "WOL",
    country: "England",
    league: "Premier League",
    reputation: 73,
    budget: 50000000,
    primaryColor: "#FDB913",
    secondaryColor: "#231F20",
    stadiumName: "Molineux Stadium"
  }
];

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

const DEMO_STANDINGS = PREMIER_LEAGUE_CLUBS.slice(0, 4).map(function(club) {
  return {
    clubId: club.id,
    club: club.name,
    played: 0,
    wins: 0,
    draws: 0,
    losses: 0,
    goalsFor: 0,
    goalsAgainst: 0,
    gd: 0,
    points: 0
  };
});
