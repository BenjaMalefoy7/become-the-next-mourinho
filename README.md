# Become the next Mourinho — V0.29

Jeu privé de gestion footballistique jouable directement dans le navigateur.

Le projet avance progressivement en HTML/CSS/JavaScript vanilla, sans backend pour le moment. Les sauvegardes sont stockées localement dans le navigateur via `localStorage`.

## Version actuelle

**V0.29 — Render registry, phase 1**

Cette version remplace une partie importante de la cascade fragile de `refreshUI` par un registre central de rendu.

Avant, plusieurs modules extraits faisaient encore :

```text
refreshUI = function(){ oldRefresh(); monRender(); }
```

Maintenant, les modules extraits principaux s’enregistrent dans un registre :

```text
btmRegisterRender("module", renderFunction)
```

Le registre est initialisé par `squad.js`, puis appelé par un seul `refreshUI` centralisé.

## Modules passés sur le registre V0.29

```text
squad.js        // bootstrap du registre + rendu effectif
season-flow.js  // panneau jour par jour + verrou matchday
mailbox.js      // courrier manager
training.js     // entraînement par groupes
match-center.js // écran Match
```

Ces modules ne réécrivent plus chacun `refreshUI` en cascade.

## Chaîne de match actuelle

```text
match-center.js
→ appelle saveSimulatedMatch()

season-flow.js
→ vérifie que le match est jouable
→ appelle btmSimulateUserMatch(career, userMatch)
→ appelle btmSimulateOtherMatches(career, matchday, userFixtureId)
→ appelle computeDynamicStandings(career)
→ enrichit le rapport
→ génère le courrier de match
→ sauvegarde la carrière
```

Le Match Center reste le seul module qui dessine l’écran Match.

## Modules réellement extraits

```text
match-center.js   // code réel du Match Center
match-center.css  // styles réels du Match Center
season-flow.js    // code réel du rythme jour par jour + appel explicite de la simulation pure
season-flow.css   // styles réels du panneau saison
mailbox.js        // code réel du courrier manager
mailbox.css       // styles réels du courrier manager
training.js       // code réel de l'entraînement par groupes
training.css      // styles réels de l'entraînement
match-engine.js   // code réel de simulation du match utilisateur
league-sim.js     // code réel de simulation journée / classement
```

## Fichiers chargés depuis index.html

```text
data.js?v=060
app.js?v=044
theme.js?v=023
lineup.js?v=023
calendar.js?v=023
match-engine.js?v=028A   // contenu V0.28B
league-sim.js?v=028A     // contenu V0.28B
squad.js?v=023           // contenu V0.29
season-flow.js?v=025     // contenu V0.29
mailbox.js?v=026         // contenu V0.29
player-db.js?v=023
transfers.js?v=023
training.js?v=027        // contenu V0.29
match-center.js?v=028A   // contenu V0.29
```

Important : les fichiers ont été mis à jour, mais `index.html` doit encore être bumpé proprement en `?v=029`. En attendant, faire un **Ctrl + F5** après déploiement.

## Ponts de compatibilité restants

```text
lineup.js       -> lineup-v050.js
calendar.js     -> calendar-v060.js
player-db.js    -> player-db-v016.js
transfers.js    -> transfers-v017.js
```

`match-engine.js` et `league-sim.js` ne sont plus des ponts.

## DA active

La DA active reste **Coach Notebook / Manager War Room** : carnet tactique, papier, onglets, dossiers, notes de coach et couleurs dynamiques du club.

## Fonctionnalités présentes

- page d’accueil au lancement ;
- création de carrière avec club personnalisé ;
- choix du club Premier League remplacé ;
- choix de difficulté : outsider, ambitieux, nouveau géant ;
- génération d’un effectif fictif de départ ;
- sauvegardes multiples via `localStorage` ;
- Premier League 2025/2026 structurée ;
- calendrier complet généré sur 38 journées ;
- écran Composition avec terrain cliquable ;
- compatibilité des postes principaux et secondaires ;
- saison jour par jour avec verrou de jour de match ;
- Match Center stable extrait, avec analyse adverse ;
- validation composition / plan de match ;
- simulation utilisateur relogée dans `match-engine.js` ;
- simulation des autres matchs relogée dans `league-sim.js` ;
- classement dynamique recalculé depuis les matchs joués ;
- rapport post-match enrichi ;
- courrier manager réduit et stabilisé ;
- base joueurs générée pour le recrutement ;
- premier marché des transferts jouable ;
- entraînement par groupes extrait et stabilisé.

## Important

Les budgets, réputations, valeurs joueurs, salaires, statistiques de match et profils générés sont des valeurs de gameplay provisoires.

Les vrais effectifs joueurs ne sont pas encore intégrés. Ils arriveront plus tard depuis un dataset propre.

L’option “Garder l’effectif du club remplacé” est déjà prévue dans le menu, mais elle reste verrouillée tant que les vrais effectifs ne sont pas intégrés.

## Règle de modules

La règle désormais : **nom de fichier stable + version en query string**.

À privilégier :

```text
match-center.js?v=029
season-flow.js?v=029
mailbox.js?v=029
training.js?v=029
match-engine.js?v=028B
league-sim.js?v=028B
```

À éviter désormais :

```text
season-v013.js
season-v0141.js
season-v01910.js
match-v080.js
matchday-v090.js
```

## Prochaine étape recommandée

**V0.29B — Bump HTML + fin du registre sur les modules de base**

Objectifs :

```text
- bumper index.html en ?v=029
- déplacer le bootstrap du registre dans un fichier dédié ou app.js
- convertir lineup/calendar au registre quand ils seront extraits
- commencer la suppression des vieux wrappers historiques restants
```
