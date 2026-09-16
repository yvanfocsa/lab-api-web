# Spécifications fonctionnelles et techniques

Ce document formalise les règles d'architecture, les structures de données et le comportement attendu des endpoints de l'API REST développée avec Express.

## Présentation générale

L'application fournit une API REST dédiée à la consultation et à l'édition d'articles, de recettes de cuisine et de leurs commentaires respectifs. L'ensemble des données est conservé en mémoire pendant la durée d'exécution du processus. Chaque ressource créée reçoit un identifiant unique généré au format UUID v4.

Les objectifs du projet couvrent trois aspects essentiels :
- Construire une architecture modulaire en s'appuyant sur la méthode `Router` d'Express.
- Respecter les conventions HTTP pour les méthodes, les paramètres d'URL et les codes de statut.
- Valider la conformité de chaque route à l'aide d'une suite de tests automatisés rapides et indépendants.

## Structures de données

### Article

```typescript
interface Article {
  id: string;        // Identifiant unique UUID v4
  title: string;     // Titre de la publication
  content: string;   // Corps du texte
  date: string;      // Date au format JJ/MM/AAAA
  author: string;    // Nom de l'auteur
}
```

### Recette

```typescript
interface Recette {
  id: string;             // Identifiant unique UUID v4
  title: string;          // Nom de la recette
  content: string;        // Instructions de préparation
  ingredients: string[];  // Liste des ingrédients nécessaires
  date: string;           // Date au format JJ/MM/AAAA
  author: string;         // Nom du chef ou de l'auteur
}
```

### Commentaire

```typescript
interface Commentaire {
  id: string;             // Identifiant unique UUID v4
  timestamp: number;      // Horodatage UNIX en millisecondes (Date.now())
  content: string;        // Contenu du message
  articleId?: string;     // Rapprochement avec un article
  recetteId?: string;     // Rapprochement avec une recette
  author: string;         // Nom de l'auteur du commentaire
}
```

## Spécification des routes

### Routes générales

#### Consultation de l'accueil
- **Route :** `GET /`
- **Rôle :** Retourne un aperçu du service et l'inventaire des routes disponibles.
- **Réponse :** Code `200 OK` avec un objet JSON décrivant les chemins d'accès.

#### Salutation
- **Route :** `GET /hello` et `GET /hello/:name`
- **Rôle :** Retourne un texte simple de salutation. Le nom peut être transmis en paramètre de requête (`?name=Alice`) ou directement dans le chemin (`/hello/Alice`).
- **Réponse :** Code `200 OK` avec un texte brut.

#### Informations statiques
- **Route :** `GET /about`
- **Rôle :** Lit et renvoie le contenu du fichier `content/about.json`.
- **Réponses :** Code `200 OK` avec le document JSON lu, ou `404 Not Found` en cas de fichier introuvable.

### Gestion des articles

#### Lister les articles
- **Route :** `GET /articles`
- **Rôle :** Renvoie la collection complète des articles enregistrés.
- **Réponse :** Code `200 OK` avec un tableau d'articles.

#### Ajouter un nouvel article
- **Route :** `POST /articles`
- **Format du corps :** JSON obligatoire, encodé en UTF-8.
- **Champs attendus :** `title` (chaîne), `content` (chaîne), `author` (chaîne). Le champ `date` est optionnel.
- **Traitement :** Validation des champs obligatoires, génération d'un UUID v4, puis ajout en mémoire.
- **Réponses :**
  - Code `201 Created` : L'objet créé est renvoyé avec son identifiant et sa date.
  - Code `400 Bad Request` : Si un ou plusieurs champs obligatoires sont omis.

#### Obtenir un article par identifiant
- **Route :** `GET /articles/:articleId`
- **Paramètre :** `articleId` correspond à l'identifiant de la ressource.
- **Réponses :**
  - Code `200 OK` : L'article correspondant est retourné.
  - Code `404 Not Found` : Si aucun article ne correspond à l'identifiant demandé.

