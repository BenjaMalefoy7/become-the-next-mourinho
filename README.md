# Become the next Mourinho — V0.37

Jeu privé de gestion footballistique jouable directement dans le navigateur.

Le projet avance en HTML/CSS/JavaScript vanilla, sans backend pour le moment. Les sauvegardes sont stockées localement via `localStorage`.

## Version actuelle

**V0.37 — schemaVersion + migrations de sauvegardes**

Cette passe ajoute un module stable de migration des sauvegardes :

```text
save-migrations.js
```

Il se charge juste après `app.js` et avant les modules gameplay. Son rôle est de migrer les anciennes carrières vers un schéma unique :

```text
schemaVersion: 37
```

## Ce que la migration corrige

```text
- schemaVersion absent ou ancien
- version / dataVersion incohérents
- finances partiellement manquantes
- joueurs avec champs incomplets
- club incomplet
- league / standings / fixtures manquants
- mailbox / trainingFocus absents
- dates createdAt / updatedAt absentes
```

Les migrations sont appliquées :

```text
- à la lecture des carrières
- avant sauvegarde
- avant repairCareerIfNeeded
```

## Modules stabilisés

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
save-migrations.js
```

## État de la roadmap de stabilisation

```text
✅ Débrancher les anciens renderers de match
✅ Extraire la simulation pure
✅ Unifier refreshUI avec un registre
✅ Vérifier Calendar / passage de jour
✅ Extraire Calendar
✅ Extraire Lineup
✅ Extraire Player DB
✅ Extraire Transfers
✅ Nettoyer les principaux orphelins récents
✅ Ajouter schemaVersion + migrations de sauvegardes
```

## Note cache

`index.html` charge `save-migrations.js?v=037`. Un **Ctrl + F5** reste recommandé après déploiement GitHub Pages.

## Prochaine étape recommandée

La roadmap de stabilisation demandée est maintenant terminée. La prochaine étape peut revenir vers du gameplay : amélioration du mercato, moteur de match, live match, blessures/morale, infrastructures ou save manager plus avancé.
