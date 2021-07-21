const FactoryGirl = require('factory-girl')
const factory = FactoryGirl.factory
const adapter = new FactoryGirl.SequelizeAdapter()
const { User, Post } = require('../src/models')

factory.setAdapter(adapter)

factory.define('user', User, {
  name: factory.sequence('User.name', (n) => `Username ${n}`),
})

factory.define('post', Post, {
  title: factory.sequence('Post.title', (n) => `Post Title ${n}`),
  content: 'Post Content',
  userId: factory.assoc('user', 'id'),
})

module.exports = factory
