# Cartes de visite dynamique - GRAFFEUILLE

Toutes les cartes, un seul dépôt :

Attention pour le lien QR : 

- Ne pas renommez le nom d'utilisateur GitHub.
- Ne pas renommez le nom de votre dépôt GitHub.
- Ne passez pas le dépôt de "Public" à "Privé" (les pages GitHub gratuites doivent obligatoirement rester publiques).

| Page | À qui elle s'adresse |
| --- | --- |
| `equipe/<personne>/` | **La carte en ligne**, une adresse par employé. C'est elle qui s'ouvre quand on scanne le QR code au dos de la carte imprimée. Elle ne montre que les coordonnées, sur une page pensée pour un téléphone. |
| `index.html` | Entrée de secours : affiche la personne désignée par le fragment d'URL. |
| `editeur.html` | **L'éditeur.** On y saisit les coordonnées, on voit la carte se composer, on exporte le fichier d'impression. Aucune page publique n'y renvoie. |

Pourquoi GitHub ? : tout tourne dans le navigateur : pas de serveur, pas de compte, pas de
dépendance externe.

## Les adresses en ligne

Le site est publié à la racine du dépôt, depuis la branche `main` :

<https://graffeuille.github.io/CDV/>


### Une adresse par employé

Ce sont celles-ci que les QR code vont ouvrir :

| Personne | Adresse |
| --- | --- |
| Alain GRAFFEUILLE | <https://graffeuille.github.io/CDV/equipe/alain-graffeuille/> |
| Jérôme GOUMARD | <https://graffeuille.github.io/CDV/equipe/jerome-goumard/> |
| Marie-Noëlle GRAFFEUILLE | <https://graffeuille.github.io/CDV/equipe/marie-noelle-graffeuille/> |
| Sarah FOSSARD | <https://graffeuille.github.io/CDV/equipe/sarah-fossard/> |
| Michaël MANCIA | <https://graffeuille.github.io/CDV/equipe/michael-mancia/> |
| Mickaël MOREL | <https://graffeuille.github.io/CDV/equipe/mickael-morel/> |
| Fabrice PELLIZOTTI | <https://graffeuille.github.io/CDV/equipe/fabrice-pellizotti/> |
| Jean-Michel GAISNON | <https://graffeuille.github.io/CDV/equipe/jean-michel-gaisnon/> |
| Loïc BERNARD | <https://graffeuille.github.io/CDV/equipe/loic-bernard/> |

### Les autres adresses

| Adresse | Ce qu'elle ouvre |
| --- | --- |
| <https://graffeuille.github.io/CDV/editeur.html> | L'éditeur. Aucune page publique n'y renvoie : il n'est ni listé, ni protégé. |
| <https://graffeuille.github.io/CDV/> | Entrée de secours. Sans fragment, elle affiche la carte de Jérôme Goumard. |
| <https://graffeuille.github.io/CDV/#loic-bernard> | Ancienne forme par identifiant, toujours acceptée pour ne pas invalider un QR déjà imprimé. |
| <https://graffeuille.github.io/CDV/equipe/sarah-fossard/carte.json> | La fiche brute d'une personne, telle que la page la lit. |

## Un dossier par personne

Chaque employé a son propre dossier, sa propre adresse et ses propres fichiers :

```
equipe/
  _modele/                 ← à dupliquer pour ajouter quelqu'un
    index.html             ← identique partout, jamais à modifier
    carte.json             ← les coordonnées
    portrait.svg           ← les fichiers propres à la personne
  jerome-goumard/
    index.html
    carte.json
```

### L'équipe déjà en place

| Dossier | Personne | Fonction | Service |
| --- | --- | --- | --- |
| `alain-graffeuille` | Alain GRAFFEUILLE | Directeur Adjoint | |
| `jerome-goumard` | Jérôme GOUMARD | Directeur | |
| `marie-noelle-graffeuille` | Marie-Noëlle GRAFFEUILLE | Chef de projets et développement | |
| `sarah-fossard` | Sarah FOSSARD | Commerciale | Grands Comptes |
| `michael-mancia` | Michaël MANCIA | Responsable commercial | Boîtes de vitesses / Ponts |
| `mickael-morel` | Mickaël MOREL | Responsable commercial | Moteurs |
| `fabrice-pellizotti` | Fabrice PELLIZOTTI | Commercial | Boîtes de vitesses / Ponts |
| `jean-michel-gaisnon` | Jean-Michel GAISNON | Responsable Atelier | Production Moteurs |
| `loic-bernard` | Loïc BERNARD | Responsable Atelier | Production Moteurs |

Le site est `www.graffeuille.fr` pour l'ensemble de l'équipe.

### Ajouter un employé

1. Dupliquer `equipe/_modele/`, le renommer `prenom-nom`.
2. Dans l'éditeur, remplir le formulaire, mettre `prenom-nom` dans
   « Identifiant de la personne », puis **Fiche pour le site** : le fichier
   `carte.json` téléchargé remplace celui du dossier.
3. Déposer éventuellement une photo dans le dossier et écrire son nom de
   fichier dans le champ « Photo du dossier ».
4. Imprimer la carte : son QR pointe déjà vers la nouvelle adresse.

`index.html` ne contient que trois lignes utiles — il désigne `carte.json` et
charge le code commun. Il est donc identique dans tous les dossiers, et une
refonte de la mise en page n'oblige jamais à repasser dessus.

## Ce que voit la personne qui scanne

Le QR code ne contient pas la fiche mais **l'adresse de la page en ligne**. La
différence compte : corriger un numéro sur le site met à jour toutes les cartes
déjà distribuées, alors qu'un QR contenant une vCard fige les coordonnées dans
l'encre.

