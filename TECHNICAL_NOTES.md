# Notes techniques

Etat apres V0.35.

La DA active reste Coach Notebook / Manager War Room.

V0.35 extrait le recrutement : transfers.js ne charge plus transfers-v017.js. Le module stable contient maintenant le rendu du marche, les filtres, l'achat au prix demande, l'ajout du joueur a l'effectif, la mise a jour du budget transfert et l'enregistrement dans le registre de rendu.

Transfers depend maintenant de la base joueurs stable : btmEnsurePlayerDatabase(career, count) reste fourni par player-db.js.

Modules dans le registre : theme.js, squad.js, lineup.js, calendar.js, season-flow.js, mailbox.js, player-db.js, transfers.js, training.js, match-center.js.

Compatibilites gameplay majeures restantes : aucune cote Match, Calendar, Lineup, Player DB ou Transfers.

Fichiers historiques orphelins candidats au nettoyage : transfers-v017.js, player-db-v016.js, lineup-v050.js, calendar-v060.js, anciens season-v0xx et anciens modules de rapport de match neutralises.

Prochaine etape recommandee : nettoyage cible des orphelins historiques, puis schemaVersion + migrations de sauvegardes.

Note cache : index.html charge maintenant transfers.css?v=035 et transfers.js?v=035. Faire Ctrl + F5 apres deploiement GitHub Pages.