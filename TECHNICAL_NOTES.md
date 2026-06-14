# Notes techniques

État après V0.25.

## Direction active

La DA active reste **Coach Notebook / Manager War Room** : carnet de coach, papier, dossiers, onglets, notes tactiques et couleurs dynamiques du club.

## Ce qui a été stabilisé en V0.20

- Le bouton “Jour suivant” est bloqué si un match non joué est dû.
- Le bouton “Avancer au prochain match” ne sert plus à skipper : il devient une logique “Aller au match” le jour même.
- Les anciens blocs concurrents du type “Dernier rapport” ont été remplacés par un rendu unique du Match Center.
- Le rapport post-match génère et conserve une timeline, des stats et une lecture coach.
- `season-v015.js` réduit le spam courrier.

## Ce qui a été engagé en V0.21

La V0.21 a commencé la migration vers le **loader plat + noms stables** sans casser brutalement les modules historiques.

Points d’entrée stables créés :

```text
match-center.js
season-flow.js
mailbox.js
player-db.js
transfers.js
training.js
```

## Ce qui a changé en V0.22

La V0.22 a rendu `index.html` plus explicite : les modules récents ont été chargés directement depuis le HTML via des points d’entrée stables.

## Ce qui a changé en V0.23

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

## Ce qui a changé en V0.24

Premier gros pont réellement extrait :

```text
match-center.js   // code réel du Match Center
match-center.css  // styles réels du Match Center
```

Ces fichiers ne sont plus de simples redirections vers :

```text
season-v013.js
season-v013.css
```

## Ce qui change en V0.25

Deuxième gros pont réellement extrait :

```text
season-flow.js    // code réel du rythme jour par jour
season-flow.css   // styles réels du panneau saison
```

Ces fichiers ne sont plus de simples redirections vers :

```text
season-v014.js
season-v014.css
```

`season-flow.js` gère maintenant directement :

```text
date courante
passage au jour suivant
blocage si match dû
accès au Match Center le jour même
récupération condition
génération limitée du courrier
sauvegarde après passage de jour
```

`index.html` charge maintenant :

```text
season-flow.css?v=025
season-flow.js?v=025
```

## Ponts de compatibilité restants

```text
lineup.js       -> lineup-v050.js
calendar.js     -> calendar-v060.js
match-engine.js -> match-v080.js
league-sim.js   -> matchday-v090.js
mailbox.js      -> season-v015.js
player-db.js    -> player-db-v016.js
transfers.js    -> transfers-v017.js
training.js     -> training-v018.js
```

Cette compatibilité reste volontaire : on extrait les modules un par un pour éviter de casser la carrière, le calendrier et les sauvegardes.

## Règle à appliquer jusqu’au bout

Basculer vers des noms de modules stables et mettre la version uniquement dans la query string.

À privilégier :

```text
match-center.js?v=025
season-flow.js?v=025
mailbox.js?v=025
transfers.js?v=025
training.js?v=025
squad.js?v=025
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

### V0.26 — Extraction réelle du Courrier

Objectif : copier le code utile de `season-v015.js` vers `mailbox.js`, puis retirer le pont.

Priorité ensuite :

```text
lineup.js
calendar.js
match-engine.js
league-sim.js
training.js
transfers.js
```

## Season Flow cible

Le rythme jour par jour est maintenant centralisé dans `season-flow.js`. La future amélioration sera d’y relier plus proprement l’entraînement, avec un vrai orchestrateur de journée unique.