import { Service } from 'typedi';
import { getCustomRepository } from 'typeorm';
import { PaymentType, Transaction } from '../entity/transaction';
import { UserNotFoundError } from '../errors/user-not-found.error';
import { TransactionRepository } from '../repository/transaction.repository';
import { UserRepository } from '../repository/user.repository';

@Service()
export class TransactionFillService {
  fill = async (value: number, userId: number): Promise<Transaction> => {
    const userRepository = getCustomRepository(UserRepository);
    const transactionRepository = getCustomRepository(TransactionRepository);

    const user = await userRepository.findOne({ id: userId });

    if (!user) {
      throw new UserNotFoundError();
    }

    const transaction = new Transaction();
    transaction.type = PaymentType.PAYMENT_FILL;
    transaction.value = value;
    transaction.user = user;

    return transactionRepository.save(transaction);
  };
}
