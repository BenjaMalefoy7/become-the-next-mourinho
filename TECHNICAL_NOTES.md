# Notes techniques

État après V0.21.

## Direction active

La DA active reste **Coach Notebook / Manager War Room** : carnet de coach, papier, dossiers, onglets, notes tactiques et couleurs dynamiques du club.

## Ce qui a été stabilisé en V0.20

- `season-v014.js` centralise maintenant mieux le passage jour par jour.
- Le bouton “Jour suivant” est bloqué si un match non joué est dû.
- Le bouton “Avancer au prochain match” ne sert plus à skipper : il devient une logique “Aller au match” le jour même.
- `season-v013.js` sert maintenant de Match Center unifié malgré son nom historique.
- Les anciens blocs concurrents du type “Dernier rapport” sont remplacés par un rendu unique du Match Center.
- Le rapport post-match génère et conserve une timeline, des stats et une lecture coach.
- `season-v015.js` réduit le spam courrier et ne charge plus les anciens modules récents de match.
- Les modules récents de match qui se rechargeaient en chaîne ne sont plus appelés depuis le loader dynamique du courrier.

## Ce qui a été engagé en V0.21

La V0.21 commence la migration vers le **loader plat + noms stables** sans casser brutalement les modules historiques.

Nouveaux points d’entrée stables créés :

```text
btm-flat-loader.js?v=021
match-center.js?v=021
season-flow.js?v=021
mailbox.js?v=021
player-db.js?v=021
transfers.js?v=021
training.js?v=021
match-center.css?v=021
season-flow.css?v=021
mailbox.css?v=021
transfers.css?v=021
training.css?v=021
```

Pour éviter une rupture de gameplay, certains de ces fichiers sont encore des **ponts de compatibilité** vers les anciens fichiers versionnés. C’est volontaire : on stabilise d’abord les points d’entrée, puis on supprimera les vieux fichiers progressivement.

## Priorité technique majeure restante

Le projet a été itéré très vite avec beaucoup de fichiers versionnés dans leur nom (`season-v013.js`, `season-v01910.js`, etc.). Cette approche a permis de prototyper rapidement, mais elle rend maintenant le code et la documentation difficiles à suivre.

### Règle à appliquer jusqu’au bout

Basculer vers des noms de modules stables et mettre la version uniquement dans la query string.

Exemples attendus :

```text
match-center.js?v=021
season-flow.js?v=021
mailbox.js?v=021
transfers.js?v=021
training.js?v=021
squad.js?v=021
```

À éviter désormais :

```text
season-v013.js
season-v0141.js
season-v01910.js
match-details-v010.js
```

Objectif : éviter que README, CHANGELOG et documentation décrochent à chaque itération.

## Fichiers chargés actuellement

Les fichiers historiques restent encore présents. La V0.21 ajoute des points d’entrée stables, mais le ménage complet n’est pas encore terminé.

Modules historiques encore importants :

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
season-v013.js  -> Match Center V0.20
season-v014.js  -> Season Flow V0.20
season-v015.js  -> Mailbox V0.20 + loader plat V0.21
player-db-v016.js
transfers-v017.js
training-v018.js
```

Nouveaux points d’entrée V0.21 :

```text
btm-flat-loader.js
match-center.js
season-flow.js
mailbox.js
player-db.js
transfers.js
training.js
```

## Dette refreshUI

Plusieurs modules enrichissent ou remplacent encore `refreshUI`. Cela reste fragile. Il faudra créer un orchestrateur central de rendu au lieu d’empiler des wrappers.

## Prochaine étape technique recommandée

### V0.22 — Index vraiment plat

Charger directement les modules stables dans `index.html` :

```text
match-center.js?v=022
season-flow.js?v=022
mailbox.js?v=022
squad.js?v=022
transfers.js?v=022
training.js?v=022
```

Puis retirer les anciens loaders dynamiques de `match-details-v010.js`, `squad-v012.js` et `season-v015.js`.

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
