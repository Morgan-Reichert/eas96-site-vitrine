# EAS 96 — Estuaire d'Armor Simulation · Site vitrine

Site statique en HTML, CSS et JS, sans dépendance ni installation. Il suffit d'ouvrir `index.html` dans un navigateur.

**En ligne :** https://morgan-reichert.github.io/eas96-site-vitrine/

## Structure

```
index.html            Page d'accueil (toutes les sections)
recrutement.html      Page recrutement : prérequis, module INTRANET, candidature via Discord
css/variables.css     Thème : couleurs, polices, tailles, espacements
css/style.css         Mise en page et composants
js/main.js            Configuration (date, liens) et interactions
assets/img/           Logos, favicon et photos
```

## Parcours de l'accueil

Bandeau d'annonce → Hero « Servir · Protéger · Secourir » + compte à rebours → Chiffres clés → 01 Le projet → 02 Notre objectif → 03 Les pôles → 04 Les attendus → 05 Le recrutement → Galerie → FAQ → Appel final → Pied de page

Tous les boutons « Postuler » et « Déposer ma candidature » mènent à `recrutement.html` : prérequis, puis encadré « Module INTRANET — Recrutement en cours de développement », puis procédure de candidature sur Discord. Quand le module INTRANET sera en ligne, mettez à jour la section « La candidature » de cette page.

## Contenus

Les textes reprennent fidèlement la présentation fournie par le client : le projet et son univers fictif (département du 96, Estuaire d'Armor), les quatre pôles (SDIS 96, SAMU / CHU Montreval, Police Nationale — DIDPN Estuaire d'Armor, opérateurs radio du centre de traitement des appels), les sessions (3 à 4 par semaine, de 21 h à minuit, planning non figé) et les conditions pour rejoindre le serveur.

## Fonctionnalités

- **Bannière de consentement** à la première visite (voir « Confidentialité »).
- **Bandeau d'annonce** au-dessus du menu, refermable.
- **Menu** transparent sur la photo, compact au défilement ; le lien de la section visible est surligné.
- **Compte à rebours** façon panneau d'affichage (haut de page et appel final).
- **Chiffres clés** ; membres et connectés du Discord récupérés en direct après accord.
- **Fiches des pôles** : « Découvrir le pôle » ouvre une fenêtre (le pôle, la formation, pour postuler).
- **Galerie** filtrable par pôle, visionneuse plein écran (flèches du clavier, balayage sur mobile), carrousel sur mobile.
- **Apparition des blocs** au défilement, désactivée si l'appareil demande de limiter les animations.

## Confidentialité

Le site n'utilise aucun cookie. Les polices Google Fonts et le compteur de membres Discord ne sont chargés qu'après un clic sur « Accepter ». En cas de refus, le site s'affiche avec les polices du système et sans compteur Discord. Le choix est mémorisé dans le navigateur (`eas96-consent`) et peut être modifié via « Préférences de confidentialité » dans le pied de page.

## À modifier en priorité

### 1. Date d'ouverture et liens : `js/main.js`

Objet `CONFIG` en haut du fichier :

- `launchDate` : lundi 14 septembre 2026 à 20h00 (heure de Paris). Toutes les dates affichées suivent automatiquement.
- `links` : Discord (https://discord.gg/hyYrn5gmMf), règlement et réseaux sociaux. Tous les éléments `data-link="…"` récupèrent ces liens.

### 2. Éléments encore à fournir

- Liens du règlement, des réseaux sociaux et page de mentions légales (liens `#`).
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

Le site est publié par GitHub Pages depuis la branche `main` du dépôt `Morgan-Reichert/eas96-site-vitrine`. Chaque envoi (`git push`) republie le site en une minute environ ; le cache de GitHub peut garder l'ancienne version jusqu'à 10 minutes (Ctrl+F5 pour forcer).
