# Become the next Mourinho — V0.27

Jeu privé de gestion footballistique jouable directement dans le navigateur.

Le projet avance progressivement en HTML/CSS/JavaScript vanilla, sans backend pour le moment. Les sauvegardes sont stockées localement dans le navigateur via `localStorage`.

## Version actuelle

**V0.26 + V0.27 — Extraction réelle du Courrier et de l’Entraînement**

Cette version poursuit la transition propre engagée en V0.21–V0.25. `index.html` charge les modules via des noms stables, et deux nouveaux ponts historiques ont été retirés :

```text
mailbox.js / mailbox.css ne dépendent plus de season-v015.js / season-v0151.css
training.js / training.css ne dépendent plus de training-v018.js / training-v018.css
```

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
season-flow.js?v=025
mailbox.js?v=026
player-db.js?v=023
transfers.js?v=023
training.js?v=027
match-center.js?v=023
```

## Modules réellement extraits

```text
match-center.js   // code réel du Match Center
match-center.css  // styles réels du Match Center
season-flow.js    // code réel du rythme jour par jour
season-flow.css   // styles réels du panneau saison
mailbox.js        // code réel du courrier manager
mailbox.css       // styles réels du courrier manager
training.js       // code réel de l'entraînement par groupes
training.css      // styles réels de l'entraînement
```

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
- courrier manager réduit et stabilisé ;
- base joueurs générée pour le recrutement ;
- premier marché des transferts jouable ;
- entraînement par groupes extrait et stabilisé.

## Important

Les budgets, réputations, valeurs joueurs, salaires, statistiques de match et profils générés sont des valeurs de gameplay provisoires.

Les vrais effectifs joueurs ne sont pas encore intégrés. Ils arriveront plus tard depuis un dataset propre.

L’option “Garder l’effectif du club remplacé” est déjà prévue dans le menu, mais elle reste verrouillée tant que les vrais effectifs ne sont pas intégrés.

## Règle de modules

La règle désormais : **nom de fichier stable + version en query string**.

À privilégier :

```text
match-center.js?v=027
season-flow.js?v=027
mailbox.js?v=027
transfers.js?v=027
training.js?v=027
squad.js?v=027
```

À éviter désormais :

```text
season-v013.js
season-v0141.js
season-v01910.js
```

## Prochaine étape recommandée

**V0.28 — extraction réelle du Recrutement**

Objectif : faire pour `transfers.js` ce qui vient d’être fait pour `mailbox.js` et `training.js`, sans encore ajouter les fenêtres de mercato ou les négociations avancées.
