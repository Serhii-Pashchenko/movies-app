class ApiError extends Error {
  constructor(status, message, errors = []) {
    super(message);
    this.status = status;
    this.errors = errors;
  }

  static badRequest(message, errors = []) {
    return new ApiError(400, message, errors);
  }

  static unauthorized() {
    return new ApiError(401, 'Unauthorized');
  }

  static internalError(message, errors) {
    return new ApiError(500, message, errors);
  }

  static forbidden(message, errors) {
    return new ApiError(403, message, errors);
  }
}

module.exports = ApiError;
