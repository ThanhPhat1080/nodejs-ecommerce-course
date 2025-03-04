'use strict'

import {
  HTTP_REASON_PHRASES,
  HTTP_STATUS_CODES
} from '../utils/httpStatusCode.js';
class ErrorResponse extends Error {
  constructor(message, status) {
    super(message)
    this.status = status;
  }
}

class ConflictRequestError extends Error {
  constructor(message = HTTP_REASON_PHRASES.CONFLICT, statusCode = HTTP_STATUS_CODES.CONFLICT) {
    super(message, statusCode)
  }
}

class BadRequestError extends Error {
  constructor(message = HTTP_REASON_PHRASES.FORBIDDEN, statusCode = HTTP_STATUS_CODES.FORBIDDEN) {
    super(message, statusCode);
  }
}

class AuthFailureError extends Error {
  constructor(message = HTTP_REASON_PHRASES.UNAUTHORIZED, statusCode = HTTP_STATUS_CODES.UNAUTHORIZED) {
    super(message, statusCode);
  }
}
export { AuthFailureError, BadRequestError, ConflictRequestError, ErrorResponse };

