import { Service } from 'typedi';
import { PaymentType, Transaction } from '../entity/transaction';
import { UserNotFoundError } from '../errors/user-not-found.error';
import { TransactionRepository } from '../repository/transaction.repository';
import { UserRepository } from '../repository/user.repository';

@Service()
export class TransactionFillService {
  constructor(
    protected readonly userRepository: UserRepository,
    protected readonly transactionRepository: TransactionRepository,
  ) {}

  fill = async (value: number, userId: number): Promise<Transaction | null> => {
    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new UserNotFoundError();
    }

    const transaction = new Transaction();
    transaction.type = PaymentType.PAYMENT_FILL;
    transaction.value = value;
    transaction.user = user;

    return this.transactionRepository.save(transaction);
  };
}
