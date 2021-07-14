const CustomError = require('./CustomError')

module.exports = {
  NotFoundError: new CustomError(
    'NotFound',
    404,
    "The requested data doesn't exist."
  ),
}
