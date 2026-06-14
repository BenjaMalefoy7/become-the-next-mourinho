# Notes techniques

État après V0.31.

## Direction active

La DA active reste **Coach Notebook / Manager War Room** : carnet de coach, papier, dossiers, onglets, notes tactiques et couleurs dynamiques du club.

## Stabilisations majeures récentes

- `index.html` charge désormais des points d’entrée stables.
- `match-center.js`, `season-flow.js`, `mailbox.js` et `training.js` sont de vrais modules extraits.
- `match-engine.js` et `league-sim.js` sont de vrais modules de simulation.
- La chaîne de match est explicite et ne dépend plus de `oldSave`.
- Le registre de rendu est installé par `theme.js`.
- `lineup.js` et `calendar.js` sont maintenant intégrés au registre avec neutralisation de leurs anciens wrappers `refreshUI`.

## V0.31 — Calendar registry cutover

`calendar.js` garde encore une compatibilité avec `calendar-v060.js`, mais son wrapper `refreshUI` historique est neutralisé après chargement.

Le flux voulu devient :

```text
calendar.js
→ charge temporairement calendar-v060.js
→ restaure le refreshUI central
→ enregistre renderCalendarV060 dans btmRegisterRender("calendar", ...)
```

Le calendrier ne doit pas décider du passage réel des jours. Il sert à afficher une journée, parcourir les journées du calendrier et afficher les prochains matchs. Le passage de date reste la responsabilité de `season-flow.js`.

## Modules actuellement enregistrés

```text
theme.js
squad.js
lineup.js
calendar.js
season-flow.js
mailbox.js
training.js
match-center.js
```

## Limites restantes

```text
lineup.js       -> compatibilité temporaire avec lineup-v050.js
calendar.js     -> compatibilité temporaire avec calendar-v060.js
player-db.js    -> player-db-v016.js
transfers.js    -> transfers-v017.js
```

## Prochaine étape recommandée

### V0.32 — extraction complète de Calendar ou nettoyage des orphelins

Objectifs :

```text
- copier le vrai code utile de calendar-v060.js dans calendar.js ;
- retirer ensuite la compatibilité calendar-v060.js ;
- garder season-flow.js comme unique responsable du passage réel des jours ;
- préparer la suppression des fichiers historiques devenus inutiles.
```

## Note cache

`index.html` pointe maintenant vers `calendar.css?v=031` et `calendar.js?v=031`. Faire Ctrl + F5 après déploiement GitHub Pages.
