import { Service } from 'typedi';
import { getCustomRepository } from 'typeorm';
import { TransactionService } from '../domain/transaction.service';
import { UserNotFoundError } from '../errors/user-not-found.error';
import { GENERAL } from '../infrastructure/constants';
import { UserRepository } from '../repository/user.repository';
import { ExchangeRateService } from './exchange-rate.service';

@Service()
export class InformationBalanceService {
  constructor(
    protected readonly transactionService: TransactionService,
    protected readonly exchangeRateService: ExchangeRateService,
  ) {}

  getBalance = async (userId: number, currency: string): Promise<number> => {
    const userRepository = getCustomRepository(UserRepository);
    const user = await userRepository.findOne({ id: userId });

    if (!user) {
      throw new UserNotFoundError();
    }

    const userBalance = await this.transactionService.getBalance(user);

    if (currency === GENERAL.DEFAULT_CURRENCY) {
      return Promise.resolve(userBalance);
    }

    return this.exchangeRateService.convert(userBalance, currency);
  };
}
