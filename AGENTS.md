# AGENTS.md - Guide pour Agents IA et Assistants de Développement

Ce document fournit aux agents d'intelligence artificielle (et aux développeurs) le contexte architectural, les conventions de code et les instructions opérationnelles pour naviguer et contribuer efficacement à ce dépôt.

---

## 🤖 1. Présentation du Dépôt

- **Nom du projet :** `lab-web-api-express`
- **Cadre académique :** Technologies Web Avancées - ECE Paris
- **Technologie principale :** Node.js avec le framework Express.js (v4.x)
- **Objectif :** Implémentation d'une API REST modulaire avec gestion en mémoire d'articles, recettes et commentaires, couverte par des tests automatisés (Mocha + SuperTest).

---

## 🏗️ 2. Structure et Organisation du Code

- **`index.js`** : Point d'entrée principal du serveur (écoute HTTP avec repli de port automatique).
- **`src/app.js`** : Instanciation d'Express, middlewares (`express.json()`), et montage des routeurs.
- **`src/db.js`** : Base de données in-memory simulant une persistance. Expose un helper `db.reset()` crucial pour les tests.
- **`headers/` (ou `handlers/`)** :
  - `recettes.js` : Routeur Express pour l'API `/recettes` et `/recettes/:recetteId/comments`.
  - `articles.js`, `comments.js`, `general.js` : Routeurs modulaires.
- **`src/routes/`** : Implémentations d'origine des routeurs Express.
- **`test/api.test.js`** : Suite de tests automatisés (27 tests) exécutée avec Mocha et SuperTest.
- **`content/about.json`** : Fichier JSON statique utilisé pour la route `/about`.
- **`SPECS.md`** : Spécifications techniques détaillées.
- **`README.md`** : Documentation utilisateur et documentation de l'API.

---

## ⚡ 3. Commandes d'Exploitation

### Installation
```bash
npm install
```

### Lancement du serveur
```bash
npm start
```
*Note : Le port par défaut est `8080`. Si `8080` est déjà réservé par un autre processus, le serveur bascule automatiquement sur le port `3000`.*

### Exécution des tests
```bash
npm test
```
*Important : Tous les tests doivent passer avec succès (`0 failure`) avant de considérer une modification comme validée.*

---

## 📋 4. Règles de Développement et Bonnes Pratiques

1. **Isolation des tests :**
   Toujours invoquer `db.reset()` dans le hook `beforeEach` des suites de tests pour éviter les effets de bord entre scénarios.
2. **Gestion des IDs et dates :**
   - Toujours générer les identifiants via `uuid.v4()`.
   - Utiliser `Date.now()` pour les timestamps de commentaires.
3. **Codes de statut HTTP à respecter scrupuleusement :**
   - `200 OK` : Lecture réussie.
   - `201 Created` : Création de ressource réussie (`POST`).
   - `400 Bad Request` : Corps de requête incomplet ou invalide.
   - `404 Not Found` : Ressource ou parent inexistant.
   - `500 Internal Server Error` : Erreur interne inattendue.
4. **Conventions Git :**
   Rédiger tous les messages de commit selon la spécification [Conventional Commits](https://www.conventionalcommits.org) :
   - `feat: ...`
   - `fix: ...`
   - `test: ...`
   - `docs: ...`
   - `chore: ...`
   - `refactor: ...`

---

## 🔍 5. Vérification Rapide (Checklist Agent)

Avant de valider une modification :
- [ ] Exécuter `npm test` et s'assurer que les 27 tests passent.
- [ ] Vérifier la propreté du git tree avec `git status`.
- [ ] Mettre à jour `README.md` ou `SPECS.md` si de nouveaux endpoints sont ajoutés.
