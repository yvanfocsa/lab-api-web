const express = require('express')
const path = require('path')
const fs = require('fs')

const router = express.Router()

/**
 * Refactored from Lab 1: /hello endpoint
 * Supports query parameter (?name=...) as in Lab 1
 */
router.get('/hello', (req, res) => {
  const name = req.query.name
  if (name) {
    if (name.toLowerCase() === 'yvan' || name.toLowerCase() === 'yvan focsa') {
      return res.type('text/plain').send("Bonjour ! Je m'appelle Yvan Focsa, étudiant à l'ECE en Technologies Web Avancées. Bienvenue sur mon projet !")
    }
    return res.type('text/plain').send(`Hello ${name}`)
  }
  res.type('text/plain').send('Hello anonymous')
})

/**
 * Supports route parameter (/hello/:name) as introduced in the Express course
 */
router.get('/hello/:name', (req, res) => {
  const name = req.params.name
  if (name.toLowerCase() === 'yvan' || name.toLowerCase() === 'yvan focsa') {
    return res.type('text/plain').send("Bonjour ! Je m'appelle Yvan Focsa, étudiant à l'ECE en Technologies Web Avancées. Bienvenue sur mon projet !")
  }
  res.type('text/plain').send(`Hello ${name}`)
})

/**
 * Refactored from Lab 1: Dynamic content retrieval from content/ folder
 */
router.get('/about', (req, res) => {
  const filePath = path.join(__dirname, '..', '..', 'content', 'about.json')
  if (fs.existsSync(filePath)) {
    try {
      const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'))
      return res.json(data)
    } catch (err) {
      return res.status(500).json({ error: 'Error reading content file' })
    }
  }
  res.status(404).json({ error: 'Content not found' })
})

module.exports = router
