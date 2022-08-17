import { Service } from 'typedi';
import { User } from '../entity/user';
import { AppDataSource } from '../shared/data/config/data-source';

@Service()
export class UserRepository {
  constructor(private readonly userRepository = AppDataSource.getRepository(User)) {}

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
