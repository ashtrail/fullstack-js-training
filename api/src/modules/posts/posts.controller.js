const postService = require('./posts.service')

module.exports = {
  post: (req, res, next) => {
    postService
      .create(req.body)
      .then((post) => res.status(201).send(post))
      .catch(next)
  },

  getAll: (_req, res, next) => {
    postService
      .getAll()
      .then((posts) => res.status(200).send(posts))
      .catch(next)
  },

  getOne: (req, res, next) => {
    postService
      .getById(req.params.id)
      .then((post) => res.status(200).send(post))
      .catch(next)
  },

  patch: (req, res, next) => {
    postService
      .updateById(req.params.id, req.body)
      .then((post) => res.status(200).send(post))
      .catch(next)
  },

  delete: (req, res, next) => {
    postService
      .delete(req.params.id)
      .then(() => res.status(204).send({}))
      .catch(next)
  },
}
