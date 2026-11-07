/* ==========================================================================
   TRIADE — traductions du site (français, anglais, allemand, italien, grec)
   Une ligne = un texte, avec ses 5 versions côte à côte, dans cet ordre :
       fr · en · de · it · el
   Deux tableaux :
     UI      = les textes du site (menus, boutons, titres). Clé courte à gauche.
     CONTENU = les textes qui viennent de content/*.json (associations, étapes,
               légendes des photos…). La clé est le texte FRANÇAIS lui-même : si
               l'équipe modifie ce texte dans /admin, la traduction ne correspond
               plus et le site affiche le français plutôt qu'une version périmée.
   Les mots entre {accolades} sont remplis par le site ({km}, {depart}…).
   Un mot entre *étoiles* est mis en italique et en terracotta (comme dans les titres).
   Les récits du journal et les interviews restent dans la langue où ils sont écrits.
   ========================================================================== */
(() => {
  'use strict';

  const LANGS = [
    { code: 'fr', label: 'Français', locale: 'fr-FR' },
    { code: 'en', label: 'English', locale: 'en-GB' },
    { code: 'de', label: 'Deutsch', locale: 'de-DE' },
    { code: 'it', label: 'Italiano', locale: 'it-IT' },
    { code: 'el', label: 'Ελληνικά', locale: 'el-GR' },
  ];
  const CODES = LANGS.map((l) => l.code);
  const row = (cells) => Object.fromEntries(CODES.map((c, i) => [c, cells[i]]));

  /* ---------- Textes du site ------------------------------------------- */
  const UI = {};
  const U = (key, ...cells) => { UI[key] = row(cells); };

  // Menu, en-tête, pied de page
  U('skip', `Aller au contenu`, `Skip to content`, `Zum Inhalt springen`, `Vai al contenuto`, `Μετάβαση στο περιεχόμενο`);
  U('nav_route', `Sur la route`, `On the road`, `Unterwegs`, `In viaggio`, `Στον δρόμο`);
  U('nav_assos', `Associations`, `Organisations`, `Organisationen`, `Associazioni`, `Οργανώσεις`);
  U('nav_meetings', `Rencontres`, `Meetings`, `Begegnungen`, `Incontri`, `Συναντήσεις`);
  U('nav_supporters', `Ils nous soutiennent`, `Our supporters`, `Unsere Unterstützer`, `Ci sostengono`, `Μας στηρίζουν`);
  U('nav_press', `Presse`, `Press`, `Presse`, `Stampa`, `Τύπος`);
  U('nav_donate', `Soutenir`, `Support`, `Unterstützen`, `Sostieni`, `Στηρίξτε`);
  U('nav_label', `Navigation principale`, `Main navigation`, `Hauptnavigation`, `Navigazione principale`, `Κύριο μενού`);
  U('menu_open', `Ouvrir le menu`, `Open menu`, `Menü öffnen`, `Apri il menu`, `Άνοιγμα μενού`);
  U('menu_close', `Fermer le menu`, `Close menu`, `Menü schließen`, `Chiudi il menu`, `Κλείσιμο μενού`);
  U('home_aria', `TRIADE, accueil`, `TRIADE, home`, `TRIADE, Startseite`, `TRIADE, pagina iniziale`, `TRIADE, αρχική σελίδα`);
  U('lang_label', `Langue`, `Language`, `Sprache`, `Lingua`, `Γλώσσα`);
  U('live_pos', `Position en direct : `, `Live position: `, `Live-Position: `, `Posizione in diretta: `, `Ζωντανή θέση: `);
  U('live_updated', ` · mis à jour le {d}`, ` · updated on {d}`, ` · aktualisiert am {d}`, ` · aggiornato il {d}`, ` · ενημερώθηκε στις {d}`);
  U('departure', `Départ `, `Departure `, `Abreise `, `Partenza `, `Αναχώρηση `);
  U('in_days_1', ` · dans 1 jour`, ` · in 1 day`, ` · in 1 Tag`, ` · tra 1 giorno`, ` · σε 1 ημέρα`);
  U('in_days_n', ` · dans {n} jours`, ` · in {n} days`, ` · in {n} Tagen`, ` · tra {n} giorni`, ` · σε {n} ημέρες`);
  U('foot_project', `Un projet étudiant et associatif.`, `A student, non-profit project.`, `Ein studentisches, gemeinnütziges Projekt.`, `Un progetto studentesco e associativo.`, `Ένα φοιτητικό, μη κερδοσκοπικό έργο.`);
  U('foot_site', `Le site`, `The site`, `Die Website`, `Il sito`, `Ο ιστότοπος`);
  U('foot_follow', `Nous suivre`, `Follow us`, `Folgen Sie uns`, `Seguici`, `Ακολουθήστε μας`);
  U('support_assos', `Soutenir les associations`, `Support the organisations`, `Die Organisationen unterstützen`, `Sostieni le associazioni`, `Στηρίξτε τις οργανώσεις`);
  U('legal', `Mentions légales`, `Legal notice`, `Impressum`, `Note legali`, `Νομικές πληροφορίες`);
  U('team_space', `Espace équipe`, `Team area`, `Teambereich`, `Area del team`, `Χώρος ομάδας`);
  U('soc_email', `Écrire à l’équipe`, `Write to the team`, `Schreiben Sie uns`, `Scrivi al team`, `Στείλτε μας μήνυμα`);

  // Titres des pages (onglet du navigateur)
  U('title_home', `TRIADE — À vélo pour celles et ceux qui protègent le vivant`, `TRIADE — By bike, for those who protect the living world`, `TRIADE — Mit dem Fahrrad für alle, die die Natur schützen`, `TRIADE — In bicicletta per chi protegge la natura`, `TRIADE — Με ποδήλατο για όσους προστατεύουν τη φύση`);
  U('desc_home', `Trois étudiants traversent l’Europe à vélo, de mars à août 2027, à la rencontre d’associations de protection de la biodiversité. Suivez l’aventure.`, `Three students cycle across Europe from March to August 2027 to meet organisations that protect biodiversity. Follow the adventure.`, `Drei Studierende durchqueren Europa von März bis August 2027 mit dem Fahrrad, um Organisationen zu besuchen, die die Artenvielfalt schützen. Verfolgen Sie das Abenteuer.`, `Tre studenti attraversano l’Europa in bicicletta, da marzo ad agosto 2027, per incontrare associazioni che proteggono la biodiversità. Segui l’avventura.`, `Τρεις φοιτητές διασχίζουν την Ευρώπη με ποδήλατο, από τον Μάρτιο έως τον Αύγουστο 2027, για να γνωρίσουν οργανώσεις που προστατεύουν τη βιοποικιλότητα. Ακολουθήστε το ταξίδι.`);

  // Accueil
  U('hero_eyebrow', `Projet étudiant et associatif`, `Student, non-profit project`, `Studentisches, gemeinnütziges Projekt`, `Progetto studentesco e associativo`, `Φοιτητικό, μη κερδοσκοπικό έργο`);
  U('hero_h1', `À vélo pour celles et ceux qui protègent *le vivant*`, `By bike, for those who protect *the living world*`, `Mit dem Fahrrad für alle, die *die Natur* schützen`, `In bicicletta per chi protegge *la natura*`, `Με ποδήλατο για όσους προστατεύουν *τη φύση*`);
  U('hero_lede', `Trois étudiants, trois vélos, {km} km à travers l’Europe, {periode}, à la rencontre d’associations de protection de la biodiversité.`, `Three students, three bikes, {km} km across Europe, {periode}, to meet organisations that protect biodiversity.`, `Drei Studierende, drei Fahrräder, {km} km quer durch Europa, {periode}, um Organisationen zu besuchen, die sich für den Schutz der Artenvielfalt einsetzen.`, `Tre studenti, tre biciclette, {km} km attraverso l’Europa, {periode}, per incontrare associazioni che proteggono la biodiversità.`, `Τρεις φοιτητές, τρία ποδήλατα, {km} χλμ. σε όλη την Ευρώπη, {periode}, για να γνωρίσουν οργανώσεις που προστατεύουν τη βιοποικιλότητα.`);
  U('hero_btn1', `Suivre l’aventure`, `Follow the adventure`, `Das Abenteuer verfolgen`, `Segui l’avventura`, `Ακολουθήστε το ταξίδι`);
  U('on_road', `En route · jour {n}`, `On the road · day {n}`, `Unterwegs · Tag {n}`, `In viaggio · giorno {n}`, `Στον δρόμο · ημέρα {n}`);
  U('fig_aria', `Chiffres clés`, `Key figures`, `Zahlen und Fakten`, `Numeri chiave`, `Βασικά στοιχεία`);
  U('fig_days_before', `jours avant le départ`, `days until departure`, `Tage bis zur Abreise`, `giorni alla partenza`, `ημέρες έως την αναχώρηση`);
  U('fig_days_road', `jours de route`, `days on the road`, `Tage unterwegs`, `giorni di viaggio`, `ημέρες στον δρόμο`);
  U('fig_km_done', `km parcourus`, `km cycled`, `km zurückgelegt`, `km percorsi`, `χλμ. διανυθέντα`);
  U('fig_km_plan', `km prévus`, `km planned`, `km geplant`, `km previsti`, `χλμ. προγραμματισμένα`);
  U('fig_countries_done', `pays traversés`, `countries crossed`, `Länder durchquert`, `paesi attraversati`, `χώρες που διασχίσαμε`);
  U('fig_countries_plan', `pays prévus`, `countries planned`, `Länder geplant`, `paesi previsti`, `χώρες προγραμματισμένες`);
  U('fig_assos_done', `associations rencontrées`, `organisations met`, `Organisationen besucht`, `associazioni incontrate`, `οργανώσεις που γνωρίσαμε`);
  U('fig_assos_plan', `associations à rencontrer`, `organisations to meet`, `Organisationen, die wir besuchen`, `associazioni da incontrare`, `οργανώσεις που θα γνωρίσουμε`);
  U('meter_aria', `{p} % de l’objectif`, `{p}% of the goal`, `{p} % des Ziels`, `{p}% dell’obiettivo`, `{p}% του στόχου`);
  U('proj_eyebrow', `Le projet`, `The project`, `Das Projekt`, `Il progetto`, `Το έργο`);
  U('proj_h2', `Une boucle européenne pour rencontrer ceux qui *protègent la nature*`, `A European loop to meet those who *protect nature*`, `Eine Europaschleife, um die zu treffen, die *die Natur schützen*`, `Un anello europeo per incontrare chi *protegge la natura*`, `Ένας ευρωπαϊκός κύκλος για να συναντήσουμε όσους *προστατεύουν τη φύση*`);
  U('proj_lede', `Nous sommes trois étudiants de l’Institut Agro Montpellier. Pendant {mois} mois, nous traversons l’Europe à vélo pour rencontrer six associations qui protègent des espèces menacées (ours, lynx, loup, cigognes) et raconter leur travail.`, `We are three students from Institut Agro Montpellier. For {mois} months, we are cycling across Europe to meet six organisations that protect endangered species (bears, lynx, wolves, storks) and to tell the story of their work.`, `Wir sind drei Studierende des Institut Agro Montpellier. {mois} Monate lang radeln wir durch Europa, um sechs Organisationen zu treffen, die bedrohte Arten schützen (Bären, Luchse, Wölfe, Störche), und von ihrer Arbeit zu erzählen.`, `Siamo tre studenti dell’Institut Agro Montpellier. Per {mois} mesi attraversiamo l’Europa in bicicletta per incontrare sei associazioni che proteggono specie minacciate (orsi, linci, lupi, cicogne) e raccontare il loro lavoro.`, `Είμαστε τρεις φοιτητές του Institut Agro Montpellier. Για {mois} μήνες διασχίζουμε την Ευρώπη με ποδήλατο για να γνωρίσουμε έξι οργανώσεις που προστατεύουν απειλούμενα είδη (αρκούδες, λύγκες, λύκους, πελαργούς) και να διηγηθούμε το έργο τους.`);
  U('school_alt', `L’Institut Agro Montpellier, école des trois étudiants`, `Institut Agro Montpellier, the three students’ school`, `Das Institut Agro Montpellier, die Hochschule der drei Studierenden`, `L’Institut Agro Montpellier, la scuola dei tre studenti`, `Το Institut Agro Montpellier, η σχολή των τριών φοιτητών`);
  U('assos_eyebrow', `Les associations`, `The organisations`, `Die Organisationen`, `Le associazioni`, `Οι οργανώσεις`);
  U('assos_h2', `Six associations pour *protéger le vivant*`, `Six organisations to *protect the living world*`, `Sechs Organisationen für *den Schutz der Natur*`, `Sei associazioni per *proteggere la natura*`, `Έξι οργανώσεις για *την προστασία της φύσης*`);
  U('assos_lede_home', `Chacune défend un territoire et une espèce. Nous irons les voir, donner un coup de main sur place et raconter leur travail.`, `Each one defends a territory and a species. We will visit them, lend a hand on site and tell the story of their work.`, `Jede setzt sich für ein Gebiet und eine Art ein. Wir besuchen sie, packen vor Ort mit an und erzählen von ihrer Arbeit.`, `Ognuna difende un territorio e una specie. Andremo a trovarle, daremo una mano sul posto e racconteremo il loro lavoro.`, `Η καθεμία υπερασπίζεται μια περιοχή και ένα είδος. Θα τις επισκεφθούμε, θα βοηθήσουμε επιτόπου και θα διηγηθούμε το έργο τους.`);
  U('assos_more', `Découvrir les associations et leurs témoignages`, `Discover the organisations and their testimonials`, `Die Organisationen und ihre Berichte entdecken`, `Scopri le associazioni e le loro testimonianze`, `Γνωρίστε τις οργανώσεις και τις μαρτυρίες τους`);
  U('itin_eyebrow', `L’itinéraire`, `The itinerary`, `Die Strecke`, `L’itinerario`, `Το δρομολόγιο`);
  U('itin_h2', `De la Côte d’Azur à la *mer du Nord*, par les Balkans`, `From the Côte d’Azur to the *North Sea*, via the Balkans`, `Von der Côte d’Azur bis zur *Nordsee*, über den Balkan`, `Dalla Costa Azzurra al *Mare del Nord*, passando per i Balcani`, `Από την Κυανή Ακτή στη *Βόρεια Θάλασσα*, μέσω των Βαλκανίων`);
  U('itin_lede', `Des Apennins aux Balkans, du Danube à la mer du Nord : un seul trajet, six associations.`, `From the Apennines to the Balkans, from the Danube to the North Sea: one journey, six organisations.`, `Von den Apenninen bis zum Balkan, von der Donau bis zur Nordsee: eine Reise, sechs Organisationen.`, `Dagli Appennini ai Balcani, dal Danubio al Mare del Nord: un solo viaggio, sei associazioni.`, `Από τους Απεννίνους στα Βαλκάνια, από τον Δούναβη στη Βόρεια Θάλασσα: ένα ταξίδι, έξι οργανώσεις.`);
  U('itin_btn', `Voir toutes les étapes`, `See all the stages`, `Alle Etappen ansehen`, `Vedi tutte le tappe`, `Δείτε όλες τις στάσεις`);
  U('map_alt', `Carte de l’itinéraire : Grasse, Italie, Albanie, Grèce, Bulgarie, Serbie, Hongrie, Autriche, Tchéquie, Allemagne, Pays-Bas, Belgique, retour à Grasse`, `Route map: Grasse, Italy, Albania, Greece, Bulgaria, Serbia, Hungary, Austria, Czechia, Germany, the Netherlands, Belgium, back to Grasse`, `Routenkarte: Grasse, Italien, Albanien, Griechenland, Bulgarien, Serbien, Ungarn, Österreich, Tschechien, Deutschland, Niederlande, Belgien, zurück nach Grasse`, `Mappa dell’itinerario: Grasse, Italia, Albania, Grecia, Bulgaria, Serbia, Ungheria, Austria, Cechia, Germania, Paesi Bassi, Belgio, ritorno a Grasse`, `Χάρτης της διαδρομής: Γκρας, Ιταλία, Αλβανία, Ελλάδα, Βουλγαρία, Σερβία, Ουγγαρία, Αυστρία, Τσεχία, Γερμανία, Κάτω Χώρες, Βέλγιο, επιστροφή στη Γκρας`);
  U('map_alt_short', `Carte de l’itinéraire de TRIADE à travers l’Europe`, `TRIADE route map across Europe`, `Die TRIADE-Route durch Europa`, `Mappa dell’itinerario di TRIADE attraverso l’Europa`, `Χάρτης της διαδρομής του TRIADE στην Ευρώπη`);
  U('map_caption', `En orange : l’itinéraire à vélo. En pointillé : le ferry d’Ancône à Zadar. Points foncés : les associations.`, `In orange: the cycling route. Dotted: the ferry from Ancona to Zadar. Dark dots: the organisations.`, `Orange: die Radroute. Gepunktet: die Fähre von Ancona nach Zadar. Dunkle Punkte: die Organisationen.`, `In arancione: l’itinerario in bicicletta. Tratteggiato: il traghetto da Ancona a Zara. Punti scuri: le associazioni.`, `Πορτοκαλί: η διαδρομή με ποδήλατο. Διακεκομμένη: το πλοίο από την Ανκόνα στο Ζαντάρ. Σκούρες κουκκίδες: οι οργανώσεις.`);
  U('pos_where', `Où sommes-nous aujourd’hui ?`, `Where are we today?`, `Wo sind wir heute?`, `Dove siamo oggi?`, `Πού βρισκόμαστε σήμερα;`);
  U('pos_none', `Pas encore partis`, `Not on the road yet`, `Noch nicht aufgebrochen`, `Non siamo ancora partiti`, `Δεν έχουμε ξεκινήσει ακόμη`);
  U('pos_updated', `Mis à jour le {d}`, `Updated on {d}`, `Aktualisiert am {d}`, `Aggiornato il {d}`, `Ενημερώθηκε στις {d}`);
  U('pos_start', `Départ de Grasse {depart}`, `Departure from Grasse {depart}`, `Abreise von Grasse {depart}`, `Partenza da Grasse {depart}`, `Αναχώρηση από τη Γκρας {depart}`);
  U('pos_next', `Prochaine étape : {nom} · {periode}`, `Next stop: {nom} · {periode}`, `Nächste Station: {nom} · {periode}`, `Prossima tappa: {nom} · {periode}`, `Επόμενη στάση: {nom} · {periode}`);
  U('news_h2', `Dernières nouvelles`, `Latest news`, `Neueste Nachrichten`, `Ultime notizie`, `Τα τελευταία νέα`);
  U('news_more', `Voir toutes les nouvelles`, `See all the news`, `Alle Neuigkeiten ansehen`, `Vedi tutte le notizie`, `Δείτε όλα τα νέα`);
  U('news_empty_t', `Le journal s’ouvre au départ`, `The journal opens at departure`, `Das Tagebuch öffnet mit der Abreise`, `Il diario si apre alla partenza`, `Το ημερολόγιο ανοίγει με την αναχώρηση`);
  U('news_empty', `Premières photos et premiers récits dès {depart}. D’ici là, les préparatifs se suivent sur Instagram.`, `First photos and stories from {depart}. Until then, follow the preparations on Instagram.`, `Erste Fotos und Berichte ab {depart}. Bis dahin können Sie die Vorbereitungen auf Instagram verfolgen.`, `Prime foto e primi racconti da {depart}. Nel frattempo, i preparativi si seguono su Instagram.`, `Οι πρώτες φωτογραφίες και ιστορίες θα έρθουν από {depart}. Μέχρι τότε, παρακολουθήστε τις προετοιμασίες στο Instagram.`);

  // Page « Sur la route » (suivi en direct + journal + étapes)
  U('route_h1', `Notre route, *en direct*`, `Our journey, *live*`, `Unsere Reise, *live*`, `Il nostro viaggio, *in diretta*`, `Το ταξίδι μας, *ζωντανά*`);
  U('route_lede', `Notre position, nos photos, nos vidéos et nos étapes, au fil des kilomètres.`, `Our position, photos, videos and stages, kilometre after kilometre.`, `Unsere Position, Fotos, Videos und Etappen, Kilometer für Kilometer.`, `La nostra posizione, le foto, i video e le tappe, chilometro dopo chilometro.`, `Η θέση μας, οι φωτογραφίες, τα βίντεο και οι στάσεις μας, χιλιόμετρο με χιλιόμετρο.`);
  U('live_eyebrow', `En direct`, `Live`, `Live`, `In diretta`, `Ζωντανά`);
  U('pos_where_now', `Où sommes-nous *maintenant* ?`, `Where are we *right now*?`, `Wo sind wir *gerade*?`, `Dove siamo *adesso*?`, `Πού βρισκόμαστε *τώρα*;`);
  U('ps_embed_title', `Notre position en direct (Polarsteps)`, `Our live position (Polarsteps)`, `Unsere Live-Position (Polarsteps)`, `La nostra posizione in diretta (Polarsteps)`, `Η ζωντανή θέση μας (Polarsteps)`);
  U('ps_open', `Ouvrir dans Polarsteps`, `Open in Polarsteps`, `In Polarsteps öffnen`, `Apri in Polarsteps`, `Άνοιγμα στο Polarsteps`);
  U('ps_text', `Notre trajet, nos étapes et nos photos géolocalisées sont sur Polarsteps.`, `Our route, stages and geotagged photos are on Polarsteps.`, `Unsere Route, unsere Etappen und unsere Fotos mit Ortsangabe finden Sie auf Polarsteps.`, `Il nostro percorso, le tappe e le foto geolocalizzate sono su Polarsteps.`, `Η διαδρομή, οι στάσεις και οι γεωγραφικά τοποθετημένες φωτογραφίες μας είναι στο Polarsteps.`);
  U('ps_btn', `Suivre en direct sur Polarsteps`, `Follow live on Polarsteps`, `Live auf Polarsteps verfolgen`, `Seguici in diretta su Polarsteps`, `Παρακολουθήστε ζωντανά στο Polarsteps`);
  U('ps_empty_t', `Le suivi en direct ouvre au départ`, `Live tracking opens at departure`, `Das Live-Tracking startet mit der Abreise`, `Il tracciamento in diretta si apre alla partenza`, `Η ζωντανή παρακολούθηση ξεκινά με την αναχώρηση`);
  U('ps_empty', `Notre position s’affichera ici dès {depart}.`, `Our position will appear here from {depart}.`, `Unsere Position erscheint hier ab {depart}.`, `La nostra posizione apparirà qui da {depart}.`, `Η θέση μας θα εμφανιστεί εδώ από {depart}.`);
  U('photos_eyebrow', `Photos et vidéos`, `Photos and videos`, `Fotos und Videos`, `Foto e video`, `Φωτογραφίες και βίντεο`);
  U('photos_h2', `Au fil des *jours*`, `Day by *day*`, `Tag für *Tag*`, `Giorno dopo *giorno*`, `Μέρα με τη *μέρα*`);
  U('photos_lede', `Les photos et les récits de la route, du plus récent au plus ancien.`, `The photos and stories from the road, from newest to oldest.`, `Die Fotos und Berichte von unterwegs, vom neuesten zum ältesten.`, `Le foto e i racconti del viaggio, dal più recente al più vecchio.`, `Οι φωτογραφίες και οι ιστορίες του δρόμου, από τις πιο πρόσφατες στις παλαιότερες.`);
  U('stages_eyebrow', `Étape par étape`, `Stage by stage`, `Etappe für Etappe`, `Tappa dopo tappa`, `Στάση προς στάση`);
  U('stages_h2', `Une boucle de *{km} km* à travers l’Europe`, `A loop of *{km} km* across Europe`, `Eine Schleife von *{km} km* quer durch Europa`, `Un anello di *{km} km* attraverso l’Europa`, `Ένας κύκλος *{km} χλμ.* σε όλη την Ευρώπη`);
  U('stages_lede', `Départ et arrivée à Grasse, {periode}. Six associations sur la route.`, `Departure and arrival in Grasse, {periode}. Six organisations along the way.`, `Start und Ziel in Grasse, {periode}. Sechs Organisationen am Weg.`, `Partenza e arrivo a Grasse, {periode}. Sei associazioni lungo la strada.`, `Αναχώρηση και άφιξη στη Γκρας, {periode}. Έξι οργανώσεις στη διαδρομή.`);
  U('stages_hint', `Les cercles verts sont les associations. Les kilomètres sont cumulés depuis Grasse.`, `The green circles are the organisations. Distances are cumulative from Grasse.`, `Die grünen Kreise sind die Organisationen. Die Kilometer sind ab Grasse aufsummiert.`, `I cerchi verdi sono le associazioni. I chilometri sono cumulati a partire da Grasse.`, `Οι πράσινοι κύκλοι είναι οι οργανώσεις. Τα χιλιόμετρα είναι σωρευτικά από τη Γκρας.`);
  U('badge_asso', `Association`, `Organisation`, `Organisation`, `Associazione`, `Οργάνωση`);
  U('km_unit', `{n} km`, `{n} km`, `{n} km`, `{n} km`, `{n} χλμ.`);

  // Journal : cartes et récits
  U('by', `Par {x}`, `By {x}`, `Von {x}`, `Di {x}`, `Από {x}`);
  U('read_min', `{n} min de lecture`, `{n} min read`, `{n} Min. Lesezeit`, `{n} min di lettura`, `{n} λεπτά ανάγνωσης`);
  U('photo_1', `1 photo`, `1 photo`, `1 Foto`, `1 foto`, `1 φωτογραφία`);
  U('photo_n', `{n} photos`, `{n} photos`, `{n} Fotos`, `{n} foto`, `{n} φωτογραφίες`);
  U('news_default_title', `Nouvelles du voyage`, `News from the road`, `Neuigkeiten von unterwegs`, `Notizie dal viaggio`, `Νέα από το ταξίδι`);
  U('day_n', `Jour {n}`, `Day {n}`, `Tag {n}`, `Giorno {n}`, `Ημέρα {n}`);
  U('back_route', `Retour à la route`, `Back to the journey`, `Zurück zur Reise`, `Torna al viaggio`, `Επιστροφή στο ταξίδι`);
  U('orig_note', `Récit publié en français.`, `Story published in French.`, `Bericht auf Französisch veröffentlicht.`, `Racconto pubblicato in francese.`, `Η ιστορία δημοσιεύτηκε στα γαλλικά.`);
  U('at_time', `{d} à {h} h {m}`, `{d} at {h}:{m}`, `{d}, {h}:{m} Uhr`, `{d} alle {h}:{m}`, `{d}, {h}:{m}`);
  U('lb_label', `Visionneuse de photos`, `Photo viewer`, `Fotobetrachter`, `Visualizzatore di foto`, `Προβολέας φωτογραφιών`);
  U('lb_close', `Fermer`, `Close`, `Schließen`, `Chiudi`, `Κλείσιμο`);
  U('lb_prev', `Photo précédente`, `Previous photo`, `Vorheriges Foto`, `Foto precedente`, `Προηγούμενη φωτογραφία`);
  U('lb_next', `Photo suivante`, `Next photo`, `Nächstes Foto`, `Foto successiva`, `Επόμενη φωτογραφία`);
  U('photo_alt', `{x} — photo {n}`, `{x} — photo {n}`, `{x} — Foto {n}`, `{x} — foto {n}`, `{x} — φωτογραφία {n}`);
  U('enlarge', `Agrandir : {x}`, `Enlarge: {x}`, `Vergrößern: {x}`, `Ingrandisci: {x}`, `Μεγέθυνση: {x}`);
  U('video_play', `Lire la vidéo`, `Play video`, `Video abspielen`, `Guarda il video`, `Αναπαραγωγή βίντεο`);
  U('video_see', `Voir la vidéo`, `Watch the video`, `Video ansehen`, `Guarda il video`, `Δείτε το βίντεο`);
  U('video_title', `Vidéo`, `Video`, `Video`, `Video`, `Βίντεο`);
  U('maps_open', `Voir sur Google Maps`, `View on Google Maps`, `Auf Google Maps ansehen`, `Vedi su Google Maps`, `Προβολή στους Χάρτες Google`);

  // Associations, rencontres
  U('assoc_lede', `Chaque association a son terrain, son espèce, ses combats. Nous venons les rencontrer, donner un coup de main et raconter ce qu’elles font.`, `Each organisation has its own territory, species and struggles. We come to meet them, lend a hand and tell the story of what they do.`, `Jede Organisation hat ihr eigenes Gebiet, ihre eigene Art und ihre eigenen Kämpfe. Wir besuchen sie, helfen mit und erzählen, was sie tun.`, `Ogni associazione ha il suo territorio, la sua specie, le sue battaglie. Veniamo a conoscerle, a dare una mano e a raccontare ciò che fanno.`, `Κάθε οργάνωση έχει τη δική της περιοχή, το δικό της είδος, τους δικούς της αγώνες. Ερχόμαστε να τις γνωρίσουμε, να βοηθήσουμε και να διηγηθούμε τι κάνουν.`);
  U('assoc_nav', `Aller à une association`, `Go to an organisation`, `Zu einer Organisation springen`, `Vai a un’associazione`, `Μετάβαση σε μια οργάνωση`);
  U('site_of_a', `Site de l’association`, `The organisation’s website`, `Website der Organisation`, `Sito dell’associazione`, `Ιστότοπος της οργάνωσης`);
  U('site_of', `Site de {x}`, `{x} website`, `Website von {x}`, `Sito di {x}`, `Ιστότοπος {x}`);
  U('site_of_v', `Site d’{x}`, `{x} website`, `Website von {x}`, `Sito di {x}`, `Ιστότοπος {x}`);
  U('site_of_2', `Site de la 2e association`, `Second organisation’s website`, `Website der zweiten Organisation`, `Sito della seconda associazione`, `Ιστότοπος της δεύτερης οργάνωσης`);
  U('donate_direct', `Faire un don directement`, `Donate directly`, `Direkt spenden`, `Dona direttamente`, `Κάντε δωρεά απευθείας`);
  U('testimonials', `Témoignages`, `Testimonials`, `Berichte`, `Testimonianze`, `Μαρτυρίες`);
  U('testi_soon', `Témoignage à venir — rendez-vous {p}.`, `Testimonial coming soon — planned visit: {p}.`, `Bericht folgt — geplanter Besuch: {p}.`, `Testimonianza in arrivo — visita prevista: {p}.`, `Η μαρτυρία έρχεται — προγραμματισμένη επίσκεψη: {p}.`);
  U('team_aria', `Les trois membres de l’équipe`, `The three team members`, `Die drei Teammitglieder`, `I tre membri del team`, `Τα τρία μέλη της ομάδας`);
  U('portrait_of', `Portrait de {x}`, `Portrait of {x}`, `Porträt von {x}`, `Ritratto di {x}`, `Πορτρέτο: {x}`);
  U('read_iv', `Lire l’interview`, `Read the interview`, `Interview lesen`, `Leggi l’intervista`, `Διαβάστε τη συνέντευξη`);
  U('filter_all', `Toutes`, `All`, `Alle`, `Tutte`, `Όλες`);
  U('filter_label', `Filtrer par association`, `Filter by organisation`, `Nach Organisation filtern`, `Filtra per associazione`, `Φιλτράρισμα ανά οργάνωση`);
  U('meet_h1', `Des visages derrière chaque *espèce protégée*`, `Faces behind every *protected species*`, `Gesichter hinter jeder *geschützten Art*`, `Volti dietro ogni *specie protetta*`, `Πρόσωπα πίσω από κάθε *προστατευόμενο είδος*`);
  U('meet_lede', `Gardes, chercheuses, bénévoles, bergers : nous passons du temps avec les équipes de chaque association et nous racontons leur quotidien, en vidéo ou à l’écrit.`, `Rangers, researchers, volunteers, shepherds: we spend time with the teams of each organisation and tell the story of their daily work, in video or in writing.`, `Ranger, Forscherinnen, Freiwillige, Hirten: Wir verbringen Zeit mit den Teams jeder Organisation und erzählen von ihrem Alltag, im Video oder schriftlich.`, `Guardie, ricercatrici, volontari, pastori: trascorriamo del tempo con le squadre di ogni associazione e raccontiamo la loro quotidianità, in video o per iscritto.`, `Φύλακες, ερευνήτριες, εθελοντές, βοσκοί: περνάμε χρόνο με τις ομάδες κάθε οργάνωσης και διηγούμαστε την καθημερινότητά τους, με βίντεο ή γραπτά.`);
  U('meet_empty_t', `Les premières rencontres arrivent`, `The first meetings are coming`, `Die ersten Begegnungen stehen bevor`, `I primi incontri stanno arrivando`, `Οι πρώτες συναντήσεις έρχονται`);
  U('meet_empty', `Dans chaque association, nous recueillons les témoignages des équipes. Premières rencontres dès {depart}.`, `In each organisation, we collect the testimonials of the teams. First meetings from {depart}.`, `In jeder Organisation sammeln wir die Berichte der Teams. Erste Begegnungen ab {depart}.`, `In ogni associazione raccogliamo le testimonianze delle squadre. Primi incontri da {depart}.`, `Σε κάθε οργάνωση συλλέγουμε τις μαρτυρίες των ομάδων. Οι πρώτες συναντήσεις θα γίνουν από {depart}.`);

  // Soutiens et sponsors
  U('sup_eyebrow', `Sponsors et soutiens`, `Sponsors and supporters`, `Sponsoren und Unterstützer`, `Sponsor e sostenitori`, `Χορηγοί και υποστηρικτές`);
  U('sup_h1', `Merci à celles et ceux qui rendent ce voyage *possible*`, `Thank you to everyone who makes this journey *possible*`, `Danke an alle, die diese Reise *möglich* machen`, `Grazie a chi rende questo viaggio *possibile*`, `Ευχαριστούμε όσους κάνουν αυτό το ταξίδι *εφικτό*`);
  U('sup_lede', `Un coup de pouce, du matériel, un toit pour la nuit : chaque aide compte, et nous racontons ici l’histoire de chacune.`, `A helping hand, some gear, a roof for the night: every bit of help counts, and here we tell the story of each one.`, `Ein Anstoß, Ausrüstung, ein Dach über dem Kopf: Jede Hilfe zählt, und hier erzählen wir die Geschichte jeder einzelnen.`, `Un aiuto, dell’attrezzatura, un tetto per la notte: ogni sostegno conta e qui raccontiamo la storia di ciascuno.`, `Μια βοήθεια, εξοπλισμός, μια στέγη για τη νύχτα: κάθε στήριξη μετράει και εδώ διηγούμαστε την ιστορία της καθεμιάς.`);
  U('sup_story', `Leur histoire avec TRIADE`, `Their story with TRIADE`, `Ihre Geschichte mit TRIADE`, `La loro storia con TRIADE`, `Η ιστορία τους με το TRIADE`);
  U('sup_slot_t', `D’autres soutiens bientôt`, `More supporters soon`, `Bald weitere Unterstützer`, `Presto altri sostenitori`, `Σύντομα κι άλλοι υποστηρικτές`);
  U('sup_slot', `Entreprise, école, commerce, association : vous voulez nous aider ? Écrivez-nous, nous serons ravis d’en parler.`, `Company, school, shop, organisation: would you like to help us? Write to us, we would be glad to talk.`, `Unternehmen, Schule, Geschäft, Verein: Sie möchten uns helfen? Schreiben Sie uns, wir sprechen gern mit Ihnen.`, `Azienda, scuola, negozio, associazione: volete aiutarci? Scriveteci, ne parleremo volentieri.`, `Επιχείρηση, σχολείο, κατάστημα, οργάνωση: θέλετε να μας βοηθήσετε; Γράψτε μας, θα χαρούμε να τα πούμε.`);
  U('sup_slot_btn', `Nous écrire`, `Write to us`, `Schreiben Sie uns`, `Scriveteci`, `Γράψτε μας`);

  // Presse
  U('press_h1', `Parler de TRIADE`, `Talking about TRIADE`, `Über TRIADE berichten`, `Parlare di TRIADE`, `Γράφοντας για το TRIADE`);
  U('press_lede', `Vous êtes journaliste, blogueur ou responsable d’une association ou d’une école ? Voici de quoi nous présenter. Nous répondons à toutes les demandes.`, `Are you a journalist, a blogger, or in charge of an organisation or a school? Here is what you need to present us. We answer every request.`, `Sie sind Journalist, Blogger oder leiten eine Organisation oder Schule? Hier finden Sie alles, um uns vorzustellen. Wir beantworten jede Anfrage.`, `Sei un giornalista, un blogger o il responsabile di un’associazione o di una scuola? Ecco di che presentarci. Rispondiamo a tutte le richieste.`, `Είστε δημοσιογράφος, blogger ή υπεύθυνος μιας οργάνωσης ή ενός σχολείου; Εδώ θα βρείτε ό,τι χρειάζεστε για να μας παρουσιάσετε. Απαντάμε σε όλα τα αιτήματα.`);
  U('press_two', `En deux phrases`, `In two sentences`, `In zwei Sätzen`, `In due frasi`, `Σε δύο προτάσεις`);
  U('press_p1', `TRIADE (Three Riders In Adventure Discovering Europe) est un projet de trois étudiants de l’Institut Agro Montpellier : une boucle à vélo à travers l’Europe, de mars à août 2027, à la rencontre de six associations de protection de la biodiversité.`, `TRIADE (Three Riders In Adventure Discovering Europe) is a project by three students of Institut Agro Montpellier: a bike loop across Europe, from March to August 2027, to meet six organisations that protect biodiversity.`, `TRIADE (Three Riders In Adventure Discovering Europe) ist ein Projekt von drei Studierenden des Institut Agro Montpellier: eine Radschleife quer durch Europa, von März bis August 2027, um sechs Organisationen zu besuchen, die sich für die Artenvielfalt einsetzen.`, `TRIADE (Three Riders In Adventure Discovering Europe) è un progetto di tre studenti dell’Institut Agro Montpellier: un anello in bicicletta attraverso l’Europa, da marzo ad agosto 2027, per incontrare sei associazioni che proteggono la biodiversità.`, `Το TRIADE (Three Riders In Adventure Discovering Europe) είναι ένα έργο τριών φοιτητών του Institut Agro Montpellier: ένας κύκλος με ποδήλατο σε όλη την Ευρώπη, από τον Μάρτιο έως τον Αύγουστο 2027, για να γνωρίσουν έξι οργανώσεις που προστατεύουν τη βιοποικιλότητα.`);
  U('press_p2', `Nous donnons un coup de main sur le terrain, nous interviewons celles et ceux qui y travaillent et nous racontons leur action en photos et en vidéos.`, `We lend a hand in the field, interview the people who work there and tell the story of their action in photos and videos.`, `Wir packen vor Ort mit an, interviewen die Menschen, die dort arbeiten, und erzählen von ihrem Einsatz in Fotos und Videos.`, `Diamo una mano sul campo, intervistiamo chi ci lavora e raccontiamo la loro azione con foto e video.`, `Βοηθάμε στο πεδίο, παίρνουμε συνεντεύξεις από όσους εργάζονται εκεί και διηγούμαστε τη δράση τους με φωτογραφίες και βίντεο.`);
  U('press_contact', `Contact`, `Contact`, `Kontakt`, `Contatti`, `Επικοινωνία`);
  U('press_logos', `Logos et carte`, `Logos and map`, `Logos und Karte`, `Loghi e mappa`, `Λογότυπα και χάρτης`);
  U('press_free', `Libres d’utilisation pour parler du projet.`, `Free to use when talking about the project.`, `Frei verwendbar, um über das Projekt zu berichten.`, `Liberi da usare per parlare del progetto.`, `Ελεύθερα προς χρήση για να μιλήσετε για το έργο.`);
  U('press_logo_light', `Logo TRIADE (fond clair)`, `TRIADE logo (light background)`, `TRIADE-Logo (heller Hintergrund)`, `Logo TRIADE (sfondo chiaro)`, `Λογότυπο TRIADE (ανοιχτό φόντο)`);
  U('press_logo_dark', `Logo TRIADE (fond sombre)`, `TRIADE logo (dark background)`, `TRIADE-Logo (dunkler Hintergrund)`, `Logo TRIADE (sfondo scuro)`, `Λογότυπο TRIADE (σκούρο φόντο)`);
  U('press_globe', `Globe seul`, `Globe only`, `Nur der Globus`, `Solo il globo`, `Μόνο η υδρόγειος`);
  U('press_map', `Carte de l’itinéraire`, `Route map`, `Routenkarte`, `Mappa dell’itinerario`, `Χάρτης της διαδρομής`);
  U('press_review', `Revue de presse`, `Press review`, `Pressespiegel`, `Rassegna stampa`, `Δημοσιεύματα`);
  U('press_review_h', `Ils ont parlé de nous`, `They have talked about us`, `Sie haben über uns berichtet`, `Hanno parlato di noi`, `Έγραψαν για εμάς`);
  U('press_none_t', `Pas encore d’articles`, `No articles yet`, `Noch keine Artikel`, `Ancora nessun articolo`, `Δεν υπάρχουν ακόμη άρθρα`);
  U('press_none', `La revue de presse apparaîtra ici.`, `The press review will appear here.`, `Der Pressespiegel erscheint hier.`, `La rassegna stampa apparirà qui.`, `Τα δημοσιεύματα θα εμφανιστούν εδώ.`);

  // Cagnotte
  U('cag_eyebrow', `La cagnotte`, `The fundraiser`, `Die Spendenaktion`, `La raccolta fondi`, `Η συγκέντρωση χρημάτων`);
  U('cag_h1', `Soutenir celles et ceux qui protègent *le vivant*`, `Support those who protect *the living world*`, `Unterstützen Sie alle, die *die Natur* schützen`, `Sostieni chi protegge *la natura*`, `Στηρίξτε όσους προστατεύουν *τη φύση*`);
  U('cag_collected', `collectés sur un objectif de {x}`, `raised toward a goal of {x}`, `gesammelt bei einem Ziel von {x}`, `raccolti su un obiettivo di {x}`, `συγκεντρώθηκαν σε στόχο {x}`);
  U('cag_goal_aria', `{p} % de l’objectif atteint`, `{p}% of the goal reached`, `{p} % des Ziels erreicht`, `{p}% dell’obiettivo raggiunto`, `Έχει επιτευχθεί το {p}% του στόχου`);
  U('cag_donate_on', `Faire un don sur {x}`, `Donate on {x}`, `Auf {x} spenden`, `Dona su {x}`, `Κάντε δωρεά στο {x}`);
  U('cag_donate', `Faire un don`, `Donate`, `Spenden`, `Dona`, `Κάντε δωρεά`);
  U('cag_form', `Formulaire de don`, `Donation form`, `Spendenformular`, `Modulo di donazione`, `Φόρμα δωρεάς`);
  U('cag_soon_t', `La cagnotte ouvre bientôt`, `The fundraiser opens soon`, `Die Spendenaktion startet bald`, `La raccolta fondi apre presto`, `Η συγκέντρωση ανοίγει σύντομα`);
  U('cag_soon', `Suivez-nous sur Instagram pour être prévenu(e) dès son ouverture.`, `Follow us on Instagram to be notified as soon as it opens.`, `Folgen Sie uns auf Instagram, um bei der Eröffnung benachrichtigt zu werden.`, `Seguici su Instagram per essere avvisato appena apre.`, `Ακολουθήστε μας στο Instagram για να ενημερωθείτε μόλις ανοίξει.`);
  U('cag_direct_h', `Donner directement à une association`, `Give directly to an organisation`, `Direkt an eine Organisation spenden`, `Donare direttamente a un’associazione`, `Δωρεά απευθείας σε μια οργάνωση`);
  U('cag_direct_link', `Faire un don directement →`, `Donate directly →`, `Direkt spenden →`, `Dona direttamente →`, `Κάντε δωρεά απευθείας →`);

  // Mentions légales
  U('ment_h_editor', `Éditeur du site`, `Site publisher`, `Herausgeber der Website`, `Editore del sito`, `Εκδότης του ιστότοπου`);
  U('ment_editor', `TRIADE, projet étudiant non commercial porté par Titouan Havet, Tanguy Ruel et Téo Moghabghab, étudiants à l’Institut Agro Montpellier.`, `TRIADE is a non-commercial student project run by Titouan Havet, Tanguy Ruel and Téo Moghabghab, students at Institut Agro Montpellier.`, `TRIADE ist ein nichtkommerzielles Studierendenprojekt von Titouan Havet, Tanguy Ruel und Téo Moghabghab, Studenten am Institut Agro Montpellier.`, `TRIADE è un progetto studentesco non commerciale portato avanti da Titouan Havet, Tanguy Ruel e Téo Moghabghab, studenti dell’Institut Agro Montpellier.`, `Το TRIADE είναι ένα μη εμπορικό φοιτητικό έργο των Titouan Havet, Tanguy Ruel και Téo Moghabghab, φοιτητών του Institut Agro Montpellier.`);
  U('ment_contact', `Contact :`, `Contact:`, `Kontakt:`, `Contatto:`, `Επικοινωνία:`);
  U('ment_h_host', `Hébergement`, `Hosting`, `Hosting`, `Hosting`, `Φιλοξενία`);
  U('ment_host', `Site hébergé par GitHub Pages — GitHub, Inc., 88 Colin P. Kelly Jr. Street, San Francisco, CA 94107, États-Unis.`, `Site hosted by GitHub Pages — GitHub, Inc., 88 Colin P. Kelly Jr. Street, San Francisco, CA 94107, United States.`, `Die Website wird von GitHub Pages gehostet — GitHub, Inc., 88 Colin P. Kelly Jr. Street, San Francisco, CA 94107, USA.`, `Sito ospitato da GitHub Pages — GitHub, Inc., 88 Colin P. Kelly Jr. Street, San Francisco, CA 94107, Stati Uniti.`, `Ο ιστότοπος φιλοξενείται από το GitHub Pages — GitHub, Inc., 88 Colin P. Kelly Jr. Street, San Francisco, CA 94107, ΗΠΑ.`);
  U('ment_h_data', `Données personnelles`, `Personal data`, `Personenbezogene Daten`, `Dati personali`, `Προσωπικά δεδομένα`);
  U('ment_data1', `Ce site ne dépose aucun cookie et n’utilise aucun outil de mesure d’audience. Les polices de caractères sont hébergées sur le site lui-même. Les services intégrés (vidéos YouTube, carte Polarsteps, formulaire de don) appliquent leur propre politique de confidentialité ; les vidéos YouTube ne se chargent que lorsque vous cliquez sur « Lire la vidéo ».`, `This site sets no cookies and uses no audience-measurement tool. The fonts are hosted on the site itself. Embedded services (YouTube videos, Polarsteps map, donation form) apply their own privacy policies; YouTube videos load only when you click “Play video”.`, `Diese Website setzt keine Cookies und verwendet keine Analysewerkzeuge. Die Schriftarten werden auf der Website selbst gehostet. Eingebundene Dienste (YouTube-Videos, Polarsteps-Karte, Spendenformular) unterliegen ihren eigenen Datenschutzrichtlinien; YouTube-Videos werden erst geladen, wenn Sie auf „Video abspielen“ klicken.`, `Questo sito non utilizza cookie né strumenti di misurazione del pubblico. I caratteri tipografici sono ospitati sul sito stesso. I servizi integrati (video YouTube, mappa Polarsteps, modulo di donazione) applicano la propria informativa sulla privacy; i video YouTube si caricano solo quando fate clic su «Guarda il video».`, `Αυτός ο ιστότοπος δεν χρησιμοποιεί cookies ούτε εργαλεία μέτρησης επισκεψιμότητας. Οι γραμματοσειρές φιλοξενούνται στον ίδιο τον ιστότοπο. Οι ενσωματωμένες υπηρεσίες (βίντεο YouTube, χάρτης Polarsteps, φόρμα δωρεάς) εφαρμόζουν τη δική τους πολιτική απορρήτου· τα βίντεο YouTube φορτώνονται μόνο όταν πατήσετε «Αναπαραγωγή βίντεο».`);
  U('ment_data2', `Pour toute question ou demande concernant vos données, écrivez-nous à l’adresse ci-dessus.`, `For any question or request about your data, write to us at the address above.`, `Bei Fragen oder Anliegen zu Ihren Daten schreiben Sie uns an die oben genannte Adresse.`, `Per qualsiasi domanda o richiesta riguardante i vostri dati, scriveteci all’indirizzo indicato sopra.`, `Για οποιαδήποτε ερώτηση ή αίτημα σχετικά με τα δεδομένα σας, γράψτε μας στην παραπάνω διεύθυνση.`);
  U('ment_h_credits', `Crédits`, `Credits`, `Bildnachweise`, `Crediti`, `Πιστώσεις`);
  U('ment_credits', `Photos et textes : TRIADE, sauf mention contraire. Les logos des associations appartiennent à leurs propriétaires respectifs. Polices Bodoni Moda et Jost, sous licence SIL Open Font License.`, `Photos and texts: TRIADE, unless otherwise stated. Organisation logos belong to their respective owners. Fonts Bodoni Moda and Jost, under the SIL Open Font License.`, `Fotos und Texte: TRIADE, sofern nicht anders angegeben. Die Logos der Organisationen gehören ihren jeweiligen Eigentümern. Schriftarten Bodoni Moda und Jost unter der SIL Open Font License.`, `Foto e testi: TRIADE, salvo diversa indicazione. I loghi delle associazioni appartengono ai rispettivi proprietari. Caratteri Bodoni Moda e Jost, con licenza SIL Open Font License.`, `Φωτογραφίες και κείμενα: TRIADE, εκτός αν αναφέρεται διαφορετικά. Τα λογότυπα των οργανώσεων ανήκουν στους αντίστοιχους κατόχους τους. Γραμματοσειρές Bodoni Moda και Jost, με άδεια SIL Open Font License.`);

  /* ---------- Textes venant de content/*.json --------------------------- */
  const CONTENU = [];
  const C = (...cells) => { CONTENU.push(row(cells)); };

  // Pays
  C(`France`, `France`, `Frankreich`, `Francia`, `Γαλλία`);
  C(`Italie`, `Italy`, `Italien`, `Italia`, `Ιταλία`);
  C(`Croatie`, `Croatia`, `Kroatien`, `Croazia`, `Κροατία`);
  C(`Albanie`, `Albania`, `Albanien`, `Albania`, `Αλβανία`);
  C(`Grèce`, `Greece`, `Griechenland`, `Grecia`, `Ελλάδα`);
  C(`Macédoine du Nord`, `North Macedonia`, `Nordmazedonien`, `Macedonia del Nord`, `Βόρεια Μακεδονία`);
  C(`Bulgarie`, `Bulgaria`, `Bulgarien`, `Bulgaria`, `Βουλγαρία`);
  C(`Serbie`, `Serbia`, `Serbien`, `Serbia`, `Σερβία`);
  C(`Hongrie`, `Hungary`, `Ungarn`, `Ungheria`, `Ουγγαρία`);
  C(`Autriche`, `Austria`, `Österreich`, `Austria`, `Αυστρία`);
  C(`Tchéquie`, `Czechia`, `Tschechien`, `Cechia`, `Τσεχία`);
  C(`Allemagne`, `Germany`, `Deutschland`, `Germania`, `Γερμανία`);
  C(`Pays-Bas`, `Netherlands`, `Niederlande`, `Paesi Bassi`, `Κάτω Χώρες`);
  C(`Belgique`, `Belgium`, `Belgien`, `Belgio`, `Βέλγιο`);

  // Villes des étapes
  C(`Grasse`, `Grasse`, `Grasse`, `Grasse`, `Γκρας`);
  C(`Ancône`, `Ancona`, `Ancona`, `Ancona`, `Ανκόνα`);
  C(`Tirana`, `Tirana`, `Tirana`, `Tirana`, `Τίρανα`);
  C(`Sofia`, `Sofia`, `Sofia`, `Sofia`, `Σόφια`);
  C(`Belgrade`, `Belgrade`, `Belgrad`, `Belgrado`, `Βελιγράδι`);
  C(`Budapest`, `Budapest`, `Budapest`, `Budapest`, `Βουδαπέστη`);
  C(`Vienne`, `Vienna`, `Wien`, `Vienna`, `Βιέννη`);
  C(`Prague`, `Prague`, `Prag`, `Praga`, `Πράγα`);
  C(`Berlin`, `Berlin`, `Berlin`, `Berlino`, `Βερολίνο`);
  C(`Amsterdam`, `Amsterdam`, `Amsterdam`, `Amsterdam`, `Άμστερνταμ`);
  C(`Bruxelles`, `Brussels`, `Brüssel`, `Bruxelles`, `Βρυξέλλες`);

  // Détails des étapes
  C(`France · départ`, `France · departure`, `Frankreich · Start`, `Francia · partenza`, `Γαλλία · αναχώρηση`);
  C(`France · arrivée`, `France · arrival`, `Frankreich · Ziel`, `Francia · arrivo`, `Γαλλία · άφιξη`);
  C(`Région de Florence, Italie`, `Florence region, Italy`, `Region Florenz, Italien`, `Zona di Firenze, Italia`, `Περιοχή Φλωρεντίας, Ιταλία`);
  C(`Puis ferry vers Zadar, Croatie`, `Then ferry to Zadar, Croatia`, `Dann Fähre nach Zadar, Kroatien`, `Poi traghetto per Zara, Croazia`, `Στη συνέχεια πλοίο για το Ζαντάρ, Κροατία`);
  C(`Lynx des Balkans · Albanie`, `Balkan lynx · Albania`, `Balkanluchs · Albanien`, `Lince dei Balcani · Albania`, `Λύγκας των Βαλκανίων · Αλβανία`);
  C(`Région de Florina, Grèce`, `Florina region, Greece`, `Region Florina, Griechenland`, `Zona di Florina, Grecia`, `Περιοχή Φλώρινας, Ελλάδα`);
  C(`Bergenhusen, Allemagne`, `Bergenhusen, Germany`, `Bergenhusen, Deutschland`, `Bergenhusen, Germania`, `Μπέργκενχουζεν, Γερμανία`);

  // Périodes
  C(`Début mars`, `Early March`, `Anfang März`, `Inizio marzo`, `Αρχές Μαρτίου`);
  C(`Mi-mars`, `Mid-March`, `Mitte März`, `Metà marzo`, `Μέσα Μαρτίου`);
  C(`Tout le long du trajet`, `All along the route`, `Auf der gesamten Strecke`, `Lungo tutto il percorso`, `Σε όλη τη διαδρομή`);
  C(`Croatie, puis tout le long du trajet`, `Croatia, then all along the route`, `Kroatien, dann auf der gesamten Strecke`, `Croazia, poi lungo tutto il percorso`, `Κροατία, και στη συνέχεια σε όλη τη διαδρομή`);
  C(`Fin mars`, `Late March`, `Ende März`, `Fine marzo`, `Τέλη Μαρτίου`);
  C(`Début avril`, `Early April`, `Anfang April`, `Inizio aprile`, `Αρχές Απριλίου`);
  C(`Mi-avril`, `Mid-April`, `Mitte April`, `Metà aprile`, `Μέσα Απριλίου`);
  C(`Fin avril`, `Late April`, `Ende April`, `Fine aprile`, `Τέλη Απριλίου`);
  C(`Début mai`, `Early May`, `Anfang Mai`, `Inizio maggio`, `Αρχές Μαΐου`);
  C(`Mi-mai`, `Mid-May`, `Mitte Mai`, `Metà maggio`, `Μέσα Μαΐου`);
  C(`Fin mai`, `Late May`, `Ende Mai`, `Fine maggio`, `Τέλη Μαΐου`);
  C(`Début juin`, `Early June`, `Anfang Juni`, `Inizio giugno`, `Αρχές Ιουνίου`);
  C(`Mi-juin`, `Mid-June`, `Mitte Juni`, `Metà giugno`, `Μέσα Ιουνίου`);
  C(`Du 20 juin au 5 juillet environ`, `Around 20 June to 5 July`, `Etwa vom 20. Juni bis 5. Juli`, `Dal 20 giugno al 5 luglio circa`, `Από 20 Ιουνίου έως 5 Ιουλίου περίπου`);
  C(`Mi-juillet`, `Mid-July`, `Mitte Juli`, `Metà luglio`, `Μέσα Ιουλίου`);
  C(`Début août`, `Early August`, `Anfang August`, `Inizio agosto`, `Αρχές Αυγούστου`);

  // Réglages (dates en texte)
  C(`début mars 2027`, `early March 2027`, `Anfang März 2027`, `inizio marzo 2027`, `αρχές Μαρτίου 2027`);
  C(`de mars à août 2027`, `from March to August 2027`, `von März bis August 2027`, `da marzo ad agosto 2027`, `από τον Μάρτιο έως τον Αύγουστο 2027`);

  // Statuts
  C(`Contact en cours`, `Contact in progress`, `Kontakt läuft`, `Contatto in corso`, `Σε επαφή`);
  C(`Rencontre confirmée`, `Meeting confirmed`, `Treffen bestätigt`, `Incontro confermato`, `Η συνάντηση επιβεβαιώθηκε`);
  C(`Rencontre réalisée`, `Meeting done`, `Treffen hat stattgefunden`, `Incontro avvenuto`, `Η συνάντηση πραγματοποιήθηκε`);

  // Associations : espèces, lieux
  C(`Ours brun marsicain`, `Marsican brown bear`, `Marsischer Braunbär`, `Orso bruno marsicano`, `Μαρσικανική καφέ αρκούδα`);
  C(`Lynx des Balkans`, `Balkan lynx`, `Balkanluchs`, `Lince dei Balcani`, `Λύγκας των Βαλκανίων`);
  C(`Ours brun`, `Brown bear`, `Braunbär`, `Orso bruno`, `Καφέ αρκούδα`);
  C(`Loup`, `Wolf`, `Wolf`, `Lupo`, `Λύκος`);
  C(`Ours brun et loup`, `Brown bear and wolf`, `Braunbär und Wolf`, `Orso bruno e lupo`, `Καφέ αρκούδα και λύκος`);
  C(`Ceinture verte européenne`, `European Green Belt`, `Grünes Band Europa`, `Cintura verde europea`, `Ευρωπαϊκή Πράσινη Ζώνη`);
  C(`Cigognes et oiseaux`, `Storks and birds`, `Störche und Vögel`, `Cicogne e uccelli`, `Πελαργοί και πουλιά`);
  C(`Apennins centraux, région de Florence`, `Central Apennines, Florence region`, `Zentralapennin, Region Florenz`, `Appennino centrale, zona di Firenze`, `Κεντρικοί Απέννινοι, περιοχή Φλωρεντίας`);
  C(`Région de Florina (Nymfaio) et Thessalonique`, `Florina region (Nymfaio) and Thessaloniki`, `Region Florina (Nymfaio) und Thessaloniki`, `Zona di Florina (Nymfaio) e Salonicco`, `Περιοχή Φλώρινας (Νυμφαίο) και Θεσσαλονίκη`);

  // Associations : présentations
  C(`Une association qui œuvre au retour d’une nature sauvage dans les Apennins centraux, où vit l’ours brun marsicain, l’un des ours les plus menacés d’Europe.`,
    `An organisation working to bring wild nature back to the central Apennines, home to the Marsican brown bear, one of the most endangered bears in Europe.`,
    `Eine Organisation, die sich für die Rückkehr der wilden Natur im Zentralapennin einsetzt, dem Lebensraum des Marsischen Braunbären, eines der am stärksten bedrohten Bären Europas.`,
    `Un’associazione che lavora per il ritorno della natura selvaggia nell’Appennino centrale, dove vive l’orso bruno marsicano, uno degli orsi più minacciati d’Europa.`,
    `Μια οργάνωση που εργάζεται για την επιστροφή της άγριας φύσης στους Κεντρικούς Απεννίνους, όπου ζει η μαρσικανική καφέ αρκούδα, μία από τις πιο απειλούμενες αρκούδες της Ευρώπης.`);
  C(`Protection and Preservation of Natural Environment in Albania : une association albanaise de protection de la nature, engagée notamment pour le lynx des Balkans, un des félins les plus rares d’Europe.`,
    `Protection and Preservation of Natural Environment in Albania: an Albanian nature conservation organisation, notably committed to the Balkan lynx, one of Europe’s rarest wild cats.`,
    `Protection and Preservation of Natural Environment in Albania: eine albanische Naturschutzorganisation, die sich insbesondere für den Balkanluchs einsetzt, eine der seltensten Katzen Europas.`,
    `Protection and Preservation of Natural Environment in Albania: un’associazione albanese per la tutela della natura, impegnata in particolare per la lince dei Balcani, uno dei felini più rari d’Europa.`,
    `Protection and Preservation of Natural Environment in Albania: μια αλβανική οργάνωση για την προστασία της φύσης, που δραστηριοποιείται ιδίως για τον λύγκα των Βαλκανίων, ένα από τα σπανιότερα αιλουροειδή της Ευρώπης.`);
  C(`Deux associations grecques qui travaillent ensemble, et avec lesquelles nous travaillerons en même temps. ARCTUROS protège l’ours brun et le loup et accueille des ours secourus dans son refuge de Nymfaio. Callisto est une organisation environnementale grecque pour la faune sauvage et la nature.`,
    `Two Greek organisations that work together, and with which we will work at the same time. ARCTUROS protects the brown bear and the wolf and shelters rescued bears in its sanctuary in Nymfaio. Callisto is a Greek environmental organisation for wildlife and nature.`,
    `Zwei griechische Organisationen, die zusammenarbeiten und mit denen wir gleichzeitig arbeiten werden. ARCTUROS schützt den Braunbären und den Wolf und nimmt gerettete Bären in seinem Schutzgebiet in Nymfaio auf. Callisto ist eine griechische Umweltorganisation für Wildtiere und Natur.`,
    `Due associazioni greche che lavorano insieme e con le quali lavoreremo contemporaneamente. ARCTUROS protegge l’orso bruno e il lupo e accoglie orsi salvati nel suo rifugio di Nymfaio. Callisto è un’organizzazione ambientale greca per la fauna selvatica e la natura.`,
    `Δύο ελληνικές οργανώσεις που συνεργάζονται και με τις οποίες θα δουλέψουμε ταυτόχρονα. Η οργάνωση ARCTUROS προστατεύει την καφέ αρκούδα και τον λύκο και φιλοξενεί διασωθείσες αρκούδες στο καταφύγιό της στο Νυμφαίο. Η Callisto είναι μια ελληνική περιβαλλοντική οργάνωση για την άγρια ζωή και τη φύση.`);
  C(`Une fondation européenne de protection de la nature, qui travaille à faire de l’ancien rideau de fer, de la mer de Barents à la mer Noire, un corridor de nature : la Ceinture verte européenne.`,
    `A European nature conservation foundation working to turn the former Iron Curtain, from the Barents Sea to the Black Sea, into a corridor for nature: the European Green Belt.`,
    `Eine europäische Naturschutzstiftung, die daran arbeitet, den ehemaligen Eisernen Vorhang, von der Barentssee bis zum Schwarzen Meer, in einen Naturkorridor zu verwandeln: das Grüne Band Europa.`,
    `Una fondazione europea per la tutela della natura, che lavora per trasformare l’ex cortina di ferro, dal Mare di Barents al Mar Nero, in un corridoio di natura: la Cintura verde europea.`,
    `Ένα ευρωπαϊκό ίδρυμα για την προστασία της φύσης, που εργάζεται για να μετατρέψει το πρώην Σιδηρούν Παραπέτασμα, από τη Θάλασσα του Μπάρεντς έως τη Μαύρη Θάλασσα, σε διάδρομο φύσης: την Ευρωπαϊκή Πράσινη Ζώνη.`);
  C(`Le NABU est la plus grande association allemande de protection de la nature. Son Michael-Otto-Institut, à Bergenhusen, étudie notamment les cigognes blanches.`,
    `NABU is the largest German nature conservation organisation. Its Michael Otto Institute in Bergenhusen studies, among other things, white storks.`,
    `Der NABU ist der größte deutsche Naturschutzverband. Sein Michael-Otto-Institut in Bergenhusen erforscht unter anderem den Weißstorch.`,
    `Il NABU è la più grande associazione tedesca per la tutela della natura. Il suo Michael-Otto-Institut, a Bergenhusen, studia in particolare le cicogne bianche.`,
    `Το NABU είναι η μεγαλύτερη γερμανική οργάνωση για την προστασία της φύσης. Το Michael-Otto-Institut του, στο Bergenhusen, μελετά μεταξύ άλλων τους λευκούς πελαργούς.`);

  // Cagnotte
  C(`La cagnotte TRIADE sert à soutenir les associations de protection de la nature que nous rencontrons sur la route.\n\nDonnez ce que vous voulez, quand vous voulez : 10 €, 25 €, 50 €, 100 € ou un autre montant, en une fois ou chaque mois.\n\n**Ne vous mettez jamais en difficulté pour nous aider.** Il n’y a aucune contrepartie commerciale : seulement notre reconnaissance, et des nouvelles de la route.\n\nLes modalités précises (qui reçoit quoi, et comment) seront détaillées ici à l’ouverture.`,
    `The TRIADE fundraiser supports the nature conservation organisations we meet along the way.\n\nGive what you want, when you want: €10, €25, €50, €100 or any other amount, once or every month.\n\n**Never put yourself in difficulty to help us.** There is no commercial return: only our gratitude, and news from the road.\n\nThe exact terms (who receives what, and how) will be detailed here when it opens.`,
    `Die TRIADE-Spendenaktion unterstützt die Naturschutzorganisationen, die wir auf unserer Reise besuchen.\n\nGeben Sie, was Sie möchten, wann Sie möchten: 10 €, 25 €, 50 €, 100 € oder einen anderen Betrag, einmalig oder monatlich.\n\n**Bringen Sie sich nie in Schwierigkeiten, um uns zu helfen.** Es gibt keine kommerzielle Gegenleistung: nur unseren Dank und Neuigkeiten von unterwegs.\n\nDie genauen Modalitäten (wer was erhält und wie) werden hier zur Eröffnung erläutert.`,
    `La raccolta fondi TRIADE serve a sostenere le associazioni per la tutela della natura che incontriamo lungo la strada.\n\nDonate quello che volete, quando volete: 10 €, 25 €, 50 €, 100 € o un altro importo, una tantum o ogni mese.\n\n**Non mettetevi mai in difficoltà per aiutarci.** Non c’è alcuna contropartita commerciale: solo la nostra gratitudine e notizie dalla strada.\n\nLe modalità precise (chi riceve cosa, e come) saranno spiegate qui all’apertura.`,
    `Η συγκέντρωση χρημάτων του TRIADE στηρίζει τις οργανώσεις προστασίας της φύσης που συναντάμε στον δρόμο.\n\nΔώστε ό,τι θέλετε, όποτε θέλετε: 10 €, 25 €, 50 €, 100 € ή οποιοδήποτε άλλο ποσό, εφάπαξ ή κάθε μήνα.\n\n**Μη θέτετε ποτέ τον εαυτό σας σε δύσκολη θέση για να μας βοηθήσετε.** Δεν υπάρχει κανένα εμπορικό αντάλλαγμα: μόνο η ευγνωμοσύνη μας και νέα από τον δρόμο.\n\nΟι ακριβείς λεπτομέρειες (ποιος λαμβάνει τι, και πώς) θα παρουσιαστούν εδώ με το άνοιγμα.`);

  // Soutiens
  C(`Notre itinéraire est tracé sur Komoot.`, `Our route is planned on Komoot.`, `Unsere Route planen wir mit Komoot.`, `Il nostro itinerario è tracciato su Komoot.`, `Η διαδρομή μας σχεδιάζεται στο Komoot.`);

  // Légendes du bandeau de photos (lieux et étapes)
  C(`Grèce · Albanie · Macédoine du Nord`, `Greece · Albania · North Macedonia`, `Griechenland · Albanien · Nordmazedonien`, `Grecia · Albania · Macedonia del Nord`, `Ελλάδα · Αλβανία · Βόρεια Μακεδονία`);
  C(`Baie de Cannes et massif de l’Esterel`, `Bay of Cannes and the Esterel massif`, `Bucht von Cannes und Esterel-Massiv`, `Baia di Cannes e massiccio dell’Esterel`, `Κόλπος των Καννών και ορεινό συγκρότημα Εστερέλ`);
  C(`France — Côte d’Azur, premiers coups de pédale`, `France — Côte d’Azur, first pedal strokes`, `Frankreich — Côte d’Azur, die ersten Pedaltritte`, `Francia — Costa Azzurra, le prime pedalate`, `Γαλλία — Κυανή Ακτή, οι πρώτες πεταλιές`);
  C(`Parc national des Abruzzes`, `Abruzzo National Park`, `Nationalpark Abruzzen`, `Parco nazionale d’Abruzzo`, `Εθνικό Πάρκο Αμπρούτσο`);
  C(`Italie — pays de l’ours marsicain`, `Italy — land of the Marsican bear`, `Italien — Land des Marsischen Bären`, `Italia — terra dell’orso marsicano`, `Ιταλία — η χώρα της μαρσικανικής αρκούδας`);
  C(`Coucher de soleil à Zadar`, `Sunset in Zadar`, `Sonnenuntergang in Zadar`, `Tramonto a Zara`, `Ηλιοβασίλεμα στο Ζαντάρ`);
  C(`Croatie — arrivée du ferry d’Ancône`, `Croatia — arrival of the ferry from Ancona`, `Kroatien — Ankunft der Fähre aus Ancona`, `Croazia — arrivo del traghetto da Ancona`, `Κροατία — άφιξη του πλοίου από την Ανκόνα`);
  C(`Alpes albanaises, Theth`, `Albanian Alps, Theth`, `Albanische Alpen, Theth`, `Alpi albanesi, Theth`, `Αλβανικές Άλπεις, Θετ`);
  C(`Albanie — pays du lynx des Balkans`, `Albania — land of the Balkan lynx`, `Albanien — Land des Balkanluchses`, `Albania — terra della lince dei Balcani`, `Αλβανία — η χώρα του λύγκα των Βαλκανίων`);
  C(`Petit lac de Prespa`, `Small Prespa Lake`, `Kleiner Prespasee`, `Piccolo lago di Prespa`, `Λίμνη Μικρή Πρέσπα`);
  C(`Lac de Prespa`, `Lake Prespa`, `Prespasee`, `Lago di Prespa`, `Λίμνη Πρέσπα`);
  C(`Monts du Pinde`, `Pindus Mountains`, `Pindos-Gebirge`, `Monti del Pindo`, `Όρη της Πίνδου`);
  C(`Grèce — pays de l’ours et du loup`, `Greece — land of the bear and the wolf`, `Griechenland — Land des Bären und des Wolfs`, `Grecia — terra dell’orso e del lupo`, `Ελλάδα — η χώρα της αρκούδας και του λύκου`);
  C(`Cathédrale Alexandre-Nevski, Sofia`, `Alexander Nevsky Cathedral, Sofia`, `Alexander-Newski-Kathedrale, Sofia`, `Cattedrale di Aleksandr Nevskij, Sofia`, `Καθεδρικός Ναός Αλέξανδρου Νιέφσκι, Σόφια`);
  C(`Bulgarie — étape de mi-avril`, `Bulgaria — mid-April stop`, `Bulgarien — Station Mitte April`, `Bulgaria — tappa di metà aprile`, `Βουλγαρία — στάση στα μέσα Απριλίου`);
  C(`Forteresse de Kalemegdan, Belgrade`, `Kalemegdan Fortress, Belgrade`, `Festung Kalemegdan, Belgrad`, `Fortezza di Kalemegdan, Belgrado`, `Φρούριο Καλέμεγκνταν, Βελιγράδι`);
  C(`Serbie — le Danube et la Save`, `Serbia — the Danube and the Sava`, `Serbien — Donau und Save`, `Serbia — il Danubio e la Sava`, `Σερβία — ο Δούναβης και ο Σάβος`);
  C(`Parlement de Budapest`, `Budapest Parliament`, `Parlament in Budapest`, `Parlamento di Budapest`, `Κοινοβούλιο της Βουδαπέστης`);
  C(`Hongrie — le Danube`, `Hungary — the Danube`, `Ungarn — die Donau`, `Ungheria — il Danubio`, `Ουγγαρία — ο Δούναβης`);
  C(`Château de Schönbrunn, Vienne`, `Schönbrunn Palace, Vienna`, `Schloss Schönbrunn, Wien`, `Palazzo di Schönbrunn, Vienna`, `Ανάκτορο Σένμπρουν, Βιέννη`);
  C(`Prague au lever du soleil`, `Prague at sunrise`, `Prag bei Sonnenaufgang`, `Praga all’alba`, `Η Πράγα την ανατολή του ηλίου`);
  C(`Porte de Brandebourg, Berlin`, `Brandenburg Gate, Berlin`, `Brandenburger Tor, Berlin`, `Porta di Brandeburgo, Berlino`, `Πύλη του Βρανδεμβούργου, Βερολίνο`);
  C(`Mer des Wadden, Schleswig-Holstein`, `Wadden Sea, Schleswig-Holstein`, `Wattenmeer, Schleswig-Holstein`, `Mare dei Wadden, Schleswig-Holstein`, `Θάλασσα Βάντεν, Σλέσβιχ-Χολστάιν`);
  C(`Allemagne — pays des cigognes`, `Germany — land of the storks`, `Deutschland — Land der Störche`, `Germania — terra delle cicogne`, `Γερμανία — η χώρα των πελαργών`);
  C(`Maisons sur les canaux, Amsterdam`, `Canal houses, Amsterdam`, `Grachtenhäuser, Amsterdam`, `Case sui canali, Amsterdam`, `Σπίτια στα κανάλια, Άμστερνταμ`);
  C(`Grand-Place de Bruxelles`, `Grand-Place, Brussels`, `Grand-Place in Brüssel`, `Grand-Place di Bruxelles`, `Γκραν Πλας των Βρυξελλών`);

  window.TRIADE_I18N = { langs: LANGS, ui: UI, contenu: CONTENU };
})();
