class BaseError extends Error {}

class InputValidationExpection extends BaseError {
  constructor(message) {
    super(message);
    this.statusCode = 422;
  }
}

class NotFoundExpection extends BaseError {
  constructor(message) {
    super(message);
    this.statusCode = 404;
  }
}

class BadRequestExpection extends BaseError {
  constructor(message) {
    super(message);
    this.statusCode = 400;
  }
}

class UnAuthorizedExpection extends BaseError {
  constructor(message) {
    super(message);
    this.statusCode = 401;
  }
}

class ForbiddenExpection extends BaseError {
  constructor(message) {
    super(message);
    this.statusCode = 403;
  }
}

export {
  InputValidationExpection,
  NotFoundExpection,
  BadRequestExpection,
  UnAuthorizedExpection,
  ForbiddenExpection,
};
