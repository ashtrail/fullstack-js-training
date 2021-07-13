const express = require('express')
const router = express.Router()
const models = require('./db/models')
const CustomError = require('./CustomError')
const { UniqueConstraintError } = require('sequelize')

const postEagerConfig = {
  include: [
    {
      model: models.User,
      as: 'author',
    },
  ],
}

const userEagerConfig = {
  include: [
    {
      model: models.Post,
      as: 'posts',
    },
  ],
}

const NotFoundError = new CustomError(
  'NotFound',
  404,
  "This entry doesn't exits"
)

const getById = async (model, id, eagerConf = null) => {
  let data
  if (eagerConf !== null) {
    data = await model.findByPk(id, eagerConf)
  } else {
    data = await model.findByPk(id)
  }
  if (data == null) throw NotFoundError
  return data
}

router
  .get('/posts', (_req, res, next) => {
    models.Post.findAll(postEagerConfig)
      .then((posts) => res.status(200).send(posts))
      .catch(next)
  })

  .get('/posts/:id', (req, res, next) => {
    getById(models.Post, req.params.id, postEagerConfig)
      .then((post) => res.status(200).send(post))
      .catch(next)
  })

  .post('/posts', (req, res, next) => {
    models.Post.create(req.body)
      .then((post) => res.status(201).send(post))
      .catch(next)
  })

  .get('/users', (_req, res, next) => {
    models.User.findAll(userEagerConfig)
      .then((users) => res.status(200).send(users))
      .catch(next)
  })

  .get('/users/:id', (req, res, next) => {
    getById(models.User, req.params.id, userEagerConfig)
      .then((user) => res.status(200).send(user))
      .catch(next)
  })

  .post('/users', (req, res, next) => {
    const createUser = async (data) => {
      try {
        const user = await models.User.create(data)
        return user
      } catch (e) {
        if (e instanceof UniqueConstraintError) {
          throw new CustomError(
            'DuplicateUser',
            403,
            'This username is already taken'
          )
        } else {
          throw e
        }
      }
    }
    createUser(req.body)
      .then((user) => res.status(201).send(user))
      .catch(next)
  })

module.exports = router
