import { Service } from 'typedi';
import { PaymentType, Transaction, User } from '../entity';
import { TransactionRepository } from '../repository';

@Service()
export class TransactionService {
  constructor(protected readonly transactionRepository: TransactionRepository) {}

  protected transactionReducer = (acc: number, current: Transaction) => {
    return acc + Number(current.value);
  };

  getBalance = async (user: User): Promise<number> => {
    const paymentFillTrx = await this.transactionRepository.getPaymentTransactions(
      user,
      PaymentType.PAYMENT_FILL,
    );
    const paymentMadeTrx = await this.transactionRepository.getPaymentTransactions(
      user,
      PaymentType.PAYMENT_MADE,
    );
    const paymentReceivedTrx = await this.transactionRepository.getPaymentTransactions(
      user,
      PaymentType.PAYMENT_RECEIVED,
    );
    const paymentWithdrawTrx = await this.transactionRepository.getPaymentTransactions(
      user,
      PaymentType.PAYMENT_WITHDRAW,
    );

    const fillTotal = paymentFillTrx.reduce(this.transactionReducer, 0);
    const madeTotal = paymentMadeTrx.reduce(this.transactionReducer, 0);
    const receivedTotal = paymentReceivedTrx.reduce(this.transactionReducer, 0);
    const withdrawTotal = paymentWithdrawTrx.reduce(this.transactionReducer, 0);

    return fillTotal - withdrawTotal - madeTotal + receivedTotal;
  };

  getTransactionsAmountByPeriod = async (
    user: User,
    startDate: Date,
    endDate: Date,
    type: PaymentType,
  ) => {
    const paymentTrx = await this.getTransactionsByPeriod(user, startDate, endDate, type);
    return paymentTrx.reduce(this.transactionReducer, 0);
  };

  getTransactionsByPeriod = (user: User, startDate: Date, endDate: Date, type: PaymentType) => {
    return this.transactionRepository.getTransactionsByPeriod(user, startDate, endDate, type);
  };
}
