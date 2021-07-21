const { Post, User } = require('../../models')
const _pick = require('lodash.pick')
const { NotFoundError } = require('../../errors')

const postEagerConfig = {
  include: [
    {
      model: User,
      as: 'author',
    },
  ],
}

const postService = {
  async create({ title, content, userId }) {
    const post = await Post.create({ title, content, userId })
    return this.getById(post.id)
  },

  async getAll() {
    return Post.findAll(postEagerConfig)
  },

  async getById(id) {
    const post = await Post.findByPk(id, postEagerConfig)
    if (post == null) throw NotFoundError
    return post
  },

  async updateById(id, post) {
    const toUpdate = _pick(post, ['title', 'content'])
    await Post.update(toUpdate, { where: { id: id } })
    return this.getById(id)
  },

  async delete(id) {
    const deleted = await Post.destroy({ where: { id: id } })
    if (deleted) {
      return true
    } else {
      throw NotFoundError
    }
  },
}

module.exports = postService
