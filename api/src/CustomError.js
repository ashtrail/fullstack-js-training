class CustomError extends Error {
  constructor(type, code) {
    super()
    this.type = type
    this.code = code
    Error.captureStackTrace(this, CustomError)
  }
}

module.exports = CustomError
