import { Service } from 'typedi';
import { TransactionService } from '../domain';
import { PaymentType, Transaction } from '../entity';
import {
  OutOfBalanceError,
  SelfPaymentError,
  UserDestinationError,
  UserNotFoundError,
} from '../errors';
import { UserRepository } from '../repository';
import { AppDataSource } from '../shared/data/config';

@Service()
export class TransactionPayService {
  constructor(
    protected readonly transactionService: TransactionService,
    protected readonly userRepository: UserRepository,
  ) {}

  pay = async (value: number, srcUserId: number, destUserEmail: string): Promise<void> => {
    const srcUser = await this.userRepository.findById(srcUserId);
    if (!srcUser) {
      throw new UserNotFoundError();
    }

    if (srcUser.email === destUserEmail) {
      throw new SelfPaymentError();
    }

    const destUser = await this.userRepository.findByEmail(destUserEmail);
    if (!destUser) {
      throw new UserDestinationError();
    }

    const totalBalance = await this.transactionService.getBalance(srcUser);

    if (value > totalBalance) {
      throw new OutOfBalanceError();
    }

    const srcTrx = new Transaction();
    srcTrx.type = PaymentType.PAYMENT_MADE;
    srcTrx.user = srcUser;
    srcTrx.value = value;

    const destTrx = new Transaction();
    destTrx.type = PaymentType.PAYMENT_RECEIVED;
    destTrx.user = destUser;
    destTrx.value = value;

    await AppDataSource.transaction(async (transactionEntityManager) => {
      await transactionEntityManager.save(srcTrx);
      await transactionEntityManager.save(destTrx);
    });
  };
}
