const { Post, User } = require('../db/models')
const CustomError = require('../CustomError')
const { UniqueConstraintError } = require('sequelize')
const { NotFoundError } = require('../errors')

const userEagerConfig = {
  include: [
    {
      model: Post,
      as: 'posts',
    },
  ],
}

const userService = {
  async create({ name }) {
    try {
      const user = await User.create({ name })
      return this.getById(user.id)
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
  },

  async getAll() {
    return User.findAll(userEagerConfig)
  },

  async getById(id) {
    const user = await User.findByPk(id, userEagerConfig)
    if (user == null) throw NotFoundError
    return user
  },

  async getNameAvailability(name) {
    const user = await User.findOne({ where: { name: name } })
    return user === null
  },

  async updateById(id, { name }) {
    await User.update({ name }, { where: { id: id } })
    return this.getById(id)
  },

  async delete(id) {
    const deleted = await User.destroy({ where: { id: id } })
    if (deleted) {
      return true
    } else {
      throw NotFoundError
    }
  },
}

module.exports = userService
