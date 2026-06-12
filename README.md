# Become the next Mourinho — V0.4

Jeu privé de gestion football jouable directement dans le navigateur.

## Version actuelle

V0.4 ajoute la génération d’un effectif de départ pour les nouvelles carrières.

Cette version contient :

- une vraie page d’accueil au lancement ;
- un menu pré-jeu séparé pour créer une carrière ;
- un menu pré-jeu séparé pour les sauvegardes ;
- la sidebar uniquement après lancement ou chargement d’une carrière ;
- des menus custom pour le badge temporaire, le club remplacé et la difficulté ;
- un choix d’effectif de départ dans la création de carrière ;
- l’option active : générer un effectif neuf ;
- l’option future verrouillée : garder l’effectif du club remplacé ;
- la création automatique de 24 joueurs fictifs pour le club personnalisé ;
- des joueurs générés selon la difficulté : outsider, ambitieux ou nouveau géant ;
- les champs joueurs : nom, club, nationalité, âge, poste principal, postes secondaires, overall, attaque, défense, physique, mental, potentiel, salaire, valeur, contrat, morale, condition et blessure ;
- l’affichage de l’effectif réel de la carrière dans l’onglet Effectif ;
- la masse salariale calculée dans l’onglet Finances ;
- les sauvegardes multiples avec `localStorage` ;
- une structure propre pour la Premier League 2025/2026 ;
- les 20 clubs de Premier League 2025/2026 sous forme d’objets ;
- le remplacement du club choisi par le club personnalisé ;
- un classement initial généré depuis les clubs de la carrière ;
- un dashboard qui affiche la ligue, le club remplacé et le nombre de joueurs.

## Important

Les budgets, réputations, valeurs joueurs et salaires sont des valeurs de gameplay provisoires. Ce ne sont pas des chiffres officiels.

Les vrais effectifs joueurs ne sont pas encore intégrés. Ils arriveront plus tard depuis un dataset FIFA / EA FC / SoFIFA.

L’option “Garder l’effectif du club remplacé” est déjà prévue dans le menu, mais elle est verrouillée tant que les vrais effectifs ne sont pas intégrés.

Les anciennes sauvegardes créées avant la V0.4 peuvent ne pas contenir d’effectif. Il faut créer une nouvelle carrière pour tester la génération de joueurs.

## Comment lancer

Le projet peut être ouvert via GitHub Pages si le repo est configuré pour publier depuis la branche `main` et le dossier `/root`.

Sinon, il suffit d'ouvrir `index.html` dans un navigateur.

## Fichiers

- `index.html` : structure de l'application, menus pré-jeu et choix d’effectif de départ.
- `style.css` : style provisoire et menus custom.
- `app.js` : logique d’accueil, création de carrière, sauvegardes, navigation manager, menus custom et génération d’effectif.
- `data.js` : données structurées du championnat, des clubs, des postes et des formations.

## Note sur le style visuel

Le style actuel est provisoire. Il sert uniquement à avancer sur les mécaniques de jeu.

Une vraie direction artistique sera décidée plus tard avec des exemples visuels, afin d'éviter un rendu trop proche d'un dashboard professionnel.

## Prochaine étape

V0.5 : commencer à exploiter l’effectif avec une première composition d’équipe.

Objectifs prévus :

- choisir une formation ;
- afficher les postes attendus ;
- sélectionner des titulaires depuis l’effectif ;
- calculer une note d’équipe simple ;
- préparer le futur moteur de match.