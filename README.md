# Become the next Mourinho — V0.38

Jeu privé de gestion footballistique jouable directement dans le navigateur.

Le projet avance en HTML/CSS/JavaScript vanilla, sans backend pour le moment. Les sauvegardes sont stockées localement via `localStorage`.

## Version actuelle

**V0.38 — cleanup final de stabilisation**

Cette passe termine le nettoyage recommandé après la refonte structurelle :

```text
- suppression des derniers anciens modules match / season / mail / squad / training devenus orphelins
- suppression des anciens CSS legacy remplacés par les CSS stables
- retrait du double bootstrap du registre dans squad.js
- theme.js reste l’unique propriétaire du registre de rendu
- save-migrations.js utilise maintenant les constantes de version définies par app.js
- ajout d’un commentaire dans index.html sur l’ordre critique des scripts
```

## Invariant important

L’ordre des scripts dans `index.html` est volontaire :

```text
data.js
app.js
save-migrations.js
theme.js
modules gameplay
```

`theme.js` doit rester chargé avant les modules qui utilisent `btmRegisterRender`, car il installe le registre de rendu central.

## Schema de sauvegarde

Le schéma courant reste :

```text
schemaVersion: 37
```

La V0.38 ne change pas la structure des sauvegardes. Elle nettoie surtout les fichiers et clarifie les dépendances.

## Modules stabilisés

```text
theme.js
squad.js
lineup.js
calendar.js
season-flow.js
mailbox.js
player-db.js
transfers.js
training.js
match-center.js
```

## Modules réellement extraits

```text
match-center.js
match-center.css
season-flow.js
season-flow.css
mailbox.js
mailbox.css
training.js
training.css
match-engine.js
league-sim.js
theme.js
calendar.js
lineup.js
player-db.js
transfers.js
save-migrations.js
```

## État de la roadmap de stabilisation

```text
✅ Débrancher les anciens renderers de match
✅ Extraire la simulation pure
✅ Unifier refreshUI avec un registre
✅ Vérifier Calendar / passage de jour
✅ Extraire Calendar
✅ Extraire Lineup
✅ Extraire Player DB
✅ Extraire Transfers
✅ Nettoyer les fichiers orphelins
✅ Ajouter schemaVersion + migrations de sauvegardes
✅ Retirer le double bootstrap du registre
✅ Documenter l’ordre critique des scripts
```

La roadmap de stabilisation recommandée est maintenant terminée.

## Note cache

`index.html` charge `save-migrations.js?v=038`, `theme.js?v=038` et `squad.js?v=038`. Un **Ctrl + F5** reste recommandé après déploiement GitHub Pages.

## Prochaine étape recommandée

Le socle étant stabilisé, la prochaine étape peut revenir vers du gameplay : amélioration du mercato, moteur de match, live match, blessures/morale, infrastructures ou save manager plus avancé.