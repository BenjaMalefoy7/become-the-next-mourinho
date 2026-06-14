# Become the next Mourinho — V0.19.10

Jeu privé de gestion footballistique jouable directement dans le navigateur.

Le projet avance progressivement en HTML/CSS/JavaScript vanilla, sans backend pour le moment. Les sauvegardes sont stockées localement dans le navigateur via `localStorage`.

## Version actuelle

**V0.19.10 — Matchday Center + flow jour par jour + rapport de match forcé**

Cette version marque le passage du prototype de match simple vers une vraie boucle de manager :

```text
jour suivant
jour de match
Matchday Center
validation composition
validation plan
simulation
rapport post-match
retour au calendrier
```

La DA active reste **Coach Notebook / Manager War Room** : carnet tactique, papier, onglets, dossiers, notes de coach et couleurs dynamiques du club.

## Fonctionnalités déjà présentes

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
- rapport post-match enrichi : score, timeline, possession, tirs, xG simplifié, occasions et lecture coach ;
- courrier manager ;
- base joueurs générée pour le recrutement ;
- premier marché des transferts jouable ;
- entraînement par groupes.

## Important

Les budgets, réputations, valeurs joueurs, salaires, statistiques de match et profils générés sont des valeurs de gameplay provisoires.

Les vrais effectifs joueurs ne sont pas encore intégrés. Ils arriveront plus tard depuis un dataset propre.

L’option “Garder l’effectif du club remplacé” est déjà prévue dans le menu, mais elle reste verrouillée tant que les vrais effectifs ne sont pas intégrés.

## Dette technique prioritaire

Le projet a beaucoup itéré avec des fichiers versionnés dans leur nom. Cette méthode devient difficile à maintenir.

La prochaine refonte technique devra basculer vers des noms de modules stables avec version en query string.

À faire :

```text
match-center.js?v=020
season-flow.js?v=020
mailbox.js?v=020
transfers.js?v=020
training.js?v=020
squad.js?v=020
```

À éviter désormais :

```text
season-v013.js
season-v0141.js
season-v01910.js
```

Objectif : éviter que README, CHANGELOG et notes techniques décrochent à chaque version rapide.

## Fichiers principaux

- `index.html` : structure de l’application, écrans d’entrée, shell principal et imports.
- `style.css` : base générale historique.
- `notebook-nav-v0112.css` : couche active Coach Notebook / intercalaires carnet.
- `data.js` : données de championnat, clubs, postes et formations.
- `app.js` : logique d’accueil, création, sauvegardes, navigation, génération d’effectif et stabilisation.
- `lineup.css` + `lineup-v050.js` : composition d’équipe.
- `calendar.css` + `calendar-v060.js` : calendrier généré.
- `match.css` + `match-v080.js` : simulation simple.
- `matchday-v090.js` : simulation de journée et classement dynamique.
- `match-details.css` + `match-details-v010.js` : statistiques et résumé enrichi de match, avec couche légère de variables DA.
- `squad-v012.js/css` : écran Effectif en dossier joueur.
- `season-v013.js` à `season-v01910.js/css` : modules récents de saison, courrier et Matchday Center.
- `player-db-v016.js` : base joueurs générée.
- `transfers-v017.js/css` : marché des transferts.
- `training-v018.js/css` : entraînements.

## Prochaine étape recommandée

**V0.20 — Match Center unifié**

Objectif : reconstruire proprement tout l’écran Match dans un seul module stable, puis arrêter les anciens rendus empilés.
