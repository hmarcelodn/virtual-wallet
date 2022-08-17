import { CustomError } from './custom.error';

export class PasswordPolicyError extends CustomError {
  statusCode = 400;

  constructor() {
    super();

    Object.setPrototypeOf(this, PasswordPolicyError.prototype);
  }

  serializeErrors(): { message: string; field?: string | undefined }[] {
    return [
      {
        message: 'Invalid Password Policy. Include Uppercase/Lowercase/Digits/8-25 Characters.',
      },
    ];
  }
}
