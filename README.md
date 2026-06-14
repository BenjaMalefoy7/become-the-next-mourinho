# Become the next Mourinho — V0.30A

Jeu privé de gestion footballistique jouable directement dans le navigateur.

Le projet avance en HTML/CSS/JavaScript vanilla, sans backend pour le moment. Les sauvegardes sont stockées localement via `localStorage`.

## Version actuelle

**V0.30A — Lineup registry cutover**

Cette passe stabilise le module Composition sans encore réécrire tout son ancien moteur historique.

`lineup.js` ne laisse plus le vieux module Composition garder son wrapper `refreshUI`. Il capture le `refreshUI` central, charge temporairement le moteur historique de compo, neutralise son wrapper après chargement, puis enregistre `renderLineupBuilder` dans le registre de rendu :

```text
app.js
→ theme.js installe le registre
→ lineup.js charge la logique de composition
→ wrapper legacy neutralisé
→ btmRegisterRender("lineup", renderLineupBuilder)
```

## Modules passés sur le registre

```text
theme.js
squad.js
lineup.js
season-flow.js
mailbox.js
training.js
match-center.js
```

## Chaîne de match actuelle

```text
match-center.js
→ appelle saveSimulatedMatch()

season-flow.js
→ vérifie que le match est jouable
→ appelle btmSimulateUserMatch(career, userMatch)
→ appelle btmSimulateOtherMatches(career, matchday, userFixtureId)
→ appelle computeDynamicStandings(career)
→ enrichit le rapport
→ génère le courrier de match
→ sauvegarde la carrière
```

Le Match Center reste le seul module qui dessine l’écran Match.

## Modules réellement extraits

```text
match-center.js
match-center.css
season-flow.js
season-flow.css
mailbox.js
mailbox.css
training.js
training.css
match-engine.js
league-sim.js
theme.js
```

## Ponts ou compatibilités restants

```text
lineup.js       -> compatibilité temporaire avec lineup-v050.js, wrapper neutralisé
calendar.js     -> calendar-v060.js
player-db.js    -> player-db-v016.js
transfers.js    -> transfers-v017.js
```

## Note cache

`index.html` pointe encore vers `lineup.js?v=023` pour le moment. Le contenu réel de `lineup.js` est en V0.30A, mais un **Ctrl + F5** est nécessaire tant que le cache-buster HTML n’est pas bumpé.

## Prochaine étape recommandée

**V0.30B — bump HTML ciblé ou extraction complète de Lineup**

Objectifs :

```text
- bumper `index.html` proprement sans réécrire les longues lignes HTML ;
- ou extraire complètement le code Composition dans `lineup.js` sans pont ;
- continuer ensuite avec Calendar.
```
