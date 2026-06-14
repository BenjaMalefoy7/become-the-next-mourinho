# Changelog — Become the next Mourinho

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
match-center.js?v=020
season-flow.js?v=020
mailbox.js?v=020
transfers.js?v=020
training.js?v=020
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

## V0.10 — Match enrichi

- Ajout des statistiques de match : possession, tirs, tirs cadrés, xG simplifié, occasions dangereuses.
- Ajout de l’homme du match.
- Ajout d’un résumé textuel post-match.

## V0.9 — Simulation de journée + classement dynamique

- Simulation complète d’une journée.
- Simulation automatique des autres matchs.
- Classement recalculé depuis les matchs joués.
- Ajout des zones C1, C3, C4 et relégation.

## V0.8 — Simulation simple du match

- Résultat simulé pour le prochain match.
- Événements simples.
- Baisse de condition des titulaires.
- Sauvegarde du dernier résultat.

## V0.7 — Pré-match

- Écran pré-match basé sur la prochaine rencontre du calendrier.
- Validation de la composition avant le lancement du match.
- Affichage domicile / extérieur.

## V0.6 — Calendrier généré

- Calendrier complet sur 38 journées.
- 19 matchs aller et 19 matchs retour.
- Affichage du prochain match et des prochaines rencontres.

## V0.5 — Composition

- Choix de formation.
- Terrain cliquable.
- Auto-composition.
- Gestion des postes principaux et secondaires.
- Sauvegarde de la composition.

## V0.4 — Effectif généré

- Génération d’un effectif fictif de 24 joueurs.
- Valeurs, salaires, potentiel, condition, morale et contrat.

## V0.3 — Premier League structurée

- Intégration de la Premier League 2025/2026 comme base fixe.
- Remplacement d’un club par le club personnalisé.

## V0.2 — Création de carrière

- Formulaire de création de club.
- Sauvegardes multiples dans le navigateur.

## V0.1 — Base jouable

- Shell initial de l’application.
- Navigation de base.
- Premiers écrans placeholder.
