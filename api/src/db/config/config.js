module.exports = {
  development: {
    storage: '../../../blog-dev.sqlite3',
    dialect: 'sqlite',
  },
  test: {
    storage: '../../../blog-test.sqlite3',
    dialect: 'sqlite',
    logging: false,
  },
}
