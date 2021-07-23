const express = require('express')
const cors = require('cors')
const app = express()
const moduleHelper = require('./src/module.helper')

const errorHandler = require('./src/error-handler.js')

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

// Load routes from modules
const METHODS = ['get', 'post', 'put', 'delete', 'head', 'patch', 'all']
const routePrefix = '' // For example `/api/v1`

const routeModules = moduleHelper.getModulesListOfType('routes')

// TODO: Add validators to routes
routeModules.forEach((module) => {
  const moduleRouter = express.Router()
  let moduleRoutes = require(module.path)

  // Validate that every route has the required attributes
  moduleRoutes = moduleRoutes.filter((r, index) => {
    if (!r.path) {
      console.error(
        `Module [${module.name}]: Route with index [${index}] must have a \`path\` defined.`
      )
      return false
    }
    if (!r.method) {
      console.error(
        `Module [${module.name}]: Route ${
          r.path
        } must have a valid \`method\` (${METHODS.join(', ')})`
      )
      return false
    }
    if (METHODS.indexOf(String(r.method).toLowerCase()) === -1) {
      console.error(
        `Module [${module.name}]: Route ${r.path} has an invalid method ('${r.method}')`
      )
      return false
    }
    if (!r.controller) {
      console.error(
        `Module [${module.name}]: Route ${r.path} does not have a controller`
      )
      return false
    }
    return true
  })

  moduleRoutes.forEach((r) => {
    // Make sure there is a try/catch for each controller to avoid crashing the server
    const controller = async (req, res, next) => {
      try {
        await r.controller(req, res, next)
      } catch (err) {
        next(err)
      }
    }
    moduleRouter.route(`${routePrefix}${r.path}`)[r.method](controller)
  })
  // Add the routes to the app
  app.use(moduleRouter)
})

app.use(function (req, res) {
  res.status(404).send(`404 : Can't find URL ${req.url}`)
})

app.use(errorHandler)

if (process.env.NODE_ENV !== 'test') {
  const server = app.listen(3042, function () {
    console.log(`Server listening on ${server.address().port}`)
  })
}

module.exports = app
