import { CustomError } from './custom.error';

export class ExchangeRateNotFoundError extends CustomError {
  statusCode = 400;

  constructor(private readonly currency: string) {
    super();

    Object.setPrototypeOf(this, ExchangeRateNotFoundError.prototype);
  }

  serializeErrors(): { message: string; field?: string | undefined }[] {
    return [
      {
        message: `Exchange rate does not exist for currency ${this.currency}`,
      },
    ];
  }
}
