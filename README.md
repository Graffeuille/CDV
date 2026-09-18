# Cartes de visite en ligne - GRAFFEUILLE

Chaque employé a une adresse à lui. Le QR code au dos de sa carte imprimée
l'ouvre sur le téléphone de la personne qui vient de scanner : logo, portrait,
nom, fonction, puis les coordonnées à toucher - appeler, écrire, ouvrir le
site, ouvrir l'itinéraire. Le bouton « Ajouter à mes contacts » télécharge la
fiche `.vcf`.

Tout tourne dans le navigateur : pas de serveur, pas de compte, aucune
dépendance extérieure.

> **À ne pas faire**, sous peine de casser tous les QR codes déjà imprimés :
> renommer le compte GitHub, renommer le dépôt, ou le passer en privé
> (les GitHub Pages gratuites doivent rester publiques).

## Les adresses

Le site est publié à la racine du dépôt, depuis la branche `main` :
<https://graffeuille.github.io/CDV/>

### Une adresse par employé - ce sont celles que les QR ouvrent

| Personne | Fonction | Adresse |
| --- | --- | --- |
| Alain GRAFFEUILLE | Directeur Adjoint | <https://graffeuille.github.io/CDV/equipe/alain-graffeuille/> |
| Jérôme GOUMARD | Directeur | <https://graffeuille.github.io/CDV/equipe/jerome-goumard/> |
| Marie-Noëlle GRAFFEUILLE | Chef de projets et développement | <https://graffeuille.github.io/CDV/equipe/marie-noelle-graffeuille/> |
| Sarah FOSSARD | Commerciale, Grands Comptes | <https://graffeuille.github.io/CDV/equipe/sarah-fossard/> |
| Michaël MANCIA | Responsable commercial, Boîtes de vitesses / Ponts | <https://graffeuille.github.io/CDV/equipe/michael-mancia/> |
| Mickaël MOREL | Responsable commercial, Moteurs | <https://graffeuille.github.io/CDV/equipe/mickael-morel/> |
| Fabrice PELLIZOTTI | Commercial, Boîtes de vitesses / Ponts | <https://graffeuille.github.io/CDV/equipe/fabrice-pellizotti/> |
| Jean-Michel GAISNON | Responsable Atelier, Production Moteurs | <https://graffeuille.github.io/CDV/equipe/jean-michel-gaisnon/> |
| Loïc BERNARD | Responsable Atelier, Production Moteurs | <https://graffeuille.github.io/CDV/equipe/loic-bernard/> |

Le site est `www.graffeuille.com` pour toute l'équipe.

### Les autres adresses

| Adresse | Ce qu'elle ouvre |
| --- | --- |
| <https://graffeuille.github.io/CDV/> | Entrée de secours. Sans rien après le `#`, elle affiche la carte de Jérôme Goumard. |
| <https://graffeuille.github.io/CDV/#loic-bernard> | Ancienne forme par identifiant, toujours acceptée pour ne pas invalider un QR déjà imprimé. |
| <https://graffeuille.github.io/CDV/equipe/sarah-fossard/carte.json> | La fiche brute, telle que la page la lit. |

## Un dossier par personne

```
equipe/
  _modele/                 <- à dupliquer pour ajouter quelqu'un
    index.html             <- identique partout, jamais à modifier
    carte.json             <- les coordonnées
    portrait.svg           <- les fichiers propres à la personne
  jerome-goumard/
    index.html
    carte.json
```

`index.html` ne contient qu'une chose utile : l'attribut `data-carte` qui
désigne `carte.json`, et les quatre scripts communs. Il est donc identique dans tous les dossiers, et refaire la
mise en page n'oblige jamais à y repasser.

### Ajouter un employé

1. Dupliquer `equipe/_modele/`, le renommer `prenom-nom` (sans accent, sans
   espace ni majuscule - c'est ce nom qui devient l'adresse).
2. Remplir `carte.json` dans le nouveau dossier.
3. Pour une photo : la déposer dans le dossier et écrire son nom de fichier
   dans `"photo"`. Laisser `""` s'il n'y en a pas.
4. Le QR de la carte imprimée doit pointer vers
   `https://graffeuille.github.io/CDV/equipe/prenom-nom/`.

### Les champs de `carte.json`

Tout champ absent ou vide reprend la valeur commune définie en tête de
`assets/js/contact.js`, et toute ligne sans valeur ne s'affiche pas.

