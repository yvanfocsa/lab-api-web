# Spécifications Techniques et Fonctionnelles (SPECS.md)

Ce document décrit les spécifications de l'API REST développée avec Node.js et Express pour le TP *Web API with Node.js*.

---

## 1. Vue d'ensemble du projet

L'application est un serveur d'API REST modulaire sous Express fournissant la gestion d'articles, de recettes de cuisine et de leurs commentaires respectifs, avec persistance en mémoire et génération d'identifiants uniques UUID v4.

### 1.1 Objectifs
- Migration d'un serveur HTTP natif vers une architecture **Express** modulaire.
- Utilisation de `express.Router` et du support des paramètres imbriqués (`mergeParams: true`).
- Gestion des verbes HTTP standards (`GET`, `POST`) et des codes de statut (`200 OK`, `201 Created`, `400 Bad Request`, `404 Not Found`).
- Couverture complète par des tests unitaires et d'intégration avec **Mocha** et **SuperTest**.
- Analyse comparative de **GraphQL** face à REST.

---

## 2. Modèles de Données

### 2.1 Article
```typescript
interface Article {
  id: string;        // UUID v4
  title: string;     // Titre de l'article (obligatoire)
  content: string;   // Corps de l'article (obligatoire)
  date: string;      // Date au format JJ/MM/AAAA
  author: string;    // Nom de l'auteur (obligatoire)
}
```

### 2.2 Recette (`headers/recettes.js`)
```typescript
interface Recette {
  id: string;             // UUID v4
  title: string;          // Nom du plat / de la recette (obligatoire)
  content: string;        // Instructions de préparation (obligatoire)
  ingredients: string[];  // Liste des ingrédients
  date: string;           // Date au format JJ/MM/AAAA
  author: string;         // Chef / Auteur (obligatoire)
}
```

### 2.3 Commentaire
```typescript
interface Commentaire {
  id: string;             // UUID v4
  timestamp: number;      // Horodatage UNIX en millisecondes (Date.now())
  content: string;        // Texte du commentaire (obligatoire)
  articleId?: string;     // ID de l'article associé (optionnel si lié à une recette)
  recetteId?: string;     // ID de la recette associée (optionnel si lié à un article)
  author: string;         // Auteur du commentaire (obligatoire)
}
```

---

## 3. Spécification des Endpoints REST

### 3.1 Racine & Routes Générales

| Méthode | Endpoint | Description | Réponses possibles |
| :--- | :--- | :--- | :--- |
| `GET` | `/` | Cartographie des routes de l'API | `200 OK` (JSON) |
| `GET` | `/hello` | Salutation anonyme ou via `?name=...` | `200 OK` (Texte) |
| `GET` | `/hello/:name` | Salutation personnalisée via paramètre de route | `200 OK` (Texte) |
| `GET` | `/about` | Contenu dynamique issu de `content/about.json` | `200 OK` (JSON), `404 Not Found` |

### 3.2 Articles (`/articles`)

#### `GET /articles`
- **Description :** Retourne l'ensemble des articles enregistrés.
- **Réponse :** `200 OK` avec un tableau d'objets `Article`.

#### `POST /articles`
- **Description :** Enregistre un nouvel article.
- **Entête :** `Content-Type: application/json`
- **Corps :** `{ "title": string, "content": string, "author": string, "date"?: string }`
- **Validation :** `title`, `content` et `author` sont obligatoires.
- **Génération automatique :** `id` (UUID v4) et `date` (si non fournie).
- **Réponses :**
  - `201 Created` : Renvoie l'objet créé.
  - `400 Bad Request` : Si des champs obligatoires sont manquants.

#### `GET /articles/:articleId`
- **Description :** Récupère un article spécifique.
- **Paramètre :** `articleId` (UUID)
- **Réponses :**
  - `200 OK` : Renvoie l'objet `Article`.
  - `404 Not Found` : Si l'identifiant n'existe pas.

### 3.3 Commentaires d'Articles (`/articles/:articleId/comments`)

#### `GET /articles/:articleId/comments`
- **Description :** Liste tous les commentaires d'un article.
- **Réponses :**
  - `200 OK` : Tableau de commentaires.
  - `404 Not Found` : Si l'article parent n'existe pas.

#### `POST /articles/:articleId/comments`
- **Description :** Ajoute un commentaire sur un article.
- **Corps :** `{ "content": string, "author": string }`
- **Génération automatique :** `id` (UUID v4) et `timestamp` (`Date.now()`).
- **Réponses :**
  - `201 Created` : Renvoie le commentaire créé.
  - `400 Bad Request` : Si `content` ou `author` est manquant.
  - `404 Not Found` : Si l'article parent n'existe pas.

#### `GET /articles/:articleId/comments/:commentId`
- **Description :** Récupère un commentaire spécifique d'un article.
- **Réponses :**
  - `200 OK` : Renvoie le commentaire.
  - `404 Not Found` : Si l'article ou le commentaire n'existe pas.

---

### 3.4 Recettes (`headers/recettes.js` monté sur `/recettes`)

#### `GET /recettes`
- **Description :** Liste toutes les recettes de cuisine.
- **Réponse :** `200 OK` avec un tableau d'objets `Recette`.

#### `POST /recettes`
- **Description :** Ajoute une nouvelle recette culinaire.
- **Corps :** `{ "title": string, "content": string, "author": string, "ingredients"?: string[] }`
- **Réponses :** `201 Created`, `400 Bad Request`.

#### `GET /recettes/:recetteId`
- **Description :** Récupère une recette par son identifiant.
- **Réponses :** `200 OK`, `404 Not Found`.

#### `GET /recettes/:recetteId/comments`
- **Description :** Liste tous les avis/commentaires d'une recette.
- **Réponses :** `200 OK`, `404 Not Found`.

#### `POST /recettes/:recetteId/comments`
- **Description :** Poste un commentaire/avis sur une recette.
- **Réponses :** `201 Created`, `400 Bad Request`, `404 Not Found`.

#### `GET /recettes/:recetteId/comments/:commentId`
- **Description :** Récupère un commentaire spécifique d'une recette.
- **Réponses :** `200 OK`, `404 Not Found`.

---

## 4. Spécification de la Suite de Tests

- **Framework :** Mocha v11.
- **Client HTTP de test :** SuperTest v7.
- **Module d'assertion :** `node:assert`.
- **Isolation des tests :** Utilisation d'un hook `beforeEach(() => db.reset())` pour garantir l'indépendance de chaque cas de test conformément aux règles du cours (éviter le couplage temporel ou d'état).
- **Couverture :** 27 tests vérifiant la totalité des chemins nominaux et d'erreurs (400, 404, 500).

---

## 5. Spécification Comparative GraphQL vs REST

| Critère | REST API | GraphQL API |
| :--- | :--- | :--- |
| **Point d'entrée** | Multiples URL (`/articles`, `/comments`, etc.) | URL unique (`/graphql` via `POST`) |
| **Over-fetching** | Schéma figé imposé par le serveur | Résolu : le client choisit précisément les champs |
| **Under-fetching (N+1)** | Nécessite plusieurs requêtes en chaîne | Résolu : récupération de l'article et de ses commentaires en 1 seule requête |
| **Typage & Schéma** | Schéma souvent externe (Swagger / OpenAPI) | Schéma fort obligatoire et auto-documenté |
