# Notes techniques

État après V0.23.

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

## Ce qui a changé en V0.22

La V0.22 a rendu `index.html` plus explicite : les modules récents ont été chargés directement depuis le HTML via des points d’entrée stables.

## Ce qui change en V0.23

`index.html` ne charge plus directement les anciens modules de base. Il passe maintenant par les noms stables :

```text
data.js?v=060
app.js?v=044
theme.js?v=023
lineup.js?v=023
calendar.js?v=023
match-engine.js?v=023
league-sim.js?v=023
squad.js?v=023
season-flow.js?v=023
mailbox.js?v=023
player-db.js?v=023
transfers.js?v=023
training.js?v=023
match-center.js?v=023
```

Les anciens fichiers restent encore derrière certains ponts de compatibilité :

```text
lineup.js       -> lineup-v050.js
calendar.js     -> calendar-v060.js
match-engine.js -> match-v080.js
league-sim.js   -> matchday-v090.js
match-center.js -> season-v013.js
season-flow.js  -> season-v014.js
mailbox.js      -> season-v015.js
player-db.js    -> player-db-v016.js
transfers.js    -> transfers-v017.js
training.js     -> training-v018.js
```

Cette compatibilité est volontaire : le HTML est propre, mais les gros modules historiques ne sont pas encore tous recopiés dans les fichiers stables.

## Règle à appliquer jusqu’au bout

Basculer vers des noms de modules stables et mettre la version uniquement dans la query string.

À privilégier :

```text
match-center.js?v=023
season-flow.js?v=023
mailbox.js?v=023
transfers.js?v=023
training.js?v=023
squad.js?v=023
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

### V0.24 — Extraction réelle des ponts + schemaVersion

Objectif : copier progressivement le code utile des anciens fichiers vers les fichiers stables.

Priorité :

```text
match-center.js
season-flow.js
mailbox.js
training.js
transfers.js
```

Puis retirer les anciens fichiers derrière les ponts.

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
1. vérifier si un match non joué bloque la journée
2. avancer la date
3. appliquer récupération / entraînement
4. générer uniquement les messages utiles
5. sauvegarder
6. rafraîchir l’interface
```
