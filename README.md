# Become the next Mourinho — V0.2.1

Jeu privé de gestion football jouable directement dans le navigateur.

## Version actuelle

V0.2.1 ajuste l’entrée du jeu pour avoir une vraie page d’accueil avant l’interface manager.

Cette version contient :

- une page d’accueil au lancement du jeu ;
- trois choix principaux : Nouvelle partie, Continuer, Mes sauvegardes ;
- désactivation automatique du bouton Continuer si aucune carrière n’existe ;
- accès à l’interface manager seulement après un choix ;
- création d’une carrière ;
- mode actif : créer son club ;
- choix du club de Premier League remplacé ;
- choix de difficulté ;
- budget de départ selon la difficulté ;
- sauvegardes multiples avec `localStorage` ;
- chargement d’une carrière ;
- suppression d’une carrière ;
- dashboard mis à jour selon la carrière active.

## Comment lancer

Le projet peut être ouvert via GitHub Pages si le repo est configuré pour publier depuis la branche `main` et le dossier `/root`.

Sinon, il suffit d'ouvrir `index.html` dans un navigateur.

## Fichiers

- `index.html` : structure de l'application.
- `style.css` : style provisoire.
- `app.js` : logique d’accueil, navigation, création de carrière et sauvegardes.
- `data.js` : données temporaires de démo.

## Note sur le style visuel

Le style actuel est provisoire. Il sert uniquement à avancer sur les mécaniques de jeu.

Une vraie direction artistique sera décidée plus tard avec des exemples visuels, afin d'éviter un rendu trop proche d'un dashboard professionnel.

## Prochaine étape

V0.3 : structurer les vraies données de jeu.

Objectifs prévus :

- définir les structures propres pour les clubs ;
- préparer la structure des joueurs ;
- préparer la structure du championnat ;
- poser les bases de la Premier League 2025/2026 ;
- préparer la future intégration d'un dataset FIFA / EA FC / SoFIFA.
