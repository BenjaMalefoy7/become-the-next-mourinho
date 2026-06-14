# Become the next Mourinho — V0.36

Jeu privé de gestion footballistique jouable directement dans le navigateur.

Le projet avance en HTML/CSS/JavaScript vanilla, sans backend pour le moment. Les sauvegardes sont stockées localement via `localStorage`.

## Version actuelle

**V0.36 — nettoyage ciblé des fichiers historiques orphelins**

Cette passe supprime les anciens fichiers devenus inutiles après les extractions réelles de Calendar, Lineup, Player DB et Transfers.

Fichiers supprimés :

```text
calendar-v060.js
lineup-v050.js
player-db-v016.js
transfers-v017.js
```

Ces fichiers ne sont plus chargés par `index.html` et ne sont plus appelés par les points d’entrée stables.

## Modules passés sur le registre

```text
theme.js
squad.js
lineup.js
calendar.js
season-flow.js
mailbox.js
player-db.js
transfers.js
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
transfers.js
```

## Ponts ou compatibilités restants

```text
Aucun pont gameplay majeur encore actif côté Match / Calendar / Lineup / Player DB / Transfers.
```

Il peut rester d’autres anciens fichiers historiques dans le dépôt. Ils seront supprimés uniquement après vérification explicite pour éviter de casser une dépendance cachée.

## Note cache

`index.html` charge toujours `transfers.js?v=035`, `player-db.js?v=034`, `calendar.js?v=031` et `lineup.js?v=023`. Les fichiers eux-mêmes sont bien extraits. Un **Ctrl + F5** reste recommandé après déploiement GitHub Pages.

## Prochaine étape recommandée

**V0.37 — schemaVersion + migrations de sauvegardes**.
