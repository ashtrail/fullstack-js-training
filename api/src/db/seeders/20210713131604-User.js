module.exports = {
  up: async (queryInterface, _Sequelize) => {
    await queryInterface.bulkInsert(
      'Users',
      [
        {
          name: 'John',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: 'Jane',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    )
  },

  down: async (queryInterface, _Sequelize) => {
    await queryInterface.bulkDelete('Users', null, {})
  },
}
