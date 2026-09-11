# EAS 96 Simulation — Site vitrine

Site statique en HTML, CSS et JS, sans dépendance ni installation. Il suffit d'ouvrir `index.html` dans un navigateur.

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

Bandeau d'annonce → Hero + compte à rebours → Chiffres clés → 01 Le principe → 02 Notre objectif → 03 Les services → 04 Les attendus → 05 Le recrutement → Galerie → FAQ → Appel final → Pied de page

Tous les boutons « Postuler » et « Déposer ma candidature » mènent à `recrutement.html` : prérequis, puis encadré « Module INTRANET — Recrutement en cours de développement », puis procédure de candidature sur Discord. Quand le module INTRANET sera en ligne, mettez à jour la section « La candidature » de cette page.

## Fonctionnalités

- **Bandeau d'annonce** au-dessus du menu, refermable (mémorisé dans le navigateur).
- **Menu** transparent sur la photo, compact et opaque au défilement ; le lien de la section visible est surligné.
- **Compte à rebours** façon panneau d'affichage (haut de page et appel final).
- **Chiffres clés** animés ; membres et connectés du Discord récupérés en direct depuis l'invitation.
- **Fiches services** : « Découvrir le service » ouvre une fenêtre avec missions, grades et prérequis.
- **Galerie** filtrable par service, visionneuse plein écran (flèches du clavier, balayage sur mobile), carrousel sur mobile.
- **Apparition des blocs** au défilement, désactivée si l'appareil demande de limiter les animations.

## À modifier en priorité

### 1. Date d'ouverture et liens : `js/main.js`

Objet `CONFIG` en haut du fichier :

- `launchDate` : lundi 14 septembre 2026 à 20h00 (heure de Paris). Toutes les dates affichées suivent automatiquement.
- `links` : Discord (https://discord.gg/hyYrn5gmMf), règlement et réseaux sociaux. Tous les éléments `data-link="…"` récupèrent ces liens.

### 2. Textes : `index.html` et `recrutement.html`

Remplacez le lorem ipsum ; chaque section est repérée par un commentaire. À valider en particulier :

- les 4 services (Sapeurs-pompiers, SAMU · SMUR, Forces de l'ordre, Sécurité civile), déduits des illustrations, et leurs fiches ;
- les chiffres « 50+ » et « 100 % » (commentaires « Chiffre à ajuster ») ;
- les badges « Recrute · XX places ».

### 3. Photos : `assets/img/`

Remplacez un fichier par une autre capture **sous le même nom** :

| Fichier | Contenu actuel | Emplacement |
| --- | --- | --- |
| `hero.jpg` | Canadair sur feu de forêt | Fond du haut de page |
| `principe.jpg` | COS donnant ses consignes | Section 01 |
| `objectif.jpg` | Équipe de sapeurs-pompiers | Section 02 |
| `service-1.jpg` → `service-4.jpg` | Pompiers, SMUR, police, hélico Dragon | Cartes et fiches des services |
| `galerie-1.jpg` → `galerie-9.jpg` | Captures en jeu | Galerie (catégorie dans `data-category`) |
| `cta.jpg` | Incendie industriel | Fond de l'appel final |
| `og-image.jpg` | Hélico Dragon + logo | Aperçu du lien sur Discord |
| `logo-leger-blanc.png`, `logo-complet-blanc.png`, `favicon.png` | Logos | En-tête, pied de page, onglet |

Les photos viennent du dossier `img illustrations`, recadrées pour retirer les incrustations FiveM. Pour une netteté parfaite en plein écran, préférez des captures en 2560 px.

### 4. Style : `css/variables.css`

Palette issue du logo : bleu nuit, blanc et rouge (le rouge est réservé aux actions). Deux contextes de couleur : clair (`:root`) et sombre (`.theme-dark`). On y règle aussi les voiles des photos (`--overlay-hero`, `--overlay-cta`) et les couleurs des services.

## Avant la mise en ligne

- Mettre des URL absolues dans les balises `og:image` (sinon l'aperçu Discord ne s'affiche pas).
- Remplacer les liens `#` restants (mentions légales, réseaux).
