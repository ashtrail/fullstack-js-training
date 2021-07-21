const c = require('./users.controller')

module.exports = [
  {
    method: 'post',
    path: '/users',
    controller: c.post,
  },
  {
    method: 'get',
    path: '/users',
    controller: c.getAll,
  },
  {
    method: 'get',
    path: '/users/available',
    controller: c.getAvailability,
  },
  {
    method: 'get',
    path: '/users/:id',
    controller: c.getOne,
  },
  {
    method: 'patch',
    path: '/users/:id',
    controller: c.patch,
  },
  {
    method: 'delete',
    path: '/users/:id',
    controller: c.delete,
  },
]
