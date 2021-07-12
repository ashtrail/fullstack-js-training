const express = require('express')
const cors = require('cors')
const app = express()

const errorHandler = require('./src/error-handler.js')

const routes = require('./src/routes')

app.use(cors())
app.use(express.json())

// Log all request received
app.use((req, _res, next) => {
  if (process.env.NODE_ENV !== 'test') {
    console.log('Received Request', {
      method: req.method,
      url: req.originalUrl,
      body: req.body,
    })
  }
  next()
})

app.get('/ping', (_req, res) => {
  res.send('pong')
})

app.use('/', routes)

app.use(function (_req, res) {
  res.status(404).send("404 : Can't find URL")
})

app.use(errorHandler)

if (process.env.NODE_ENV !== 'test') {
  const server = app.listen(3000, function () {
    console.log(`Server listening on ${server.address().port}`)
  })
}

module.exports = app
