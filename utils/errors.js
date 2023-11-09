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

export { InputValidationExpection, NotFoundExpection, BadRequestExpection };
