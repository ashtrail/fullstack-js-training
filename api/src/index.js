const { getModulesListOfType } = require('./module.helper')

const controllers = {}
const services = {}

// Load and expose services and controllers to simplify import
getModulesListOfType('service').forEach((module) => {
  services[`${module.camelCaseName}Service`] = require(module.path)
})

getModulesListOfType('controller').forEach((module) => {
  controllers[`${module.camelCaseName}Controller`] = require(module.path)
})

module.exports = {
  controllers,
  services,
}
