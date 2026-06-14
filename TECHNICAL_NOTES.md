# Notes techniques

État après V0.27.

## Direction active

La DA active reste **Coach Notebook / Manager War Room** : carnet de coach, papier, dossiers, onglets, notes tactiques et couleurs dynamiques du club.

## Ce qui a été stabilisé en V0.20

- Le bouton “Jour suivant” est bloqué si un match non joué est dû.
- Le bouton “Avancer au prochain match” ne sert plus à skipper : il devient une logique “Aller au match” le jour même.
- Les anciens blocs concurrents du type “Dernier rapport” ont été remplacés par un rendu unique du Match Center.
- Le rapport post-match génère et conserve une timeline, des stats et une lecture coach.
- Le courrier a commencé à être réduit pour éviter le spam quotidien.

## Ce qui a été engagé en V0.21–V0.23

Migration vers le **loader plat + noms stables** sans casser brutalement les modules historiques.

`index.html` passe maintenant par des points d’entrée stables :

```text
match-center.js
season-flow.js
mailbox.js
player-db.js
transfers.js
training.js
lineup.js
calendar.js
match-engine.js
league-sim.js
```

## Extractions réelles déjà faites

```text
V0.24 : match-center.js / match-center.css
V0.25 : season-flow.js / season-flow.css
V0.26 : mailbox.js / mailbox.css
V0.27 : training.js / training.css
```

Ces fichiers ne sont plus de simples ponts vers les anciens fichiers versionnés.

## Ce qui change en V0.26

`mailbox.js` contient maintenant directement :

```text
onglet Courrier
liste de messages
lecteur de message
messages lus / non lus
briefing veille / jour de match
rapport après match
notification transfert
```

`mailbox.css` contient maintenant directement les styles du courrier. Il ne dépend plus de `season-v0151.css`.

## Ce qui change en V0.27

`training.js` contient maintenant directement :

```text
plan d'entraînement par groupes
focus gardiens / défense / milieu / attaque
application des effets lors du passage réel d'un jour
rendu de l'écran entraînement
```

Correction importante : l'entraînement ne s'applique plus si `Jour suivant` est bloqué par un match à jouer.

`training.css` contient maintenant directement les styles de l'entraînement. Il ne dépend plus de `training-v018.css`.

## Ponts de compatibilité restants

```text
lineup.js       -> lineup-v050.js
calendar.js     -> calendar-v060.js
match-engine.js -> match-v080.js
league-sim.js   -> matchday-v090.js
player-db.js    -> player-db-v016.js
transfers.js    -> transfers-v017.js
```

Cette compatibilité reste volontaire : on extrait les modules un par un pour éviter de casser la carrière, le calendrier et les sauvegardes.

## Règle à appliquer jusqu’au bout

Basculer vers des noms de modules stables et mettre la version uniquement dans la query string.

À privilégier :

```text
match-center.js?v=027
season-flow.js?v=027
mailbox.js?v=027
transfers.js?v=027
training.js?v=027
squad.js?v=027
```

À éviter désormais :

```text
season-v013.js
season-v0141.js
season-v01910.js
match-details-v010.js
```

Objectif : éviter que README, CHANGELOG et documentation décrochent à chaque itération.

## Dette refreshUI

Plusieurs modules enrichissent ou remplacent encore `refreshUI`. Cela reste fragile. Il faudra créer un orchestrateur central de rendu au lieu d’empiler des wrappers.

## Prochaine étape technique recommandée

### V0.28 — Extraction réelle du Recrutement

Objectif : copier le code utile de `transfers-v017.js` vers `transfers.js`, puis retirer le pont sans encore ajouter les fenêtres de mercato ou les négociations avancées.

Priorité ensuite :

```text
player-db.js
lineup.js
calendar.js
match-engine.js
league-sim.js
```

## Season Flow cible

Le rythme jour par jour est maintenant centralisé dans `season-flow.js`. La future amélioration sera d’y relier plus proprement l’entraînement avec un vrai orchestrateur de journée unique, au lieu de wrappers successifs.
