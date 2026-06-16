// =====================================================================
// Become the next Mourinho — Generated name quality
// V0.45J-fix: post-process generated squads with nationality-safe names.
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
  const NAME_ATTEMPTS = 120;
  const FALLBACK_INITIALS = ["A","B","C","D","E","F","G","H","J","K","L","M","N","P","R","S","T","V"];

  const STYLE = {
    England: {
      first: ["Jack","Harry","George","Oliver","Charlie","Tom","Jacob","Alfie","Lewis","Mason","Callum","Ryan","Reece","Ollie","Dexter","Marcus","Archie","Jude","Ethan","Noah","Theo","Finley","Harvey","Riley","Bobby","Freddie","Oscar","Kian","Morgan","Jamie","Declan","Curtis","Jadon","Cole","Ben","Conor","Bukayo","Trent","Kyle","Jordan"],
      last: ["Smith","Walker","Carter","Mills","Hughes","Turner","Reid","Ward","Cooper","Bennett","Hayes","Shaw","Knight","Palmer","Webb","Rowe","Anderson","Phillips","Taylor","Johnson","Thompson","Roberts","Green","Wood","Moore","King","Henderson","Foster","Bailey","Watkins","Westwood","Ashford","Hartley","Bramwell","Fairfield","Whitmore","Stonebridge","Crowley","Oakley","Kingsley"]
    },
    France: {
      first: ["Lucas","Hugo","Théo","Nathan","Enzo","Maxime","Antoine","Mathis","Clément","Romain","Léo","Adrien","Florian","Kylian","Ousmane","Aurélien","Jules","Evan","Noé","Baptiste","Sacha","Nolan","Malo","Quentin","Yanis","Ilan","Eliott","Axel","Maël","Amine","Nassim","Ibrahim","Warren","Eduardo","Moussa","Malik","Rayan","Noam","Mathéo","Youssef"],
      last: ["Martin","Bernard","Dubois","Moreau","Laurent","Lefebvre","Girard","Faure","Rousseau","Mercier","Garnier","Chevalier","Renard","Camara","Diallo","Lemoine","Petit","Blanc","Gauthier","Perrin","Marchand","Legrand","Benoît","Boyer","Guerin","Masson","Dumont","Leroy","Fontaine","Barbier","Traoré","Konaté","Fofana","Diaby","Sissoko","Bamba","Kouamé","Mendy","Diarra","Toure"]
    },
    Spain: {
      first: ["Sergio","Carlos","Javier","Pablo","Álvaro","Marco","Iker","Rubén","Hugo","Diego","Adrián","Mateo","Nico","Gerard","Dani","Pau","Alejandro","Iván","Jorge","Mario","Unai","Ferran","Álex","Raúl","Jaime","Óscar","Marcos","Miguel","Aitor","Mikel","Gavi","Pedri","Lamine","Ansu","Yeremy","Fermín","Rodri","Ander","Asier","Isco"],
      last: ["García","Martínez","López","Sánchez","Romero","Torres","Ramos","Navarro","Molina","Herrera","Vargas","Castro","Iglesias","Serra","Vidal","Soler","Moreno","Ruiz","Jiménez","Hernández","Ortega","Delgado","Cabrera","Campos","Reyes","Aguilar","Santos","Peña","Vega","Cano","Calvo","Rubio","Prieto","Pascual","Arias","Rojas","Serrano","Méndez","Gallego","Cortés"]
    },
    Portugal: {
      first: ["João","Diogo","Rúben","Bruno","Gonçalo","Tiago","Rafael","André","Nuno","Fábio","Pedro","Bernardo","Henrique","Tomás","Dinis","Martim","Afonso","Guilherme","Miguel","Rodrigo","Duarte","Renato","Francisco","Vasco","Leandro","Hugo","Ivo","Rui","Xavier","David","Vitinha","Cristiano","Otávio","Rúben","Jota","Trincão","Matheus","Gonçalo","Nélson","Pepe"],
      last: ["Silva","Santos","Ferreira","Costa","Pereira","Oliveira","Carvalho","Gomes","Lopes","Marques","Fonseca","Pinto","Ramos","Neves","Cardoso","Moreira","Teixeira","Mendes","Nunes","Sousa","Vieira","Correia","Rocha","Monteiro","Barros","Moura","Faria","Leite","Coelho","Amorim","Guerreiro","Cancelo","Dalot","Leão","Palhinha","Vitinha","Jota","Trincão","Semedo","Patrício"]
    },
    Brazil: {
      first: ["Gabriel","Lucas","Matheus","Bruno","Rodrigo","Vinícius","Pedro","Thiago","Felipe","Caio","Raphael","Éder","Igor","Murilo","Wesley","João","Ruan","Renan","Rafael","Gustavo","Vitor","Luan","Arthur","Henrique","Danilo","Douglas","Allan","Éverton","Marcos","Diego","Endrick","Neymar","Richarlison","Raphinha","Casemiro","Antony","Éder","Bremer","Yan","Andrey"],
      last: ["Silva","Souza","Oliveira","Santos","Ferreira","Lima","Costa","Ribeiro","Almeida","Barbosa","Rocha","Carvalho","Gomes","Martins","Nascimento","Araújo","Pereira","Melo","Duarte","Moreira","Fernandes","Castro","Monteiro","Cardoso","Correia","Teixeira","Moura","Cavalcante","Andrade","Machado","Rodrigues","Azevedo","Batista","Campos","Mendes","Nunes","Pires","Vieira","Borges","Tavares"]
    },
    Argentina: {
      first: ["Lautaro","Julián","Enzo","Alexis","Nicolás","Thiago","Franco","Gonzalo","Emiliano","Cristian","Matías","Facundo","Valentín","Joaquín","Bruno","Agustín","Tomás","Santiago","Juan","Ángel","Leandro","Ezequiel","Lisandro","Ramiro","Luciano","Federico","Nahuel","Alan","Iván","Pablo","Lionel","Rodrigo","Exequiel","Giovanni","Paulo","Ángel","Nicolás","Germán","Lucas","Marcos"],
      last: ["González","Rodríguez","Fernández","Álvarez","Romero","Martínez","Paredes","Acuña","Molina","Correa","Mac Allister","Lo Celso","Otamendi","Palacios","Simeone","Pérez","Giménez","Benítez","Cabrera","Morales","Quinteros","Vega","Rojas","Herrera","Medina","Varela","Arias","Sosa","Funes","Domínguez","Messi","De Paul","Dybala","Di María","López","Montiel","Tagliafico","Almada","Buonanotte","Barco"]
    },
    Netherlands: {
      first: ["Daan","Sem","Lars","Bram","Tijn","Cody","Frenkie","Jurriën","Xavi","Micky","Teun","Joey","Noa","Quinten","Ryan","Wout","Mats","Jesse","Luuk","Jorrit","Sven","Thijs","Ruben","Mees","Tygo","Niels","Denzel","Steven","Davy","Calvin","Tijjani","Brian","Justin","Jurrien","Jeremie","Memphis","Matthijs","Daley","Quincy","Kenneth"],
      last: ["de Jong","van Dijk","Bakker","de Vries","Janssen","Visser","Smit","Meijer","Mulder","de Boer","van den Berg","Koopmans","Timber","Dumfries","Gakpo","Reijnders","Klaassen","Schouten","Bergwijn","Blind","Simons","Frimpong","Gravenberch","de Ligt","Aké","Malen","Depay","Bijlow","Veerman","Weghorst","van de Ven","Brobbey","Lang","Wieffer","Hartman","Stengs","Rensch","Veltman","Verbruggen","Zirkzee"]
    },
    Germany: {
      first: ["Leon","Florian","Jamal","Niclas","Kai","Pascal","Robin","Jonas","Felix","Maximilian","Lukas","Marvin","Nico","Tim","Julian","David","Timo","Serge","Karim","Anton","Marco","Kevin","Emre","Joshua","Leroy","Dennis","Moritz","Niklas","Jonathan","Mats","Ilkay","Toni","Thomas","Manuel","Antonio","Rüdiger","Florian","Robert","Benjamin","Youssoufa"],
      last: ["Müller","Schmidt","Wagner","Fischer","Weber","Becker","Hofmann","Koch","Richter","Klein","Wolf","Schäfer","Brandt","Gündogan","Havertz","Wirtz","Neuer","Rüdiger","Kimmich","Sané","Musiala","Goretzka","Tah","Raum","Can","Adeyemi","Gnabry","Füllkrug","Schlotterbeck","Henrichs","Kroos","Reus","Werner","Süle","Hummels","Anton","Undav","Baumann","Nmecha","Kobel"]
    },
    Belgium: {
      first: ["Romelu","Youri","Leandro","Charles","Amadou","Dodi","Arthur","Jérémy","Lois","Maxim","Senne","Aster","Roméo","Wout","Loïs","Orel","Thibaut","Kevin","Michy","Yari","Alexis","Zeno","Johan","Noah","Mats","Théo","Daan","Eliot","Sacha","Nicolas","Eden","Axel","Thomas","Jan","Toby","Dries","Hans","Johan","Koen","Arnaud"],
      last: ["Lukaku","Tielemans","Trossard","De Ketelaere","Onana","Lukebakio","Theate","Doku","Openda","De Cuyper","Lavia","Vanaken","Mangala","Faes","Carrasco","Vermeeren","Courtois","De Bruyne","Batshuayi","Verschaeren","Saelemaekers","Debast","Vranckx","Vertonghen","Alderweireld","Mertens","Witsel","Meunier","Castagne","Origi","Van den Broeck","Peeters","Janssens","Claes","Verbruggen","Willems","Maes","Goossens","Lambrechts","Vandenberghe"]
    },
    Italy: {
      first: ["Marco","Lorenzo","Alessandro","Federico","Davide","Nicolò","Matteo","Riccardo","Gianluca","Sandro","Giacomo","Samuele","Andrea","Cesare","Francesco","Leonardo","Tommaso","Pietro","Giovanni","Manuel","Domenico","Ciro","Nicola","Luca","Edoardo","Filippo","Cristian","Mattia","Gabriele","Daniele","Gianluigi","Giorgio","Claudio","Federico","Alessio","Moise","Rafael","Stefano","Gennaro","Salvatore"],
      last: ["Rossi","Ferrari","Esposito","Bianchi","Romano","Colombo","Greco","Conti","De Luca","Mancini","Barella","Tonali","Scamacca","Locatelli","Bastoni","Frattesi","Donnarumma","Chiesa","Calafiori","Dimarco","Di Lorenzo","Jorginho","Pellegrini","Raspadori","Retegui","Buongiorno","Ricci","Udogie","Kean","Orsolini","Acerbi","Berardi","Spinazzola","Zaniolo","Verratti","Meret","Vicario","Politano","Cambiaso","Gatti"]
    },
    Nigeria: {
      first: ["Victor","Samuel","Ademola","Joe","Calvin","Alex","Kelechi","Taiwo","Frank","Bright","Paul","Cyriel","Raphael","Gift","Emmanuel","Tolu","Moses","Chidera","Ibrahim","Wilfred","Terem","Umar","Sadiq","Kenneth","Zaidu","Fisayo","Nathan","Adebayo","Ola","Daniel","Victor","Boniface","Maduka","Semi","William","Kevin","Bassey","Aribo","Iheanacho","Ndidi"],
      last: ["Osimhen","Chukwueze","Lookman","Aribo","Bassey","Iwobi","Iheanacho","Awoniyi","Onyeka","Dele","Aina","Simon","Onuachu","Sanusi","Ndidi","Boniface","Okafor","Uche","Balogun","Adebayo","Ogunleye","Eze","Okonkwo","Nwosu","Afolayan","Akindele","Obasi","Ibrahim","Salisu","Musa","Okoye","Ajayi","Ekong","Dessers","Onyedika","Moffi","Sadiq","Dennis","Omeruo","Nwabali"]
    },
    Senegal: {
      first: ["Sadio","Idrissa","Ismaïla","Nicolas","Boulaye","Pape","Habib","Krépin","Cheikhou","Iliman","Lamine","Abdou","Moussa","Formose","Nampalys","Pathé","Kalidou","Édouard","Mamadou","Bamba","Youssouf","Aliou","Samba","Moustapha","Arouna","Ibrahima","Sidy","Souleymane","Badou","Oumar","Pape","Mikayil","Famara","Mame","Saliou","Abdoulaye","Babacar","El Hadji","Moussa","Seny"],
      last: ["Mané","Gueye","Sarr","Jackson","Dia","Sané","Diallo","Diatta","Kouyaté","Ndiaye","Camara","Mendy","Niakhaté","Ciss","Jakobs","Diao","Koulibaly","Gomis","Faye","Sow","Diouf","Sakho","Ba","Fall","Seck","Diagne","Dieng","Sy","Ndao","Mbaye","Cissé","Samb","Wade","Niane","Badiane","Ndour","Gassama","Thiam","Sene","Toure"]
    },
    Norway: {
      first: ["Erling","Martin","Alexander","Sander","Fredrik","Kristian","Patrick","Leo","Ola","Jens","Andreas","Emil","Oscar","Mathias","Birk","Antonio","Magnus","Marius","Tobias","Henrik","Jonas","Sivert","Hugo","Markus","Elias","Noah","Lasse","Simen","Aron","Oliver","Jørgen","Kasper","Håkon","Morten","Sondre","Vetle","Eirik","Thomas","Kristoffer","Ludvig"],
      last: ["Haaland","Ødegaard","Sørloth","Berge","Aursnes","Thorstvedt","Bobb","Nusa","Larsen","Ryerson","Hauge","Østigård","Solbakken","Vetlesen","Schjelderup","Nilsen","Hansen","Johansen","Olsen","Pedersen","Andersen","Kristiansen","Berg","Dahl","Hovland","Knudsen","Eide","Myhre","Bakke","Strand","Meling","Normann","Selvik","Børkeeiet","Gregersen","Sahraoui","Bjørkan","Hanche-Olsen","Askildsen","Solheim"]
    },
    Denmark: {
      first: ["Mikkel","Rasmus","Christian","Andreas","Jonas","Joakim","Pierre","Victor","Morten","Anders","Thomas","Mathias","Gustav","Oliver","Frederik","Kasper","Nicolai","Emil","Magnus","Simon","Jacob","Mads","Daniel","Noah","William","Malthe","Oscar","Lasse","Valdemar","Tobias","Jesper","Kasper","Joachim","Yussuf","Philip","Mads","Martin","Jannik","Daniel","Jens"],
      last: ["Hjulmand","Højlund","Eriksen","Olsen","Wind","Mæhle","Højbjerg","Kristensen","Andersen","Damsgaard","Bah","Nørgaard","Isaksen","Dorgu","Vestergaard","Schmeichel","Jensen","Nielsen","Hansen","Pedersen","Madsen","Sørensen","Poulsen","Christensen","Larsen","Kjær","Dolberg","Skov","Braithwaite","Delaney","Lindstrøm","Nelsson","Wass","Stryger","Rønnow","Skov Olsen","Daramy","Billing","Dreyer","Falk"]
    }
  };

  const CODE_TO_STYLE = {
    ENG: "England", GBR: "England",
    FRA: "France",
    ESP: "Spain",
    PRT: "Portugal", POR: "Portugal",
    BRA: "Brazil",
    ARG: "Argentina",
    NLD: "Netherlands", NED: "Netherlands",
    DEU: "Germany", GER: "Germany",
    BEL: "Belgium",
    ITA: "Italy",
    NGA: "Nigeria",
    SEN: "Senegal",
    NOR: "Norway",
    DNK: "Denmark", DEN: "Denmark"
  };

  const LABEL_TO_STYLE = {
    england: "England", english: "England", angleterre: "England",
    france: "France", french: "France", francais: "France", français: "France",
    spain: "Spain", spanish: "Spain", espagne: "Spain",
    portugal: "Portugal", portuguese: "Portugal", portugais: "Portugal",
    brazil: "Brazil", brasil: "Brazil", brazilian: "Brazil", bresil: "Brazil", brésil: "Brazil",
    argentina: "Argentina", argentine: "Argentina", argentinian: "Argentina",
    netherlands: "Netherlands", dutch: "Netherlands", paysbas: "Netherlands", pays_bas: "Netherlands",
    germany: "Germany", german: "Germany", allemagne: "Germany",
    belgium: "Belgium", belgian: "Belgium", belgique: "Belgium",
    italy: "Italy", italian: "Italy", italie: "Italy",
    nigeria: "Nigeria", nigerian: "Nigeria",
    senegal: "Senegal", sénégal: "Senegal", senegalese: "Senegal",
    norway: "Norway", norwegian: "Norway", norvege: "Norway", norvège: "Norway",
    denmark: "Denmark", danish: "Denmark", danemark: "Denmark"
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

  function normalizeLabel(value) {
    return normalizeKey(value)
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "_")
      .replace(/^_+|_+$/g, "");
  }

  function getOriginalNameParts(player) {
    const raw = String(player.fullName || player.name || player.shortName || "Alex Player").trim();
    const parts = raw.split(/\s+/).filter(Boolean);
    if (parts.length === 1) return { first: parts[0], last: "Player" };
    return { first: parts[0], last: parts.slice(1).join(" ") };
  }

  function getStyle(player) {
    const code = String(player && player.nationalityCode || "").trim().toUpperCase();
    if (CODE_TO_STYLE[code] && STYLE[CODE_TO_STYLE[code]]) return STYLE[CODE_TO_STYLE[code]];

    const label = normalizeLabel(player && player.nationality);
    if (LABEL_TO_STYLE[label] && STYLE[LABEL_TO_STYLE[label]]) return STYLE[LABEL_TO_STYLE[label]];

    return null;
  }

  function buildLastName(rng, style, player) {
    if (style && Array.isArray(style.last) && style.last.length) return pickFrom(rng, style.last);
    return getOriginalNameParts(player).last;
  }

  function buildFirstName(rng, style, player) {
    if (style && Array.isArray(style.first) && style.first.length) return pickFrom(rng, style.first);
    return getOriginalNameParts(player).first;
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
    const style = getStyle(player);
    let fallback = null;

    for (let attempt = 0; attempt < NAME_ATTEMPTS; attempt += 1) {
      const first = buildFirstName(rng, style, player);
      const last = buildLastName(rng, style, player);
      const fullName = `${first} ${last}`;

      if (!fallback || !registry.fullNames.has(normalizeKey(fullName))) {
        fallback = { first, last, fullName, shortName: `${first[0]}. ${last}` };
      }

      if (isAvailable(registry, fullName, last)) {
        registerName(registry, fullName, last);
        return { fullName, shortName: `${first[0]}. ${last}` };
      }
    }

    const fallbackFirst = fallback ? fallback.first : buildFirstName(rng, style, player);
    const fallbackLast = fallback ? fallback.last : buildLastName(rng, style, player);

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
    version: "0.45J-fix",
    lastNameLimitPerSquad: LAST_NAME_LIMIT_PER_SQUAD,
    fullNameDuplicates: "blocked",
    source: "generated-name-quality",
    fallback: "original-player-name"
  });
})();
