const Sequelize = require('sequelize')
const env = process.env.NODE_ENV || 'development'
const sequelizeConfig = require('./db/config/config')[env]
const { getModulesListOfType } = require('./module.helper')

const sequelize = new Sequelize(
  'database',
  'username',
  'password',
  sequelizeConfig
)

const models = {}

const modules = getModulesListOfType('model')

// Load all models from modules
modules.forEach((module) => {
  const model = require(module.path)(sequelize, Sequelize.DataTypes)
  models[model.name] = model
})

// Register their associations
Object.keys(models).forEach((modelName) => {
  if (models[modelName].associate) {
    models[modelName].associate(models)
  }
})

models.sequelize = sequelize
models.Sequelize = Sequelize

module.exports = models
