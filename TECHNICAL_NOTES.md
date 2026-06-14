# Notes techniques

État après V0.29B.

## Direction active

La DA active reste **Coach Notebook / Manager War Room** : carnet de coach, papier, dossiers, onglets, notes tactiques et couleurs dynamiques du club.

## Stabilisations majeures récentes

- `index.html` charge désormais des points d’entrée stables.
- `match-center.js`, `season-flow.js`, `mailbox.js` et `training.js` sont de vrais modules extraits.
- `match-engine.js` et `league-sim.js` sont de vrais modules de simulation, sans dépendance à `match-v080.js` ou `matchday-v090.js`.
- La chaîne de match est explicite : Match Center appelle `saveSimulatedMatch`, puis Season Flow pilote la simulation, le classement, le rapport, le courrier et la sauvegarde.
- Les anciens renderers de match ne doivent plus dessiner l’écran Match.

## V0.29B — registre de rendu centralisé

Le registre de rendu est maintenant installé par `theme.js`, chargé juste après `app.js`.

```text
app.js
→ theme.js
→ registre de rendu
→ modules extraits
```

Fonctions disponibles :

```text
btmRegisterRender(name, renderer)
btmUnregisterRender(name)
btmRunRegisteredRenders(career)
```

Le cycle de rendu voulu devient :

```text
refreshUI()
→ rendu de base app.js
→ btmRunRegisteredRenders()
→ rendus enregistrés
```

Modules actuellement enregistrés :

```text
theme.js
squad.js
season-flow.js
mailbox.js
training.js
match-center.js
```

## Limites restantes

Les derniers wrappers historiques importants restent liés à :

```text
lineup-v050.js
calendar-v060.js
```

Tant que ces fichiers sont encore appelés via leurs ponts stables, il reste une dette technique autour du rendu.

## Ponts de compatibilité restants

```text
lineup.js       -> lineup-v050.js
calendar.js     -> calendar-v060.js
player-db.js    -> player-db-v016.js
transfers.js    -> transfers-v017.js
```

## Règle de modules

Conserver des noms stables et changer uniquement la query string :

```text
module.js?v=029B
```

Éviter de recréer des fichiers du type :

```text
season-v01910.js
match-report-v0199.js
```

## Prochaine étape recommandée

### V0.30 — Extraction réelle de Lineup ou Calendar

Objectifs :

```text
- extraire réellement `lineup.js` ou `calendar.js` ;
- retirer leurs anciens wrappers `refreshUI` ;
- les brancher dans `btmRegisterRender` ;
- réduire encore les ponts historiques restants.
```

## Note cache

`index.html` est bumpé pour `theme.js?v=029B`, `match-engine.js?v=028B`, `league-sim.js?v=028B` et `squad.js?v=029B`. Un Ctrl + F5 reste conseillé après déploiement GitHub Pages.
