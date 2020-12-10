# **Correction Sprint 2**

# Fonctionnalité

## Exporter le dessin 6/6 - 1

- [x] Il est possible d'exporter le dessin localement via une fenêtre d'export de fichier.
- [x] Il est possible d'ouvrir la fenêtre d'export avec le raccourci `CTRL + E`.
- [x] Une seule fenêtre modale parmi: (sauvegarder, carrousel et exporter) peut être affichée en même temps (pas de _stack_ non plus).
- [x] Les différent raccourcis ne sont pas disponibles lorsque cette fenêtre est affichée.
- [x] Il est possible d'exporter une image en format JPG.
- [x] Il est possible d'exporter une image en format PNG.
- [x] Il est possible d'appliquer un filtre à l'image exportée.
- [x] Un choix d'au moins 5 filtres _sensiblement_ différents est offert.
- [x] Les différents filtres sont clairement identifiés pour leur sélection.
- [x] Un seul filtre est appliqué à l'image exportée.
- [x] Il est possible d'entrer un nom pour le fichier exporté.
- [x] Il est possible de voir une vignette de prévisualisation de l'image à exporter.
- [x] Un bouton de confirmation doit être présent pour exporter l'image.

### Commentaires

## Carrousel de dessins 6.47/8 - 0.8

- [x] Il est possible de voir les dessins sauvegardés sur un serveur via le carrousel de dessins.
- [x] Il est possible d'ouvrir la fenêtre du carrousel avec le raccourci `CTRL + G`.
- [x] Le carrousel doit présenter 3 fiches à la fois.
- [x] Le carrousel doit gérer les cas oũ moins de 3 dessins sont disponibles.
- [x] Il est possible de faire défiler le carrousel en boucle avec les touches du clavier.
- [x] Il est possible de faire défiler le carrousel en boucle avec des boutons présents dans l'interface.
- [x] Une seule fenêtre modale parmi: (sauvegarder, carrousel et exporter) peut être affichée en même temps (pas de _stack_ non plus).
- [x] Les différent raccourcis ne sont pas disponibles lorsque cette fenêtre est affichée.
- [x] Chaque fiche de dessin comporte un nom, des étiquettes (s'il y en a) et un aperçu du dessin en format réduit.
- [x] Le nom, les étiquettes et l'aperçu doivent être ceux qui ont été définis lorsque l'utilisateur les a sauvegardé.
- [x] Lors des requêtes pour charger les dessins dans la liste, un élément de chargement doit indiquer que la requête est en cours.
- [x] La liste doit être chargeable sans délai excessif.
- [x] Il est possible de filtrer les dessins par leurs étiquettes. Voir la carte **Filtrage par étiquettes**.
- [x] Il est possible de charger un dessin en cliquant sur sa fiche.
- [ ] Si un dessin choisi ne peut pas être ouvert, l'utilisateur doit être invité à choisir un autre via la même fenêtre modale.
- [x] Si un dessin présent non-vide est sur la zone de travail, l'utilisateur doit recevoir une alerte confirmant ou non vouloir abandonner ses changements.
- [ ] Il est possible de supprimer un dessin à l'aide d'un bouton de suppression.
- [ ] Lorsqu'un dessin est supprimé, le carrousel doit se mettre automatiquement à jour et ne doit plus contenir ce dessin .
- [ ] Si un dessin choisi ne peut pas être supprimé, l'utilisateur doit être informé de la raison et le carrousel doit être mis à jour.
- [x] Lorsqu'un dessin est sauvegardé, _au moins à_ la prochaine ouverture, le carrousel doit pouvoir afficher le nouveau dessin sauvegardé.
- [x] Les anciens paramètres d'ouverture ne sont plus visibles lors de la réouverture du carrousel (les paramètres sont remis à leur état original). _ie: pas de filtre d'activé_

### Commentaires

J'ai beaucoup de problème avec la mise à jour et la suppression de dessin dans le carrousel. Vous pouvez venir me voir à la prochaine periode de TP pour que je vous montre mes problèmes. Aucune vérification de l'ouverture et supression de dessin.

## Base de données 5/6 - 0.83

- [x] Il est possible de sauvegarder le nom et les tags d'un nouveau dessin sur une base de données MongoDB.
- [x] La base de données est à distance et non localement sur la machine du serveur.
- [x] Lorsqu'un dessin est supprimé par un utilisateur, la base de données est mise à jour.
- [x] Le client est capable de récupérer l'information d'un ou plusieurs dessins à partir de la base de données.
- [x] La récupération de données se fait à partir de la base de données et non des fichiers locaux.
- [ ] Si la base de données contient des informations sur des dessins non-existants sur le serveur, ces dessins ne sont pas montrés à l'utilisateur.

### Commentaires

Aucune logique au niveau du serveur vérifie que les dessins sont existants.

## Sauvegarder le dessin sur serveur 7.42/8 - 0.92

- [x] Il est possible de sauvegarder le dessin sur un serveur via une fenêtre de sauvegarde.
- [x] Il est possible de sauvegarder le dessin en formant PNG.
- [x] Il est possible d'ouvrir la fenêtre de sauvegarde avec le raccourci `CTRL + S`.
- [x] Une seule fenêtre modale parmi: (sauvegarder, ouvrir et exporter) peut être affichée en même temps (pas de _stack_ non plus)
- [x] Les différent raccourcis ne sont pas disponibles lorsque cette fenêtre est affichée.
- [x] Il est possible d'associer un nom au dessin à sauvegarder.
- [x] Il est possible d'associer zéro ou plusieurs étiquettes au dessin.
- [x] Il est possible d'enlever les étiquettes si elles sont choisies dans la fenêtre.
- [x] Il est possible de sauvegarder des dessins avec le même nom et avec les mêmes étiquettes (cette condition simultanément ou non) dans le serveur.
- [ ] Les règles de validation pour les étiquettes sont clairement présentées dans l'interface.
- [x] Des vérifications (client ET serveur) sont présentes pour la sauvegarde. _Vérification minimale: nom non vide et étiquettes valides_
- [x] S'il est impossible de sauvegarder le dessin, l'utilisateur se fait mettre au courant avec un message pertinent (message d'erreur).
- [x] Un bouton de confirmation doit être présent pour sauvegarder le dessin.
- [x] La modale de sauvegarde (ou du moins le bouton de confirmation) est mise non disponbile lorsque le dessin est en pleine sauvegarde.

### Commentaires

La longeur du text pour l'étiquette n'est pas lié à la bonne case.

## Filtrage par étiquettes 6/6 - 1

- [x] Il doit être possible de filtrer les dessins en utilisant des étiquettes.
- [x] Pour chaque dessin de la liste, les étiquettes, si présentes, doivent toutes être visibles (via un mécanisme de votre choix).
- [x] Le filtrage par étiquette - Lorsque vide, tous les dessins doivent être possibles d'être chargés. _ie: pas d'étiquette, pas de filtre_.
- [x] Le filtrage par étiquette - Lorsqu'une étiquette est sélectionnée pour filtrage, seulement les dessins sur le serveur avec cette étiquette sont visibles dans le carrousel.
- [x] Le filtrage par étiquette - Lorsque mutliples étiquettes sont sélectionnées pour filtrage, seulement les dessins sur le serveur qui contiennent au moins une des étiquettes doivent être visibles dans la liste (_OU_ logique).
- [x] Il doit être possible d'accéder à tous les dessins du carrousel, pour un critère de recherche donné.
- [x] Si aucun dessin n'est trouvable par les étiquettes sélectionnées, l'utilisateur doit en être informé.
- [x] Les anciens paramètres d'ouverture ne sont plus visibles lors de la réouverture du carrousel (les paramètres sont remis à leur état original). _ie: pas de filtre d'activé_

### Commentaires

## Selection

- 0.05 formation d'un carré ou cercle doit s'effectué seulement si le bouton shift est appuyé,
- 0.05 on ne peut pas sélectionné les bordures du canvas

## Sceau de peinture

- Bug: L'algorithme n'a pas l'air d'utiliser les couleurs donc lorsqu'on trace un rectangle avec un contour blanc (donc pas visible) et qu'on essaye de colorier toute la surface de dessin (apres un undo) avec du rouge p.e. on a toujours un rectangle blanc affiché. (Vous pouvez venir me voir si ce le problème n'est pas clair)

## Annuler-refaire

- Vos tests devraient inclure une vérification de l'état de la pile.

# QA

## Qualité des classes /14

### La classe n'a qu'une responsabilitée et elle est non triviale.

**2/3**  
_Commentaires :_

signOf tool.ts devrait faire partie d'une classe proprité mathématique
toolbar.service.ts semble etre un toolmanager en même temps

### Le nom de la classe est approprié. Utilisation appropriée des suffixes ({..}Component,{..}Controller, {..}Service, etc.). Le format à utiliser est le PascalCase

**2/2**  
_Commentaires :_

### La classe ne comporte pas d'attributs inutiles (incluant des getter/setter inutiles). Les attributs ne représentent que des états de la classe. Un attribut utilisé seulement dans les tests ne devrait pas exister.

**1.75/3**  
_Commentaires :_

tagEmpty, drawingTitle, drawings, tagToAdd upload-dialog.component.ts
getOpacity et opacity color.ts

### La classe minimise l'accessibilité des membres (public/private/protected)

**0/2**  
_Commentaires :_

resize-command.ts copy
shape-tool.ts plusieurs attributs peuvent être protected
create-new-drawing.component.ts drawingService peut être privé
resizeCommand drawing.component.ts
polygonService polygon.component.ts
rectangleService rectangle.component.ts
fireBaseService upload-dialog.component.ts
ref, task, id, name, canvasData fire-base.service.ts
primaryColor, secondaryColor ... toolbar.service.ts

### Les valeurs par défaut des attributs de la classe sont initialisés de manière consistante (soit dans le constructeur partout, soit à la définition)

**4/4**  
_Commentaires :_

## Qualité des fonctions /13

### Les noms des fonctions sont précis et décrivent les tâches voulues. Le format à utiliser doit être uniforme dans tous les fichiers (camelCase, PascalCase, ...)

**1.5/2**  
_Commentaires :_

setPointeSize afficherSegementPreview ajustementAngle clearlock line.service.ts

### Chaque fonction n'a qu'une seule utilité, elle ne peut pas être fragmentée en plusieurs fonctions et elle est facilement lisible.

**1.75/3**  
_Commentaires :_

onResize drawing.component.ts
setPreviewFilter export-drawing-dialog.component.ts
polygon.service.ts draw
move-selection.service.ts checkArrowKeysPressed

### Les fonctions minimisent les paramètres en entrée (pas plus de trois). Utilisation d'interfaces ou de classe pour des paramètres pouvant être regroupé logiquement.

**2.75/3**  
_Commentaires :_

canvasEmpty utilise toujours les même attributs de classes en paramêtres drawing.service.ts

### Les fonctions sont pures lorsque possible. Les effets secondaires sont minimisés

**3/3**  
_Commentaires :_

### Tous les paramètres de fonction sont utilisés

**2/2**  
_Commentaires :_

## Exceptions /4

### Les exceptions sont claires et spécifiques (Pas d'erreurs génériques). Les messages d'erreur affichés à l'utilisateur sont compréhensible pour l'utilisateur moyen (pas de code d'erreur serveur, mais plutôt un message descriptif du genre "Un problème est survenu lors de la sauvegarde du dessin")

**2/2**  
_Commentaires :_

### Toute fonction doit gérer les valeurs limites de leurs paramètres

**1/1**  
_Commentaires :_

### Tout code asynchrone (Promise, Observable ou Event) doit être géré adéquatement.

**0.5/1**  
_Commentaires :_

getDrawing, deleteDrawing gallery-dialog.component.ts ne gère pas les erreurs

## Qualité générale

- #29: create-new-drawing.component.ts(15), gallery-dialog.component.ts(83), eyedropper.service.ts(61)
- #33: color.ts(12, 93, 100, 107, 130, 134), tool.ts(59), ellipse.component.ts(27), pencil.component.ts(20), polygon.component.ts(29, 34), rectangle.component.ts(27), thickness-slider.component.ts(16), bucket.service.ts(84, 129), line-service.ts(116, 123), polygon.service.ts(90)
- #35: line.service.ts(132), selection.service.ts(32), drawing.service.ts(31)
- #36: selection.service.ts(73)
- #39: Devrait être pencil.service; devrait être fire-base pas firebase
- #47: tslint:disable-next-line: adjacent-overload-signatures inutile et non justifié (vous pouvez simplement à mettre le seter juste apres le getter du meme nom pour enlever l'erreur)
- #48: Très peu utilisé
