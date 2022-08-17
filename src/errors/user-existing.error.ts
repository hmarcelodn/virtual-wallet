import { CustomError } from './custom.error';

export class UserExistingError extends CustomError {
  statusCode = 400;

  constructor() {
    super();

    Object.setPrototypeOf(this, UserExistingError.prototype);
  }

  serializeErrors(): { message: string; field?: string | undefined }[] {
    return [{ message: 'User already exist' }];
  }
}
