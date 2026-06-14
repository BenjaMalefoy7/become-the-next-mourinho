# Become the next Mourinho — V0.22

Jeu privé de gestion footballistique jouable directement dans le navigateur.

Le projet avance progressivement en HTML/CSS/JavaScript vanilla, sans backend pour le moment. Les sauvegardes sont stockées localement dans le navigateur via `localStorage`.

## Version actuelle

**V0.22 — Index plat progressif + points d’entrée stables**

Cette version déplace le chargement principal vers `index.html` avec des points d’entrée stables. L’objectif est de sortir progressivement du modèle `season-v013.js`, `season-v01910.js`, etc.

## Fichiers chargés depuis index.html

```text
data.js?v=060
app.js?v=044
lineup-v050.js?v=053
calendar-v060.js?v=071
match-v080.js?v=080
matchday-v090.js?v=090
theme.js?v=022
squad.js?v=022
season-flow.js?v=022
mailbox.js?v=022
player-db.js?v=022
transfers.js?v=022
training.js?v=022
match-center.js?v=022
```

Les anciens fichiers critiques de base restent encore chargés directement pour préserver l’ordre d’exécution et éviter une rupture de gameplay. Les modules récents passent maintenant par des points d’entrée stables.

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

## Dette technique prioritaire

Le projet a beaucoup itéré avec des fichiers versionnés dans leur nom. Cette méthode devient difficile à maintenir.

La règle désormais : **nom de fichier stable + version en query string**.

À privilégier :

```text
match-center.js?v=022
season-flow.js?v=022
mailbox.js?v=022
transfers.js?v=022
training.js?v=022
squad.js?v=022
```

À éviter désormais :

```text
season-v013.js
season-v0141.js
season-v01910.js
```

## Prochaine étape recommandée

**V0.23 — extraction complète des ponts de compatibilité**

Objectif : copier progressivement le code utile des anciens fichiers vers les fichiers stables, puis retirer les derniers fichiers historiques du chargement principal.