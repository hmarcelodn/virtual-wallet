import { CustomError } from './custom.error';

export class OutOfBalanceError extends CustomError {
  statusCode = 400;

  constructor() {
    super();

    Object.setPrototypeOf(this, OutOfBalanceError.prototype);
  }

  serializeErrors(): { message: string; field?: string | undefined }[] {
    return [
      {
        message: 'Wallet out of balance',
      },
    ];
  }
}
