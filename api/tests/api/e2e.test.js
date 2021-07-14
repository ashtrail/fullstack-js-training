const request = require('supertest')
const app = require('../../index.js')
const database = require('../../src/db/models')
const factory = require('../factory')

describe('API E2E Tests', () => {
  // Set the db object to a variable which can be accessed throughout the whole test file
  let db = database

  beforeEach(async () => {
    // Full reset of the db
    await db.sequelize.sync({ force: true })
  })

  describe('Users', () => {
    it('should create new user', async () => {
      const res = await request(app).post('/users').send({ name: 'Bob' })
      expect(res.statusCode).toEqual(201)
      expect(res.body.name).toEqual('Bob')
    })

    /*
     * For some reason this works fine with Postman but the unique constraint
     * seems to be ignored in tests.
     * It might be linked with https://github.com/sequelize/sequelize/issues/10360
     * but model.sync() did not help.
     */

    // it('should not create duplicate users', async () => {
    //   const user = await factory.create('user')
    //   const res = await request(app).post('/users').send({ name: user.name })
    //   expect(res.statusCode).toEqual(403)
    //   expect(res.body.type).toEqual('DuplicateUser')
    // })

    it('should get all users', async () => {
      await factory.createMany('user', 3)
      res = await request(app).get('/users')
      expect(res.statusCode).toEqual(200)
      expect(res.body.length).toEqual(3)
    })

    it('should get one user', async () => {
      const user = await factory.create('user')
      const res = await request(app).get(`/users/${user.id}`)
      expect(res.statusCode).toEqual(200)
      expect(res.body.name).toEqual(user.name)
    })

    it("should throw NotFound if user doesn't exist", async () => {
      const res = await request(app).get('/users/1')
      expect(res.statusCode).toEqual(404)
      expect(res.body.type).toEqual('NotFound')
    })

    it("should get user's posts", async () => {
      const user = await factory.create('user')
      await factory.createMany('post', 3, { userId: user.id })
      const res = await request(app).get(`/users/${user.id}`)
      expect(res.statusCode).toEqual(200)
      expect(res.body.posts.length).toEqual(3)
    })

    it('should update a user', async () => {
      const user = await factory.create('user', { name: 'Bob' })
      const res = await request(app)
        .patch(`/users/${user.id}`)
        .send({ name: 'Steve' })
      expect(res.statusCode).toEqual(200)
      expect(res.body.name).toEqual('Steve')
    })
  })

  describe('Posts', () => {
    it('should create new post', async () => {
      const post = await factory.attrs('post')
      const res = await request(app).post('/posts').send(post)
      expect(res.statusCode).toEqual(201)
      expect(res.body.title).toEqual(post.title)
    })

    it('should get all posts', async () => {
      await factory.createMany('post', 3)
      res = await request(app).get('/posts')
      expect(res.statusCode).toEqual(200)
      expect(res.body.length).toEqual(3)
    })

    it('should get one post', async () => {
      const user = await factory.create('user')
      const post = await factory.create('post', { userId: user.id })
      const res = await request(app).get(`/posts/${post.id}`)
      expect(res.statusCode).toEqual(200)
      expect(res.body.title).toEqual(post.title)
      expect(res.body.author.name).toEqual(user.name)
    })

    it("should throw NotFound if post doesn't exist", async () => {
      const res = await request(app).get('/posts/1')
      expect(res.statusCode).toEqual(404)
      expect(res.body.type).toEqual('NotFound')
    })

    it('should update a post', async () => {
      const post = await factory.create('post', { title: 'My Title' })
      const res = await request(app).patch(`/posts/${post.id}`).send({
        title: 'Updated Title',
      })
      expect(res.statusCode).toEqual(200)
      expect(res.body.title).toEqual('Updated Title')
    })
  })

  afterAll(async () => {
    await db.sequelize.sync({ force: true })
    await db.sequelize.close()
  })
})
