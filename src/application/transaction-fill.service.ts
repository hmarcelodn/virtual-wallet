import { Service } from 'typedi';
import { PaymentType, Transaction } from '../entity';
import { UserNotFoundError } from '../errors';
import { TransactionRepository, UserRepository } from '../repository';

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
