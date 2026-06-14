# Become the next Mourinho — V0.29B

Jeu privé de gestion footballistique jouable directement dans le navigateur.

Le projet avance progressivement en HTML/CSS/JavaScript vanilla, sans backend pour le moment. Les sauvegardes sont stockées localement dans le navigateur via `localStorage`.

## Version actuelle

**V0.29B — Render registry centralisé**

Cette version termine la phase courte V0.29B : le registre de rendu n’est plus initialisé indirectement par `squad.js`. Il est maintenant installé par `theme.js`, chargé juste après `app.js` et avant les modules extraits.

Avant, une partie importante de la cascade fragile venait de ce motif :

```text
refreshUI = function(){ oldRefresh(); monRender(); }
```

Maintenant, les modules extraits principaux s’enregistrent dans un registre :

```text
btmRegisterRender("module", renderFunction)
```

Le cycle devient :

```text
refreshUI()
→ rendu de base app.js
→ btmRunRegisteredRenders()
→ modules extraits enregistrés
```

## Modules passés sur le registre

```text
theme.js        // bootstrap du registre + couleurs dynamiques
squad.js        // rendu effectif
season-flow.js  // panneau jour par jour + verrou matchday
mailbox.js      // courrier manager
training.js     // entraînement par groupes
match-center.js // écran Match
```

Ces modules ne réécrivent plus chacun `refreshUI` en cascade.

## Chaîne de match actuelle

```text
match-center.js
→ appelle saveSimulatedMatch()

season-flow.js
→ vérifie que le match est jouable
→ appelle btmSimulateUserMatch(career, userMatch)
→ appelle btmSimulateOtherMatches(career, matchday, userFixtureId)
→ appelle computeDynamicStandings(career)
→ enrichit le rapport
→ génère le courrier de match
→ sauvegarde la carrière
```

Le Match Center reste le seul module qui dessine l’écran Match.

## Modules réellement extraits

```text
match-center.js   // code réel du Match Center
match-center.css  // styles réels du Match Center
season-flow.js    // code réel du rythme jour par jour + appel explicite de la simulation pure
season-flow.css   // styles réels du panneau saison
mailbox.js        // code réel du courrier manager
mailbox.css       // styles réels du courrier manager
training.js       // code réel de l'entraînement par groupes
training.css      // styles réels de l'entraînement
match-engine.js   // code réel de simulation du match utilisateur
league-sim.js     // code réel de simulation journée / classement
theme.js          // registre de rendu + thème dynamique
```

## Fichiers chargés depuis index.html

```text
data.js?v=060
app.js?v=044
theme.js?v=029B
lineup.js?v=023
calendar.js?v=023
match-engine.js?v=028B
league-sim.js?v=028B
squad.js?v=029B
season-flow.js?v=025
mailbox.js?v=026
player-db.js?v=023
transfers.js?v=023
training.js?v=027
match-center.js?v=028A
```

`index.html` est maintenant bumpé pour la passe V0.29B. Un **Ctrl + F5** reste conseillé après déploiement GitHub Pages.

## Ponts de compatibilité restants

```text
lineup.js       -> lineup-v050.js
calendar.js     -> calendar-v060.js
player-db.js    -> player-db-v016.js
transfers.js    -> transfers-v017.js
```

`match-engine.js` et `league-sim.js` ne sont plus des ponts.

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
- simulation utilisateur relogée dans `match-engine.js` ;
- simulation des autres matchs relogée dans `league-sim.js` ;
- classement dynamique recalculé depuis les matchs joués ;
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
match-center.js?v=029
season-flow.js?v=029
mailbox.js?v=029
training.js?v=029
match-engine.js?v=028B
league-sim.js?v=028B
```

À éviter désormais :

```text
season-v013.js
season-v0141.js
season-v01910.js
match-v080.js
matchday-v090.js
```

## Prochaine étape recommandée

**V0.30 — Extraction réelle de Lineup ou Calendar**

Objectifs :

```text
- extraire réellement lineup.js ou calendar.js ;
- supprimer leurs wrappers refreshUI historiques ;
- continuer à réduire les ponts restants ;
- préparer ensuite le nettoyage des vieux fichiers orphelins.
```
