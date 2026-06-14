# Become the next Mourinho — V0.28B

Jeu privé de gestion footballistique jouable directement dans le navigateur.

Le projet avance progressivement en HTML/CSS/JavaScript vanilla, sans backend pour le moment. Les sauvegardes sont stockées localement dans le navigateur via `localStorage`.

## Version actuelle

**V0.28B — Simulation pure, phase B**

Cette version poursuit le cutover du match après V0.28A. Les anciens rendus de match avaient été neutralisés. V0.28B retire maintenant les ponts de simulation les plus dangereux.

```text
match-engine.js  // contient directement la simulation du match utilisateur
league-sim.js    // contient directement la simulation des autres matchs + classement
season-flow.js   // appelle explicitement les deux modules
match-center.js  // reste le seul renderer de l’écran Match
```

`season-flow.js` ne dépend plus de l’ancien empilement `oldSave → matchday-v090 → match-v080`. La chaîne de simulation est maintenant explicite.

## Fichiers chargés depuis index.html

```text
data.js?v=060
app.js?v=044
theme.js?v=023
lineup.js?v=023
calendar.js?v=023
match-engine.js?v=028A   // contenu V0.28B, à bumper dans index.html lors de la prochaine passe HTML ciblée
league-sim.js?v=028A     // contenu V0.28B, à bumper dans index.html lors de la prochaine passe HTML ciblée
squad.js?v=023
season-flow.js?v=025     // contenu V0.28B, à bumper dans index.html lors de la prochaine passe HTML ciblée
mailbox.js?v=026
player-db.js?v=023
transfers.js?v=023
training.js?v=027
match-center.js?v=028A
```

Important : après cette version, faire un **Ctrl + F5** pour forcer le navigateur à recharger les fichiers JS modifiés.

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

## V0.28B : chaîne de match actuelle

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
- zones de classement : C1, C3, C4, relégation ;
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
match-center.js?v=028A
season-flow.js?v=028B
mailbox.js?v=026
training.js?v=027
match-engine.js?v=028B
league-sim.js?v=028B
```

À éviter désormais :

```text
season-v013.js
season-v0141.js
season-v01910.js
```

## Prochaine étape recommandée

**V0.29 — Orchestrateur de rendu**

Objectif : réduire les derniers wrappers `refreshUI` en remplaçant progressivement le motif fragile :

```text
refreshUI = function(){ old(); monRender(); }
```

par un registre central :

```text
registerRender("module", renderFunction)
```

Cela permettra d’éviter que plusieurs modules se réécrivent encore l’ordre de rendu.