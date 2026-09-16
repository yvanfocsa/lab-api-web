const express = require('express')
const walletsRouter = require('./headers/wallets')

const app = express()

// Middleware pour parser les requetes JSON
app.use(express.json())

// Route d accueil et apercu de l API
app.get('/', (req, res) => {
  res.json({
    service: 'API Hot Wallet Crypto',
    routes: {
      wallets: '/wallets',
      transactions: '/wallets/:id/transactions'
    }
  })
})

// Montage du routeur des portefeuilles
app.use('/wallets', walletsRouter)

// Gestion des routes inconnues (404)
app.use((req, res) => {
  res.status(404).json({ error: 'Route introuvable' })
})

// Demarrage du serveur si le fichier est execute directement
if (require.main === module) {
  const PORT = process.env.PORT || 8080
  const server = app.listen(PORT, () => {
    console.log(`Serveur actif sur le port ${PORT}`)
  })

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      const fallbackPort = 3000
      app.listen(fallbackPort, () => {
        console.log(`Port ${PORT} occupe. Bascule sur le port ${fallbackPort}`)
      })
    }
  })
}

module.exports = app
