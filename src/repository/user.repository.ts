import { Service } from 'typedi';
import { User } from '../entity';
import { AppDataSource } from '../shared/data/config';

@Service()
export class UserRepository {
  constructor(protected readonly userRepository = AppDataSource.getRepository(User)) {}

  findByEmail = (email: string): Promise<User | null> => {
    return this.userRepository.findOne({ where: { email } });
  };

  findById = (id: number): Promise<User | null> => {
    return this.userRepository.findOne({ where: { id } });
  };

  save = (user: User): Promise<User | null> => {
    return this.userRepository.save(user);
  };
}
