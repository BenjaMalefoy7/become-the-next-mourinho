# Notes techniques

Etat apres V0.38.

La DA active reste Coach Notebook / Manager War Room.

## V0.38 — cleanup final de stabilisation

La V0.38 termine les derniers points mineurs remontes apres la roadmap de stabilisation :

```text
- theme.js reste l'unique proprietaire du registre de rendu
- squad.js ne reintegre plus de bootstrap du registre
- save-migrations.js utilise les constantes APP_VERSION et DATA_SCHEMA_VERSION de app.js
- index.html documente l'ordre critique des scripts
- les anciens fichiers legacy orphelins ont ete supprimes
```

## Invariant d'ordre des scripts

L'ordre dans `index.html` est volontaire :

```text
data.js
app.js
save-migrations.js
theme.js
modules gameplay
```

`theme.js` doit rester avant les modules qui appellent `btmRegisterRender`.

`save-migrations.js` doit rester apres `app.js`, car il enveloppe `loadCareers`, `saveCareers` et `repairCareerIfNeeded`.

## Schema de sauvegarde

Le schema courant reste :

```text
schemaVersion: 37
```

V0.38 ne change pas la structure des sauvegardes. Elle nettoie l'architecture et reduit les risques de divergence.

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

## Nettoyage V0.38

Fichiers legacy supprimes :

```text
match-v080.js
matchday-v090.js
matchday-v019.js
match-details-v010.js
match-report-v0199.js
match-report-force-v01910.js
prematch-v070.js
season-lock-v0198.js
season-v013.js
season-v014.js
season-v015.js
season-v0151.js
squad-v012.js
training-v018.js
league-simulation.js
btm-flat-loader.js
season-v013.css
season-v014.css
season-v015.css
season-v0151.css
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
✅ principaux orphelins supprimes
✅ schemaVersion + migrations ajoutees
✅ double bootstrap du registre retire
✅ invariant d'ordre des scripts documente
```

La roadmap de stabilisation demandee est terminee. Les prochaines etapes peuvent revenir vers le gameplay, tout en gardant les migrations a jour a chaque changement de structure de sauvegarde.