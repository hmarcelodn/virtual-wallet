import { EntityRepository, Repository } from 'typeorm';
import { TokenBlackList } from '../entity/token-black-list';

@EntityRepository(TokenBlackList)
export class TokenBlackListRepository extends Repository<TokenBlackList> {
  getToken = (token: string) => {
    return this.findOne({ token });
  };
}
