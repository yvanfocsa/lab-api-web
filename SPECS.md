# Spécifications de l'API Hot Wallet

API REST simple pour gérer des portefeuilles crypto et leurs transactions.

## 1. Modèles de données

### Portefeuille (`Wallet`)
- `id` : identifiant unique (UUID v4 généré automatiquement)
- `name` : nom du portefeuille (ex: "Portefeuille ETH")
- `currency` : devise (ex: "ETH", "BTC", "SOL")
- `balance` : solde (nombre, par défaut 0)
- `owner` : propriétaire (ex: "Yvan")

### Transaction (`Transaction`)
- `id` : identifiant unique (UUID v4 généré automatiquement)
- `walletId` : identifiant du portefeuille rattaché
- `type` : "DEPOT" ou "RETRAIT"
- `amount` : montant (nombre supérieur à 0)
- `recipient` : destinataire ou libellé
- `timestamp` : horodatage automatique (Date.now())

## 2. Routes de l'API

### Portefeuilles (`/wallets`)

| Méthode | Route | Description | Code retour |
| :--- | :--- | :--- | :--- |
| `GET` | `/wallets` | Liste tous les portefeuilles | `200 OK` |
| `POST` | `/wallets` | Crée un portefeuille (`name`, `currency`, `owner`) | `201 Created` ou `400 Bad Request` |
| `GET` | `/wallets/:id` | Affiche un portefeuille par son identifiant | `200 OK` ou `404 Not Found` |

### Transactions (`/wallets/:id/transactions`)

| Méthode | Route | Description | Code retour |
| :--- | :--- | :--- | :--- |
| `GET` | `/wallets/:id/transactions` | Liste les transactions d'un portefeuille | `200 OK` ou `404 Not Found` |
| `POST` | `/wallets/:id/transactions` | Ajoute une transaction (`type`, `amount`, `recipient`) | `201 Created`, `400` ou `404` |
| `GET` | `/wallets/:id/transactions/:txId` | Affiche une transaction spécifique | `200 OK` ou `404 Not Found` |

### Routes générales

| Méthode | Route | Description | Code retour |
| :--- | :--- | :--- | :--- |
| `GET` | `/` | Accueil et liste des routes disponibles | `200 OK` |
| `GET` | `/hello` | Salutation avec option `?name=Alice` | `200 OK` |
| `GET` | `/about` | Lit le fichier `content/about.json` | `200 OK` ou `404 Not Found` |

## 3. Gestion des erreurs

- `400 Bad Request` : champ obligatoire manquant ou montant invalide.
- `404 Not Found` : portefeuille ou transaction introuvable.

## 4. Comparatif GraphQL en 2 points

1. **Moins de données inutiles :** en REST, `/wallets/:id` renvoie tous les champs. Avec GraphQL, le client demande seulement `{ balance }`.
2. **Moins de requêtes :** en REST, afficher le solde et les transactions demande 2 requêtes. En GraphQL, une seule requête imbriquée suffit.
