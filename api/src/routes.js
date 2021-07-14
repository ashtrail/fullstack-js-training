const express = require('express')
const router = express.Router()
const models = require('./db/models')
const CustomError = require('./CustomError')
const { UniqueConstraintError } = require('sequelize')
const { getById, updateById } = require('./db/service-helper.js')

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

router
  /*
   ** === POSTS ===
   */

  .post('/posts', (req, res, next) => {
    models.Post.create(req.body)
      .then((post) => res.status(201).send(post))
      .catch(next)
  })

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

  .patch('/posts/:id', (req, res, next) => {
    updateById(models.Post, req.params.id, req.body, postEagerConfig)
      .then((post) => res.status(200).send(post))
      .catch(next)
  })

  /*
   ** === USERS ===
   */

  .post('/users', (req, res, next) => {
    const createUser = async (data) => {
      try {
        const user = await models.User.create(data)
        return user
      } catch (e) {
        if (e instanceof UniqueConstraintError) {
          e = new CustomError(
            'DuplicateUser',
            403,
            'This username is already taken'
          )
        }
        throw e
      }
    }
    createUser(req.body)
      .then((user) => res.status(201).send(user))
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

  .patch('/users/:id', (req, res, next) => {
    updateById(models.User, req.params.id, req.body, userEagerConfig)
      .then((user) => res.status(200).send(user))
      .catch(next)
  })

module.exports = router
