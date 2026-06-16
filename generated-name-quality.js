// =====================================================================
// Become the next Mourinho — Generated name quality
// V0.45J-bis: post-process generated squads to avoid visible name repeats.
// =====================================================================

(function initGeneratedNameQuality() {
  "use strict";

  if (window.__BTM_GENERATED_NAME_QUALITY_LOADED__) return;
  window.__BTM_GENERATED_NAME_QUALITY_LOADED__ = true;

  const generateSquadBeforeNameQuality = window.generateStartingSquad;
  if (typeof generateSquadBeforeNameQuality !== "function") {
    console.warn("generateStartingSquad indisponible, qualité des noms non appliquée.");
    return;
  }

  const LAST_NAME_LIMIT_PER_SQUAD = 2;
  const NAME_ATTEMPTS = 90;
  const FALLBACK_INITIALS = ["A","B","C","D","E","F","G","H","J","K","L","M","N","P","R","S","T","V"];

  const STYLE = {
    England: {
      first: ["Jack","Harry","George","Oliver","Charlie","Tom","Jacob","Alfie","Lewis","Mason","Callum","Ryan","Reece","Ollie","Dexter","Marcus","Archie","Jude","Ethan","Noah","Theo","Finley","Harvey","Riley","Bobby","Freddie","Oscar","Kian","Morgan","Jamie"],
      prefix: ["Ash","Brook","West","Hart","Crow","Ell","Fair","Whit","Oak","Stone","Bram","Wood","Hal","Brid","Kings"],
      suffix: ["ford","ley","ton","wood","well","son","field","brook","shaw","worth","ham","ridge","more","croft","den"]
    },
    France: {
      first: ["Lucas","Hugo","Théo","Nathan","Enzo","Maxime","Antoine","Mathis","Clément","Romain","Léo","Adrien","Florian","Kylian","Ousmane","Aurélien","Jules","Evan","Noé","Baptiste","Sacha","Nolan","Malo","Quentin","Yanis","Ilan","Eliott","Axel","Maël","Amine"],
      prefix: ["Bel","Mont","Val","Mar","Du","Ler","Char","Gau","Riv","Bois","Ren","Fau","Mer","Lau","Cor"],
      suffix: ["mont","bert","reau","nier","val","court","eau","ard","in","ot","ier","el","and","on","et"]
    },
    Spain: {
      first: ["Sergio","Carlos","Javier","Pablo","Álvaro","Marco","Iker","Rubén","Hugo","Diego","Adrián","Mateo","Nico","Gerard","Dani","Pau","Alejandro","Iván","Jorge","Mario","Unai","Ferran","Álex","Raúl","Jaime","Óscar","Marcos","Miguel","Aitor","Mikel"],
      prefix: ["Gar","Nav","Sol","Her","Var","Cast","Mol","Ser","Vid","Ros","Mar","Cal","Cam","Del","Rub"],
      suffix: ["cía","ez","ero","ano","ales","osa","ero","és","ino","era","ado","illo","era","ano","al"]
    },
    Portugal: {
      first: ["João","Diogo","Rúben","Bruno","Gonçalo","Tiago","Rafael","André","Nuno","Fábio","Pedro","Bernardo","Henrique","Tomás","Dinis","Martim","Afonso","Guilherme","Miguel","Rodrigo","Duarte","Renato","Francisco","Vasco","Leandro","Hugo","Ivo","Rui","Xavier","David"],
      prefix: ["Sil","Fer","Cost","Per","Olive","Carv","Gom","Lop","Mar","Fon","Pint","Nev","Card","Mor","Teix"],
      suffix: ["va","eira","a","es","ira","alho","es","es","ques","seca","o","es","oso","eira","eiro"]
    },
    Brazil: {
      first: ["Gabriel","Lucas","Matheus","Bruno","Rodrigo","Vinícius","Pedro","Thiago","Felipe","Caio","Raphael","Éder","Igor","Murilo","Wesley","João","Ruan","Renan","Rafael","Gustavo","Vitor","Luan","Arthur","Henrique","Danilo","Douglas","Allan","Éverton","Marcos","Diego"],
      prefix: ["Sou","Lim","Cost","Rib","Alm","Bar","Roch","Carv","Gom","Mart","Nas","Arau","Pere","Mel","Duar"],
      suffix: ["za","a","a","eiro","eida","bosa","a","alho","es","ins","cimento","jo","ira","o","te"]
    },
    Argentina: {
      first: ["Lautaro","Julián","Enzo","Alexis","Nicolás","Thiago","Franco","Gonzalo","Emiliano","Cristian","Matías","Facundo","Valentín","Joaquín","Bruno","Agustín","Tomás","Santiago","Juan","Ángel","Leandro","Ezequiel","Lisandro","Ramiro","Luciano","Federico","Nahuel","Alan","Iván","Pablo"],
      prefix: ["Gon","Rod","Fer","Alv","Rom","Mart","Cor","Mol","Pal","Per","Gim","Qui","Ben","Cab","Mor"],
      suffix: ["zález","ríguez","nández","arez","ero","ínez","rea","ina","acios","ez","énez","roga","ítez","rera","ales"]
    },
    Netherlands: {
      first: ["Daan","Sem","Lars","Bram","Tijn","Cody","Frenkie","Jurriën","Xavi","Micky","Teun","Joey","Noa","Quinten","Ryan","Wout","Mats","Jesse","Luuk","Jorrit","Sven","Thijs","Ruben","Mees","Tygo","Niels","Denzel","Steven","Davy","Calvin"],
      prefix: ["van ","de ","ter ","Bakker","Smit","Meij","Mul","Viss","Koop","Tim","Dum","Reijn","Klaa","Schout","Berg"],
      suffix: ["Berg","Boer","Vries","Jong","Dijk","er","der","er","mans","ber","stra","ders","sen","en","wijn"]
    },
    Germany: {
      first: ["Leon","Florian","Jamal","Niclas","Kai","Pascal","Robin","Jonas","Felix","Maximilian","Lukas","Marvin","Nico","Tim","Julian","David","Timo","Serge","Karim","Anton","Marco","Kevin","Emre","Joshua","Leroy","Dennis","Moritz","Niklas","Jonathan","Mats"],
      prefix: ["Müll","Schm","Wagn","Fisch","Web","Beck","Hof","Koch","Rich","Klein","Wolf","Schäf","Brand","Kell","Vog"],
      suffix: ["er","idt","er","er","er","er","mann","er","ter","er","gang","er","t","er","el"]
    },
    Belgium: {
      first: ["Romelu","Youri","Leandro","Charles","Amadou","Dodi","Arthur","Jérémy","Lois","Maxim","Senne","Aster","Roméo","Wout","Loïs","Orel","Thibaut","Kevin","Michy","Yari","Alexis","Zeno","Johan","Noah","Mats","Théo","Daan","Eliot","Sacha","Nicolas"],
      prefix: ["Van ","De ","Ver","Mech","Brug","Ant","Liev","Cla","Wes","Bod","Hey","Dend","Sae","Deb","Vran"],
      suffix: ["aken","brugge","meeren","ele","sens","ers","ens","es","ael","art","en","er","mans","ast","ckx"]
    },
    Italy: {
      first: ["Marco","Lorenzo","Alessandro","Federico","Davide","Nicolò","Matteo","Riccardo","Gianluca","Sandro","Giacomo","Samuele","Andrea","Cesare","Francesco","Leonardo","Tommaso","Pietro","Giovanni","Manuel","Domenico","Ciro","Nicola","Luca","Edoardo","Filippo","Cristian","Mattia","Gabriele","Daniele"],
      prefix: ["Ross","Ferr","Espos","Bian","Roman","Col","Grec","Cont","Manc","Bare","Ton","Locat","Bast","Ric","Pell"],
      suffix: ["i","ari","ito","chi","o","ombo","o","i","ini","lla","ali","elli","oni","ci","ini"]
    },
    Nigeria: {
      first: ["Victor","Samuel","Ademola","Joe","Calvin","Alex","Kelechi","Taiwo","Frank","Bright","Paul","Cyriel","Raphael","Gift","Emmanuel","Tolu","Moses","Chidera","Ibrahim","Wilfred","Terem","Umar","Sadiq","Kenneth","Zaidu","Fisayo","Nathan","Adebayo","Ola","Daniel"],
      prefix: ["Osi","Chu","Iwo","Awo","Ony","Aina","Sanu","Ndi","Eko","Aja","Mof","Oka","Uch","Balo","Ade"],
      suffix: ["men","weze","bi","niyi","eka","la","si","di","ng","yi","fi","for","e","gun","goke"]
    },
    Senegal: {
      first: ["Sadio","Idrissa","Ismaïla","Nicolas","Boulaye","Pape","Habib","Krépin","Cheikhou","Iliman","Lamine","Abdou","Moussa","Formose","Nampalys","Pathé","Kalidou","Édouard","Mamadou","Bamba","Youssouf","Aliou","Samba","Moustapha","Arouna","Ibrahima","Sidy","Souleymane","Badou","Oumar"],
      prefix: ["Man","Gue","Sar","Di","San","Dial","Diat","Kou","Ndi","Cam","Men","Cis","Jak","Fay","Sow"],
      suffix: ["é","ye","r","a","é","lo","ta","yaté","aye","ara","dy","s","obs","e",""]
    },
    Norway: {
      first: ["Erling","Martin","Alexander","Sander","Fredrik","Kristian","Patrick","Leo","Ola","Jens","Andreas","Emil","Oscar","Mathias","Birk","Antonio","Magnus","Marius","Tobias","Henrik","Jonas","Sivert","Hugo","Markus","Elias","Noah","Lasse","Simen","Aron","Oliver"],
      prefix: ["Haal","Øde","Sør","Berg","Aurs","Thor","Nus","Lar","Ryer","Haug","Sol","Vet","Schjel","Nils","Hov"],
      suffix: ["and","gaard","loth","e","nes","vedt","a","sen","son","e","bakken","lesen","derup","en","land"]
    },
    Denmark: {
      first: ["Mikkel","Rasmus","Christian","Andreas","Jonas","Joakim","Pierre","Victor","Morten","Anders","Thomas","Mathias","Gustav","Oliver","Frederik","Kasper","Nicolai","Emil","Magnus","Simon","Jacob","Mads","Daniel","Noah","William","Malthe","Oscar","Lasse","Valdemar","Tobias"],
      prefix: ["Hjul","Høj","Erik","Wind","Mæh","Krist","And","Dam","Nør","Isak","Dorg","Vest","Schm","Jens","Skov"],
      suffix: ["mand","lund","sen","er","le","ensen","ersen","gaard","gaard","sen","u","ergaard","eichel","en",""]
    }
  };

  function hashNameSeed(club, difficulty, squad) {
    const base = [
      club && club.id,
      club && club.name,
      difficulty,
      squad.map((player) => player.playerId).join(","),
      Math.floor(Math.random() * 1000000)
    ].join("|");

    let hash = 2166136261;
    for (let i = 0; i < base.length; i += 1) {
      hash ^= base.charCodeAt(i);
      hash = Math.imul(hash, 16777619);
    }
    return hash >>> 0;
  }

  function mulberry32(a) {
    return function rng() {
      a |= 0;
      a = (a + 0x6D2B79F5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function pickFrom(rng, list) {
    return list[Math.floor(rng() * list.length)];
  }

  function normalizeKey(value) {
    return String(value || "").trim().toLowerCase();
  }

  function getStyle(nationality) {
    return STYLE[nationality] || STYLE.England;
  }

  function buildLastName(rng, style) {
    return `${pickFrom(rng, style.prefix)}${pickFrom(rng, style.suffix)}`;
  }

  function isAvailable(registry, fullName, lastName) {
    const fullKey = normalizeKey(fullName);
    const lastKey = normalizeKey(lastName);
    return !registry.fullNames.has(fullKey)
      && (registry.lastNames.get(lastKey) || 0) < LAST_NAME_LIMIT_PER_SQUAD;
  }

  function registerName(registry, fullName, lastName) {
    registry.fullNames.add(normalizeKey(fullName));
    const lastKey = normalizeKey(lastName);
    registry.lastNames.set(lastKey, (registry.lastNames.get(lastKey) || 0) + 1);
  }

  function buildUniqueName(player, rng, registry) {
    const style = getStyle(player.nationality);
    let fallback = null;

    for (let attempt = 0; attempt < NAME_ATTEMPTS; attempt += 1) {
      const first = pickFrom(rng, style.first);
      const last = buildLastName(rng, style);
      const fullName = `${first} ${last}`;

      if (!fallback || !registry.fullNames.has(normalizeKey(fullName))) {
        fallback = { first, last, fullName, shortName: `${first[0]}. ${last}` };
      }

      if (isAvailable(registry, fullName, last)) {
        registerName(registry, fullName, last);
        return { fullName, shortName: `${first[0]}. ${last}` };
      }
    }

    const fallbackFirst = fallback ? fallback.first : pickFrom(rng, style.first);
    const fallbackLast = fallback ? fallback.last : buildLastName(rng, style);

    for (let attempt = 0; attempt < FALLBACK_INITIALS.length * 2; attempt += 1) {
      const middle = pickFrom(rng, FALLBACK_INITIALS);
      const fullName = `${fallbackFirst} ${middle}. ${fallbackLast}`;
      if (!registry.fullNames.has(normalizeKey(fullName))) {
        registerName(registry, fullName, fallbackLast);
        return { fullName, shortName: `${fallbackFirst[0]}. ${middle}. ${fallbackLast}` };
      }
    }

    const suffix = Math.floor(rng() * 90) + 10;
    const fullName = `${fallbackFirst} ${fallbackLast} ${suffix}`;
    registerName(registry, fullName, fallbackLast);
    return { fullName, shortName: `${fallbackFirst[0]}. ${fallbackLast} ${suffix}` };
  }

  function improveGeneratedNames(squad, club, difficulty) {
    const rng = mulberry32(hashNameSeed(club, difficulty, squad));
    const registry = { fullNames: new Set(), lastNames: new Map() };

    return squad.map((player) => {
      const name = buildUniqueName(player, rng, registry);
      return Object.assign({}, player, {
        shortName: name.shortName,
        fullName: name.fullName,
        name: name.fullName
      });
    });
  }

  window.generateStartingSquad = function generateStartingSquadWithNameQuality(club, difficulty) {
    const squad = generateSquadBeforeNameQuality(club, difficulty);
    return Array.isArray(squad) ? improveGeneratedNames(squad, club || {}, difficulty) : squad;
  };

  window.BTM_GENERATED_NAME_QUALITY_META = Object.freeze({
    version: "0.45J-bis",
    lastNameLimitPerSquad: LAST_NAME_LIMIT_PER_SQUAD,
    fullNameDuplicates: "blocked",
    source: "generated-name-quality"
  });
})();
