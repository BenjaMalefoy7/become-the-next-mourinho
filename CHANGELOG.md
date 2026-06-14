# Changelog — Become the next Mourinho

## V0.24 — Extraction réelle du Match Center

- `match-center.js` n’est plus un simple pont vers `season-v013.js`.
- `match-center.css` n’est plus un simple `@import` vers `season-v013.css`.
- Le rendu stable du Match Center vit maintenant directement dans `match-center.js`.
- Le style stable du Match Center vit maintenant directement dans `match-center.css`.
- Le Match Center conserve les fonctions principales :
  - préparation d’avant-match ;
  - analyse adverse ;
  - validation de composition ;
  - validation du plan de match ;
  - lancement du match ;
  - rapport post-match avec timeline et stats.
- Cette version retire le premier gros pont historique derrière les noms stables.
- `index.html` garde encore `match-center.js?v=023` pendant cette passe, donc un `Ctrl + F5` reste recommandé.

## V0.23 — Index plat sur points d’entrée stables

- `index.html` ne charge plus directement les vieux modules de base :
  - `lineup-v050.js`
  - `calendar-v060.js`
  - `match-v080.js`
  - `matchday-v090.js`
- Le HTML principal charge maintenant les points d’entrée stables :
  - `lineup.js?v=023`
  - `calendar.js?v=023`
  - `match-engine.js?v=023`
  - `league-sim.js?v=023`
  - `theme.js?v=023`
  - `squad.js?v=023`
  - `season-flow.js?v=023`
  - `mailbox.js?v=023`
  - `player-db.js?v=023`
  - `transfers.js?v=023`
  - `training.js?v=023`
  - `match-center.js?v=023`
- Ajout de `league-sim.js` comme point d’entrée stable vers la simulation de journée / classement dynamique.
- Cache-busting aligné en `?v=023` sur les ponts principaux.
- `theme.js` affiche maintenant V0.23 dans le footer.
- README et notes techniques mis à jour sur l’état réel.

## V0.22 — Index plat progressif

- `index.html` charge maintenant directement les modules récents via des points d’entrée stables.
- Ajout des points d’entrée stables pour l’Effectif :
  - `squad.js?v=022`
  - `squad.css?v=022`
- Ajout de ponts stables pour les modules de base encore historiques :
  - `lineup.js?v=022`
  - `calendar.js?v=022`
  - `match-engine.js?v=022`
  - `league-simulation.js?v=022`
  - `theme.js?v=022`
- Retrait du loader dynamique caché dans `season-v015.js`.
- Retrait de `match-details-v010.js` du chargement principal de `index.html` afin d’éviter qu’il relance des modules concurrents.
- Cache-busting aligné sur `?v=022` pour les ponts stables.
- README mis à jour sur V0.22.

## V0.21 — Début loader plat + noms stables

- Ajout de `btm-flat-loader.js?v=021` comme point d’entrée central pour les modules récents.
- Ajout de points d’entrée stables :
  - `match-center.js?v=021`
  - `season-flow.js?v=021`
  - `mailbox.js?v=021`
  - `player-db.js?v=021`
  - `transfers.js?v=021`
  - `training.js?v=021`
- Ajout de points d’entrée CSS stables :
  - `match-center.css?v=021`
  - `season-flow.css?v=021`
  - `mailbox.css?v=021`
  - `transfers.css?v=021`
  - `training.css?v=021`
- Remplacement du mini-loader non-match dans `season-v015.js` par le loader plat central.
- Conservation volontaire de ponts de compatibilité vers certains fichiers historiques versionnés pour éviter une rupture brutale.
- Documentation mise à jour pour refléter l’état V0.21.

## V0.20 — Stabilisation flow saison + Match Center unifié

- Stabilisation du passage jour par jour.
- Blocage réel du bouton “Jour suivant” quand un match non joué est dû.
- Le bouton d’accès au match devient une logique “Aller au match” le jour même.
- Unification de l’écran Match dans `season-v013.js` malgré son nom historique.
- Suppression des anciens rendus concurrents dans l’écran Match via réécriture complète du rendu.
- Ajout d’un rapport post-match intégré au Match Center : score, timeline, stats, xG simplifié et lecture coach.
- Enrichissement et persistance des données de rapport après simulation.
- Réduction du spam courrier : plus de briefing automatique inutile tous les jours.
- Suppression du chaînage dynamique des anciens modules de match récents depuis `season-v015.js`.
- Réalignement du footer et du texte dashboard sur V0.20.

