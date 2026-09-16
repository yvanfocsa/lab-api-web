const app = require('./src/app')

const PORT = process.env.PORT || 8080

const server = app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`)
})

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    const fallbackPort = 3000
    console.warn(`Port ${PORT} is in use, falling back to port ${fallbackPort}...`)
    app.listen(fallbackPort, () => {
      console.log(`Server listening on port ${fallbackPort}`)
    })
  } else {
    console.error('Server error:', err)
  }
})

module.exports = app
