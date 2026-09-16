const initialDb = {
  articles: [
    {
      id: '6ec0bd7f-11c0-43da-975e-2a8ad9ebae0b',
      title: 'My article',
      content: 'Content of the article.',
      date: '04/10/2022',
      author: 'Liz Gringer'
    }
  ],
  recettes: [
    {
      id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
      title: 'Tarte aux pommes rustique',
      content: 'Délicieuse tarte aux pommes croustillante avec compote maison et cannelle.',
      ingredients: ['Pommes Golden', 'Pâte feuilletée', 'Sucre de canne', 'Beurre doux', 'Cannelle'],
      date: '16/09/2026',
      author: 'Chef Yvan'
    }
  ],
  comments: [
    {
      id: '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d',
      timestamp: 1664835049,
      content: 'Content of the comment.',
      articleId: '6ec0bd7f-11c0-43da-975e-2a8ad9ebae0b',
      author: 'Bob McLaren'
    },
    {
      id: 'c3d4e5f6-a7b8-9012-cdef-123456789012',
      timestamp: 1664836000,
      content: 'Une excellente recette, testée et validée par toute la famille !',
      recetteId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
      author: 'Marie Curie'
    }
  ]
}

const db = {
  articles: JSON.parse(JSON.stringify(initialDb.articles)),
  recettes: JSON.parse(JSON.stringify(initialDb.recettes)),
  comments: JSON.parse(JSON.stringify(initialDb.comments)),
  reset() {
    this.articles = JSON.parse(JSON.stringify(initialDb.articles))
    this.recettes = JSON.parse(JSON.stringify(initialDb.recettes))
    this.comments = JSON.parse(JSON.stringify(initialDb.comments))
  }
}

module.exports = db
