const express = require('express')
const { v4: uuidv4 } = require('uuid')
const db = require('../db')

// mergeParams: true is necessary to access :articleId from the parent router
const router = express.Router({ mergeParams: true })

// GET /articles/:articleId/comments - get all comments of the article with articleId
router.get('/', (req, res) => {
  const { articleId } = req.params
  const article = db.articles.find(a => a.id === articleId)
  if (!article) {
    return res.status(404).json({ error: 'Article not found' })
  }

  const comments = db.comments.filter(c => c.articleId === articleId)
  res.json(comments)
})

// POST /articles/:articleId/comments - add a new comment to a specific article with articleId
router.post('/', (req, res) => {
  const { articleId } = req.params
  const article = db.articles.find(a => a.id === articleId)
  if (!article) {
    return res.status(404).json({ error: 'Article not found' })
  }

  const { content, author } = req.body
  if (!content || !author) {
    return res.status(400).json({ error: 'Both content and author are required' })
  }

  const newComment = {
    id: uuidv4(),
    timestamp: Date.now(),
    content,
    articleId,
    author
  }

  db.comments.push(newComment)
  res.status(201).json(newComment)
})

// GET /articles/:articleId/comments/:commentId - get a comment with commentId of the article with articleId
router.get('/:commentId', (req, res) => {
  const { articleId, commentId } = req.params
  const article = db.articles.find(a => a.id === articleId)
  if (!article) {
    return res.status(404).json({ error: 'Article not found' })
  }

  const comment = db.comments.find(c => c.id === commentId && c.articleId === articleId)
  if (!comment) {
    return res.status(404).json({ error: 'Comment not found' })
  }

  res.json(comment)
})

module.exports = router
