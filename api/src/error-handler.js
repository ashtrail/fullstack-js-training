const CustomError = require('./CustomError')

function errorHandler(err, _req, res, next) {
  if (res.headersSent) return next(err)
  if (err instanceof CustomError) {
    res.status(err.code).send({
      type: err.type,
    })
  } else {
    console.log(err)
    res.status(500).send({
      type: 'unknown-error',
    })
  }
}

module.exports = errorHandler
