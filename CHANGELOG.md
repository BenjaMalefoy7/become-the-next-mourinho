# Changelog — Become the next Mourinho

## V0.33 — Lineup extrait

- `lineup.js` n’est plus un pont vers `lineup-v050.js`.
- La gestion des formations est maintenant directement dans le module stable.
- La composition est normalisée et réparée directement par `lineup.js`.
- Les changements de formation, d’auto-composition, de vidage et de titulaires sont sauvegardés directement par le module stable.
- `lineup.js` s’enregistre toujours via `btmRegisterRender("lineup", ...)`.
- `lineup-v050.js` devient un fichier historique orphelin candidat au nettoyage.
- `index.html` garde encore `lineup.js?v=023`, donc Ctrl + F5 reste conseillé pour tester la V0.33.

## V0.32 — Calendar extrait

- `calendar.js` n’est plus un pont vers `calendar-v060.js`.
- La génération du calendrier est maintenant directement dans le module stable.
- Le rendu du calendrier est maintenant directement dans le module stable.
- `calendar.js` s’enregistre toujours via `btmRegisterRender("calendar", ...)`.
- Les boutons du calendrier restent uniquement des boutons d’affichage : ils ne modifient pas la date réelle de carrière.
- `calendar-v060.js` devient un fichier historique orphelin candidat au nettoyage.
- `index.html` garde encore `calendar.js?v=031`, donc Ctrl + F5 reste conseillé pour tester la V0.32.

## V0.31 — Calendar registry cutover

- `calendar.js` stabilise le module Calendrier côté registre de rendu.
- Le vieux wrapper `refreshUI` de `calendar-v060.js` est neutralisé après chargement.
- `renderCalendarV060` est enregistré via `btmRegisterRender("calendar", ...)`.
- Les boutons du calendrier changent seulement la journée affichée et ne modifient pas la date réelle de carrière.
- `index.html` pointe maintenant vers `calendar.css?v=031` et `calendar.js?v=031`.

## V0.30A — Lineup registry cutover

- `lineup.js` stabilise le module Composition côté registre de rendu.
- Le vieux wrapper `refreshUI` de `lineup-v050.js` est neutralisé après chargement.
- `renderLineupBuilder` est enregistré via `btmRegisterRender("lineup", ...)`.
- Cette passe réduit le risque de cascade `refreshUI`, sans encore extraire tout le code historique de Composition.
- `lineup.js` garde temporairement une compatibilité avec `lineup-v050.js?v=030A`.
- `index.html` garde encore `lineup.js?v=023` pour le moment, donc Ctrl + F5 reste nécessaire.

## V0.29B — Render registry centralisé

- Le bootstrap du registre de rendu est déplacé dans `theme.js`.
- Le registre n’est plus dépendant de `squad.js`.
- `theme.js` s’enregistre via `btmRegisterRender`.
- `index.html` est bumpé pour `theme.js`, `match-engine.js`, `league-sim.js` et `squad.js`.

## V0.29 — Render registry, phase 1

- Ajout du registre central de rendu.
- `squad.js`, `season-flow.js`, `mailbox.js`, `training.js` et `match-center.js` passent par le registre.

## V0.28B — Simulation pure

- `match-engine.js` et `league-sim.js` ne sont plus des ponts vers les vieux moteurs de match.
- `season-flow.js` appelle explicitement la simulation utilisateur, les autres matchs et le classement.

## V0.28A — Match Renderer Cutover

- Les vieux rendus de `match-v080.js` et `matchday-v090.js` sont neutralisés.
- `match-center.js` devient le seul renderer de l’écran Match.

## V0.27 — Entraînement extrait

- `training.js` et `training.css` ne sont plus des ponts.
- L’entraînement ne s’applique plus si le jour est bloqué par un match à jouer.

## V0.26 — Courrier extrait

- `mailbox.js` et `mailbox.css` ne sont plus des ponts.
- Le courrier réduit le spam quotidien.

## V0.25 — Season Flow extrait

- `season-flow.js` et `season-flow.css` ne sont plus des ponts.

## V0.24 — Match Center extrait

- `match-center.js` et `match-center.css` ne sont plus des ponts.
