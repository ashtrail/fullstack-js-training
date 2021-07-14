const CustomError = require('../src/CustomError')
const { getById } = require('../src/db/service-helper.js')

describe('getById helper', () => {
  it('should get user by id', async () => {
    const fakeReturn = { empty: false }
    const fakeModel = {
      async findByPk(_id) {
        return fakeReturn
      },
    }
    expect(await getById(fakeModel, 1)).toBe(fakeReturn)
  })

  it('should throw error if user not found', async () => {
    const fakeModel = {
      async findByPk(_id) {
        return null
      },
    }
    try {
      await getById(fakeModel, 1)
    } catch (error) {
      expect(error instanceof CustomError).toBe(true)
      expect(error.type).toBe('NotFound')
    }
  })
})
