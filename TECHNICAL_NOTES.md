# Notes techniques

État après V0.30A.

## Direction active

La DA active reste **Coach Notebook / Manager War Room** : carnet de coach, papier, dossiers, onglets, notes tactiques et couleurs dynamiques du club.

## Stabilisations majeures récentes

- `index.html` charge désormais des points d’entrée stables.
- `match-center.js`, `season-flow.js`, `mailbox.js` et `training.js` sont de vrais modules extraits.
- `match-engine.js` et `league-sim.js` sont de vrais modules de simulation.
- La chaîne de match est explicite et ne dépend plus de `oldSave`.
- Le registre de rendu est installé par `theme.js`.

## V0.30A — Lineup registry cutover

`lineup.js` garde encore une compatibilité avec `lineup-v050.js`, mais son wrapper `refreshUI` historique est neutralisé après chargement.

Le flux voulu devient :

```text
lineup.js
→ charge temporairement lineup-v050.js
→ restaure le refreshUI central
→ enregistre renderLineupBuilder dans btmRegisterRender("lineup", ...)
```

Ce n’est pas encore l’extraction complète de Composition, mais cela retire le conflit principal avec le registre de rendu.

## Modules actuellement enregistrés

```text
theme.js
squad.js
lineup.js
season-flow.js
mailbox.js
training.js
match-center.js
```

## Limites restantes

```text
lineup.js       -> compatibilité temporaire avec lineup-v050.js
calendar.js     -> calendar-v060.js
player-db.js    -> player-db-v016.js
transfers.js    -> transfers-v017.js
```

## Prochaine étape recommandée

### V0.30B ou V0.31 — terminer Lineup ou passer Calendar

Objectifs :

```text
- bumper proprement index.html pour lineup.js?v=030A ;
- extraire complètement le code Composition dans lineup.js si l’outil le permet ;
- ou attaquer Calendar, qui reste le dernier wrapper de rendu vraiment sensible.
```

## Note cache

`index.html` garde encore `lineup.js?v=023`. Tant que ce cache-buster n’est pas bumpé, faire Ctrl + F5 après déploiement GitHub Pages.
