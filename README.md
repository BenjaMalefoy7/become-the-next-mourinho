# Become the next Mourinho — V0.3

Jeu privé de gestion football jouable directement dans le navigateur.

## Version actuelle

V0.3 pose les premières vraies fondations de données du jeu.

Cette version contient :

- la page d’accueil ajoutée en V0.2.1 ;
- la création de carrière ;
- les sauvegardes multiples avec `localStorage` ;
- une structure propre pour la Premier League 2025/2026 ;
- les 20 clubs de Premier League 2025/2026 sous forme d’objets ;
- les infos de club : id, nom, nom court, pays, ligue, réputation, budget, couleurs et stade ;
- le format du championnat : saison, nombre d’équipes, journées, points par résultat ;
- la structure des postes utilisés dans le jeu ;
- la structure des formations prévues ;
- la création d’une ligue de 20 équipes quand une carrière est créée ;
- le remplacement du club choisi par le club personnalisé ;
- un classement initial généré depuis les clubs de la carrière ;
- un dashboard qui affiche la ligue et le club remplacé.

## Important

Les budgets et réputations des clubs sont des valeurs de gameplay provisoires. Ce ne sont pas des chiffres officiels.

Les vraies données joueurs ne sont pas encore intégrées. Elles arriveront plus tard depuis un dataset FIFA / EA FC / SoFIFA.

## Comment lancer

Le projet peut être ouvert via GitHub Pages si le repo est configuré pour publier depuis la branche `main` et le dossier `/root`.

Sinon, il suffit d'ouvrir `index.html` dans un navigateur.

## Fichiers

- `index.html` : structure de l'application.
- `style.css` : style provisoire.
- `app.js` : logique d’accueil, navigation, création de carrière, sauvegardes et génération d’état de carrière.
- `data.js` : données structurées du championnat, des clubs, des postes et des formations.

## Note sur le style visuel

Le style actuel est provisoire. Il sert uniquement à avancer sur les mécaniques de jeu.

Une vraie direction artistique sera décidée plus tard avec des exemples visuels, afin d'éviter un rendu trop proche d'un dashboard professionnel.

## Prochaine étape

V0.4 : générer l’effectif de départ du club créé selon la difficulté.

Objectifs prévus :

- créer un générateur de joueurs fictifs pour le club personnalisé ;
- générer un effectif différent selon la difficulté : outsider, ambitieux ou nouveau géant ;
- créer des joueurs avec poste principal, postes secondaires et stats simples ;
- stocker l’effectif dans la carrière ;
- afficher l’effectif réel de la carrière plutôt que les joueurs de démo.
