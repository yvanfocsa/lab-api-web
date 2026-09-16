# Lab: Web API with Node.js and Express

Projet réalisé dans le cadre du cours de Technologies Web Avancées à l'ECE Paris.

## 🎯 Objectifs

- Programmation côté serveur avec **Node.js**
- Création d'un serveur Web et d'une API REST avec **Express.js**
- Organisation modulaire du code avec `express.Router`
- Couverture de tests automatisés avec **Mocha** et **SuperTest**
- Compréhension et analyse comparative de **GraphQL** face à REST

---

## 📁 Structure du projet

```
serene-bose/
├── content/
│   └── about.json               # Contenu JSON dynamique hérité du Lab 1
├── src/
│   ├── app.js                   # Configuration Express, middlewares et routage
│   ├── server.js                # Point d'entrée pour démarrer le serveur HTTP
│   ├── db.js                    # Modèle de base de données en mémoire (articles & commentaires)
│   └── routes/
│       ├── general.js           # Routes migrées du Lab 1 (/hello, /about)
│       ├── articles.js          # Routes pour /articles
│       └── comments.js          # Sub-router pour /articles/:articleId/comments
├── test/
│   └── api.test.js              # Suite de 20 tests unitaires et d'intégration
├── .gitignore                   # Fichiers ignorés par Git
├── package.json                 # Dépendances et scripts npm
└── README.md                    # Documentation complète du projet
```

---

## 🚀 Installation et Démarrage

### Prérequis

- **Node.js** (v18+)
- **npm** (v9+)

### Installation des dépendances

```bash
npm install
```

### Lancement du serveur

```bash
npm start
```

Par défaut, le serveur écoute sur le port `8080` (ou sur la variable d'environnement `PORT` si définie, avec bascule automatique sur `3000` si le port est occupé).

---

## 🧪 Tests Automatisés (Partie 3 - Bonus)

Le projet intègre une suite de tests complète avec **Mocha** et **SuperTest** couvrant 100% des routes et des cas limites (succès, erreurs 400 et 404, isolation de l'état).

Pour lancer les tests :

```bash
npm test
```

Résultat d'exécution :
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
      ✔ GET /articles/:articleId/comments/:commentId should return 404 for non-existent article

  20 passing (50ms)
```

---

## 📡 Documentation de l'API REST

### 1. Routes Générales (Partie 1 - Réfracteur Lab 1)

#### `GET /`
Présentation de l'API et cartographie des endpoints.

#### `GET /hello`
- Sans paramètre : retourne `Hello anonymous`
- Avec paramètre de requête `?name=Alice` : retourne `Hello Alice`
- Avec nom étudiant `?name=Yvan` : retourne la présentation personnalisée.

#### `GET /hello/:name`
Support des paramètres d'URL (ex: `/hello/Alice`).

#### `GET /about`
Retourne le contenu JSON statique issu de `content/about.json`.

---

### 2. Gestion des Articles (`/articles`)

#### `GET /articles`
Retourne la liste de tous les articles.

```bash
curl -X GET http://localhost:8080/articles
```

**Réponse (`200 OK`) :**
```json
[
  {
    "id": "6ec0bd7f-11c0-43da-975e-2a8ad9ebae0b",
    "title": "My article",
    "content": "Content of the article.",
    "date": "04/10/2022",
    "author": "Liz Gringer"
  }
]
```

#### `POST /articles`
Crée un nouvel article. L'identifiant UUID et la date sont générés automatiquement si non fournis.

```bash
curl -X POST http://localhost:8080/articles \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Introduction à Express",
    "content": "Express facilite la création d APIs REST sous Node.js.",
    "author": "Yvan Focsa"
  }'
```

**Réponse (`201 Created`) :**
```json
{
  "id": "a90f1110-6c92-48a0-9eb9-b8832a8292c3",
  "title": "Introduction à Express",
  "content": "Express facilite la création d APIs REST sous Node.js.",
  "date": "16/09/2026",
  "author": "Yvan Focsa"
}
```

#### `GET /articles/:articleId`
Récupère un article via son identifiant unique.

```bash
curl -X GET http://localhost:8080/articles/6ec0bd7f-11c0-43da-975e-2a8ad9ebae0b
```

---

### 3. Gestion des Commentaires (`/articles/:articleId/comments`)

#### `GET /articles/:articleId/comments`
Récupère tous les commentaires associés à l'article spécifié.

```bash
curl -X GET http://localhost:8080/articles/6ec0bd7f-11c0-43da-975e-2a8ad9ebae0b/comments
```

**Réponse (`200 OK`) :**
```json
[
  {
    "id": "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d",
    "timestamp": 1664835049,
    "content": "Content of the comment.",
    "articleId": "6ec0bd7f-11c0-43da-975e-2a8ad9ebae0b",
    "author": "Bob McLaren"
  }
]
```

#### `POST /articles/:articleId/comments`
Ajoute un nouveau commentaire sur un article. L'UUID et le timestamp UNIX (`Date.now()`) sont générés automatiquement.

```bash
curl -X POST http://localhost:8080/articles/6ec0bd7f-11c0-43da-975e-2a8ad9ebae0b/comments \
  -H "Content-Type: application/json" \
  -d '{
    "content": "Excellent article, très instructif !",
    "author": "Jean Dupont"
  }'
