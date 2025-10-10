import { STATUS, type StatusType } from '../constants/status.constants';

class AppError extends Error {
  readonly status: number;
  readonly code: string;

  constructor(message: string, code: StatusType) {
    if (!message.endsWith('!')) {
      message = `${message} !`;
    }
    super(message);
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

class NotFoundError extends AppError {
  constructor(message: string) {
    super(message, 'NOT_FOUND');
    this.name = 'NotFoundError';
  }
}

class ConflictError extends AppError {
  constructor(message: string) {
    super(message, 'CONFLICT');
    this.name = 'ConflictError';
  }
}

// 5**
class ServerError extends AppError {
  constructor(message = 'Something went wrong!') {
    super(message, 'SERVER_ERROR');
    this.name = 'ServerError';
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
  NotFoundError,
  ConflictError,
  // 5**
  ServerError,
  // db
  DBError,
};
