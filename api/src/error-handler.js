const CustomError = require('./CustomError')

function errorHandler(err, _req, res, next) {
  if (res.headersSent) return next(err)
  if (err instanceof CustomError) {
    res.status(err.code).send({
      type: err.type,
      message: err.message,
    })
  } else {
    console.log(err)
    res.status(500).send({
      type: 'UnknownError',
    })
  }
}

module.exports = errorHandler
