# Notes techniques

Etat apres V0.36.

La DA active reste Coach Notebook / Manager War Room.

V0.36 nettoie les premiers fichiers historiques devenus orphelins apres les extractions reelles des modules Calendar, Lineup, Player DB et Transfers.

Fichiers supprimes : calendar-v060.js, lineup-v050.js, player-db-v016.js, transfers-v017.js.

Ces fichiers ne sont plus charges par index.html et les points d'entree stables correspondants ne les appellent plus.

Modules dans le registre : theme.js, squad.js, lineup.js, calendar.js, season-flow.js, mailbox.js, player-db.js, transfers.js, training.js, match-center.js.

Compatibilites gameplay majeures restantes : aucune cote Match, Calendar, Lineup, Player DB ou Transfers.

Des anciens fichiers historiques peuvent encore rester dans le depot, notamment autour des anciennes versions season/match/report. Ils doivent etre supprimes uniquement apres verification explicite des references.

Prochaine etape recommandee : schemaVersion + migrations de sauvegardes.

Note cache : certains cache-busters de index.html restent anterieurs aux versions internes des modules. Faire Ctrl + F5 apres deploiement GitHub Pages.
