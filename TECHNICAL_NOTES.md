# Notes techniques

État après V0.28B.

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

## V0.28B — Simulation pure, phase B

Objectif : retirer la dépendance à l’empilement historique de `saveSimulatedMatch`.

### Avant V0.28B

```text
match-center.js
→ saveSimulatedMatch()
→ season-flow.js wrapper
→ matchday-v090.js wrapper
→ match-v080.js simulation
```

### Après V0.28B

```text
match-center.js
→ saveSimulatedMatch()
→ season-flow.js
→ btmSimulateUserMatch(career, userMatch)
→ btmSimulateOtherMatches(career, matchday, userFixtureId)
→ computeDynamicStandings(career)
→ btmEnhanceLastMatchReport(career)
→ btmGenerateMatchMail(career, result)
→ saveCareers(...)
```

### Modules extraits

```text
match-engine.js
- ne charge plus match-v080.js
- expose btmSimulateUserMatch(career, match)
- conserve les helpers nécessaires : simGetLineupStats, simulateCurrentMatch, simReduceStarterCondition
- ne sauvegarde pas directement
- ne touche pas au DOM
- ne wrap pas refreshUI

league-sim.js
- ne charge plus matchday-v090.js
- expose btmSimulateOtherMatches(career, matchday, userFixtureId)
- expose computeDynamicStandings(career)
- conserve temporairement renderDynamicStandings(career) pour l’écran Classement
- ne touche plus à l’écran Match
- ne wrap pas refreshUI

season-flow.js
- ne capture plus oldSave
- pilote explicitement la chaîne de simulation
```

## Ponts de compatibilité restants

```text
lineup.js       -> lineup-v050.js
calendar.js     -> calendar-v060.js
player-db.js    -> player-db-v016.js
transfers.js    -> transfers-v017.js
```

`match-engine.js` et `league-sim.js` ne sont plus des ponts. Le vieux `match-v080.js` et le vieux `matchday-v090.js` restent dans le repo pour l’instant, mais ils ne devraient plus être chargés par les points d’entrée stables.

## Risque encore connu

Plusieurs modules enrichissent ou remplacent encore `refreshUI`. V0.28A a retiré les wrappers de match historiques, et V0.28B retire la dépendance logique aux vieux simulateurs. Il reste encore des wrappers dans :

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
season-flow.js?v=028B
mailbox.js?v=026
training.js?v=027
match-engine.js?v=028B
league-sim.js?v=028B
```

À éviter désormais :

```text
season-v013.js
season-v0141.js
season-v01910.js
match-details-v010.js
match-v080.js
matchday-v090.js
```

Objectif : éviter que README, CHANGELOG et documentation décrochent à chaque itération.

## Prochaine étape technique recommandée

### V0.29 — Orchestrateur de rendu

Objectif : remplacer progressivement le motif fragile :

```text
refreshUI = function(){ oldRefresh(); renderModule(); }
```

par un registre central :

```text
registerRender("moduleName", renderFunction)
```

Cela permettra de passer de plusieurs wrappers fragiles à un seul cycle de rendu maîtrisé.

## Angle mort à vérifier ensuite

`calendar-v060.js` ne semble pas avancer la date réelle : ses boutons changent surtout la journée affichée. Il faudra quand même confirmer qu’aucun autre chemin que `season-flow.js` ne permet réellement d’avancer le jour de carrière.

## Note cache

`index.html` pointe encore certains assets en `?v=028A` ou `?v=025`. Le contenu réel est passé en V0.28B, donc un Ctrl + F5 est nécessaire. Le bump HTML doit être fait dans une petite passe ciblée dès que possible, idéalement avant V0.29.