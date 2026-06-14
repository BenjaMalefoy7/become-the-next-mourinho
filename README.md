# Become the next Mourinho — V0.24

Jeu privé de gestion footballistique jouable directement dans le navigateur.

Le projet avance progressivement en HTML/CSS/JavaScript vanilla, sans backend pour le moment. Les sauvegardes sont stockées localement dans le navigateur via `localStorage`.

## Version actuelle

**V0.24 — Extraction réelle du Match Center**

Cette version poursuit la transition propre engagée en V0.21–V0.23. `index.html` charge les modules via des noms stables et le premier gros pont historique a été réellement extrait : `match-center.js` et `match-center.css` ne redirigent plus vers `season-v013.js` / `season-v013.css`.

## Fichiers chargés depuis index.html

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

> Note : le contenu de `match-center.js` est maintenant en V0.24 même si le cache-busting HTML reste encore `?v=023` sur cette passe. Faire `Ctrl + F5` pendant la transition.

## DA active

La DA active reste **Coach Notebook / Manager War Room** : carnet tactique, papier, onglets, dossiers, notes de coach et couleurs dynamiques du club.

## Fonctionnalités présentes

- page d’accueil au lancement ;
- création de carrière avec club personnalisé ;
- choix du club Premier League remplacé ;
- choix de difficulté : outsider, ambitieux, nouveau géant ;
- génération d’un effectif fictif de départ ;
- sauvegardes multiples via `localStorage` ;
- Premier League 2025/2026 structurée ;
- calendrier complet généré sur 38 journées ;
- écran Composition avec terrain cliquable ;
- compatibilité des postes principaux et secondaires ;
- saison jour par jour avec verrou de jour de match ;
- Match Center stable extrait, avec analyse adverse ;
- validation composition / plan de match ;
- simulation simple du match ;
- simulation complète d’une journée ;
- classement dynamique recalculé depuis les matchs joués ;
- zones de classement : C1, C3, C4, relégation ;
- rapport post-match enrichi ;
- courrier manager réduit ;
- base joueurs générée pour le recrutement ;
- premier marché des transferts jouable ;
- entraînement par groupes.

## Important

Les budgets, réputations, valeurs joueurs, salaires, statistiques de match et profils générés sont des valeurs de gameplay provisoires.

Les vrais effectifs joueurs ne sont pas encore intégrés. Ils arriveront plus tard depuis un dataset propre.

L’option “Garder l’effectif du club remplacé” est déjà prévue dans le menu, mais elle reste verrouillée tant que les vrais effectifs ne sont pas intégrés.

## Règle de modules

La règle désormais : **nom de fichier stable + version en query string**.

À privilégier :

```text
match-center.js?v=024
season-flow.js?v=024
mailbox.js?v=024
transfers.js?v=024
training.js?v=024
squad.js?v=024
```

À éviter désormais :

```text
season-v013.js
season-v0141.js
season-v01910.js
```

## Prochaine étape recommandée

**V0.25 — extraction réelle de Season Flow**

Objectif : faire pour `season-flow.js` ce qui vient d’être fait pour `match-center.js`, puis continuer avec `mailbox.js`, `lineup.js`, `calendar.js` et les moteurs de simulation.
