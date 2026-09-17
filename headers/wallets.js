const express = require('express')
const { v4: uuidv4 } = require('uuid')
const db = require('../src/db')
const transactionsRouter = require('./transactions')

const router = express.Router()

// Monter le sous-routeur des transactions
router.use('/:id/transactions', transactionsRouter)

// GET /wallets
router.get('/', (req, res) => {
  res.json(db.wallets)
})

// POST /wallets
router.post('/', (req, res) => {
  const { name, currency, owner, balance } = req.body

  if (!name || !currency || !owner) {
    return res.status(400).json({ error: 'Champs obligatoires : name, currency, owner' })
  }

  const newWallet = {
    id: uuidv4(),
    name,
    currency,
    balance: typeof balance === 'number' ? balance : 0,
    owner,
    date: new Date().toLocaleDateString('fr-FR')
  }

  db.wallets.push(newWallet)
  res.status(201).json(newWallet)
})

// GET /wallets/:id
router.get('/:id', (req, res) => {
  const wallet = db.wallets.find(w => w.id === req.params.id)
  if (!wallet) {
    return res.status(404).json({ error: 'Portefeuille introuvable' })
  }

  res.json(wallet)
})

module.exports = router