### Commentaires rattachés aux articles

Le routeur de commentaires est monté sur le préfixe `/articles/:articleId/comments`. Il active l'option `mergeParams: true` pour accéder directement à l'identifiant de l'article parent.

#### Lister les commentaires d'un article
- **Route :** `GET /articles/:articleId/comments`
- **Réponses :**
  - Code `200 OK` : Tableau des commentaires filtrés pour cet article.
  - Code `404 Not Found` : Si l'article parent n'existe pas.

#### Ajouter un commentaire à un article
- **Route :** `POST /articles/:articleId/comments`
- **Champs attendus :** `content` (chaîne) et `author` (chaîne).
- **Traitement :** Contrôle d'existence de l'article, contrôle des champs, génération d'un UUID v4 et d'un horodatage UNIX.
- **Réponses :**
  - Code `201 Created` : Le commentaire créé est retourné.
  - Code `400 Bad Request` : Données incomplètes.
  - Code `404 Not Found` : Article parent inexistant.

#### Consulter un commentaire précis
- **Route :** `GET /articles/:articleId/comments/:commentId`
- **Réponses :**
  - Code `200 OK` : Le commentaire ciblé est retourné.
  - Code `404 Not Found` : Si l'article ou le commentaire n'existe pas, ou si le commentaire ne correspond pas à l'article spécifié.

### Gestion des recettes et avis

Le module `headers/recettes.js` reproduit les mêmes exigences de robustesse et de validation pour le domaine culinaire.

#### Lister les recettes
- **Route :** `GET /recettes`
- **Réponse :** Code `200 OK` avec le tableau des recettes.

#### Ajouter une recette
- **Route :** `POST /recettes`
- **Champs attendus :** `title`, `content`, `author`, et optionnellement le tableau `ingredients`.
- **Réponses :** Code `201 Created` en cas de succès, Code `400 Bad Request` si les données obligatoires manquent.

#### Consulter une recette
- **Route :** `GET /recettes/:recetteId`
- **Réponses :** Code `200 OK` avec la recette, ou Code `404 Not Found`.

#### Commentaires de recettes
- **`GET /recettes/:recetteId/comments`** : Retourne la liste des avis (Code `200 OK` ou `404 Not Found`).
- **`POST /recettes/:recetteId/comments`** : Ajoute un avis horodaté (Code `201 Created`, `400 Bad Request` ou `404 Not Found`).
- **`GET /recettes/:recetteId/comments/:commentId`** : Retourne l'avis demandé (Code `200 OK` ou `404 Not Found`).

## Validation et protocole de test

Les tests s'appuient sur le couple Mocha et SuperTest, avec les assertions natives du module `node:assert`.

### Principes d'isolation

Pour respecter les standards recommandés par l'équipe pédagogique et éviter les effets de bord entre scénarios, la base de données est réinitialisée avant chaque test via la méthode `db.reset()`. Les tests restent ainsi prévisibles, quelle que soit leur séquence d'exécution.

### Couverture fonctionnelle

La suite de tests vérifie systématiquement :
- La bonne réception des requêtes valides (statuts `200` et `201`).
- Le rejet des payloads incomplets avec le statut `400`.
- Le traitement des ressources inexistantes avec le statut `404`.
- L'intégrité des structures JSON renvoyées par chaque route.

## Principes clés du comparatif GraphQL

1. **Contrôle de la granularité :** GraphQL élimine le surplus de données (over-fetching) en permettant au client de sélectionner uniquement les champs dont il a besoin pour son affichage.
2. **Réduction des requêtes :** Une requête GraphQL peut charger une recette et l'ensemble de ses commentaires simultanément, évitant ainsi le problème du N+1 propre aux approches REST séquentielles.
3. **Contrat strict :** Le schéma GraphQL sert de spécification vivante, typée et vérifiable par les outils de développement.
