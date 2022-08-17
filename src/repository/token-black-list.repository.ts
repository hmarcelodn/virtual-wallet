import { Service } from 'typedi';
import { TokenBlackList } from '../entity/token-black-list';
import { AppDataSource } from '../shared/data/config/data-source';

@Service()
export class TokenBlackListRepository {
  constructor(
    private readonly tokenBlackListRepository = AppDataSource.getRepository(TokenBlackList),
  ) {}

  getToken = (token: string): Promise<TokenBlackList | null> => {
    return this.tokenBlackListRepository.findOne({ where: { token } });
  };

  save = (tokenBlackList: TokenBlackList): Promise<TokenBlackList | null> => {
    return this.tokenBlackListRepository.save(tokenBlackList);
  };
}
