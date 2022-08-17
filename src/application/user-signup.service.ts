import PasswordValidator from 'password-validator';
import { Service } from 'typedi';
import * as CryptoJS from 'crypto-js';
import { getCustomRepository } from 'typeorm';
import { User } from '../entity/user';
import { PasswordPolicyError } from '../errors/password-policy.error';
import { UserExistingError } from '../errors/user-existing.error';
import { UserSignupDto } from '../model/user-signup.dto';
import { UserRepository } from '../repository/user.repository';
import { GENERAL } from '../infrastructure/constants';

@Service()
export class UserSignupService {
  signup = async (userSignupInput: UserSignupDto): Promise<User> => {
    const userRepository = getCustomRepository(UserRepository);

    const schema = new PasswordValidator();
    schema
      .is()
      .min(8)
      .is()
      .max(25)
      .has()
      .uppercase()
      .has()
      .lowercase()
      .has()
      .digits()
      .has()
      .not()
      .spaces();

    if (!schema.validate(userSignupInput.password)) {
      throw new PasswordPolicyError();
    }

    const encryptedPassword = CryptoJS.AES.encrypt(
      userSignupInput.password,
      GENERAL.ENCRYPTION_TOKEN,
    );

    const newUser = new User();
    newUser.email = userSignupInput.email;
    newUser.birthDate = new Date(userSignupInput.birth_date);
    newUser.firstName = userSignupInput.first_name;
    newUser.lastName = userSignupInput.last_name;
    newUser.password = encryptedPassword.toString();
    newUser.userIdentity = userSignupInput.id;

    if (await userRepository.findByEmail(userSignupInput.email)) {
      throw new UserExistingError();
    }

    return userRepository.save(newUser);
  };
}
