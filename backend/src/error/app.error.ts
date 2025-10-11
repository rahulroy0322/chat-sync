import { STATUS, type StatusType } from '../constants/status.constants';

class AppError extends Error {
  readonly status: number;
  readonly code: string;

  constructor(message: string, code: StatusType) {
    if (!message.endsWith('!')) {
      message = `${message} !`;
    }
    super(message);
    this.message = message;
    if (this.name === 'Error') {
      this.name = 'AppError';
    }
    this.status = STATUS[code] as number;
    this.code = code;
    AppError.captureStackTrace(this);
  }
}

// 4**
class BadRequestError extends AppError {
  constructor(message: string) {
    super(message, 'BAD_REQUEST');
    this.name = 'BadRequestError';
  }
}

class ValueError extends AppError {
  constructor(message: string) {
    super(message, 'BAD_REQUEST');
    this.name = 'BadRequestError';
  }
}

class UnauthorizedError extends AppError {
  constructor(message = 'You are not logged in!') {
    super(message, 'UNAUTHORIZED');
    this.name = 'UnauthorizedError';
  }
}

class ForbiddenError extends AppError {
  constructor(message = "Don't have sufficient permissions!") {
    super(message, 'FORBIDDEN');
    this.name = 'ForbiddenError';
  }
}
class NotFoundError extends AppError {
  constructor(message: string) {
    super(message, 'NOT_FOUND');
    this.name = 'NotFoundError';
  }
}

class NotAcceptableError extends AppError {
  constructor(message: string) {
    super(message, 'NOT_ACCEPTABLE');
    this.name = 'NotAcceptableError';
  }
}

class ConflictError extends AppError {
  constructor(message: string) {
    super(message, 'CONFLICT');
    this.name = 'ConflictError';
  }
}

class TooManyRequestsError extends AppError {
  constructor(message: string) {
    super(message, 'TOO_MANY_REQUESTS');
    this.name = 'TooManyRequestsError';
  }
}

// 5**
class ServerError extends AppError {
  constructor(message = 'Something went wrong!') {
    super(message, 'SERVER_ERROR');
    this.name = 'ServerError';
  }
}

class NotImplementedError extends AppError {
  constructor(message: string) {
    super(message, 'NOT_IMPLEMENTED');
    this.name = 'NotImplementedError';
  }
}

// db
class DBError extends AppError {
  constructor(message: string) {
    super(message, 'CONFLICT');
    this.name = 'DBError';
  }
}

export {
  AppError,
  // 4**
  BadRequestError,
  ValueError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  NotAcceptableError,
  ConflictError,
  TooManyRequestsError,
  // 5**
  ServerError,
  NotImplementedError,
  // db
  DBError,
};
