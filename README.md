# Become the next Mourinho — V0.28A

Jeu privé de gestion footballistique jouable directement dans le navigateur.

Le projet avance progressivement en HTML/CSS/JavaScript vanilla, sans backend pour le moment. Les sauvegardes sont stockées localement dans le navigateur via `localStorage`.

## Version actuelle

**V0.28A — Match Renderer Cutover, phase A**

Cette version suit le retour de check-up externe : avant d’ajouter de nouvelles features, il fallait prouver que le Match Center était le seul module à dessiner l’écran Match.

La simulation historique reste en place pour ne pas casser les matchs, mais les anciens effets visuels de `match-v080.js` et `matchday-v090.js` ont été neutralisés.

```text
match-v080.js      // conserve la simulation du match utilisateur, ne dessine plus l’écran Match
matchday-v090.js   // conserve la simulation de journée / classement, ne renomme plus le bouton Match
match-center.js    // reste le seul renderer de l’écran Match
```

## Fichiers chargés depuis index.html

```text
data.js?v=060
app.js?v=044
theme.js?v=023
lineup.js?v=023
calendar.js?v=023
match-engine.js?v=028A
league-sim.js?v=028A
squad.js?v=023
season-flow.js?v=025
mailbox.js?v=026
player-db.js?v=023
transfers.js?v=023
training.js?v=027
match-center.js?v=028A
```

## Modules réellement extraits

```text
match-center.js   // code réel du Match Center
match-center.css  // styles réels du Match Center
season-flow.js    // code réel du rythme jour par jour
season-flow.css   // styles réels du panneau saison
mailbox.js        // code réel du courrier manager
mailbox.css       // styles réels du courrier manager
training.js       // code réel de l'entraînement par groupes
training.css      // styles réels de l'entraînement
```

## V0.28A : ce qui est coupé

```text
match-v080.js
- plus de renderLastResultV080
- plus de bindSimulationButtonV080
- plus de updateMatchVersionTextsV080
- plus de décorations DOM depuis le moteur de match
- plus de wrapper refreshUI

matchday-v090.js
- plus de renommage du bouton de match
- plus de textes dashboard V0.9.2
- plus de wrapper refreshUI pour l’écran Match
- conserve computeDynamicStandings et saveSimulatedMatchdayV090
```

Le classement conserve encore un rendu dédié temporaire, en attendant l’orchestrateur central de rendu.

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
- Match Center stable extrait, avec analyse adverse ;
- validation composition / plan de match ;
- simulation simple du match ;
- simulation complète d’une journée ;
- classement dynamique recalculé depuis les matchs joués ;
- zones de classement : C1, C3, C4, relégation ;
- rapport post-match enrichi ;
- courrier manager réduit et stabilisé ;
- base joueurs générée pour le recrutement ;
- premier marché des transferts jouable ;
- entraînement par groupes extrait et stabilisé.

## Important

Les budgets, réputations, valeurs joueurs, salaires, statistiques de match et profils générés sont des valeurs de gameplay provisoires.

Les vrais effectifs joueurs ne sont pas encore intégrés. Ils arriveront plus tard depuis un dataset propre.

L’option “Garder l’effectif du club remplacé” est déjà prévue dans le menu, mais elle reste verrouillée tant que les vrais effectifs ne sont pas intégrés.

## Règle de modules

La règle désormais : **nom de fichier stable + version en query string**.

À privilégier :

```text
match-center.js?v=028A
season-flow.js?v=025
mailbox.js?v=026
training.js?v=027
transfers.js?v=023
squad.js?v=023
```

À éviter désormais :

```text
season-v013.js
season-v0141.js
season-v01910.js
```

## Prochaine étape recommandée

**V0.28B — simulation pure**

Objectif : transformer `match-engine.js` et `league-sim.js` en vrais modules sans pont vers `match-v080.js` et `matchday-v090.js`.

La chaîne cible sera :

```text
season-flow.js
→ simulateUserMatch(career)
→ simulateOtherMatches(career)
→ computeDynamicStandings(career)
→ enrichAndPersistMatchReport(career)
→ generateMatchMail(career)
```

Tant que cette extraction n’est pas terminée, ne pas ajouter de nouvelles features liées au match, au live match, au dirty game ou au rapport enrichi.
