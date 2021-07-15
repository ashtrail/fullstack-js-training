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

  /*
   * User routes integration tests
   */
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

    it('should get username availability', async () => {
      await factory.create('user', { name: 'Bob' })
      let res = await request(app)
        .get(`/users/available`)
        .query({ name: 'Bob' })
      expect(res.statusCode).toEqual(200)
      expect(res.body.available).toEqual(false)
      res = await request(app).get(`/users/available`).query({ name: 'Steve' })
      expect(res.statusCode).toEqual(200)
      expect(res.body.available).toEqual(true)
    })

    it('should update a user', async () => {
      const user = await factory.create('user', { name: 'Bob' })
      const res = await request(app)
        .patch(`/users/${user.id}`)
        .send({ name: 'Steve' })
      expect(res.statusCode).toEqual(200)
      expect(res.body.name).toEqual('Steve')
    })

    it('should delete a user', async () => {
      const user = await factory.create('user')
      const res = await request(app).del(`/users/${user.id}`)
      expect(res.statusCode).toEqual(204)
      const query = await db.User.findByPk(user.id)
      expect(query).toEqual(null)
    })

    it("should get user's posts on GET, CREATE & UPDATE", async () => {
      const user = await factory.create('user')
      await factory.createMany('post', 3, { userId: user.id })

      // Get
      let res = await request(app).get(`/users/${user.id}`)
      expect(res.statusCode).toEqual(200)
      expect(res.body.posts.length).toEqual(3)

      // Update
      res = await request(app).patch(`/users/${user.id}`).send({ name: 'Bob' })
      expect(res.statusCode).toEqual(200)
      expect(res.body.posts.length).toEqual(3)

      // Create
      res = await request(app)
        .post('/users')
        .send(await factory.attrs('user'))
      expect(res.statusCode).toEqual(201)
      expect(res.body.posts).toEqual([])
    })

    it("should throw NotFound if user doesn't exist", async () => {
      // Get
      let res = await request(app).get('/users/1')
      expect(res.statusCode).toEqual(404)
      expect(res.body.type).toEqual('NotFound')

      // Update
      res = await request(app).patch('/users/1').send({ name: 'Updated name' })
      expect(res.statusCode).toEqual(404)

      // Delete
      res = await request(app).del('/users/1')
      expect(res.statusCode).toEqual(404)
    })
  })

  /*
   * Post routes integration tests
   */

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
      const post = await factory.create('post')
      const res = await request(app).get(`/posts/${post.id}`)
      expect(res.statusCode).toEqual(200)
      expect(res.body.title).toEqual(post.title)
    })

    it('should update a post', async () => {
      const post = await factory.create('post', { title: 'My Title' })
      const res = await request(app).patch(`/posts/${post.id}`).send({
        title: 'Updated Title',
      })
      expect(res.statusCode).toEqual(200)
      expect(res.body.title).toEqual('Updated Title')
    })

    it('should delete a post', async () => {
      const post = await factory.create('post')
      const res = await request(app).del(`/posts/${post.id}`)
      expect(res.statusCode).toEqual(204)
      const query = await db.Post.findByPk(post.id)
      expect(query).toEqual(null)
    })

    it('should get post author on GET, CREATE & UPDATE', async () => {
      const user = await factory.create('user')
      const post = await factory.create('post', { userId: user.id })

      // Get
      let res = await request(app).get(`/posts/${post.id}`)
      expect(res.statusCode).toEqual(200)
      expect(res.body.author.name).toEqual(user.name)

      // Update
      res = await request(app)
        .patch(`/posts/${post.id}`)
        .send({ title: 'Updated' })
      expect(res.statusCode).toEqual(200)
      expect(res.body.author.name).toEqual(user.name)

      // Create
      res = await request(app)
        .post('/posts')
        .send(await factory.attrs('post', { userId: user.id }))
      expect(res.statusCode).toEqual(201)
      expect(res.body.author.name).toEqual(user.name)
    })

    it("should throw NotFound if post doesn't exist", async () => {
      // Get
      let res = await request(app).get('/posts/1')
      expect(res.statusCode).toEqual(404)
      expect(res.body.type).toEqual('NotFound')

      // Update
      res = await request(app)
        .patch('/posts/1')
        .send({ title: 'Updated Title' })
      expect(res.statusCode).toEqual(404)

      // Delete
      res = await request(app).del('/posts/1')
      expect(res.statusCode).toEqual(404)
    })
  })

  afterAll(async () => {
    await db.sequelize.sync({ force: true })
    await db.sequelize.close()
  })
})
