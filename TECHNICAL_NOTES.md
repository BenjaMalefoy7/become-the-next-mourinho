# Notes techniques

État après V0.22.

## Direction active

La DA active reste **Coach Notebook / Manager War Room** : carnet de coach, papier, dossiers, onglets, notes tactiques et couleurs dynamiques du club.

## Ce qui a été stabilisé en V0.20

- `season-v014.js` centralise mieux le passage jour par jour.
- Le bouton “Jour suivant” est bloqué si un match non joué est dû.
- Le bouton “Avancer au prochain match” ne sert plus à skipper : il devient une logique “Aller au match” le jour même.
- `season-v013.js` sert maintenant de Match Center unifié malgré son nom historique.
- Les anciens blocs concurrents du type “Dernier rapport” sont remplacés par un rendu unique du Match Center.
- Le rapport post-match génère et conserve une timeline, des stats et une lecture coach.
- `season-v015.js` réduit le spam courrier.

## Ce qui a été engagé en V0.21

La V0.21 a commencé la migration vers le **loader plat + noms stables** sans casser brutalement les modules historiques.

Points d’entrée stables créés :

```text
btm-flat-loader.js?v=021
match-center.js?v=021
season-flow.js?v=021
mailbox.js?v=021
player-db.js?v=021
transfers.js?v=021
training.js?v=021
```

## Ce qui change en V0.22

La V0.22 rend `index.html` beaucoup plus explicite : les modules récents sont désormais chargés directement depuis le HTML via des points d’entrée stables.

Fichiers chargés depuis `index.html` :

```text
data.js?v=060
app.js?v=044
lineup-v050.js?v=053
calendar-v060.js?v=071
match-v080.js?v=080
matchday-v090.js?v=090
theme.js?v=022
squad.js?v=022
season-flow.js?v=022
mailbox.js?v=022
player-db.js?v=022
transfers.js?v=022
training.js?v=022
match-center.js?v=022
```

CSS stables ajoutés directement dans le head :

```text
squad.css?v=022
match-center.css?v=022
season-flow.css?v=022
mailbox.css?v=022
transfers.css?v=022
training.css?v=022
```

`season-v015.js` ne charge plus `btm-flat-loader.js`. Le loader plat central reste présent dans le repo pour historique de migration, mais il n’est plus le point de passage obligatoire.

## Ponts de compatibilité encore présents

Pour éviter de casser le jeu, certains points d’entrée stables restent encore des ponts vers les anciens fichiers :

```text
lineup.js           -> lineup-v050.js
calendar.js         -> calendar-v060.js
match-engine.js     -> match-v080.js
league-simulation.js -> matchday-v090.js
match-center.js     -> season-v013.js
season-flow.js      -> season-v014.js
mailbox.js          -> season-v015.js
player-db.js        -> player-db-v016.js
transfers.js        -> transfers-v017.js
training.js         -> training-v018.js
```

Cette compatibilité est volontaire. La prochaine étape devra extraire le code utile dans les fichiers stables pour pouvoir supprimer progressivement les anciens noms versionnés.

## Règle à appliquer jusqu’au bout

Basculer vers des noms de modules stables et mettre la version uniquement dans la query string.

À privilégier :

```text
match-center.js?v=022
season-flow.js?v=022
mailbox.js?v=022
transfers.js?v=022
training.js?v=022
squad.js?v=022
```

À éviter désormais :

```text
season-v013.js
season-v0141.js
season-v01910.js
match-details-v010.js
```

Objectif : éviter que README, CHANGELOG et documentation décrochent à chaque itération.

## Dette refreshUI

Plusieurs modules enrichissent ou remplacent encore `refreshUI`. Cela reste fragile. Il faudra créer un orchestrateur central de rendu au lieu d’empiler des wrappers.

## Prochaine étape technique recommandée

### V0.23 — Extraction des ponts de compatibilité

Objectif : copier progressivement le code utile des anciens fichiers vers les fichiers stables.

Priorité :

```text
match-center.js
season-flow.js
mailbox.js
training.js
transfers.js
```

Puis retirer les anciens fichiers du chargement principal.

## Match Center

À terme, `match-center.js` devra gérer seul :

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
