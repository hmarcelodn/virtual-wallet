import { Service } from 'typedi';
import * as CryptoJS from 'crypto-js';
import * as jwt from 'jsonwebtoken';

import { GENERAL } from '../shared/constants';
import { UserLoginDto, TokenResponseDto } from '../model';
import { UserRepository } from '../repository';
import { InvalidUsernamePasswordError } from '../errors';

@Service()
export class UserLoginService {
  constructor(protected readonly userRepository: UserRepository) {}

  login = async (model: UserLoginDto): Promise<TokenResponseDto> => {
    const user = await this.userRepository.findByEmail(model.email);

    if (!user) {
      throw new InvalidUsernamePasswordError();
    }

    const decryptedPassword = CryptoJS.AES.decrypt(user.password, GENERAL.ENCRYPTION_TOKEN);

    if (model.password !== decryptedPassword.toString(CryptoJS.enc.Utf8)) {
      throw new InvalidUsernamePasswordError();
    }

    const payload = {
      email: user.email,
      uuid: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      id: user.userIdentity,
    };

    const token = jwt.sign(payload, GENERAL.ENCRYPTION_TOKEN, {
      expiresIn: GENERAL.EXPIRATION_KEY,
    });

    return {
      token,
    };
  };
}
