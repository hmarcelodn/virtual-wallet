import { Service } from 'typedi';
import { getCustomRepository, getManager } from 'typeorm';
import { TransactionService } from '../domain/transaction.service';
import { PaymentType, Transaction } from '../entity/transaction';
import { OutOfBalanceError } from '../errors/out-of-balance.error';
import { SelfPaymentError } from '../errors/self-payment.error';
import { UserDestinationError } from '../errors/user-destination.error';
import { UserNotFoundError } from '../errors/user-not-found.error';
import { UserRepository } from '../repository/user.repository';

@Service()
export class TransactionPayService {
  constructor(protected readonly transactionService: TransactionService) {}

  pay = async (value: number, srcUserId: number, destUserEmail: string): Promise<void> => {
    const userRepository = getCustomRepository(UserRepository);

    const srcUser = await userRepository.findOne({ id: srcUserId });
    if (!srcUser) {
      throw new UserNotFoundError();
    }

    if (srcUser.email === destUserEmail) {
      throw new SelfPaymentError();
    }

    const destUser = await userRepository.findByEmail(destUserEmail);
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

    await getManager().transaction(async (transactionEntityManager) => {
      await transactionEntityManager.save(srcTrx);
      await transactionEntityManager.save(destTrx);
    });
  };
}
