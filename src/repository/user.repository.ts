import { EntityRepository, Repository } from 'typeorm';
import { User } from '../entity/user';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  constructor() {
    super();
  }

  findByEmail = (email: string) => {
    return this.findOne({ email });
  };
}
