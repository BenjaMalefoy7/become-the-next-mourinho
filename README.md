# Become the next Mourinho — V0.35

Jeu privé de gestion footballistique jouable directement dans le navigateur.

Le projet avance en HTML/CSS/JavaScript vanilla, sans backend pour le moment. Les sauvegardes sont stockées localement via `localStorage`.

## Version actuelle

**V0.35 — extraction réelle de Transfers / Recrutement**

Cette passe retire le dernier pont historique directement lié au marché des transferts.

Avant :

```text
transfers.js
→ chargeait transfers-v017.js
→ transfers-v017.js réécrivait refreshUI
→ le rendu recrutement dépendait d'un fichier versionné historique
```

Maintenant :

```text
transfers.js
→ contient directement le rendu Recrutement
→ utilise la base joueurs stable de player-db.js
→ gère recherche, filtre par poste et achat au prix demandé
→ ajoute le joueur acheté à l'effectif
→ met à jour budget transfert et solde
→ génère le courrier de transfert si disponible
→ passe par btmRegisterRender("transfers", ...)
→ ne charge plus transfers-v017.js
→ ne réécrit plus refreshUI
```

## Modules passés sur le registre

```text
theme.js
squad.js
lineup.js
calendar.js
season-flow.js
mailbox.js
player-db.js
transfers.js
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
player-db.js
transfers.js
```

## Ponts ou compatibilités restants

```text
Aucun pont gameplay majeur encore actif côté Match / Calendar / Lineup / Player DB / Transfers.
```

Les anciens fichiers versionnés restent présents dans le repository pour l'instant. Ils sont candidats au nettoyage ciblé dès que les tests V0.35 sont validés.

## Note cache

`index.html` charge maintenant `transfers.js?v=035` et `transfers.css?v=035`. Un **Ctrl + F5** reste recommandé après déploiement GitHub Pages.

## Prochaine étape recommandée

**V0.36 — nettoyage ciblé des fichiers historiques orphelins**, puis **V0.37 — schemaVersion + migrations de sauvegardes**.