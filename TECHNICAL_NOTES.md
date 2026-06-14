# Notes techniques

État après V0.19.10.

## Direction active

La DA active reste **Coach Notebook / Manager War Room** : carnet de coach, papier, dossiers, onglets, notes tactiques et couleurs dynamiques du club.

## Priorité technique majeure

Le projet a été itéré très vite avec beaucoup de fichiers versionnés dans leur nom (`season-v013.js`, `season-v01910.js`, etc.). Cette approche a permis de prototyper rapidement, mais elle rend maintenant le code et la documentation difficiles à suivre.

### Règle à appliquer lors du loader plat

Lors de la prochaine refonte technique importante, basculer vers des noms de modules stables et mettre la version uniquement dans la query string.

Exemples attendus :

```text
match-center.js?v=020
season-flow.js?v=020
mailbox.js?v=020
transfers.js?v=020
training.js?v=020
squad.js?v=020
```

À éviter désormais :

```text
season-v013.js
season-v0141.js
season-v01910.js
match-details-v010.js
```

Objectif : éviter que README, CHANGELOG et documentation décrochent à chaque itération.

## Fichiers chargés aujourd’hui

Les fichiers historiques restent encore présents et plusieurs modules se chargent eux-mêmes via des loaders dynamiques. C’est une dette technique à corriger.

Modules importants actuellement :

```text
app.js
data.js
lineup-v050.js
calendar-v060.js
prematch-v070.js
match-v080.js
matchday-v090.js
match-details-v010.js
squad-v012.js
season-v013.js à season-v01910.js
player-db-v016.js
transfers-v017.js
training-v018.js
```

## Dette refreshUI

Plusieurs modules enrichissent ou remplacent `refreshUI`. Cela devient fragile. Il faudra créer un orchestrateur central de rendu au lieu d’empiler des wrappers.

## Match Center

La prochaine grosse étape recommandée est de reconstruire l’écran Match dans un module unique stable :

```text
match-center.js?v=020
```

Ce module devra gérer seul :

```text
avant-match
analyse adverse
validation composition
validation plan de match
simulation
rapport post-match
timeline
stats
```

## Season Flow

Créer une fonction centrale unique :

```text
advanceOneDay()
```

Elle devra gérer dans l’ordre :

```text
blocage si match à jouer
avancement date
récupération
entraînement
courrier utile
sauvegarde
refresh UI
```

## Sauvegardes

Les prochaines sauvegardes devront recevoir un `schemaVersion` pour permettre des migrations propres.

## Données mortes

`DEMO_PLAYERS` et `DEMO_STANDINGS` sont encore présents dans `data.js`. Ils ne sont pas utilisés par le gameplay actuel et doivent être retirés lors d’un prochain passage technique prudent.
