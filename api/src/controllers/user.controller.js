const { userService } = require('../services')

module.exports = {
  post: (req, res, next) => {
    userService
      .create(req.body)
      .then((user) => res.status(201).send(user))
      .catch(next)
  },

  getAll: (_req, res, next) => {
    userService
      .getAll()
      .then((users) => res.status(200).send(users))
      .catch(next)
  },

  getOne: (req, res, next) => {
    userService
      .getById(req.params.id)
      .then((user) => res.status(200).send(user))
      .catch(next)
  },

  getAvailability: (req, res, next) => {
    userService
      .getNameAvailability(req.query.name)
      .then((available) => {
        res.status(200).send({ available })
      })
      .catch(next)
  },

  patch: (req, res, next) => {
    userService
      .updateById(req.params.id, req.body)
      .then((user) => res.status(200).send(user))
      .catch(next)
  },

  delete: (req, res, next) => {
    userService
      .delete(req.params.id)
      .then(() => {
        res.status(204).send({})
      })
      .catch(next)
  },
}
