import { Service } from 'typedi';
import { getCustomRepository } from 'typeorm';
import { TokenBlackList } from '../entity/token-black-list';
import { TokenBlackListRepository } from '../repository/token-black-list.repository';

@Service()
export class UserLogoutService {
  logout = async (token: string): Promise<void> => {
    const tokenBlackListRepository = getCustomRepository(TokenBlackListRepository);

    if (!(await tokenBlackListRepository.getToken(token))) {
      const newTokenToBlackList = new TokenBlackList();
      newTokenToBlackList.token = token;
      tokenBlackListRepository.save(newTokenToBlackList);
    }
  };
}
