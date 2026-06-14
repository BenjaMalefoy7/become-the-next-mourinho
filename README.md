# Become the next Mourinho — V0.33

Jeu privé de gestion footballistique jouable directement dans le navigateur.

Le projet avance en HTML/CSS/JavaScript vanilla, sans backend pour le moment. Les sauvegardes sont stockées localement via `localStorage`.

## Version actuelle

**V0.33 — extraction réelle de Lineup / Composition**

Cette passe retire le pont historique de la composition.

Avant :

```text
lineup.js
→ chargeait lineup-v050.js
→ neutralisait le wrapper legacy
→ enregistrait renderLineupBuilder dans le registre
```

Maintenant :

```text
lineup.js
→ contient directement la gestion de la composition
→ contient directement les formations disponibles
→ normalise et répare la compo des carrières
→ sauvegarde les changements de formation / titulaires
→ passe par btmRegisterRender("lineup", ...)
→ ne charge plus lineup-v050.js
```

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
lineup.js
```

## Ponts ou compatibilités restants

```text
player-db.js    -> player-db-v016.js
transfers.js    -> transfers-v017.js
```

## Note cache

`index.html` pointe encore vers `lineup.js?v=023`, mais le contenu réel de `lineup.js` est bien en V0.33. Un **Ctrl + F5** est nécessaire pour tester proprement.

## Prochaine étape recommandée

**V0.34 — extraction réelle de Player DB ou Recrutement, puis nettoyage ciblé des orphelins historiques.**
