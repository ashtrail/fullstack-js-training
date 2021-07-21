const c = require('./posts.controller')

module.exports = [
  {
    method: 'post',
    path: '/posts',
    controller: c.post,
  },
  {
    method: 'get',
    path: '/posts',
    controller: c.getAll,
  },
  {
    method: 'get',
    path: '/posts/:id',
    controller: c.getOne,
  },
  {
    method: 'patch',
    path: '/posts/:id',
    controller: c.patch,
  },
  {
    method: 'delete',
    path: '/posts/:id',
    controller: c.delete,
  },
]
