# Become the next Mourinho — V0.32

Jeu privé de gestion footballistique jouable directement dans le navigateur.

Le projet avance en HTML/CSS/JavaScript vanilla, sans backend pour le moment. Les sauvegardes sont stockées localement via `localStorage`.

## Version actuelle

**V0.32 — extraction réelle de Calendar**

Cette passe retire le pont historique du calendrier.

Avant :

```text
calendar.js
→ chargeait calendar-v060.js
→ neutralisait le wrapper legacy
→ enregistrait renderCalendarV060 dans le registre
```

Maintenant :

```text
calendar.js
→ contient directement la génération du calendrier
→ contient directement le rendu calendrier
→ passe par btmRegisterRender("calendar", ...)
→ ne charge plus calendar-v060.js
```

Le calendrier ne fait toujours que changer la journée affichée. Le vrai passage des jours reste piloté par `season-flow.js`.

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
calendar.js
```

## Ponts ou compatibilités restants

```text
lineup.js       -> compatibilité temporaire avec lineup-v050.js, wrapper neutralisé
player-db.js    -> player-db-v016.js
transfers.js    -> transfers-v017.js
```

## Note cache

`index.html` pointe encore vers `calendar.css?v=031` et `calendar.js?v=031`, mais le contenu réel de `calendar.js` est bien en V0.32. Un **Ctrl + F5** est nécessaire pour tester proprement.

## Prochaine étape recommandée

**V0.33 — extraction réelle de Lineup ou nettoyage ciblé des orphelins historiques.**
