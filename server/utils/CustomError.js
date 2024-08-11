class CustomError extends Error {
  constructor(message, statusCode, data) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode ?? 500;
    this.data = data;
  }
}
module.exports = {CustomError};