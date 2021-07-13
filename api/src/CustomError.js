class CustomError extends Error {
  constructor(type, code, message = '') {
    super()
    this.type = type
    this.code = code
    this.message = message
    Error.captureStackTrace(this, CustomError)
  }
}

module.exports = CustomError
