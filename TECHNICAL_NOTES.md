# Notes techniques

Etat apres V0.32.

La DA active reste Coach Notebook / Manager War Room.

V0.32 extrait le calendrier : calendar.js ne charge plus calendar-v060.js. Le module stable contient maintenant la generation du calendrier, la recherche du prochain match, le rendu Calendrier, la mise a jour dashboard liee au prochain match et l'enregistrement dans le registre de rendu.

Le calendrier reste uniquement un ecran d'affichage. Il ne modifie pas la date reelle de carriere. Le passage de jour reste gere par season-flow.js.

Modules dans le registre : theme.js, squad.js, lineup.js, calendar.js, season-flow.js, mailbox.js, training.js, match-center.js.

Compatibilites restantes : lineup.js vers lineup-v050.js, player-db.js vers player-db-v016.js, transfers.js vers transfers-v017.js.

calendar-v060.js devient un fichier historique orphelin candidat au nettoyage.

Prochaine etape recommandee : extraction reelle de Lineup ou nettoyage cible des orphelins historiques.

Note cache : index.html pointe encore vers calendar.js?v=031, mais le contenu reel de calendar.js est en V0.32. Faire Ctrl + F5 apres deploiement GitHub Pages.
