# Changelog — Become the next Mourinho

## V0.38 — Cleanup final de stabilisation

- Retrait du double bootstrap du registre de rendu dans `squad.js`.
- `theme.js` reste l’unique propriétaire du registre `btmRegisterRender` / `btmRunRegisteredRenders`.
- `squad.js` se limite maintenant à enregistrer son renderer via `btmRegisterRender("squad", ...)`.
- Suppression des anciens modules legacy orphelins liés au match, à la saison, au courrier, à l’effectif, à l’entraînement et aux anciens loaders.
- Suppression des anciens CSS legacy remplacés par `match-center.css`, `season-flow.css` et `mailbox.css`.
- `save-migrations.js` ne répète plus la valeur de `dataVersion` : il lit maintenant les constantes définies par `app.js`.
- Ajout d’un commentaire dans `index.html` pour documenter l’ordre critique des scripts : `data.js`, `app.js`, `save-migrations.js`, `theme.js`, puis les modules gameplay.
- Le footer et le dashboard affichent maintenant la V0.38.

## V0.37 — schemaVersion + migrations de sauvegardes

- Ajout du module stable `save-migrations.js`.
- Ajout d’un schéma unique de carrière : `schemaVersion: 37`.
- Les sauvegardes sont migrées automatiquement à la lecture via `loadCareers`.
- Les sauvegardes sont aussi normalisées avant écriture via `saveCareers`.
- `repairCareerIfNeeded` passe désormais par la migration centrale avant et après ses réparations historiques.
- La migration complète les champs manquants importants : club, finances, joueurs, league, standings, fixtures, mailbox, trainingFocus, version, dataVersion et timestamps.

## V0.36 — Nettoyage ciblé des orphelins

- Suppression de `calendar-v060.js`, remplacé par le module stable `calendar.js` depuis la V0.32.
- Suppression de `lineup-v050.js`, remplacé par le module stable `lineup.js` depuis la V0.33.
- Suppression de `player-db-v016.js`, remplacé par le module stable `player-db.js` depuis la V0.34.
- Suppression de `transfers-v017.js`, remplacé par le module stable `transfers.js` depuis la V0.35.

## V0.35 — Transfers / Recrutement extrait

- `transfers.js` n’est plus un pont vers `transfers-v017.js`.
- Le rendu Recrutement est maintenant directement dans le module stable.
- La recherche, le filtre par poste et l’achat au prix demandé sont conservés.
- L’achat ajoute le joueur à l’effectif, met à jour le budget transfert et le solde.
- Le courrier de transfert reste déclenché via `btmGenerateTransferMail` quand disponible.
- `transfers.js` s’enregistre via `btmRegisterRender("transfers", ...)` au lieu de réécrire `refreshUI`.

## V0.34 — Player DB extrait

- `player-db.js` n’est plus un pont vers `player-db-v016.js`.
- Le générateur de joueurs est maintenant directement dans le module stable.
- `btmEnsurePlayerDatabase(career, count)` reste disponible pour les autres modules.
- `btmEnsurePlayerDatabasePersisted(count)` reste disponible pour initialiser et sauvegarder la base joueurs active.

## V0.33 — Lineup extrait

- `lineup.js` n’est plus un pont vers `lineup-v050.js`.
- La gestion des formations est maintenant directement dans le module stable.
- La composition est normalisée et réparée directement par `lineup.js`.

## V0.32 — Calendar extrait

- `calendar.js` n’est plus un pont vers `calendar-v060.js`.
- La génération du calendrier est maintenant directement dans le module stable.
- Les boutons du calendrier restent uniquement des boutons d’affichage.

## V0.31 — Calendar registry cutover

- `calendar.js` stabilise le module Calendrier côté registre de rendu.
- Le vieux wrapper `refreshUI` de `calendar-v060.js` est neutralisé après chargement.

## V0.30A — Lineup registry cutover

- `lineup.js` stabilise le module Composition côté registre de rendu.
- Le vieux wrapper `refreshUI` de `lineup-v050.js` est neutralisé après chargement.

## V0.29B — Render registry centralisé

- Le bootstrap du registre de rendu est déplacé dans `theme.js`.
- Le registre n’est plus dépendant de `squad.js`.
- `theme.js` s’enregistre via `btmRegisterRender`.

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