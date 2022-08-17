import { CustomError } from './custom.error';

export class UserDestinationError extends CustomError {
  statusCode = 400;

  constructor() {
    super();

    Object.setPrototypeOf(this, UserDestinationError.prototype);
  }

  serializeErrors(): { message: string; field?: string | undefined }[] {
    return [
      {
        message: 'User destination was not found',
      },
    ];
  }
}