## V0.19.10 — Matchday Center et rapport forcé

- Ajout d’un rapport de match forcé chargé en dernier.
- Objectif : remplacer les anciens blocs “Dernier rapport” par un rapport post-match plus complet.
- Ajout / consolidation prévue de la timeline, des stats de match et du score central.
- Le flow de saison doit maintenant bloquer le passage au jour suivant si un match non joué est dû.

## V0.19 — Matchday Center

- Refonte de l’écran Match autour d’un centre de préparation.
- Ajout d’une analyse adverse.
- Ajout d’une compo probable adverse abstraite.
- Ajout d’une validation de composition.
- Ajout d’une validation de plan de match.
- Préparation de l’écran résultat post-match.

## V0.18 — Entraînement

- Ajout d’un système d’entraînement par groupes : gardiens, défense, milieu, attaque.
- Ajout de focus : équilibré, physique, technique, tactique, repos.
- Les effets s’appliquent progressivement lors du passage des jours.

## V0.17 — Recrutement

- Ajout d’un premier marché des transferts jouable.
- Ajout de la recherche joueur / club.
- Ajout du filtre par poste.
- Ajout de l’achat au prix demandé.
- Déduction du budget transfert.
- Ajout du joueur acheté à l’effectif.

## V0.16 — Base joueurs générée

- Ajout d’un vivier de joueurs générés par carrière.
- Préparation de la future intégration d’un dataset réel.
- Ajout des champs principaux : poste, âge, nationalité, overall, potentiel, valeur, salaire, club actuel.

## V0.15 — Courrier

- Ajout d’un onglet Courrier.
- Ajout des premiers briefings et rapports de match.
- Le courrier reste à nettoyer : moins de messages, messages plus utiles, meilleurs types.

## V0.14 — Saison jour par jour

- Ajout d’une date courante de saison.
- Ajout du passage au jour suivant.
- Ajout d’un verrou de matchday pour empêcher de sauter un match dû.

## V0.13 — Dossier tactique pré-match

- Transformation progressive de l’écran Match en dossier tactique.
- Ajout du prochain match, de la compo, de la condition et de la décision coach.

## Note technique importante

À partir de la refonte loader, le projet devra arrêter de versionner les modules dans le nom de fichier.

À privilégier :

```text
match-center.js?v=024
season-flow.js?v=024
mailbox.js?v=024
transfers.js?v=024
training.js?v=024
```

À éviter :

```text
season-v013.js
season-v0141.js
season-v01910.js
```

Cette règle doit empêcher le README, le CHANGELOG et les notes techniques de décrocher à chaque itération rapide.

## V0.12 — Effectif en dossier joueur

- Refonte de l’écran Effectif en dossier joueur.
- Liste compacte à gauche.
- Dossier détaillé à droite.
- Notes coach et informations clés.

## V0.11.4 — Stabilisation DA + nettoyage urgent

- Clarification de la direction artistique active : Coach Notebook / Manager War Room.
- Conservation de la navigation active dans `notebook-nav-v0112.css`.
- Suppression des anciens fichiers orphelins :
  - `app-v043.js`
  - `notebook-theme.css`
  - `notebook-theme-v011.js`
- Mise à jour du README pour refléter l’état réel du projet à ce moment-là.

## V0.11.3 — Intercalaires carnet

- Suppression du gros rail vertical façon fausse reliure.
- Navigation gauche transformée en intercalaires de carnet.
- Onglet actif plus visible et plus proche de la page.
- Écrans d’entrée rapprochés de la DA carnet.

## V0.11 — Direction artistique Coach Notebook

- Première base visuelle carnet / classeur / war room.
- Couleurs du club utilisées pour piloter la DA.
- Premiers essais de texture papier, sidebar classeur, post-its et onglets.
