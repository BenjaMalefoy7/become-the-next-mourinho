# Notes techniques

Etat apres V0.37.

La DA active reste Coach Notebook / Manager War Room.

## V0.37 — schemaVersion + migrations

La V0.37 ajoute un module stable de migration :

```text
save-migrations.js
```

Il est charge juste apres `app.js` et avant les modules gameplay.

Schema courant :

```text
schemaVersion: 37
```

Le module enveloppe trois points centraux :

```text
loadCareers()
saveCareers()
repairCareerIfNeeded()
```

Objectif : migrer les anciennes sauvegardes automatiquement sans demander au joueur de recommencer sa carrière.

## Champs normalisés

```text
id
careerName
managerName
mode
difficulty
objective
squadLevel
squadSource
season
matchday
league
club
clubs
standings
fixtures
players
finances
mailbox
trainingFocus
lastMatchResult
version
dataVersion
schemaVersion
createdAt
updatedAt
```

Les joueurs sont aussi normalisés :

```text
id
name
clubId
club
nationality
primaryPosition
secondaryPositions
age
overall
potential
attack
defense
physical
mental
value
salary
contractYears
morale
condition
injuryStatus
```

## Modules dans le registre

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

## Modules stabilises / extraits

```text
match-center.js
season-flow.js
mailbox.js
training.js
match-engine.js
league-sim.js
theme.js
calendar.js
lineup.js
player-db.js
transfers.js
save-migrations.js
```

## Roadmap de stabilisation

```text
✅ anciens renderers de match neutralises
✅ simulation pure extraite
✅ registre de rendu centralise
✅ Calendar / passage de jour verifie
✅ Calendar extrait
✅ Lineup extrait
✅ Player DB extrait
✅ Transfers extrait
✅ principaux orphelins recents supprimes
✅ schemaVersion + migrations ajoutees
```

La roadmap de stabilisation demandee est terminee. Les prochaines etapes peuvent revenir vers le gameplay, tout en gardant les migrations a jour a chaque changement de structure de sauvegarde.