La page affiche le logo, le portrait s'il y en a un, le nom, la fonction, puis
quatre lignes tacticle : appeler, écrire, ouvrir le site,
ouvrir l'itinéraire. Le bouton « Ajouter à mes contacts » télécharge la fiche
`.vcf`.

### Deux formes d'adresse

| Adresse | Usage |
| --- | --- |
| `…/equipe/prenom-nom/` | **La bonne.** 77 caractères : le QR tombe en version 5, ses modules mesurent **0,54 mm** imprimés, il se scanne sans effort. |
| `…/#prenom-nom` | Ancienne forme, toujours acceptée pour ne pas invalider un QR déjà imprimé. |

### Après une modification de `carte.json`

La page relit le fichier à chaque ouverture, donc en local un simple
rafraîchissement suffit. Sur GitHub Pages, le réseau de diffusion peut servir
l'ancienne version quelques minutes après le `git push` - c'est le délai de
publication.

## L'éditeur

- **Édition en direct** - identité, fonction, coordonnées, établissement, accroche du recto, couleur d'accent, filigrane.
- **Annuaire local** - Les cartes créées sont conservées dans le navigateur. Tu peux fermer l'onglet et revenir plus tard, elles sont toujours là.
Attention : elles sont attachées à ce navigateur et à cet ordinateur.
Vider l'historique, changer de machine ou naviguer en privé donne un
annuaire vide.
- **Exports** : Le bouton d'export télécharge un fichier `.json` contenant tout
l'annuaire. Le bouton d'import le recharge. C'est la sauvegarde du
projet : garde ce fichier quelque part de sûr, et sers-t'en pour
transférer les cartes vers un autre poste ou vers un collègue.
- **Lien de partage** : Ce bouton copie une adresse qui contient l'état complet de l'éditeur :
coordonnées, thème, couleurs, mise en page. Ouvre ce lien sur
n'importe quel autre ordinateur et l'éditeur se rouvre exactement
comme tu l'avais laissé.

 ## Où sont stockées les cartes
 
 Le site n'a ni serveur, ni base de données, ni compte utilisateur.
 Tout vit dans le navigateur de la personne qui utilise l'éditeur.

### Avant d'imprimer

1. Renseigner **« Adresse du site publié »** avec le domaine réel. Sur GitHub
   Pages ce champ peut rester vide : l'éditeur déduit l'adresse de l'endroit
   d'où il est servi.
2. Donner un **identifiant**, dupliquer `equipe/_modele/` sous ce nom, et y
   déposer la fiche `carte.json` produite.
3. Vérifier le verdict affiché sous l'URL (taille de module).
4. Cocher **« Fond perdu de 5 mm et traits de coupe »**, puis imprimer avec des
   marges nulles et sans « ajuster à la page » — le format est déjà imposé par
   la feuille de style.

### L'éditeur n'est pas protégé

`editeur.html` est simplement absent de la navigation : aucun lien public n'y
mène et il porte un `noindex`. Sur un hébergement statique il n'y a pas
d'authentification possible, donc **quiconque connaît l'adresse peut l'ouvrir**.
Il ne peut rien casser (il ne fait qu'écrire dans le navigateur de la personne),
mais si cela pose problème, il faut le servir depuis un dépôt privé ou un
hébergement qui sait demander un mot de passe.

## Organisation du code

```
equipe/<personne>/      un dossier par employé : carte.json, photo, index.html
equipe/_modele/         gabarit à dupliquer
index.html              entrée de secours, pilotée par le fragment d'URL
editeur.html            éditeur des cartes

assets/js/contact.js    modèle partagé : valeurs, vCard, encodage de l'URL
assets/js/icons.js      pictogrammes, extraits de la fonte d'icônes d'origine
assets/js/logo.js       tracés du logo, en millimètres dans le repère de la carte
assets/js/carte.js      page publique (elle construit tout le gabarit)
assets/js/card.js       rendu SVG du recto et du verso
assets/js/qrcode.js     encodeur QR autonome (ISO/IEC 18004, mode octet)
assets/js/app.js        éditeur : formulaire, annuaire, exports
assets/css/fonts.css    fontes hébergées par le site
assets/fonts/           Roboto Condensed, Inter, Archivo (SIL OFL 1.1)
assets/css/carte.css    page publique (thèmes clair et sombre)
assets/css/app.css      éditeur et règles d'impression
assets/img/             logo et symbole en SVG, réutilisables hors de la carte
```

`card.js` est le seul endroit qui décrit la mise en page imprimée : l'aperçu,
le PDF, le SVG et le PNG sortent tous du même rendu. `contact.js` est le seul
endroit qui décrit les données, partagé par les deux pages.

L'encodeur QR est écrit à la main plutôt qu'importé d'un CDN, pour que les
pages restent utilisables hors ligne et sans dépendance à surveiller. Il a été
vérifié par relecture des codes produits (29 combinaisons de niveaux L/M/Q/H et
de versions 1 à 39, toutes relues correctement), puis sur des captures du rendu
réel de la carte, avec identifiant court et avec coordonnées en URL.

## Mise en ligne

C'est fait : `Settings → Pages`, « Deploy from a branch », branche `main`,
dossier racine. Il n'y a rien à compiler. Le fichier `.nojekyll` à la racine
demande à GitHub de servir les fichiers tels quels - sans lui, tout dossier
commençant par un tiret bas, dont `equipe/_modele`, serait écarté du site.

En local :

```sh
python3 -m http.server 8000
```

`http://localhost:8000/equipe/jerome-goumard/` ouvre sa carte,
`http://localhost:8000/editeur.html` l’éditeur.