```

**Réponse (`201 Created`) :**
```json
{
  "id": "787c88c9-0268-45a7-96a9-83569cffca87",
  "timestamp": 1789551582429,
  "content": "Excellent article, très instructif !",
  "articleId": "6ec0bd7f-11c0-43da-975e-2a8ad9ebae0b",
  "author": "Jean Dupont"
}
```

#### `GET /articles/:articleId/comments/:commentId`
Récupère un commentaire spécifique pour un article donné.

```bash
curl -X GET http://localhost:8080/articles/6ec0bd7f-11c0-43da-975e-2a8ad9ebae0b/comments/9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d
```

---

## 💡 Partie 4 : Synthèse et Découverte de GraphQL

En complément de l'architecture REST implémentée ci-dessus, cette section résume les principes et avantages fondamentaux de **GraphQL** par rapport à une API REST conventionnelle, en référence à l'article [Main advantages of GraphQL as an alternative to REST](https://www.adaltas.com/en/2018/11/27/graphql-advantages-over-rest/).

### 1. Résolution de l'Over-fetching et Under-fetching
- **Dans REST :** Un endpoint retourne un schéma d'objet figé. Si le front-end n'a besoin que du titre de l'article, il reçoit obligatoirement tout le contenu, l'auteur, la date, etc. (*Over-fetching*). Inversement, pour afficher un article et ses commentaires, le client doit effectuer plusieurs allers-retours HTTP : `GET /articles/:id` puis `GET /articles/:id/comments` (*Under-fetching* / problème *N+1*).
- **Dans GraphQL :** Le client déclare dans sa requête exactement les champs souhaités et peut imbriquer les relations :
  ```graphql
  query {
    article(id: "6ec0bd7f-11c0-43da-975e-2a8ad9ebae0b") {
      title
      comments {
        author
        content
      }
    }
  }
  ```
  Le serveur renvoie un JSON correspondant strictement à cette structure en une seule requête HTTP.

### 2. Point d'entrée unique (`/graphql`) vs Multiples endpoints REST
- En REST, chaque ressource ou relation nécessite un endpoint spécifique (`/articles`, `/articles/:id`, `/articles/:id/comments`, etc.).
- En GraphQL, toutes les requêtes (requêtes de lecture `queries` ou d'écriture `mutations`) sont adressées à un unique endpoint en `POST /graphql`.

### 3. Schéma fort et documentation dynamique
- GraphQL impose un schéma fortement typé (types d'objets, scalaires, mutations).
- Ce contrat d'interface permet une auto-documentation native, l'introspection du schéma et des outils de développement avancés (comme GraphiQL ou Apollo Explorer) facilitant l'intégration entre équipes front-end et back-end.

---

## 📌 Bonnes Pratiques & Git

Le projet applique rigoureusement la convention [Conventional Commits](https://www.conventionalcommits.org) :
- `chore:` maintenance de configuration et dépendances
- `feat:` nouvelles fonctionnalités et routeurs Express
- `test:` couverture par tests automatisés
- `docs:` documentation technique et rapport d'apprentissage
