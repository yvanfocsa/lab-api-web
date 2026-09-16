const express = require('express')
const articlesRouter = require('./routes/articles')
const generalRouter = require('./routes/general')
const recettesRouter = require('../headers/recettes')

const app = express()

// Middleware to parse JSON bodies
app.use(express.json())

// General routes refactored from previous lab (/hello, /about)
app.use('/', generalRouter)

// Articles and comments API routes
app.use('/articles', articlesRouter)

// Recettes API routes (from headers/recettes.js)
app.use('/recettes', recettesRouter)

// Root route providing API overview
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to the Web API with Express',
    routes: {
      hello: '/hello',
      about: '/about',
      articles: '/articles',
      comments: '/articles/:articleId/comments',
      recettes: '/recettes',
      recettesComments: '/recettes/:recetteId/comments'
    }
  })
})

// 404 handler for unknown routes
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' })
})

// Global error handler
app.use((err, req, res, next) => {
  console.error(err)
  res.status(500).json({ error: 'Internal server error' })
})

module.exports = app
