# Notes techniques

Etat apres V0.34.

La DA active reste Coach Notebook / Manager War Room.

V0.34 extrait la base joueurs : player-db.js ne charge plus player-db-v016.js. Le module stable contient maintenant le generateur de joueurs, l'initialisation de la base joueurs active, la persistance silencieuse et l'enregistrement dans le registre de rendu.

Player DB reste une brique de support pour Recrutement : transfers.js peut toujours appeler btmEnsurePlayerDatabase(career, count) pour recuperer un marche de joueurs.

Modules dans le registre : theme.js, squad.js, lineup.js, calendar.js, season-flow.js, mailbox.js, player-db.js, training.js, match-center.js.

Compatibilites restantes : transfers.js vers transfers-v017.js.

Fichiers historiques orphelins candidats au nettoyage : player-db-v016.js, lineup-v050.js, calendar-v060.js, anciens season-v0xx et anciens modules de rapport de match neutralises.

Prochaine etape recommandee : extraire transfers.js, puis faire un nettoyage cible des orphelins historiques.

Note cache : index.html charge maintenant player-db.js?v=034. Faire Ctrl + F5 apres deploiement GitHub Pages.