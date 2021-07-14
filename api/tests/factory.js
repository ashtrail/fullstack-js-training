const FactoryGirl = require('factory-girl')
const factory = FactoryGirl.factory
const adapter = new FactoryGirl.SequelizeAdapter()
const db = require('../src/db/models')

factory.setAdapter(adapter)

factory.define('user', db.User, {
  name: factory.sequence('User.name', (n) => `Username ${n}`),
})

factory.define('post', db.Post, {
  title: factory.sequence('Post.title', (n) => `Post Title ${n}`),
  content: 'Post Content',
  userId: factory.assoc('user', 'id'),
})

module.exports = factory
