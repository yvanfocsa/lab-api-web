# Lab: Web API with Node.js and Express

Projet réalisé dans le cadre du cours de **Technologies Web Avancées** à l'ECE Paris.

Ce dépôt implémente une API REST modulaire avec Express, une suite de 27 tests automatisés (Mocha & SuperTest), une base de données en mémoire avec support des articles, recettes et commentaires, ainsi qu'une documentation exhaustive.

---

## 📑 Sommaire

1. [Architecture & Fichiers](#-architecture--fichiers)
2. [Installation & Démarrage](#-installation--démarrage)
3. [Documentation de l'API REST](#-documentation-de-lapi-rest)
4. [Tests Automatisés (Partie 3 - Bonus)](#-tests-automatisés-partie-3---bonus)
5. [Synthèse Comparative GraphQL vs REST (Partie 4)](#-synthèse-comparative-graphql-vs-rest-partie-4)
6. [Spécifications & Guide Agent IA](#-spécifications--guide-agent-ia)
7. [Conventions Git](#-conventions-git)

---

## 📁 Architecture & Fichiers

```
serene-bose/
├── index.js                     # Point d'entrée principal du serveur HTTP
├── headers/                     # Modules de routage / handlers modulaires
│   ├── recettes.js              # Routeur Express pour les recettes et leurs commentaires
│   ├── articles.js              # Routeur pour les articles
│   ├── comments.js              # Routeur imbriqué pour les commentaires
│   └── general.js               # Routes issues du Lab 1 (/hello, /about)
├── handlers/                    # Alias miroir pour compatibilité
├── src/
│   ├── app.js                   # Application Express, middlewares et enregistrement des routes
│   ├── server.js                # Lanceur alternatif
│   ├── db.js                    # Base de données en mémoire avec méthode db.reset()
│   └── routes/                  # Routeurs source d'origine
├── content/
│   └── about.json               # Données statiques JSON migrées du Lab 1
├── test/
│   └── api.test.js              # 27 tests unitaires et d'intégration (Mocha + SuperTest)
├── SPECS.md                     # Cahier des charges et spécifications techniques détaillées
├── AGENTS.md                    # Directives d'exploitation pour assistants et agents IA
├── package.json                 # Métadonnées, dépendances et scripts npm
├── .gitignore                   # Exclusion de node_modules, logs, etc.
└── README.md                    # Guide général du projet
```

---

## 🚀 Installation & Démarrage

### Prérequis
- **Node.js** (v18+)
- **npm** (v9+)

### 1. Installation des dépendances
```bash
npm install
```

### 2. Démarrage du serveur
```bash
npm start
```
Le serveur démarrera sur le port `8080` (ou sur la valeur de la variable `PORT`). En cas de conflit de port, il basculera automatiquement sur le port de repli `3000`.

---

## 📡 Documentation de l'API REST

### 1. Routes Générales (Réfracteur Lab 1)

| Méthode | Route | Description | Exemple |
| :--- | :--- | :--- | :--- |
| `GET` | `/` | Vue d'ensemble et liste des routes | `curl http://localhost:8080/` |
| `GET` | `/hello` | Salutation anonyme ou via query `?name=...` | `curl "http://localhost:8080/hello?name=Alice"` |
| `GET` | `/hello/:name` | Salutation avec paramètre de route | `curl http://localhost:8080/hello/Bob` |
| `GET` | `/about` | Lecture dynamique de `content/about.json` | `curl http://localhost:8080/about` |

---

### 2. Gestion des Articles (`/articles`)

#### `GET /articles`
Renvoie la liste complète des articles.

```bash
curl -X GET http://localhost:8080/articles
```

#### `POST /articles`
Crée un nouvel article (génération automatique d'UUID v4 et date).

```bash
curl -X POST http://localhost:8080/articles \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Découvrir Express",
    "content": "Express permet de structurer efficacement une API REST.",
    "author": "Yvan Focsa"
  }'
```

#### `GET /articles/:articleId`
Récupère un article précis par son ID (`404` si introuvable).

```bash
curl -X GET http://localhost:8080/articles/6ec0bd7f-11c0-43da-975e-2a8ad9ebae0b
```

#### `GET /articles/:articleId/comments`
Récupère les commentaires d'un article.

#### `POST /articles/:articleId/comments`
Ajoute un commentaire à un article (`id` UUID et `timestamp` UNIX générés).

```bash
curl -X POST http://localhost:8080/articles/6ec0bd7f-11c0-43da-975e-2a8ad9ebae0b/comments \
  -H "Content-Type: application/json" \
  -d '{
    "content": "Article très pertinent !",
    "author": "Alice"
  }'
```

#### `GET /articles/:articleId/comments/:commentId`
Récupère un commentaire spécifique d'un article.

---

### 3. Gestion des Recettes (`headers/recettes.js` monté sur `/recettes`)

#### `GET /recettes`
Liste l'ensemble des recettes culinaires.

```bash
curl -X GET http://localhost:8080/recettes
```

**Exemple de réponse :**
```json
[
  {
    "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "title": "Tarte aux pommes rustique",
    "content": "Délicieuse tarte aux pommes croustillante avec compote maison et cannelle.",
    "ingredients": ["Pommes Golden", "Pâte feuilletée", "Sucre de canne", "Beurre doux", "Cannelle"],
    "date": "16/09/2026",
    "author": "Chef Yvan"
  }
]
```

#### `POST /recettes`
Ajoute une nouvelle recette avec liste d'ingrédients.

```bash
curl -X POST http://localhost:8080/recettes \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Crêpes maison",
    "content": "Mélanger la farine, les oeufs et le lait progressivement.",
    "ingredients": ["Farine", "Lait", "Oeufs", "Beurre fondu"],
    "author": "Yvan Focsa"
  }'
```

#### `GET /recettes/:recetteId`
Récupère une recette par son identifiant unique.

#### `GET /recettes/:recetteId/comments`
Liste les commentaires associés à une recette.

#### `POST /recettes/:recetteId/comments`
Ajoute un avis ou commentaire sur une recette.

```bash
curl -X POST http://localhost:8080/recettes/a1b2c3d4-e5f6-7890-abcd-ef1234567890/comments \
  -H "Content-Type: application/json" \
  -d '{
    "content": "Recette facile et délicieuse !",
    "author": "Gourmand92"
  }'
```

#### `GET /recettes/:recetteId/comments/:commentId`
Récupère un commentaire spécifique d'une recette.

---

## 🧪 Tests Automatisés (Partie 3 - Bonus)

Le projet utilise **Mocha** combiné à **SuperTest** pour tester tous les endpoints HTTP de manière isolée sans démarrer manuellement de port réseau.

Pour exécuter les tests :
```bash
npm test
```

### Résultats d'exécution :
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

  27 passing (60ms)
```

---

## 💡 Synthèse Comparative GraphQL vs REST (Partie 4)

Dans le cadre du cours, cette section analyse les bénéfices de **GraphQL** face à l'approche **REST** :

1. **Suppression de l'Over-fetching :**  
   En REST, la route `GET /articles/:id` renvoie toujours la totalité des champs de l'article (id, titre, contenu, date, auteur). Avec GraphQL, le client formule une requête déclarant exclusivement les champs utiles (ex: uniquement `title`), réduisant la consommation de bande passante et le parsing mobile.

2. **Suppression de l'Under-fetching (Problème N+1) :**  
   Pour afficher une page contenant une recette (ou un article) et tous ses commentaires associés en REST, le client doit envoyer au minimum 2 requêtes HTTP : `GET /recettes/:id` puis `GET /recettes/:id/comments`. En GraphQL, une seule requête imbriquée résout l'ensemble des dépendances en un unique aller-retour réseau :
   ```graphql
   query {
     recette(id: "a1b2c3d4-e5f6-7890-abcd-ef1234567890") {
       title
       ingredients
       comments {
         author
         content
       }
     }
   }
   ```

3. **Point d'accès unique :**  
   REST multiplie les endpoints et les verbes HTTP (`GET`, `POST`, `PUT`, `DELETE`). GraphQL concentre toutes les opérations sur une route unique (`POST /graphql`).

4. **Schéma fortement typé et contrat d'interface :**  
   GraphQL définit formellement chaque type, champ et relation. Le schéma sert de source de vérité unique, permettant la validation automatique, l'auto-complétion dans les IDEs et une collaboration fluide entre équipes front et back.

---

## 📄 Spécifications & Guide Agent IA

- Consultez [`SPECS.md`](./SPECS.md) pour les spécifications techniques et fonctionnelles formelles.
- Consultez [`AGENTS.md`](./AGENTS.md) pour les directives destinées aux modèles de langage et agents autonomes.

---

## 🏷️ Conventions Git

Le projet applique la convention **Conventional Commits** :
- `feat:` nouvelles fonctionnalités et routeurs
- `test:` ajouts de tests unitaires
- `docs:` documentation technique
- `chore:` maintenance des fichiers de build et configuration