| Champ | À quoi il sert |
| --- | --- |
| `firstName`, `lastName` | Le nom. Le nom de famille s'affiche en capitales. |
| `role`, `department` | Fonction et service, sous le nom. |
| `phone` | Affiché tel qu'écrit, appelé au format international. Un 06/07 est marqué « mobile » dans la fiche vCard. |
| `email`, `email2` | Un ou deux courriels. |
| `website`, `linkedin` | Le `https://` est ajouté tout seul s'il manque. |
| `company`, `street`, `postalCode`, `city`, `country` | L'établissement ; l'adresse ouvre un itinéraire. |
| `tagline` | L'accroche sous le logo. Un `\n` y force un retour à la ligne. |
| `showBaseline` | `false` masque la signature « TURGIS GAILLARD » sous le logo. |
| `accent` | La couleur de la page, `#e63329` par défaut. |
| `photo` | Nom d'un fichier image du dossier, ou `""`. |

### Après une modification de `carte.json`

La page relit le fichier à chaque ouverture : en local, un simple
rafraîchissement suffit. Sur GitHub Pages, le réseau de diffusion peut servir
l'ancienne version quelques minutes après le `git push` - c'est le délai de
publication, il n'y a rien à faire.

## Pourquoi le QR ne contient pas les coordonnées

Il ne porte que **l'adresse de la page**. La différence compte : corriger un
numéro sur le site met à jour toutes les cartes déjà distribuées, alors qu'un
QR contenant une vCard fige les coordonnées dans l'encre.

L'adresse `.../equipe/prenom-nom/` fait 77 caractères : le QR tombe en version 5,
ses modules mesurent 0,54 mm imprimés à 24 mm, il se scanne sans effort.

## Qui peut modifier les cartes

Le site est un ensemble de fichiers figés : il n'a ni serveur, ni base de
données, ni formulaire. **Une personne extérieure ne peut donc rien modifier.**
Les coordonnées ne changent que si quelqu'un modifie un `carte.json` dans ce
dépôt, et cela demande un droit d'écriture sur le dépôt GitHub.

Le dépôt est public, comme l'exigent les GitHub Pages gratuites : tout le monde
peut donc *lire* le code et les fiches. C'est sans conséquence, ce sont les
mêmes coordonnées que sur la carte imprimée.

Ce que le code interdit :

- **Fabriquer une fausse carte à notre adresse.** La page n'accepte après le `#`
  qu'un identifiant de dossier existant. Impossible d'écrire une adresse qui
  afficherait un faux nom ou un faux numéro sur `graffeuille.github.io`.
- **Sortir du dossier `equipe/`.** L'identifiant est limité aux lettres, aux
  chiffres et au tiret : ni point, ni barre oblique.
- **Injecter du code dans la page.** Tout texte affiché est échappé, et une
  règle `Content-Security-Policy` n'autorise que les scripts, styles, fontes et
  images du site lui-même. Aucun script en ligne, aucun appel extérieur.

À faire côté GitHub, une fois pour toutes :

1. `Settings -> Collaborators` : n'y laisser que les personnes qui doivent
   vraiment pouvoir modifier les cartes.
2. Activer l'authentification à deux facteurs sur ces comptes. C'est le vrai
   point d'entrée : qui prend la main sur le compte prend la main sur les
   cartes.
3. `Settings -> Branches` : protéger `main` pour empêcher un envoi direct et une
   réécriture de l'historique.

Une limite subsiste, qu'aucun code ne peut lever ici : GitHub Pages ne permet
pas d'envoyer d'en-têtes HTTP. La page ne peut donc pas s'interdire d'être
affichée dans le cadre d'un autre site. Il faudrait pour cela un hébergement
qui sache poser un en-tête `X-Frame-Options`.

## Organisation du code

```
index.html              entrée de secours, pilotée par ce qui suit le #
equipe/<personne>/      un dossier par employé : carte.json, photo, index.html
equipe/_modele/         gabarit à dupliquer

assets/js/contact.js    les données : valeurs communes, vCard, lecture du #
assets/js/carte.js      la page : elle construit tout le gabarit
assets/js/icons.js      les pictogrammes des lignes de contact
assets/js/logo.js       les tracés du logo GRAFFEUILLE / TURGIS GAILLARD
assets/css/carte.css    la mise en page (thèmes clair et sombre)
assets/css/fonts.css    les fontes, servies par le site
assets/fonts/           Inter et Archivo (SIL OFL 1.1)
assets/img/             logo, symbole et favicon en SVG
```

`contact.js` est le seul endroit qui décrit les données ; `carte.js` le seul
qui décrit la page.

## Mise en ligne

C'est fait : `Settings -> Pages`, « Deploy from a branch », branche `main`,
dossier racine. Il n'y a rien à compiler. Le fichier `.nojekyll` à la racine
demande à GitHub de servir les fichiers tels quels - sans lui, tout dossier
commençant par un tiret bas, dont `equipe/_modele/`, serait écarté du site.

Pour travailler en local :

```sh
python3 -m http.server 8000
```

puis ouvrir <http://localhost:8000/equipe/jerome-goumard/>. Ouvrir les fichiers
directement (`file://`) ne marche pas : le navigateur refuse alors de lire
`carte.json`.
