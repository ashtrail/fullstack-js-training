const express = require('express')
const router = express.Router()
const db = require('./db.js')

router
  .get('/posts', (_req, res, next) => {
    db.getAllPosts()
      .then((posts) => res.status(200).send(posts))
      .catch(next)
  })

  .get('/posts/:id', (req, res, next) => {
    db.getOnePost(req.params.id)
      .then((post) => res.status(200).send(post))
      .catch(next)
  })

  .post('/posts', (req, res, next) => {
    db.createPost(req.body)
      .then((post) => res.status(201).send(post))
      .catch(next)
  })

  .get('/users', (_req, res, next) => {
    db.getAllUsers()
      .then((users) => res.status(200).send(users))
      .catch(next)
  })

  .get('/users/:id', (req, res, next) => {
    db.getOneUser(req.params.id)
      .then((user) => res.status(200).send(user))
      .catch(next)
  })

  .post('/users', (req, res, next) => {
    db.createUser(req.body)
      .then((user) => res.status(201).send(user))
      .catch(next)
  })

module.exports = router
