import { CustomError } from './custom.error';

export class SelfPaymentError extends CustomError {
  statusCode = 400;

  constructor() {
    super();

    Object.setPrototypeOf(this, SelfPaymentError.prototype);
  }

  serializeErrors(): { message: string; field?: string | undefined }[] {
    return [
      {
        message: 'User cannot perform self-payments',
      },
    ];
  }
}
