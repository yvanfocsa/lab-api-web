const request = require('supertest')
const assert = require('node:assert')
const app = require('../index')
const db = require('../src/db')

describe('API Hot Wallet Tests', () => {
  beforeEach(() => {
    db.reset()
  })

  describe('Portefeuilles (/wallets)', () => {
    it('GET /wallets doit retourner 200 et la liste des portefeuilles', async () => {
      const res = await request(app)
        .get('/wallets')
        .expect('Content-Type', /json/)
        .expect(200)

      assert(Array.isArray(res.body))
      assert.strictEqual(res.body.length, 1)
      assert.strictEqual(res.body[0].name, 'Portefeuille Principal')
    })

    it('POST /wallets doit creer un portefeuille avec identifiant UUID', async () => {
      const newWallet = {
        name: 'Epargne Solana',
        currency: 'SOL',
        owner: 'Yvan Focsa',
        balance: 5.0
      }

      const res = await request(app)
        .post('/wallets')
        .send(newWallet)
        .expect('Content-Type', /json/)
        .expect(201)

      assert.ok(res.body.id)
      assert.strictEqual(res.body.name, newWallet.name)
      assert.strictEqual(res.body.currency, 'SOL')
      assert.strictEqual(res.body.balance, 5.0)
      assert.strictEqual(res.body.owner, 'Yvan Focsa')
    })

    it('POST /wallets doit renvoyer 400 si des champs obligatoires manquent', async () => {
      const res = await request(app)
        .post('/wallets')
        .send({ name: 'Incomplet' })
        .expect('Content-Type', /json/)
        .expect(400)

      assert.ok(res.body.error)
    })

    it('GET /wallets/:id doit renvoyer 200 et le portefeuille existant', async () => {
      const res = await request(app)
        .get('/wallets/11111111-2222-3333-4444-555555555555')
        .expect('Content-Type', /json/)
        .expect(200)

      assert.strictEqual(res.body.id, '11111111-2222-3333-4444-555555555555')
      assert.strictEqual(res.body.currency, 'ETH')
    })

    it('GET /wallets/:id doit renvoyer 404 si le portefeuille est introuvable', async () => {
      const res = await request(app)
        .get('/wallets/faux-id')
        .expect('Content-Type', /json/)
        .expect(404)

      assert.strictEqual(res.body.error, 'Portefeuille introuvable')
    })
  })

  describe('Transactions (/wallets/:id/transactions)', () => {
    const validWalletId = '11111111-2222-3333-4444-555555555555'
    const validTxId = 'aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee'

    it('GET /wallets/:id/transactions doit retourner 200 et les transactions', async () => {
      const res = await request(app)
        .get(`/wallets/${validWalletId}/transactions`)
        .expect('Content-Type', /json/)
        .expect(200)

      assert(Array.isArray(res.body))
      assert.strictEqual(res.body.length, 1)
      assert.strictEqual(res.body[0].id, validTxId)
    })

    it('GET /wallets/:id/transactions doit renvoyer 404 si le portefeuille n existe pas', async () => {
      const res = await request(app)
        .get('/wallets/faux-wallet/transactions')
        .expect('Content-Type', /json/)
        .expect(404)

      assert.strictEqual(res.body.error, 'Portefeuille introuvable')
    })

    it('POST /wallets/:id/transactions doit enregistrer un DEPOT et augmenter le solde', async () => {
      const res = await request(app)
        .post(`/wallets/${validWalletId}/transactions`)
        .send({
          type: 'DEPOT',
          amount: 0.5,
          recipient: 'Recharge Binance'
        })
        .expect('Content-Type', /json/)
        .expect(201)

      assert.ok(res.body.id)
      assert.strictEqual(res.body.type, 'DEPOT')
      assert.strictEqual(res.body.amount, 0.5)
      assert.ok(res.body.timestamp)

      // Verifier que le solde initial de 2.0 est devenu 2.5
      const walletRes = await request(app).get(`/wallets/${validWalletId}`).expect(200)
      assert.strictEqual(walletRes.body.balance, 2.5)
    })

    it('POST /wallets/:id/transactions doit enregistrer un RETRAIT et diminuer le solde', async () => {
      const res = await request(app)
        .post(`/wallets/${validWalletId}/transactions`)
        .send({
          type: 'RETRAIT',
          amount: 1.0,
          recipient: 'Virement vers compte bancaire'
        })
        .expect('Content-Type', /json/)
        .expect(201)

      assert.strictEqual(res.body.amount, 1.0)

      // Verifier que le solde initial de 2.0 est devenu 1.0
      const walletRes = await request(app).get(`/wallets/${validWalletId}`).expect(200)
      assert.strictEqual(walletRes.body.balance, 1.0)
    })

    it('POST /wallets/:id/transactions doit renvoyer 400 si le montant depasse le solde', async () => {
      const res = await request(app)
        .post(`/wallets/${validWalletId}/transactions`)
        .send({
          type: 'RETRAIT',
          amount: 999.0,
          recipient: 'Retrait trop grand'
        })
        .expect('Content-Type', /json/)
        .expect(400)

      assert.strictEqual(res.body.error, 'Fonds insuffisants')
    })

    it('POST /wallets/:id/transactions doit renvoyer 404 si le portefeuille n existe pas', async () => {
      const res = await request(app)
        .post('/wallets/faux-id/transactions')
        .send({
          type: 'DEPOT',
          amount: 1.0,
          recipient: 'Test'
        })
        .expect('Content-Type', /json/)
        .expect(404)

      assert.strictEqual(res.body.error, 'Portefeuille introuvable')
    })

    it('GET /wallets/:id/transactions/:txId doit retourner une transaction precise', async () => {
      const res = await request(app)
        .get(`/wallets/${validWalletId}/transactions/${validTxId}`)
        .expect('Content-Type', /json/)
        .expect(200)

      assert.strictEqual(res.body.id, validTxId)
      assert.strictEqual(res.body.walletId, validWalletId)
    })

    it('GET /wallets/:id/transactions/:txId doit renvoyer 404 pour une transaction inconnue', async () => {
      const res = await request(app)
        .get(`/wallets/${validWalletId}/transactions/fausse-tx`)
        .expect('Content-Type', /json/)
        .expect(404)

      assert.strictEqual(res.body.error, 'Transaction introuvable')
    })
  })
})
