# Notes techniques

État après V0.29.

## Direction active

La DA active reste **Coach Notebook / Manager War Room** : carnet de coach, papier, dossiers, onglets, notes tactiques et couleurs dynamiques du club.

## Ce qui a été stabilisé en V0.20–V0.28B

- Le bouton “Jour suivant” est bloqué si un match non joué est dû.
- Le bouton “Avancer au prochain match” ne sert plus à skipper : il devient une logique “Aller au match” le jour même.
- Le rapport post-match génère et conserve une timeline, des stats et une lecture coach.
- `match-center.js`, `season-flow.js`, `mailbox.js` et `training.js` ne sont plus de simples ponts vers les anciens fichiers versionnés.
- `match-engine.js` et `league-sim.js` ne sont plus des ponts vers les anciens simulateurs.

## V0.29 — Orchestrateur de rendu, phase 1

Objectif : réduire la cascade de wrappers `refreshUI` dans les modules déjà extraits.

### Nouveau mécanisme

Un registre central est initialisé au chargement de `squad.js` :

```text
btmRegisterRender(name, renderer)
btmUnregisterRender(name)
btmRunRegisteredRenders(career)
```

Le nouveau cycle devient :

```text
refreshUI()
→ rendu de base app.js / anciens ponts encore actifs
→ btmRunRegisteredRenders()
→ modules extraits enregistrés
```

### Modules enregistrés dans le registre

```text
squad.js
season-flow.js
mailbox.js
training.js
match-center.js
```

Ces modules ne font plus directement :

```text
refreshUI = function(){ oldRefresh(); renderModule(); }
```

Ils passent désormais par :

```text
btmRegisterRender("module", renderModule)
```

### Limite volontaire

Le registre est actuellement initialisé dans `squad.js`, car c’est le premier module extrait chargé après les ponts de base. À terme, il devrait être déplacé dans :

```text
app.js
```

ou dans un fichier dédié chargé juste après `app.js`, par exemple :

```text
render-registry.js
```

## V0.28A — Match Renderer Cutover, phase A

Objectif : prouver que `match-center.js` est le seul module qui dessine l’écran Match, sans casser la simulation historique.

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

`match-engine.js` et `league-sim.js` ne sont plus des ponts. Le vieux `match-v080.js` et le vieux `matchday-v090.js` restent dans le repo pour l’instant, mais ils ne sont plus chargés par les points d’entrée stables.

## Risque encore connu

Des wrappers `refreshUI` restent encore dans les modules historiques non extraits :

```text
lineup-v050.js
calendar-v060.js
```

Ils devront disparaître lorsque `lineup.js` et `calendar.js` seront réellement extraits.

## Règle à appliquer jusqu’au bout

Basculer vers des noms de modules stables et mettre la version uniquement dans la query string.

À privilégier :

```text
match-center.js?v=029
season-flow.js?v=029
mailbox.js?v=029
training.js?v=029
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

### V0.29B — Bump HTML + extraction de Lineup ou Calendar

Objectifs :

```text
- bumper index.html vers les query strings V0.29 ;
- déplacer le registre depuis squad.js vers app.js ou render-registry.js ;
- extraire réellement lineup.js ou calendar.js ;
- supprimer ensuite leurs wrappers refreshUI historiques.
```

## Angle mort à vérifier ensuite

`calendar-v060.js` ne semble pas avancer la date réelle : ses boutons changent surtout la journée affichée. Il faudra quand même confirmer qu’aucun autre chemin que `season-flow.js` ne permet réellement d’avancer le jour de carrière.

## Note cache

`index.html` pointe encore certains assets en query strings anciennes. Le contenu réel est passé en V0.29 pour les modules extraits, donc un Ctrl + F5 est nécessaire jusqu’au bump HTML ciblé.
