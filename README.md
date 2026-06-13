# Become the next Mourinho — V0.11.4

Jeu privé de gestion footballistique jouable directement dans le navigateur.

Le projet avance progressivement en HTML/CSS/JavaScript vanilla, sans backend pour le moment. Les sauvegardes sont stockées localement dans le navigateur via `localStorage`.

## Version actuelle

**V0.11.4 — Stabilisation DA + nettoyage urgent**

Cette version clarifie la direction artistique validée : **Coach Notebook / Manager War Room**.

La DA active repose maintenant sur :

- une navigation gauche en intercalaires de carnet ;
- une base visuelle papier / classeur via `notebook-nav-v0112.css` ;
- des couleurs dynamiques pilotées par le club chargé ;
- une interface plus proche d’un carnet de coach que d’un dashboard SaaS ;
- des écrans d’entrée davantage orientés page de garde / dossier.

Les anciens fichiers `notebook-theme.css`, `notebook-theme-v011.js` et `app-v043.js` ont été supprimés pour éviter les fichiers orphelins.

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
- pré-match avec validation de la composition ;
- simulation simple du match ;
- simulation complète d’une journée ;
- classement dynamique recalculé depuis les matchs joués ;
- zones de classement : C1, C3, C4, relégation ;
- résumé enrichi de match : possession, tirs, tirs cadrés, xG simplifié, occasions dangereuses et homme du match ;
- direction artistique Coach Notebook en cours d’intégration.

## Important

Les budgets, réputations, valeurs joueurs et salaires sont des valeurs de gameplay provisoires.

Les vrais effectifs joueurs ne sont pas encore intégrés. Ils arriveront plus tard depuis un dataset propre.

L’option “Garder l’effectif du club remplacé” est déjà prévue dans le menu, mais elle reste verrouillée tant que les vrais effectifs ne sont pas intégrés.

La DA n’est pas encore refondue écran par écran. La base globale est posée, et l’écran Effectif sera probablement le premier gros écran à refaire en format dossier joueur.

## Fichiers principaux chargés

- `index.html` : structure de l’application, écrans d’entrée, shell principal et imports.
- `style.css` : base générale historique.
- `notebook-nav-v0112.css` : couche active Coach Notebook / intercalaires carnet.
- `data.js` : données de championnat, clubs, postes et formations.
- `app.js` : logique d’accueil, création, sauvegardes, navigation, génération d’effectif et stabilisation.
- `lineup.css` + `lineup-v050.js` : composition d’équipe.
- `calendar.css` + `calendar-v060.js` : calendrier généré.
- `prematch.css` + `prematch-v070.js` : écran pré-match.
- `match.css` + `match-v080.js` : simulation simple.
- `matchday-v090.js` : simulation de journée et classement dynamique.
- `standings.css` : rendu du classement.
- `match-details.css` + `match-details-v010.js` : statistiques et résumé enrichi de match, avec couche légère de variables DA.

## Dette technique connue

- Uniformiser progressivement les fichiers modules vers un nom stable + query string, par exemple `lineup.js?v=053` au lieu de `lineup-v050.js?v=053`.
- Ajouter un `CHANGELOG.md` plus détaillé.
- Nettoyer les données mortes restantes si elles ne sont plus utilisées.
- Prévoir à terme un système de migration de sauvegardes avec `schemaVersion`.
- Réfléchir à un point d’orchestration unique du rendu avant que trop de modules n’enrobent `refreshUI`.

## Comment lancer

Le projet peut être ouvert via GitHub Pages si le repo est configuré pour publier depuis la branche `main` et la racine du repo.

Sinon, il suffit d’ouvrir `index.html` dans un navigateur.

## Prochaine étape recommandée

**V0.11.5 — Effectif en dossier joueur**

Objectif : remplacer l’affichage textuel actuel par une vraie interface carnet : liste compacte à gauche, dossier joueur à droite, silhouettes/maillots, notes de coach et informations clés.