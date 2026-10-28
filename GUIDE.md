# Guide : modifier le site TRIADE

Ce guide est pour toi qui gères la communication. **Tu n'as pas besoin de savoir coder.**
Tout se fait dans un « espace équipe » qui ressemble à un formulaire : tu remplis des cases, tu cliques sur « Enregistrer », et le site se met à jour tout seul en 1 à 2 minutes.

L'espace équipe se trouve à l'adresse du site suivie de `/admin/`
(exemple : `https://tanguyruel.github.io/triade/admin/`). Il marche très bien depuis un téléphone.

---

## 1. La première fois (10 minutes, une seule fois)

1. **Crée un compte GitHub gratuit** sur [github.com](https://github.com) (c'est là que vit le site).
2. **Donne ton nom d'utilisateur GitHub à Titouan.** Il t'ajoute à l'équipe du site (Settings → Collaborators) et tu reçois un e-mail d'invitation : clique sur « Accept invitation ».
3. **Ouvre l'espace équipe** (adresse ci-dessus) et clique sur **« Se connecter avec un jeton d'accès »**.
   (Ne clique pas sur « Se connecter avec GitHub » : ce bouton ne marche pas encore.)
4. Une fenêtre t'explique comment créer ton jeton : clique sur le lien, GitHub s'ouvre avec les bonnes cases déjà cochées. Clique sur **« Generate token »**, **copie** le jeton, reviens sur l'espace équipe et **colle-le**.
5. C'est fait. Ton navigateur s'en souvient. Si un jour on te redemande un jeton, refais l'étape 4.

> Le jeton est comme un mot de passe : ne le partage à personne, ne l'envoie pas par message.

---

## 2. Au quotidien : publier une journée dans le journal de bord

1. Espace équipe → menu de gauche **« Journal de bord »** → **« Ajouter une entrée »**.
2. Remplis les cases :
   - **Date et heure** : déjà remplie avec « maintenant ». L'heure sert au bandeau « Position en direct ».
   - **Auteur** : qui a écrit.
   - **Lieu** et **Pays** : c'est ça qui met à jour **« Position en direct » en haut de tout le site**.
   - **Titre** : une phrase courte. S'il est vide, le lieu sert de titre.
   - **Texte** : le récit (facultatif). Les boutons permettent le gras, l'italique, un lien, un sous-titre, une liste, une citation.
   - **Photos** : clique et choisis **plusieurs photos d'un coup** depuis ton téléphone ou ton ordinateur. Elles sont automatiquement réduites et allégées : envoie-les telles quelles. La première devient la photo de couverture.
   - **Vidéo** : colle l'adresse d'une vidéo YouTube (elle se lit sur le site) ou Instagram/TikTok (un bouton ouvre le lien).
3. Clique sur **« Enregistrer »** (en haut à droite). Attends 1 à 2 minutes, puis recharge le site.

La carte s'affiche sur l'accueil (« À la une » si elle a une photo) et dans le journal, avec « N min de lecture » calculé tout seul.

---

## 3. Les autres modifications, en un coup d'œil

| Je veux… | Menu de gauche | Quoi faire |
|---|---|---|
| Ajouter une interview | **Interviews et rencontres** | « Ajouter une interview », choisir l'association. Elle apparaît sur la page Rencontres **et** sur la fiche de l'association. |
| Faire avancer une association | **Associations** | Changer son **Statut** : « Contact en cours » → « Rencontre confirmée » → « Rencontre réalisée ». |
| Dire « nous avons quitté cette étape » | **Étapes du voyage** | Cocher **« Étape passée »**. La frise avance toute seule. |
| Mettre à jour les kilomètres | **Réglages** | « Kilomètres déjà parcourus » et « Pays déjà traversés ». Tant que c'est vide, le site affiche les chiffres prévus. |
| Ajouter un bandeau « Départ dans 10 jours ! » | **Réglages** | Case « Bandeau d'annonce ». Vide = pas de bandeau. |
| Mettre TikTok, YouTube, Polarsteps | **Réglages** | Colle l'adresse. Vide = l'icône n'apparaît pas. |
| Ouvrir la cagnotte | **Cagnotte** | Colle le « Lien de la cagnotte ». Tant que c'est vide : « La cagnotte ouvre bientôt ». |
| Mettre à jour le montant collecté | **Cagnotte** | « Objectif » et « Déjà collecté » (un nombre). La barre de progression apparaît. |
| Remercier quelqu'un qui nous aide | **Ils nous aident** | Seulement **après son accord écrit**. Tant que la liste est vide, l'entrée n'apparaît pas dans le menu. |
| Ajouter un article de presse | **Presse** | L'entrée « Presse » apparaît alors dans le menu. |
| Changer une photo ou un texte de l'équipe | **Équipe** | Modifier la fiche. |

---

## 4. Nos règles (à garder en tête)

- **Jamais le mot « partenaire »** avant un accord écrit. On dit « ils nous aident », seulement après accord.
- **Aucun chiffre inventé** : ni dons, ni abonnés, ni kilomètres. Si on ne sait pas, on laisse vide.
- **Les photos de personnes** (interviews, habitants) : demande leur accord.
- **Dates des étapes** : toujours vagues (« mi-avril »), sauf le NABU (20 juin → 5 juillet environ).
- Le site n'affiche **aucune publicité** et ne dépose **aucun cookie** : ne rajoute pas d'outil de mesure sans en parler.

---

## 5. Si quelque chose ne va pas

- **Je ne vois pas ma modification** : attends 2 minutes, puis recharge en forçant (`Ctrl + Maj + R`, ou `Cmd + Maj + R` sur Mac). Sur téléphone, ferme et rouvre l'onglet.
- **Une case me demande quelque chose que je n'ai pas** : seules certaines cases sont obligatoires (la date, le nom…). Les autres peuvent rester vides.
- **J'ai fait une erreur** : corrige-la dans l'espace équipe et enregistre à nouveau. Tout est gardé dans l'historique GitHub (onglet « Commits » du dépôt), donc rien n'est perdu : Titouan peut revenir en arrière.
- **L'espace équipe affiche une erreur** : préviens Titouan.

---

## 6. Pour Titouan (technique)

- Site 100 % statique (HTML, CSS, JavaScript sans bibliothèque), publié par GitHub Pages depuis la branche `main`.
- Le texte et les photos sont dans `content/*.json` et `photos/`. Les pages (`*.html`) et `assets/js/site.js` ne servent qu'à les afficher.
- L'éditeur est [Sveltia CMS](https://github.com/sveltia/sveltia-cms) 0.235.1 (MIT), copié dans `admin/sveltia-cms.js` ; sa configuration est `admin/config.yml` (si le dépôt change de nom ou de propriétaire, changer la ligne `repo:`).
- Les photos envoyées par l'éditeur sont converties en WebP, 2000 px maximum (réglé dans `config.yml`).
- Connexion : par jeton d'accès (« Fine-grained token », droit **Contents : Read and write** sur ce dépôt). Pour un vrai bouton « Se connecter avec GitHub », il faut déployer le [Sveltia CMS Authenticator](https://github.com/sveltia/sveltia-cms-auth) (Cloudflare Workers, gratuit) et ajouter `base_url:` dans `config.yml`.
- Aperçu local : `python3 -m http.server 8000` dans ce dossier, puis `http://localhost:8000` (ouvrir `index.html` en double-cliquant ne marche pas : le navigateur bloque la lecture des fichiers JSON).
- Couleurs et polices : variables au début de `assets/css/style.css`.
- Nouvelle page : copier une page existante, changer `data-page`, ajouter une fonction dans `pages` de `assets/js/site.js`, et l'entrée dans `NAV`.


## Changer les photos du haut de l’accueil

Dans **Réglages → Photos du haut de l’accueil**, ajoutez, remplacez ou retirez des
photos. Pour chacune, indiquez une légende, le crédit et, si utile, un lien source.
Pendant le voyage, remplacez les vues d’inspiration par vos photos de vélo,
d’animaux et de rencontres avec les associations (avec l’accord des personnes
photographiées). N’indiquez un lieu que si vous le connaissez réellement.

Le diaporama change de photo toutes les 7 secondes. Les points permettent de
choisir une image ; le bouton Pause arrête le défilement. Le défilement automatique
est arrêté pour les visiteurs qui demandent moins d’animations. Une image qui ne
charge pas est ignorée. Si aucune image de la liste ne charge ou si la liste est
vide, la photo locale du projet reste affichée.

Les dix paysages d’inspiration sont des photos Internet issues d’Unsplash,
via la collection Bitscoper Nature. Ils sont hébergés avec le site dans
`assets/img/paysages/`, avec leurs sources dans `credits-photos.html` et dans les
réglages. Les lieux exacts ne sont pas tous identifiés : ce ne sont ni des photos
du voyage ni des étapes certifiées. Chaque image a été redimensionnée et encodée
en WebP pour réduire le poids du diaporama. Aucun appel à Unsplash n’est nécessaire
pour leur affichage. La photo locale du projet reste disponible comme secours.

Les cinq dessins au crayon sont décoratives et ne s’affichent que dans les marges beiges de
l’accueil à partir de 1360 px, là où il y a assez de place. Elles restent absentes
des cartes et de la page des associations, et sont masquées sur mobile.
