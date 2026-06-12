# Become the next Mourinho — V0.4.4

Jeu privé de gestion footballistique jouable directement dans le navigateur.

## Version actuelle

V0.4.4 est une version de stabilisation technique avant la prochaine vraie fonctionnalité.

Elle conserve les bases de la V0.4 :

- page d’accueil au lancement ;
- menus pré-jeu séparés pour créer une carrière et gérer les sauvegardes ;
- sidebar uniquement après lancement ou chargement d’une carrière ;
- menus custom pour le badge, le club remplacé et la difficulté ;
- choix d’effectif de départ ;
- génération d’un effectif neuf de 24 joueurs fictifs ;
- sauvegardes multiples via `localStorage` ;
- Premier League 2025/2026 structurée avec 20 clubs ;
- remplacement du club choisi par le club personnalisé ;
- classement initial généré depuis la carrière active.

## Stabilisation V0.4.4

Cette version corrige plusieurs risques repérés pendant la review du repo :

- l’effectif n’est plus régénéré simplement parce qu’il descend sous 24 joueurs ;
- l’effectif généré n’est recréé automatiquement que si la sauvegarde n’a aucun joueur ;
- les IDs de clubs personnalisés sont rendus uniques pour éviter les collisions avec les clubs réels ;
- les sauvegardes corrompues ne doivent plus casser l’accueil ou l’écran Mes sauvegardes ;
- l’écriture dans `localStorage` est protégée ;
- `app.js` redevient le fichier JavaScript principal stable ;
- `index.html` charge `style.css?v=044` et `app.js?v=044` pour limiter les soucis de cache ;
- l’ancien hotfix `v041-fix.js` a été retiré.

## Important

Les budgets, réputations, valeurs joueurs et salaires sont des valeurs de gameplay provisoires.

Les vrais effectifs joueurs ne sont pas encore intégrés. Ils arriveront plus tard depuis un dataset propre.

L’option “Garder l’effectif du club remplacé” est déjà prévue dans le menu, mais elle est verrouillée tant que les vrais effectifs ne sont pas intégrés.

## Comment lancer

Le projet peut être ouvert via GitHub Pages si le repo est configuré pour publier depuis la branche `main` et la racine du repo.

Sinon, il suffit d'ouvrir `index.html` dans un navigateur.

## Fichiers

- `index.html` : structure de l'application, menus pré-jeu et choix d’effectif de départ.
- `style.css` : style provisoire et menus custom.
- `app.js` : logique d’accueil, création de carrière, sauvegardes, navigation manager, menus custom, génération d’effectif et stabilisation.
- `data.js` : données structurées du championnat, des clubs, des postes et des formations.

## Prochaine étape

V0.5 : commencer à exploiter l’effectif avec une première composition d’équipe.
