# Notes techniques

État après V0.28A.

## Direction active

La DA active reste **Coach Notebook / Manager War Room** : carnet de coach, papier, dossiers, onglets, notes tactiques et couleurs dynamiques du club.

## Ce qui a été stabilisé en V0.20–V0.27

- Le bouton “Jour suivant” est bloqué si un match non joué est dû.
- Le bouton “Avancer au prochain match” ne sert plus à skipper : il devient une logique “Aller au match” le jour même.
- Le rapport post-match génère et conserve une timeline, des stats et une lecture coach.
- `match-center.js`, `season-flow.js`, `mailbox.js` et `training.js` ne sont plus de simples ponts vers les anciens fichiers versionnés.

## V0.28A — Match Renderer Cutover, phase A

Objectif : prouver que `match-center.js` est le seul module qui dessine l’écran Match, sans casser la simulation historique.

### Ce qui a été neutralisé

```text
match-v080.js
- ne wrap plus refreshUI
- ne bind plus le bouton #prematch-launch
- ne rend plus le bloc "Dernier résultat"
- ne décore plus le calendrier après match
- ne met plus le footer/dashboard en V0.8

matchday-v090.js
- ne renomme plus le bouton de match
- ne met plus le footer/dashboard en V0.9.2
- ne wrap plus refreshUI pour modifier l’écran Match
```

### Ce qui reste volontairement actif

```text
match-v080.js
- simulateCurrentMatch(career, match)
- simGetLineupStats(career)
- simReduceStarterCondition(career)
- saveSimulatedMatch() en fallback

matchday-v090.js
- saveSimulatedMatchdayV090()
- computeDynamicStandings(career)
- simulation des autres matchs de la journée
- rendu du classement temporaire
```

Le rendu du classement reste temporairement dans `matchday-v090.js` pour éviter une régression visible de l’écran Classement. Il devra rejoindre l’orchestrateur de rendu plus tard.

## Ponts de compatibilité restants

```text
lineup.js       -> lineup-v050.js
calendar.js     -> calendar-v060.js
match-engine.js -> match-v080.js, mais renderer neutralisé
league-sim.js   -> matchday-v090.js, mais effets Match neutralisés
player-db.js    -> player-db-v016.js
transfers.js    -> transfers-v017.js
```

Cette compatibilité reste volontaire : on extrait les modules un par un pour éviter de casser la carrière, le calendrier et les sauvegardes.

## Risque encore connu

Plusieurs modules enrichissent ou remplacent encore `refreshUI`. Cela reste fragile. V0.28A retire les wrappers de match historiques, mais il reste encore des wrappers dans :

```text
lineup
calendar
squad
season-flow
mailbox
training
match-center
```

La prochaine vraie stabilisation structurelle sera un orchestrateur central de rendu.

## Règle à appliquer jusqu’au bout

Basculer vers des noms de modules stables et mettre la version uniquement dans la query string.

À privilégier :

```text
match-center.js?v=028A
season-flow.js?v=025
mailbox.js?v=026
training.js?v=027
match-engine.js?v=028A
league-sim.js?v=028A
```

À éviter désormais :

```text
season-v013.js
season-v0141.js
season-v01910.js
match-details-v010.js
```

Objectif : éviter que README, CHANGELOG et documentation décrochent à chaque itération.

## Prochaine étape technique recommandée

### V0.28B — Simulation pure

Objectif : transformer `match-engine.js` et `league-sim.js` en vrais modules sans ponts vers `match-v080.js` et `matchday-v090.js`.

Chaîne cible :

```text
season-flow.js
→ simulateUserMatch(career)
→ simulateOtherMatches(career)
→ computeDynamicStandings(career)
→ enrichAndPersistMatchReport(career)
→ generateMatchMail(career)
```

Cette étape devra être atomique : ne pas retirer `match-v080.js` ou `matchday-v090.js` avant que leur logique de simulation soit relogée ailleurs.

## Angle mort à vérifier ensuite

`calendar-v060.js` ne semble pas avancer la date réelle : ses boutons changent surtout la journée affichée. Il faudra quand même confirmer qu’aucun autre chemin que `season-flow.js` ne permet réellement d’avancer le jour de carrière.
