# Become the next Mourinho — V0.31

Jeu privé de gestion footballistique jouable directement dans le navigateur.

Le projet avance en HTML/CSS/JavaScript vanilla, sans backend pour le moment. Les sauvegardes sont stockées localement via `localStorage`.

## Version actuelle

**V0.31 — Calendar registry cutover**

Cette passe stabilise le module Calendrier sans encore réécrire tout son ancien moteur historique.

`calendar.js` charge encore temporairement `calendar-v060.js`, mais il neutralise son ancien wrapper `refreshUI` et enregistre le rendu du calendrier dans le registre central :

```text
app.js
→ theme.js installe le registre
→ calendar.js charge la logique calendrier
→ wrapper legacy neutralisé
→ btmRegisterRender("calendar", renderCalendarV060)
```

Le calendrier ne fait que changer la journée affichée. Le vrai passage des jours reste piloté par `season-flow.js`.

## Modules passés sur le registre

```text
theme.js
squad.js
lineup.js
calendar.js
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
calendar.js     -> compatibilité temporaire avec calendar-v060.js, wrapper neutralisé
player-db.js    -> player-db-v016.js
transfers.js    -> transfers-v017.js
```

## Note cache

`index.html` pointe maintenant vers `calendar.css?v=031` et `calendar.js?v=031`. Un **Ctrl + F5** reste recommandé après chaque refonte structurelle.

## Prochaine étape recommandée

**V0.32 — extraction réelle de Calendar ou nettoyage des orphelins**
