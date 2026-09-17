const express = require('express')
const { v4: uuidv4 } = require('uuid')
const db = require('../src/db')

// mergeParams: true permet d acceder a :id du routeur parent wallets
const router = express.Router({ mergeParams: true })

// GET /wallets/:id/transactions
router.get('/', (req, res) => {
  const wallet = db.wallets.find(w => w.id === req.params.id)
  if (!wallet) {
    return res.status(404).json({ error: 'Portefeuille introuvable' })
  }

  const txs = db.transactions.filter(t => t.walletId === req.params.id)
  res.json(txs)
})

// POST /wallets/:id/transactions
router.post('/', (req, res) => {
  const wallet = db.wallets.find(w => w.id === req.params.id)
  if (!wallet) {
    return res.status(404).json({ error: 'Portefeuille introuvable' })
  }

  const { type, amount, recipient } = req.body
  if (!type || !amount || !recipient) {
    return res.status(400).json({ error: 'Champs obligatoires : type, amount, recipient' })
  }

  if (type !== 'DEPOT' && type !== 'RETRAIT') {
    return res.status(400).json({ error: 'Le type doit etre DEPOT ou RETRAIT' })
  }

  const numAmount = Number(amount)
  if (isNaN(numAmount) || numAmount <= 0) {
    return res.status(400).json({ error: 'Le montant doit etre un nombre positif' })
  }

  // Verifier le solde si c est un retrait
  if (type === 'RETRAIT' && wallet.balance < numAmount) {
    return res.status(400).json({ error: 'Fonds insuffisants' })
  }

  // Mise a jour du solde en direct
  if (type === 'DEPOT') {
    wallet.balance += numAmount
  } else {
    wallet.balance -= numAmount
  }

  const newTx = {
    id: uuidv4(),
    walletId: req.params.id,
    type,
    amount: numAmount,
    recipient,
    timestamp: Date.now()
  }

  db.transactions.push(newTx)
  res.status(201).json(newTx)
})

// GET /wallets/:id/transactions/:txId
router.get('/:txId', (req, res) => {
  const wallet = db.wallets.find(w => w.id === req.params.id)
  if (!wallet) {
    return res.status(404).json({ error: 'Portefeuille introuvable' })
  }

  const tx = db.transactions.find(t => t.id === req.params.txId && t.walletId === req.params.id)
  if (!tx) {
    return res.status(404).json({ error: 'Transaction introuvable' })
  }

  res.json(tx)
})

module.exports = router
