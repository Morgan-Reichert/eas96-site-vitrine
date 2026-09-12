# EAS 96 — Estuaire d'Armor Simulation · Site vitrine

Site statique en HTML, CSS et JS, sans dépendance ni installation. Il suffit d'ouvrir `index.html` dans un navigateur.

**En ligne :** https://eas-96.fr/

## Structure

```
index.html            Page d'accueil (toutes les sections)
recrutement.html      Page recrutement : prérequis, puis dépôt de la candidature sur l'intranet
reseaux.html          Page « Nos réseaux » : comptes, dernières vidéos, prochain direct
css/variables.css     Thème : couleurs, polices, tailles, espacements
css/style.css         Mise en page et composants
js/main.js            Configuration (date, liens) et interactions
assets/img/           Logos, favicon et photos
```

## Parcours de l'accueil

Bandeau d'annonce → Hero « Servir · Protéger · Secourir » + compte à rebours → Chiffres clés → 01 Le projet → 02 Notre objectif → 03 Les pôles → 04 Les attendus → 05 Le recrutement → Galerie → FAQ → Appel final → Pied de page

Tous les boutons « Postuler » et « Déposer ma candidature » de l'accueil mènent à `recrutement.html` : les prérequis, puis la marche à suivre en trois étapes (rejoindre le Discord, se connecter à l'intranet, déposer et suivre son dossier). Le bouton « Déposer ma candidature » de cette page ouvre l'intranet, dont l'adresse est réglée dans `CONFIG.links.intranet`.

## Contenus

Les textes reprennent fidèlement la présentation fournie par le client : le projet et son univers fictif (département du 96, Estuaire d'Armor), les quatre pôles (SDIS 96, SAMU / CHU Montreval, Police Nationale — DIDPN Estuaire d'Armor, opérateurs radio du centre de traitement des appels), les sessions (3 à 4 par semaine, de 21 h à minuit, planning non figé) et les conditions pour rejoindre le serveur.

## Fonctionnalités

