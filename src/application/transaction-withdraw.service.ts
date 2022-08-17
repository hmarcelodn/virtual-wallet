import { Service } from 'typedi';
import { getCustomRepository } from 'typeorm';
import { TransactionService } from '../domain/transaction.service';
import { PaymentType, Transaction } from '../entity/transaction';
import { OutOfBalanceError } from '../errors/out-of-balance.error';
import { UserNotFoundError } from '../errors/user-not-found.error';
import { TransactionRepository } from '../repository/transaction.repository';
import { UserRepository } from '../repository/user.repository';

@Service()
export class TransactionWithdrawService {
  constructor(protected readonly transactionService: TransactionService) {}

  withdraw = async (value: number, userId: number): Promise<Transaction> => {
    const transactionRepository = getCustomRepository(TransactionRepository);
    const userRepository = getCustomRepository(UserRepository);

    const user = await userRepository.findOne({ id: userId });
    if (!user) {
      throw new UserNotFoundError();
    }

    const totalBalance = await this.transactionService.getBalance(user);

    if (value > totalBalance) {
      throw new OutOfBalanceError();
    }

    const newWithdrawTrx = new Transaction();
    newWithdrawTrx.user = user;
    newWithdrawTrx.value = value;
    newWithdrawTrx.type = PaymentType.PAYMENT_WITHDRAW;

    return transactionRepository.save(newWithdrawTrx);
  };
}
