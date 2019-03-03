class ApiError extends Error {
  constructor(message, statusCode, originalError) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.originalError = originalError;
    this.internalMessage = originalError? originalError.message : '';
  }
}

module.exports = ApiError;