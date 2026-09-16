const initialDb = {
  wallets: [
    {
      id: '11111111-2222-3333-4444-555555555555',
      name: 'Portefeuille Principal',
      currency: 'ETH',
      balance: 2.0,
      owner: 'Yvan Focsa',
      date: '16/09/2026'
    }
  ],
  transactions: [
    {
      id: 'aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee',
      walletId: '11111111-2222-3333-4444-555555555555',
      type: 'DEPOT',
      amount: 2.0,
      recipient: 'Initialisation du compte',
      timestamp: 1664835049000
    }
  ]
}

const db = {
  wallets: JSON.parse(JSON.stringify(initialDb.wallets)),
  transactions: JSON.parse(JSON.stringify(initialDb.transactions)),
  reset() {
    this.wallets = JSON.parse(JSON.stringify(initialDb.wallets))
    this.transactions = JSON.parse(JSON.stringify(initialDb.transactions))
  }
}

module.exports = db
