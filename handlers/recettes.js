const express = require('express')
const { v4: uuidv4 } = require('uuid')
const db = require('../src/db')

const router = express.Router()

// GET /recettes - Lister toutes les recettes
router.get('/', (req, res) => {
  res.json(db.recettes)
})

// POST /recettes - Ajouter une nouvelle recette
router.post('/', (req, res) => {
  const { title, content, author, ingredients, date } = req.body

  if (!title || !content || !author) {
    return res.status(400).json({ error: 'Le titre, le contenu et l\'auteur sont requis' })
  }

  const recipeDate = date || new Date().toLocaleDateString('fr-FR')

  const newRecipe = {
    id: uuidv4(),
    title,
    content,
    ingredients: Array.isArray(ingredients) ? ingredients : [],
    date: recipeDate,
    author
  }

  db.recettes.push(newRecipe)
  res.status(201).json(newRecipe)
})

// GET /recettes/:recetteId - Obtenir une recette par son ID
router.get('/:recetteId', (req, res) => {
  const { recetteId } = req.params
  const recipe = db.recettes.find(r => r.id === recetteId)

  if (!recipe) {
    return res.status(404).json({ error: 'Recette introuvable' })
  }

  res.json(recipe)
})

// GET /recettes/:recetteId/comments - Obtenir tous les commentaires d'une recette
router.get('/:recetteId/comments', (req, res) => {
  const { recetteId } = req.params
  const recipe = db.recettes.find(r => r.id === recetteId)

  if (!recipe) {
    return res.status(404).json({ error: 'Recette introuvable' })
  }

  const comments = db.comments.filter(c => c.recetteId === recetteId)
  res.json(comments)
})

// POST /recettes/:recetteId/comments - Ajouter un commentaire à une recette
router.post('/:recetteId/comments', (req, res) => {
  const { recetteId } = req.params
  const recipe = db.recettes.find(r => r.id === recetteId)

  if (!recipe) {
    return res.status(404).json({ error: 'Recette introuvable' })
  }

  const { content, author } = req.body
  if (!content || !author) {
    return res.status(400).json({ error: 'Le contenu et l\'auteur sont requis' })
  }

  const newComment = {
    id: uuidv4(),
    timestamp: Date.now(),
    content,
    recetteId,
    author
  }

  db.comments.push(newComment)
  res.status(201).json(newComment)
})

// GET /recettes/:recetteId/comments/:commentId - Obtenir un commentaire spécifique d'une recette
router.get('/:recetteId/comments/:commentId', (req, res) => {
  const { recetteId, commentId } = req.params
  const recipe = db.recettes.find(r => r.id === recetteId)

  if (!recipe) {
    return res.status(404).json({ error: 'Recette introuvable' })
  }

  const comment = db.comments.find(c => c.id === commentId && c.recetteId === recetteId)
  if (!comment) {
    return res.status(404).json({ error: 'Commentaire introuvable' })
  }

  res.json(comment)
})

module.exports = router
