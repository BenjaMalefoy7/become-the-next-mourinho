# Changelog — Become the next Mourinho

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
- `match-engine.js` et `league-sim.js` chargent leurs anciens fichiers avec `?v=028A` et un `onerror` explicite.
- `index.html` charge maintenant :
  - `match-engine.js?v=028A` ;
  - `league-sim.js?v=028A` ;
  - `match-center.js?v=028A` ;
  - `match-center.css?v=028A`.
- La prochaine étape est V0.28B : extraire la simulation pure dans `match-engine.js` et `league-sim.js`.

## V0.27 — Extraction réelle de l’Entraînement

- `training.js` n’est plus un simple pont vers `training-v018.js`.
- `training.css` n’est plus un simple `@import` vers `training-v018.css`.
- L’écran Entraînement vit maintenant directement dans `training.js`.
- Correction importante : l’entraînement ne s’applique plus si le passage au jour suivant est bloqué par un match à jouer.
- `index.html` charge maintenant `training.js?v=027` et `training.css?v=027`.

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
- `index.html` charge maintenant `mailbox.js?v=026` et `mailbox.css?v=026`.

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
- `index.html` charge maintenant `season-flow.js?v=025` et `season-flow.css?v=025`.
- Cette version retire le deuxième gros pont historique derrière les noms stables.

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
- Cette version retire le premier gros pont historique derrière les noms stables.

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
- Cache-busting aligné en `?v=023` sur les ponts principaux.
- `theme.js` affiche maintenant V0.23 dans le footer.
- README et notes techniques mis à jour sur l’état réel.

## V0.22 — Index plat progressif

- `index.html` charge maintenant directement les modules récents via des points d’entrée stables.
- Ajout des points d’entrée stables pour l’Effectif :
  - `squad.js?v=022`
  - `squad.css?v=022`
- Ajout de ponts stables pour les modules de base encore historiques :
  - `lineup.js?v=022`
  - `calendar.js?v=022`
  - `match-engine.js?v=022`
  - `league-simulation.js?v=022`
  - `theme.js?v=022`
- Retrait du loader dynamique caché dans `season-v015.js`.
- Retrait de `match-details-v010.js` du chargement principal de `index.html` afin d’éviter qu’il relance des modules concurrents.
- Cache-busting aligné sur `?v=022` pour les ponts stables.
- README mis à jour sur V0.22.

## V0.21 — Début loader plat + noms stables

- Ajout de `btm-flat-loader.js?v=021` comme point d’entrée central pour les modules récents.
- Ajout de points d’entrée stables :
  - `match-center.js?v=021`
  - `season-flow.js?v=021`
  - `mailbox.js?v=021`
  - `player-db.js?v=021`
  - `transfers.js?v=021`
  - `training.js?v=021`
- Ajout de points d’entrée CSS stables :
  - `match-center.css?v=021`
  - `season-flow.css?v=021`
  - `mailbox.css?v=021`
  - `transfers.css?v=021`
  - `training.css?v=021`
- Remplacement du mini-loader non-match dans `season-v015.js` par le loader plat central.
- Conservation volontaire de ponts de compatibilité vers certains fichiers historiques versionnés pour éviter une rupture brutale.
- Documentation mise à jour pour refléter l’état V0.21.

## V0.20 — Stabilisation flow saison + Match Center unifié

- Stabilisation du passage jour par jour.
- Blocage réel du bouton “Jour suivant” quand un match non joué est dû.
- Le bouton d’accès au match devient une logique “Aller au match” le jour même.
- Unification de l’écran Match dans `season-v013.js` malgré son nom historique.
- Suppression des anciens rendus concurrents dans l’écran Match via réécriture complète du rendu.
- Ajout d’un rapport post-match intégré au Match Center : score, timeline, stats, xG simplifié et lecture coach.
- Enrichissement et persistance des données de rapport après simulation.
- Réduction du spam courrier : plus de briefing automatique inutile tous les jours.
- Suppression du chaînage dynamique des anciens modules de match récents depuis `season-v015.js`.
- Réalignement du footer et du texte dashboard sur V0.20.

## V0.19.10 — Matchday Center et rapport forcé

- Ajout d’un rapport de match forcé chargé en dernier.
- Objectif : remplacer les anciens blocs “Dernier rapport” par un rapport post-match plus complet.
- Ajout / consolidation prévue de la timeline, des stats de match et du score central.
- Le flow de saison doit maintenant bloquer le passage au jour suivant si un match non joué est dû.

## V0.19 — Matchday Center

- Refonte de l’écran Match autour d’un centre de préparation.
- Ajout d’une analyse adverse.
- Ajout d’une compo probable adverse abstraite.
