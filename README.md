# API Hot Wallet

API REST développée avec Node.js et Express pour gérer des portefeuilles crypto et leurs transactions.

Projet réalisé dans le cadre du cours de Technologies Web Avancées à l'ECE Paris.

## 1. Démarrage rapide

### Installation des dépendances
```bash
npm install
```

### Lancement du serveur
```bash
npm start
```
Le serveur écoute par défaut sur le port `8080` (ou `3000` si le port 8080 est déjà occupé).

### Exécution des tests automatisés
```bash
npm test
```
La suite contient 13 tests automatisés avec Mocha et SuperTest.

## 2. Structure du code

L'organisation sépare le point d'entrée, les routeurs modulaires et le modèle de données :

```
├── index.js                  # Point d'entrée du serveur Express
├── headers/
│   ├── wallets.js            # Routeur principal des portefeuilles (/wallets)
│   └── transactions.js       # Sous-routeur des transactions (/wallets/:id/transactions)
├── src/
│   └── db.js                 # Base de données en mémoire avec reset() pour les tests
├── test/
│   └── wallets.test.js       # Suite de 13 tests Mocha et SuperTest
├── SPECS.md                  # Cahier des charges et spécifications
└── package.json              # Dépendances et scripts
```

## 3. Endpoints de l'API

### Portefeuilles (`/wallets`)

- `GET /wallets` : liste tous les portefeuilles existants.
- `POST /wallets` : crée un nouveau portefeuille avec génération automatique d'un identifiant UUID v4.
  ```bash
  curl -s -X POST http://localhost:8080/wallets \
    -H "Content-Type: application/json" \
    -d '{"name":"Epargne BTC","currency":"BTC","owner":"Yvan","balance":1.2}'
  ```
- `GET /wallets/:id` : consulte un portefeuille par son identifiant unique.

### Transactions (`/wallets/:id/transactions`)

- `GET /wallets/:id/transactions` : liste l'historique des opérations du portefeuille.
- `POST /wallets/:id/transactions` : exécute un dépôt ou un retrait, et met à jour le solde du portefeuille en temps réel.
  ```bash
  curl -s -X POST http://localhost:8080/wallets/11111111-2222-3333-4444-555555555555/transactions \
    -H "Content-Type: application/json" \
    -d '{"type":"DEPOT","amount":0.5,"recipient":"Virement Kraken"}'
  ```
- `GET /wallets/:id/transactions/:txId` : consulte une transaction précise.

## 4. Comparatif GraphQL et REST

1. **Suppression du surplus de données (Over-fetching) :**  
   En REST, la route `GET /wallets/:id` renvoie tous les champs enregistrés. Avec GraphQL, le client formule sa requête pour obtenir uniquement le solde `{ balance }`, économisant ainsi la bande passante.

2. **Élimination des requêtes multiples (Under-fetching) :**  
   Pour afficher un portefeuille et la liste de ses transactions en REST, le client effectue deux requêtes HTTP successives. En GraphQL, une seule requête imbriquée récupère le portefeuille et ses transactions associées en un seul aller-retour réseau.
