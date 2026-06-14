# Become the next Mourinho — V0.34

Jeu privé de gestion footballistique jouable directement dans le navigateur.

Le projet avance en HTML/CSS/JavaScript vanilla, sans backend pour le moment. Les sauvegardes sont stockées localement via `localStorage`.

## Version actuelle

**V0.34 — extraction réelle de Player DB**

Cette passe retire le pont historique de la base joueurs.

Avant :

```text
player-db.js
→ chargeait player-db-v016.js
→ player-db-v016.js réécrivait refreshUI pour créer la base joueurs
```

Maintenant :

```text
player-db.js
→ contient directement le générateur de joueurs
→ expose btmEnsurePlayerDatabase(career, count)
→ expose btmEnsurePlayerDatabasePersisted(count)
→ passe par btmRegisterRender("player-db", ...)
→ ne charge plus player-db-v016.js
→ ne réécrit plus refreshUI
```

## Modules passés sur le registre

```text
theme.js
squad.js
lineup.js
calendar.js
season-flow.js
mailbox.js
player-db.js
training.js
match-center.js
```

## Modules réellement extraits

```text
match-center.js
match-center.css
season-flow.js
season-flow.css
mailbox.js
mailbox.css
training.js
training.css
match-engine.js
league-sim.js
theme.js
calendar.js
lineup.js
player-db.js
```

## Ponts ou compatibilités restants

```text
transfers.js -> transfers-v017.js
```

## Note cache

`index.html` charge maintenant `player-db.js?v=034`. Un **Ctrl + F5** reste recommandé après déploiement GitHub Pages.

## Prochaine étape recommandée

**V0.35 — extraction réelle de Transfers / Recrutement**, puis nettoyage ciblé des fichiers historiques orphelins.