- **Bannière de consentement** à la première visite (voir « Confidentialité »).
- **Bandeau d'annonce** au-dessus du menu, refermable.
- **Menu à deux niveaux** : Le serveur, Nous rejoindre et Communauté, chacun avec son sous-menu. Transparent sur la photo, compact au défilement ; le lien de la section visible est surligné.
- **Connexion à l'intranet** : bouton avec icône à côté de « Postuler », mémorisation proposée au retour et avatar Discord à la place de l'icône (voir « Connexion à l'intranet »).
- **Page « Nos réseaux »** : les comptes du serveur, les trois dernières vidéos YouTube et le prochain direct Twitch.
- **Compte à rebours** façon panneau d'affichage (haut de page et appel final).
- **Chiffres clés** ; membres et connectés du Discord récupérés en direct après accord.
- **Fiches des pôles** : « Découvrir le pôle » ouvre une fenêtre (le pôle, la formation, pour postuler).
- **Galerie** filtrable par pôle, visionneuse plein écran (flèches du clavier, balayage sur mobile), carrousel sur mobile.
- **Apparition des blocs** au défilement, désactivée si l'appareil demande de limiter les animations.

## Connexion à l'intranet

Le site est statique : il n'authentifie personne, la session vit sur l'intranet. Le bouton à icône, à droite de « Postuler », ouvre simplement `CONFIG.links.intranet`.

Pour que le site affiche l'avatar du visiteur, l'intranet doit le renvoyer, après connexion Discord, vers une adresse de la forme :

```
https://eas-96.fr/?pseudo=LePseudo&avatar=https%3A%2F%2Fcdn.discordapp.com%2Favatars%2F...png
```

Le site :

- n'accepte que les avatars servis par `https://cdn.discordapp.com/` ;
- nettoie aussitôt l'adresse affichée dans le navigateur ;
- propose « Rester connecté sur cet appareil ? » avant toute mémorisation ;
- conserve alors le pseudo et l'avatar dans le navigateur (clé `eas96-compte`), jamais de jeton ni de session ;
- permet d'effacer ces informations avec « Oublier cet appareil », dans le menu de l'avatar.

Une fois le domaine en place, site sur `eas-96.fr` et intranet sur `intranet.eas-96.fr`, la session est partagée sans passer par l'adresse : l'intranet expose `/api/moi`, qui renvoie le pseudo et l'avatar du visiteur connecté, jamais de jeton, et le site l'interroge au chargement. Il suffit alors de renseigner `CONFIG.links.intranetApi` avec `https://intranet.eas-96.fr/api/moi`. L'avatar apparaît tout seul et disparaît dès que la session est fermée sur l'intranet.

## Confidentialité

Le site n'utilise aucun cookie. Les polices Google Fonts, le compteur de membres Discord et les vignettes des vidéos YouTube ne sont chargés qu'après un clic sur « Accepter ». En cas de refus, le site s'affiche avec les polices du système et sans compteur Discord. Le choix est mémorisé dans le navigateur (`eas96-consent`) et peut être modifié via « Préférences de confidentialité » dans le pied de page.

## À modifier en priorité

### 1. Date d'ouverture et liens : `js/main.js`

Objet `CONFIG` en haut du fichier :

- `launchDate` : lundi 14 septembre 2026 à 20h00 (heure de Paris). Toutes les dates affichées suivent automatiquement.
- `links` : Discord (https://discord.gg/hyYrn5gmMf), `intranet` (espace candidat et recruteur), Instagram, TikTok, Facebook, et les adresses encore vides (`youtube`, `twitch`, `reglement`). Tous les éléments `data-link="…"` récupèrent ces liens, et **les liens laissés vides sont masqués automatiquement** plutôt que d'afficher un lien mort.
- `youtube` : deux modes pour les trois dernières vidéos. Automatique avec `channelId` (UC…) et `apiKey` (clé API YouTube gratuite, à restreindre à votre domaine), ou manuel en remplissant `videos` avec les identifiants des vidéos. Sans l'un ni l'autre, la page affiche « Aucune vidéo pour le moment ».
- `twitch.nextStream` : Twitch n'expose pas de calendrier sans serveur, le prochain direct se renseigne donc à la main, par exemple `{ title: "Garde SDIS", startsAt: "2026-09-20T21:00:00+02:00" }`. Une fois la date passée, le bloc repasse automatiquement sur « Aucun direct programmé ».

### 2. Éléments encore à fournir

- Adresses des chaînes YouTube et Twitch, lien du règlement et page de mentions légales.
- Pour les vidéos en automatique : identifiant de chaîne YouTube et clé API restreinte au domaine.
- Une capture du centre de traitement des appels pour `service-4.jpg` (actuellement un poste de commandement).

### 3. Photos : `assets/img/`

Remplacez un fichier par une autre capture **sous le même nom** :

| Fichier | Contenu actuel | Emplacement |
| --- | --- | --- |
| `hero.jpg` | Canadair sur feu de forêt | Fond du haut de page |
| `principe.jpg` | COS donnant ses consignes | Section 01 Le projet |
| `objectif.jpg` | Équipe de sapeurs-pompiers | Section 02 Notre objectif |
| `service-1.jpg` → `service-4.jpg` | SDIS, SAMU, Police Nationale, poste de commandement | Cartes et fiches des pôles |
| `galerie-1.jpg` → `galerie-9.jpg` | Captures en jeu | Galerie (pôle dans `data-category`) |
| `cta.jpg` | Incendie industriel | Fond de l'appel final |
| `og-image.jpg` | Hélico Dragon + logo | Aperçu du lien sur Discord |
| `logo-leger-blanc.png`, `logo-complet-blanc.png`, `favicon.png` | Logos | En-tête, pied de page, onglet |

Les photos viennent du dossier `img illustrations`, recadrées pour retirer les incrustations FiveM. Pour une netteté parfaite en plein écran, préférez des captures en 2560 px.

### 4. Style : `css/variables.css`

Palette issue du logo : bleu nuit, blanc et rouge (le rouge est réservé aux actions). Deux contextes de couleur : clair (`:root`) et sombre (`.theme-dark`). On y règle aussi les voiles des photos (`--overlay-hero`, `--overlay-cta`) et les couleurs des pôles.

## Mise en ligne

Le site est hébergé par Vercel sur `https://eas-96.fr`, à partir de la branche `main` du dépôt `Morgan-Reichert/eas96-site-vitrine`. Chaque envoi (`git push`) déclenche un déploiement automatique, en une minute environ. `www.eas-96.fr` redirige vers le domaine principal, et l'intranet occupe `intranet.eas-96.fr`.
