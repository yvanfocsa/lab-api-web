# Guide de développement et directives pour agents

Ce document rassemble les conventions techniques, l'organisation du code et les consignes opérationnelles destinées aux développeurs et aux assistants automatisés intervenant sur ce dépôt.

## Contexte du projet

Le projet `lab-web-api-express` a été conçu dans le cadre du module Technologies Web Avancées dispensé à l'ECE Paris. Il s'agit d'une API REST écrite en Node.js avec Express, articulée autour de collections en mémoire pour les articles, les recettes culinaires et leurs commentaires. Une suite de tests automatisés sous Mocha et SuperTest en valide le comportement.

## Organisation des fichiers

- `index.js` : Point d'entrée principal du serveur HTTP, avec gestion de repli en cas de port indisponible.
- `src/app.js` : Instanciation d'Express, déclaration des middlewares globaux et montage des routeurs.
- `src/db.js` : Base de données locale en mémoire avec méthode `db.reset()` pour les tests.
- `headers/recettes.js` : Routeur dédié aux recettes et à leurs commentaires.
- `headers/articles.js`, `headers/comments.js`, `headers/general.js` : Routeurs modulaires du service.
- `handlers/` : Alias miroir pointant vers les mêmes routeurs pour maintenir la compatibilité.
- `test/api.test.js` : Ensemble des 27 tests automatisés exécutés via Mocha et SuperTest.
- `content/about.json` : Fichier statique utilisé par la route `/about`.
- `SPECS.md` : Cahier des charges et spécifications techniques détaillées.
- `README.md` : Documentation générale du projet et exemples d'appels.

## Commandes courantes

### Installation des paquets
```bash
npm install
```

### Lancement de l'application
```bash
npm start
```
Le serveur tente d'abord d'écouter sur le port `8080`, ou sur la variable d'environnement `PORT`. Si le port est déjà occupé, il bascule sur le port `3000`.

### Exécution des tests
```bash
npm test
```
Toutes les modifications doivent valider l'intégralité des 27 tests avec zéro échec.

## Règles de développement

1. **Isolation des scénarios de test :** Toujours exécuter `db.reset()` dans le hook `beforeEach` des suites de tests pour repartir d'un état propre et éviter les dépendances entre scénarios.
2. **Génération des clés et horodatages :** Utiliser exclusivement `uuid.v4()` pour la création des identifiants et `Date.now()` pour les timestamps des commentaires.
3. **Codes de statut HTTP :**
   - `200 OK` : Réponse positive à une lecture ou consultation.
   - `201 Created` : Création confirmée d'une ressource.
   - `400 Bad Request` : Corps de requête incomplet ou mal formé.
   - `404 Not Found` : Ressource ou entité parente inexistante.
   - `500 Internal Server Error` : Anomalie interne inattendue.
4. **Format des messages de commit :** Utiliser le standard Conventional Commits avec les préfixes appropriés (`feat:`, `fix:`, `test:`, `docs:`, `chore:`).

## Checklist de validation

Avant de finaliser une contribution :
- [ ] Exécuter `npm test` et s'assurer que les 27 tests passent avec succès.
- [ ] Contrôler la propreté de l'arbre Git avec `git status`.
- [ ] Répercuter les éventuels ajouts de routes dans `README.md` et `SPECS.md`.
