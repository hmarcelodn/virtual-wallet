import PasswordValidator from 'password-validator';
import { Service } from 'typedi';
import * as CryptoJS from 'crypto-js';
import { User } from '../entity/user';
import { PasswordPolicyError, UserExistingError } from '../errors';
import { UserSignupDto } from '../model';
import { UserRepository } from '../repository';
import { GENERAL } from '../shared/constants';

@Service()
export class UserSignupService {
  constructor(protected readonly userRepository: UserRepository) {}

  signup = async (userSignupInput: UserSignupDto): Promise<User | null> => {
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

    if (await this.userRepository.findByEmail(userSignupInput.email)) {
      throw new UserExistingError();
    }

    console.log(newUser);

    return this.userRepository.save(newUser);
  };
}
