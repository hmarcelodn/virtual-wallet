import { Service } from 'typedi';
import { TokenBlackList } from '../entity';
import { AppDataSource } from '../shared/data/config';

@Service()
export class TokenBlackListRepository {
  constructor(
    protected readonly tokenBlackListRepository = AppDataSource.getRepository(TokenBlackList),
  ) {}

  getToken = (token: string): Promise<TokenBlackList | null> => {
    return this.tokenBlackListRepository.findOne({ where: { token } });
  };

  save = (tokenBlackList: TokenBlackList): Promise<TokenBlackList | null> => {
    return this.tokenBlackListRepository.save(tokenBlackList);
  };
}
