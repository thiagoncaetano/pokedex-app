export class HTTPError extends Error {
  status: number;
  code: string;

  constructor(status: number, message: string, code = "ERROR") {
    super(message);
    this.status = status;
    this.code = code;
    this.name = this.constructor.name;
  }
}

export class BadRequestError extends HTTPError {
  constructor(message = "Bad Request") {
    super(400, message, "BAD_REQUEST");
  }
}

export class NotFoundError extends HTTPError {
  constructor(message = "Not Found") {
    super(404, message, "NOT_FOUND");
  }
}

export class ForbiddenError extends HTTPError {
  constructor(message = "Forbidden") {
    super(403, message, "FORBIDDEN");
  }
}

export class ConflictError extends HTTPError {
  constructor(message = "Conflict") {
    super(409, message, "CONFLICT");
  }
}

export class UnauthorizedError extends HTTPError {
  constructor(message = "Unauthorized") {
    super(401, message, "UNAUTHORIZED");
  }
}
