# Changelog — Become the next Mourinho

## V0.29B — Render registry centralisé

- Le bootstrap du registre de rendu est déplacé dans `theme.js`, chargé juste après `app.js`.
- Le registre n’est plus dépendant de `squad.js` pour exister.
- `theme.js` ne wrap plus directement `refreshUI` pour appliquer les couleurs du club : il s’enregistre maintenant via `btmRegisterRender("theme", apply)`.
- `index.html` est bumpé pour charger :
  - `theme.js?v=029B` ;
  - `match-engine.js?v=028B` ;
  - `league-sim.js?v=028B` ;
  - `squad.js?v=029B`.
- Les textes visibles sont alignés sur V0.29B.
- Les modules extraits continuent de passer par le registre : `squad`, `season-flow`, `mailbox`, `training`, `match-center`.

## V0.29 — Render registry, phase 1

- Ajout d’un registre central de rendu initialisé par `squad.js`.
- Ajout des fonctions globales :
  - `btmRegisterRender(name, renderer)` ;
  - `btmUnregisterRender(name)` ;
  - `btmRunRegisteredRenders(career)`.
- Les modules extraits suivants ne réécrivent plus directement `refreshUI` :
  - `squad.js` ;
  - `season-flow.js` ;
  - `mailbox.js` ;
  - `training.js` ;
  - `match-center.js`.
- `refreshUI` appelle maintenant le rendu de base puis le registre des modules extraits.
- Les anciens wrappers restent seulement dans les modules historiques non extraits, notamment `lineup` et `calendar`.
- Le Match Center reste le seul renderer de l’écran Match.

## V0.28B — Simulation pure, phase B

- `match-engine.js` n’est plus un pont vers `match-v080.js`.
- `match-engine.js` contient maintenant directement :
  - `btmSimulateUserMatch(career, match)` ;
  - `simulateCurrentMatch(career, match)` ;
  - `simGetLineupStats(career)` ;
  - `simReduceStarterCondition(career)` ;
  - les helpers de score, buteurs et événements.
- `league-sim.js` n’est plus un pont vers `matchday-v090.js`.
- `league-sim.js` contient maintenant directement :
  - `btmSimulateOtherMatches(career, matchday, userFixtureId)` ;
  - `computeDynamicStandings(career)` ;
  - `renderDynamicStandings(career)` temporairement, pour garder l’écran Classement fonctionnel.
- `season-flow.js` ne capture plus `oldSave`.
- `season-flow.js` appelle explicitement :
  - `btmSimulateUserMatch` ;
  - `btmSimulateOtherMatches` ;
  - `computeDynamicStandings` ;
  - `btmEnhanceLastMatchReport` ;
  - `btmGenerateMatchMail`.
- La chaîne de match ne dépend plus de l’empilement `season-flow → matchday-v090 → match-v080`.
- `match-center.js` reste le seul renderer de l’écran Match.

## V0.28A — Match Renderer Cutover, phase A

- `match-v080.js` conserve la simulation du match utilisateur, mais ne dessine plus l’écran Match.
- Suppression des anciens effets visuels V0.8 :
  - `renderLastResultV080` ;
  - `bindSimulationButtonV080` ;
  - `decorateCalendarResultsV080` ;
  - textes dashboard / footer V0.8 ;
  - wrapper `refreshUI` V0.8.
- `matchday-v090.js` conserve la simulation complète de journée et `computeDynamicStandings`.
- Suppression des effets conflictuels V0.9 sur l’écran Match :
  - renommage du bouton en “Simuler la journée” ;
  - textes dashboard / footer V0.9.2 ;
  - wrapper `refreshUI` qui repassait après le Match Center.
- `match-center.js` devient le seul renderer de l’écran Match.

## V0.27 — Extraction réelle de l’Entraînement

- `training.js` n’est plus un simple pont vers `training-v018.js`.
- `training.css` n’est plus un simple `@import` vers `training-v018.css`.
- L’écran Entraînement vit maintenant directement dans `training.js`.
- Correction importante : l’entraînement ne s’applique plus si le passage au jour suivant est bloqué par un match à jouer.

## V0.26 — Extraction réelle du Courrier

- `mailbox.js` n’est plus un simple pont vers `season-v015.js`.
- `mailbox.css` n’est plus un simple `@import` vers `season-v0151.css`.
- Le courrier manager vit maintenant directement dans `mailbox.js` :
  - onglet Courrier ;
  - messages lus / non lus ;
  - briefing veille ou jour de match ;
  - rapport après match ;
  - notification transfert.
- Le courrier conserve la logique réduite : pas de spam quotidien inutile.

## V0.25 — Extraction réelle de Season Flow

- `season-flow.js` n’est plus un simple pont vers `season-v014.js`.
- `season-flow.css` n’est plus un simple `@import` vers `season-v014.css`.
- Le rythme de saison vit maintenant directement dans `season-flow.js` :
  - date courante ;
  - passage au jour suivant ;
  - blocage si un match non joué est dû ;
  - accès au Match Center le jour même ;
  - récupération de condition ;
  - génération limitée du courrier ;
  - sauvegarde après passage de jour.

## V0.24 — Extraction réelle du Match Center

- `match-center.js` n’est plus un simple pont vers `season-v013.js`.
- `match-center.css` n’est plus un simple `@import` vers `season-v013.css`.
- Le rendu stable du Match Center vit maintenant directement dans `match-center.js`.
- Le style stable du Match Center vit maintenant directement dans `match-center.css`.
- Le Match Center conserve les fonctions principales :
  - préparation d’avant-match ;
  - analyse adverse ;
  - validation de composition ;
  - validation du plan de match ;
  - lancement du match ;
  - rapport post-match avec timeline et stats.

## V0.23 — Index plat sur points d’entrée stables

- `index.html` ne charge plus directement les vieux modules de base :
  - `lineup-v050.js`
  - `calendar-v060.js`
  - `match-v080.js`
  - `matchday-v090.js`
- Le HTML principal charge maintenant les points d’entrée stables :
  - `lineup.js?v=023`
  - `calendar.js?v=023`
  - `match-engine.js?v=023`
  - `league-sim.js?v=023`
  - `theme.js?v=023`
  - `squad.js?v=023`
  - `season-flow.js?v=023`
  - `mailbox.js?v=023`
  - `player-db.js?v=023`
  - `transfers.js?v=023`
  - `training.js?v=023`
  - `match-center.js?v=023`
- Ajout de `league-sim.js` comme point d’entrée stable vers la simulation de journée / classement dynamique.

## V0.22 — Index plat progressif

- `index.html` charge maintenant directement les modules récents via des points d’entrée stables.
- Ajout des points d’entrée stables pour l’Effectif :
  - `squad.js?v=022`
  - `squad.css?v=022`
- Ajout de ponts stables pour les modules de base encore historiques.
- Retrait de `match-details-v010.js` du chargement principal de `index.html` afin d’éviter qu’il relance des modules concurrents.

## V0.21 — Début loader plat + noms stables

- Ajout de `btm-flat-loader.js?v=021` comme point d’entrée central pour les modules récents.
- Ajout de points d’entrée stables pour les modules récents.
- Remplacement du mini-loader non-match dans `season-v015.js` par le loader plat central.
