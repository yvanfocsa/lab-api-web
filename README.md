# Web API Express

API REST modulaire développée avec Node.js et Express dans le cadre du cours de Technologies Web Avancées à l'ECE Paris.

Le projet met en place une architecture organisée en routeurs distincts, gère des collections d'articles, de recettes et de commentaires stockées en mémoire, et s'appuie sur une suite complète de tests automatisés.

## Sommaire

1. [Architecture](#architecture)
2. [Installation et exécution](#installation-et-exécution)
3. [Endpoints de l'API](#endpoints-de-lapi)
4. [Tests automatisés](#tests-automatisés)
5. [Comparatif GraphQL et REST](#comparatif-graphql-et-rest)
6. [Spécifications et guide de développement](#spécifications-et-guide-de-développement)

## Architecture

L'arborescence sépare la logique de configuration réseau, les routes modulaires et la couche de données en mémoire.

```
serene-bose/
├── index.js              # Point d'entrée du serveur HTTP
├── headers/              # Routeurs modulaires Express
│   ├── recettes.js       # Gestion des recettes et de leurs commentaires
│   ├── articles.js       # Gestion des articles
│   ├── comments.js       # Sous-routeur des commentaires d'articles
│   └── general.js        # Routes héritées (/hello, /about)
├── handlers/             # Alias miroir pour compatibilité
├── src/
│   ├── app.js            # Initialisation de l'application Express et middlewares
│   ├── server.js         # Script alternatif de lancement
│   ├── db.js             # Modèle de données en mémoire avec reset()
│   └── routes/           # Implémentations d'origine des routes
├── content/
│   └── about.json        # Fichier JSON statique pour la route /about
├── test/
│   └── api.test.js       # Suite de 27 tests avec Mocha et SuperTest
├── SPECS.md              # Spécifications fonctionnelles et techniques
├── AGENTS.md             # Guide d'exploitation du dépôt
└── package.json          # Dépendances et commandes npm
```

## Installation et exécution

### Prérequis

Node.js (version 18 ou supérieure) et npm.

### Installation

```bash
npm install
```

### Démarrage

```bash
npm start
```

Le serveur écoute par défaut sur le port `8080` ou sur la valeur définie par la variable `PORT`. Si ce port est déjà réservé par un autre processus, l'application bascule automatiquement sur le port `3000`.

## Endpoints de l'API

### Routes générales

| Méthode | Route | Description |
| :--- | :--- | :--- |
| `GET` | `/` | Présentation du service et liste des routes actives |
| `GET` | `/hello` | Salutation anonyme ou ciblée avec le paramètre `?name=` |
| `GET` | `/hello/:name` | Salutation avec paramètre d'URL |
| `GET` | `/about` | Lecture et retour du fichier `content/about.json` |

Exemple :

```bash
curl -s "http://localhost:8080/hello?name=Alice"
```

### Articles

Le service permet de consulter et créer des articles. Chaque ressource possède un identifiant unique généré au format UUID v4.

#### Lister les articles
```bash
curl -s http://localhost:8080/articles
```

#### Créer un article
```bash
curl -s -X POST http://localhost:8080/articles \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Architecture Express",
    "content": "Organisation modulaire des routes et gestion des middlewares.",
    "author": "Yvan Focsa"
  }'
```

Champs requis dans le corps de requête : `title`, `content` et `author`. La date est complétée automatiquement au format local si elle n'est pas transmise.

#### Consulter un article par son identifiant
```bash
curl -s http://localhost:8080/articles/6ec0bd7f-11c0-43da-975e-2a8ad9ebae0b
```

Si l'article est absent, l'API renvoie le code HTTP `404`.

### Commentaires d'articles

Les commentaires sont directement rattachés à un article via l'identifiant de ce dernier.

#### Consulter les commentaires d'un article
```bash
curl -s http://localhost:8080/articles/6ec0bd7f-11c0-43da-975e-2a8ad9ebae0b/comments
```

#### Ajouter un commentaire
```bash
curl -s -X POST http://localhost:8080/articles/6ec0bd7f-11c0-43da-975e-2a8ad9ebae0b/comments \
  -H "Content-Type: application/json" \
  -d '{
    "content": "Explications précises et code bien structuré.",
    "author": "Camille"
  }'
```

Le serveur génère un identifiant unique et enregistre l'horodatage UNIX précis de la création via `Date.now()`.

#### Consulter un commentaire précis
```bash
curl -s http://localhost:8080/articles/6ec0bd7f-11c0-43da-975e-2a8ad9ebae0b/comments/9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d
```

### Recettes

Le module `headers/recettes.js` expose un ensemble dédié aux recettes culinaires et aux avis associés.

#### Lister les recettes
```bash
curl -s http://localhost:8080/recettes
```

Format d'une entrée :
```json
{
  "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "title": "Tarte aux pommes rustique",
  "content": "Pâte feuilletée fine, compote maison et fines tranches de pommes dorées.",
  "ingredients": ["Pommes Golden", "Pâte feuilletée", "Sucre de canne", "Beurre doux", "Cannelle"],
  "date": "16/09/2026",
  "author": "Chef Yvan"
}
```

#### Créer une recette
```bash
curl -s -X POST http://localhost:8080/recettes \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Moelleux au citron",
    "content": "Zestes frais, jus pressé et cuisson lente au four.",
    "ingredients": ["Citrons bio", "Farine", "Oeufs", "Sucre", "Beurre"],
    "author": "Yvan Focsa"
  }'
```

#### Consulter et commenter une recette
- `GET /recettes/:recetteId` : consultation d'une recette par son identifiant.
- `GET /recettes/:recetteId/comments` : liste des avis déposés.
- `POST /recettes/:recetteId/comments` : ajout d'un avis (`content`, `author`).
- `GET /recettes/:recetteId/comments/:commentId` : lecture d'un avis précis.

## Tests automatisés

La suite de tests s'exécute avec Mocha et SuperTest. SuperTest injecte directement les requêtes HTTP dans l'application sans monopoliser de port réseau, ce qui garantit des exécutions rapides et fiables.

La méthode `db.reset()` s'exécute avant chaque scénario de test pour réinitialiser la base de données. Chaque test s'exécute ainsi de manière autonome, sans dépendre de l'état laissé par les scénarios précédents.

Pour lancer la suite :

```bash
npm test
```

Résultat attendu :

```text
  Web API with Express Tests
    Part 1: Refactored routes from previous lab
      ✔ GET / should return 200 with API routes overview
      ✔ GET /hello should return anonymous greeting
      ✔ GET /hello?name=Alice should return personalized greeting with query param
      ✔ GET /hello/Bob should return personalized greeting with route param
      ✔ GET /hello?name=Yvan should return student presentation
      ✔ GET /about should return JSON content from content/about.json
      ✔ GET /unknown-route should return 404
    Part 2: Articles API (/articles)
      ✔ GET /articles should list all articles
      ✔ GET /articles/:articleId should return an article by ID
      ✔ GET /articles/:articleId should return 404 when article does not exist
      ✔ POST /articles should create a new article with generated UUID and date
      ✔ POST /articles should return 400 when required fields are missing
    Part 2: Comments API (/articles/:articleId/comments)
      ✔ GET /articles/:articleId/comments should return all comments for an article
      ✔ GET /articles/:articleId/comments should return 404 if article does not exist
      ✔ POST /articles/:articleId/comments should add a new comment with UUID and timestamp
      ✔ POST /articles/:articleId/comments should return 404 when target article does not exist
      ✔ POST /articles/:articleId/comments should return 400 if required fields are missing
      ✔ GET /articles/:articleId/comments/:commentId should return the specific comment
      ✔ GET /articles/:articleId/comments/:commentId should return 404 for non-existent comment
    Headers / Recettes API (/recettes)
      ✔ GET /recettes should return the list of recipes
      ✔ GET /recettes/:recetteId should return a recipe by ID
      ✔ GET /recettes/:recetteId should return 404 if recipe not found
      ✔ POST /recettes should create a recipe with UUID
      ✔ POST /recettes should return 400 when missing fields
      ✔ GET /recettes/:recetteId/comments should return comments for that recipe
      ✔ POST /recettes/:recetteId/comments should create comment for recipe
      ✔ GET /recettes/:recetteId/comments/:commentId should return specific comment

  27 passing (58ms)
```

## Comparatif GraphQL et REST

Cette section synthétise les différences architecturales entre REST et GraphQL, en s'appuyant sur l'article technique recommandé par Adaltas.

### Précision des données

En REST, chaque point d'accès renvoie une structure de données prédéfinie. Lorsqu'un client mobile souhaite seulement afficher les titres d'une liste d'articles, le serveur transmet tout de même les textes complets, les auteurs et les dates. Ce surplus inutile s'appelle l'over-fetching.

Avec GraphQL, le client formule sa demande en précisant uniquement les champs nécessaires. Le serveur adapte sa réponse au strict besoin du demandeur, ce qui allège la charge réseau.

### Nombre d'allers-retours réseau

Pour afficher un article et la liste de ses commentaires en REST, l'application effectue souvent deux requêtes distinctes : une première vers `/articles/:id`, puis une seconde vers `/articles/:id/comments`. Sur un réseau mobile instable, cette succession de requêtes augmente la latence ressentie.

GraphQL traite les relations au sein d'une seule requête. Le client demande l'article et ses commentaires imbriqués en un appel unique vers le serveur :

```graphql
query GetArticleDetails {
  article(id: "6ec0bd7f-11c0-43da-975e-2a8ad9ebae0b") {
    title
    content
    comments {
      author
      content
      timestamp
    }
  }
}
```

### Point d'accès et contrat d'interface

Une API REST distribue ses fonctionnalités sur de multiples URL associées aux méthodes HTTP (`GET`, `POST`, `PUT`, `DELETE`). 

À l'inverse, GraphQL utilise un point d'accès unique, généralement exposé en `POST /graphql`. L'ensemble des opérations s'appuie sur un schéma fortement typé qui décrit les objets, les champs et les mutations possibles. Ce schéma sert de documentation vivante et permet aux outils de développement de détecter les erreurs de syntaxe dès la phase de saisie.

## Spécifications et guide de développement

- Le fichier [SPECS.md](./SPECS.md) détaille les structures de données, les codes d'état attendus et les règles de validation.
- Le fichier [AGENTS.md](./AGENTS.md) fournit le contexte de développement et les instructions de maintenance à destination des assistants de code.
