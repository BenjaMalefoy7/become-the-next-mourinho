# Notes techniques

État après V0.11.5.

## Direction active

La DA active est Coach Notebook / Manager War Room en version compacte.

Les fichiers supprimés lors du nettoyage précédent : app-v043.js, notebook-theme.css et notebook-theme-v011.js.

## Fichiers chargés

Les fichiers chargés sont ceux référencés dans index.html : style.css, lineup.css, calendar.css, prematch.css, match.css, standings.css, match-details.css, notebook-nav-v0112.css, data.js, app.js, lineup-v050.js, calendar-v060.js, prematch-v070.js, match-v080.js, matchday-v090.js et match-details-v010.js.

## Versioning

À terme, il faudra passer vers des noms de fichiers stables avec une version en query string, par exemple lineup.js?v=053 au lieu de lineup-v050.js?v=053.

## Dette refreshUI

Plusieurs modules enrichissent le rendu autour de refreshUI. Ce n’est pas bloquant aujourd’hui, mais il faudra plus tard créer un point de rendu central pour éviter les doubles wraps.

## Sauvegardes

Les prochaines sauvegardes devront recevoir un schemaVersion pour permettre des migrations propres.

## Données mortes

DEMO_PLAYERS et DEMO_STANDINGS sont encore présents dans data.js. Ils ne sont pas utilisés par le gameplay actuel et doivent être retirés lors d’un prochain passage technique prudent.
