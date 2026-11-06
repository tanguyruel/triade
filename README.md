# TRIADE — site web

Site de **TRIADE** (*Three Riders In Adventure Discovering Europe*) : trois étudiants de l'Institut Agro Montpellier traversent l'Europe à vélo, de mars à août 2027, à la rencontre de six associations de protection de la biodiversité.

Site statique (HTML, CSS, JavaScript sans bibliothèque), publié par GitHub Pages. Aucun cookie, aucune publicité, polices hébergées sur le site.

## Pour modifier le contenu (sans coder)

Lire **[GUIDE.md](GUIDE.md)** : l'espace équipe (`/admin/`) permet d'ajouter des photos, des récits, des interviews, de mettre à jour la position, les chiffres et la cagnotte, depuis un téléphone.

## Structure

```
index.html, route.html (« Sur la route » : position en direct, photos et vidéos, étapes),
associations.html, rencontres.html, soutiens.html, cagnotte.html, presse.html, mentions.html   → les pages
suivi.html, journal.html, aventure.html   → simples redirections des anciennes adresses
content/*.json      → TOUT le texte modifiable (l'espace équipe écrit ici)
photos/             → les photos envoyées depuis l'espace équipe
assets/css/style.css, assets/js/site.js, assets/js/langues.js (traductions), assets/img, assets/fonts   → mise en page
admin/              → l'espace équipe (Sveltia CMS) et sa configuration config.yml
```

## Aperçu en local

```
python3 -m http.server 8000
```
puis ouvrir <http://localhost:8000>.

## Licences

Code du site : à préciser par l'équipe. Sveltia CMS (MIT). Polices Bodoni Moda et Jost (SIL Open Font License 1.1). Logos des associations : propriété de leurs auteurs.
