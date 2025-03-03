'use strict'


const STATUS_CODES = {
  OK: 200,
  CREATED: 201
}


const REASON_STATUS_CODE = {
  OK: 'Success',
  CREATED: 'Created!'
}


class SuccessResponse {
  constructor({ message, statusCode = STATUS_CODES.OK, reasonStatusCode = REASON_STATUS_CODE.OK, metadata }) {
    this.message = message || reasonStatusCode,
      this.status = statusCode,
      this.metadata = metadata
  }

  send(res, header = {}) {
    return res.status(this.status).json(this)
  }
}

class OK extends SuccessResponse {
  constructor({ message, metadata }) {
    super({ message, metadata })
  }
}

class Created extends SuccessResponse {
  constructor({ message, statusCode = STATUS_CODES.CREATED, reasonStatusCode = REASON_STATUS_CODE.CREATED, metadata }) {
    super({ message, statusCode, reasonStatusCode, metadata })
  }
}

export { Created, OK, SuccessResponse }

