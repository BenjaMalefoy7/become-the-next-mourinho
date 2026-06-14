# Notes techniques

Etat apres V0.33.

La DA active reste Coach Notebook / Manager War Room.

V0.33 extrait la composition : lineup.js ne charge plus lineup-v050.js. Le module stable contient maintenant les formations, la normalisation de la composition, le rendu de l'ecran Composition, la selection des titulaires, l'auto-composition, le vidage de la compo et l'enregistrement dans le registre de rendu.

Lineup reste un ecran central pour le Match Center : la simulation lit toujours la composition depuis career.lineup. Le module stable repare les anciennes carrieres qui n'ont pas encore de lineup ou qui ont une structure de slots obsolete.

Modules dans le registre : theme.js, squad.js, lineup.js, calendar.js, season-flow.js, mailbox.js, training.js, match-center.js.

Compatibilites restantes : player-db.js vers player-db-v016.js, transfers.js vers transfers-v017.js.

Fichiers historiques orphelins candidats au nettoyage : lineup-v050.js, calendar-v060.js, anciens season-v0xx et anciens modules de rapport de match neutralises.

Prochaine etape recommandee : extraire player-db.js ou transfers.js, puis faire un nettoyage cible des orphelins historiques.

Note cache : index.html pointe encore vers lineup.js?v=023, mais le contenu reel de lineup.js est en V0.33. Faire Ctrl + F5 apres deploiement GitHub Pages.
