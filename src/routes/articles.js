const express = require('express')
const { v4: uuidv4 } = require('uuid')
const db = require('../db')
const commentsRouter = require('./comments')

const router = express.Router()

// Mount sub-router for comments: /articles/:articleId/comments
router.use('/:articleId/comments', commentsRouter)

// GET /articles - list all articles
router.get('/', (req, res) => {
  res.json(db.articles)
})

// POST /articles - add a new article
router.post('/', (req, res) => {
  const { title, content, author, date } = req.body

  if (!title || !content || !author) {
    return res.status(400).json({ error: 'Title, content, and author are required' })
  }

  // Format date if not provided (DD/MM/YYYY)
  const articleDate = date || new Date().toLocaleDateString('en-GB')

  const newArticle = {
    id: uuidv4(),
    title,
    content,
    date: articleDate,
    author
  }

  db.articles.push(newArticle)
  res.status(201).json(newArticle)
})

// GET /articles/:articleId - get an article by ID
router.get('/:articleId', (req, res) => {
  const { articleId } = req.params
  const article = db.articles.find(a => a.id === articleId)

  if (!article) {
    return res.status(404).json({ error: 'Article not found' })
  }

  res.json(article)
})

module.exports = router
