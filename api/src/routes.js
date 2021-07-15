const express = require('express')
const router = express.Router()
const { postController, userController } = require('./controllers')

router
  // Posts
  .post('/posts', postController.post)
  .get('/posts', postController.getAll)
  .get('/posts/:id', postController.getOne)
  .patch('/posts/:id', postController.patch)
  .delete('/posts/:id', postController.delete)

  // Users
  .post('/users', userController.post)
  .get('/users', userController.getAll)
  .get('/users/available', userController.getAvailability)
  .get('/users/:id', userController.getOne)
  .patch('/users/:id', userController.patch)
  .delete('/users/:id', userController.delete)

module.exports = router
