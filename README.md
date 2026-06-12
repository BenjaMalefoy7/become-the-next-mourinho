# Become the next Mourinho — V0.5.1

Jeu privé de gestion footballistique jouable directement dans le navigateur.

## Version actuelle

V0.5.1 stabilise et améliore l'écran Composition introduit en V0.5.

La base actuelle contient :

- page d’accueil au lancement ;
- menus pré-jeu séparés pour créer une carrière et gérer les sauvegardes ;
- sidebar uniquement après lancement ou chargement d’une carrière ;
- menus custom pour le badge, le club remplacé et la difficulté ;
- choix d’effectif de départ ;
- génération d’un effectif neuf de 24 joueurs fictifs ;
- sauvegardes multiples via `localStorage` ;
- Premier League 2025/2026 structurée avec 20 clubs ;
- remplacement du club choisi par le club personnalisé ;
- classement initial généré depuis la carrière active ;
- composition d’équipe sauvegardée dans la carrière.

## Nouveautés V0.5.1

- correction de l'affichage terrain du 4-4-2 : il affiche bien 2 attaquants, 4 milieux, 4 défenseurs et 1 gardien ;
- double check des formations disponibles avec des lignes de jeu plus cohérentes ;
- écran Composition plus compact ;
- postes regroupés par lignes : gardien, défense, milieu, attaque ;
- liste des joueurs mieux triée selon la compatibilité avec le poste ;
- bouton Auto-composer pour régénérer automatiquement un onze cohérent ;
- terrain plus lisible avec des lignes de jeu nommées.

## Stabilisation déjà présente

- l’effectif n’est plus régénéré simplement parce qu’il descend sous 24 joueurs ;
- l’effectif généré n’est recréé automatiquement que si la sauvegarde n’a aucun joueur ;
- les IDs de clubs personnalisés sont rendus uniques pour éviter les collisions avec les clubs réels ;
- les sauvegardes corrompues ne doivent plus casser l’accueil ou l’écran Mes sauvegardes ;
- l’écriture dans `localStorage` est protégée ;
- `index.html` charge les fichiers avec query string pour limiter les soucis de cache.

## Important

Les budgets, réputations, valeurs joueurs et salaires sont des valeurs de gameplay provisoires.

Les vrais effectifs joueurs ne sont pas encore intégrés. Ils arriveront plus tard depuis un dataset propre.

L’option “Garder l’effectif du club remplacé” est déjà prévue dans le menu, mais elle est verrouillée tant que les vrais effectifs ne sont pas intégrés.

La génération de noms cohérents par nationalité est prévue plus tard. Elle n’est pas encore intégrée.

## Comment lancer

Le projet peut être ouvert via GitHub Pages si le repo est configuré pour publier depuis la branche `main` et la racine du repo.

Sinon, il suffit d'ouvrir `index.html` dans un navigateur.

## Fichiers

- `index.html` : structure de l'application, menus pré-jeu, choix d’effectif et écran composition.
- `style.css` : style provisoire et menus custom.
- `lineup.css` : styles spécifiques à la composition d’équipe.
- `app.js` : logique d’accueil, création de carrière, sauvegardes, navigation manager, menus custom, génération d’effectif et stabilisation.
- `lineup-v050.js` : logique de composition d’équipe, actuellement stabilisée en V0.5.1.
- `data.js` : données structurées du championnat, des clubs, des postes et des formations.

## Prochaine étape

Selon les retours : V0.5.2 pour peaufiner la composition, ou V0.6 pour générer un calendrier plus complet avant la simulation de match.
