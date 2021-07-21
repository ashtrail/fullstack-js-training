const request = require('supertest')
const app = require('../../app.js')

describe('Server', () => {
  it('should ping', async () => {
    const res = await request(app).get('/ping')
    expect(res.statusCode).toEqual(200)
    expect(res.text).toEqual('pong')
  })

  it('should 404 on non-existent route', async () => {
    const res = await request(app).get('/this-route-doesnt-exist')
    expect(res.statusCode).toEqual(404)
    expect(res.text).toEqual("404 : Can't find URL /this-route-doesnt-exist")
  })
})
