# Become the next Mourinho — V0.23

Jeu privé de gestion footballistique jouable directement dans le navigateur.

Le projet avance progressivement en HTML/CSS/JavaScript vanilla, sans backend pour le moment. Les sauvegardes sont stockées localement dans le navigateur via `localStorage`.

## Version actuelle

**V0.23 — Index plat sur points d’entrée stables**

Cette version fait passer `index.html` sur des noms de modules stables. Les anciens fichiers versionnés existent encore derrière certains ponts de compatibilité, mais le HTML principal ne les appelle plus directement.

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
- Matchday Center avec analyse adverse ;
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
match-center.js?v=023
season-flow.js?v=023
mailbox.js?v=023
transfers.js?v=023
training.js?v=023
squad.js?v=023
```

À éviter désormais :

```text
season-v013.js
season-v0141.js
season-v01910.js
```

## Prochaine étape recommandée

**V0.24 — extraction réelle des ponts restants + schemaVersion de sauvegarde**

Objectif : copier progressivement le code utile des anciens fichiers vers les fichiers stables, puis retirer les derniers fichiers historiques derrière les ponts de compatibilité.
