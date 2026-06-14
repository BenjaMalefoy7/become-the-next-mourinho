# Become the next Mourinho — V0.21

Jeu privé de gestion footballistique jouable directement dans le navigateur.

Le projet avance progressivement en HTML/CSS/JavaScript vanilla, sans backend pour le moment. Les sauvegardes sont stockées localement dans le navigateur via `localStorage`.

## Version actuelle

**V0.21 — Début de migration loader plat + noms stables**

Cette version engage la migration technique vers des points d’entrée stables, tout en gardant une compatibilité prudente avec les anciens fichiers versionnés.

```text
btm-flat-loader.js?v=021
match-center.js?v=021
season-flow.js?v=021
mailbox.js?v=021
player-db.js?v=021
transfers.js?v=021
training.js?v=021
```

La DA active reste **Coach Notebook / Manager War Room** : carnet tactique, papier, onglets, dossiers, notes de coach et couleurs dynamiques du club.

## Stabilisation récente V0.20

- passage au jour suivant bloqué si un match non joué est dû ;
- bouton “Avancer au prochain match” remplacé par une logique “Aller au match” le jour même ;
- écran Match unifié pour éviter les anciens blocs concurrents ;
- rapport post-match intégré au Match Center : score, timeline, possession, tirs, xG, occasions et lecture coach ;
- stats de rapport enrichies puis persistées dans la sauvegarde ;
- courrier réduit : plus de briefing automatique inutile tous les jours ;
- anciens loaders de match récents retirés du chaînage dynamique ;
- footer et texte dashboard réalignés sur V0.20.

## Migration V0.21

- ajout de `btm-flat-loader.js` ;
- ajout des points d’entrée stables `match-center.js`, `season-flow.js`, `mailbox.js`, `player-db.js`, `transfers.js`, `training.js` ;
- ajout des points d’entrée CSS stables correspondants ;
- remplacement du mini-loader non-match dans `season-v015.js` par le loader plat central ;
- conservation temporaire des anciens fichiers versionnés comme ponts de compatibilité.

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

## Dette technique prioritaire

Le projet a beaucoup itéré avec des fichiers versionnés dans leur nom. Cette méthode devient difficile à maintenir.

La règle désormais : **nom de fichier stable + version en query string**.

À privilégier :

```text
match-center.js?v=021
season-flow.js?v=021
mailbox.js?v=021
transfers.js?v=021
training.js?v=021
squad.js?v=021
```

À éviter désormais :

```text
season-v013.js
season-v0141.js
season-v01910.js
```

Objectif : éviter que README, CHANGELOG et notes techniques décrochent à chaque version rapide.

## Fichiers principaux

- `index.html` : structure de l’application, écrans d’entrée, shell principal et imports historiques.
- `style.css` : base générale historique.
- `notebook-nav-v0112.css` : couche active Coach Notebook / intercalaires carnet.
- `data.js` : données de championnat, clubs, postes et formations.
- `app.js` : logique d’accueil, création, sauvegardes, navigation et génération d’effectif.
- `btm-flat-loader.js` : point d’entrée stable V0.21 pour les modules récents.
- `match-center.js/css` : point d’entrée stable vers le Match Center.
- `season-flow.js/css` : point d’entrée stable vers le flow saison.
- `mailbox.js/css` : point d’entrée stable vers le courrier.
- `player-db.js` : point d’entrée stable vers la base joueurs.
- `transfers.js/css` : point d’entrée stable vers les transferts.
- `training.js/css` : point d’entrée stable vers l’entraînement.

## Prochaine étape recommandée

**V0.22 — Index vraiment plat**

Objectif : charger directement les modules stables dans `index.html`, puis supprimer progressivement les anciens loaders dynamiques et les ponts vers fichiers versionnés.
