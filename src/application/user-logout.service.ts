import { Service } from 'typedi';
import { TokenBlackList } from '../entity';
import { TokenBlackListRepository } from '../repository';

@Service()
export class UserLogoutService {
  constructor(protected readonly tokenBlackListRepository: TokenBlackListRepository) {}

  logout = async (token: string): Promise<void> => {
    if (!(await this.tokenBlackListRepository.getToken(token))) {
      const newTokenToBlackList = new TokenBlackList();
      newTokenToBlackList.token = token;
      this.tokenBlackListRepository.save(newTokenToBlackList);
    }
  };
}
