import { Service } from 'typedi';
import { getCustomRepository } from 'typeorm';
import { PaymentType, Transaction } from '../entity/transaction';
import { User } from '../entity/user';
import { TransactionRepository } from '../repository/transaction.repository';

@Service()
export class TransactionService {
  protected transactionReducer = (acc: number, current: Transaction) => {
    return acc + current.value;
  };

  getBalance = async (user: User): Promise<number> => {
    const transactionRepository = getCustomRepository(TransactionRepository);

    const paymentFillTrx = await transactionRepository.getPaymentTransactions(
      user,
      PaymentType.PAYMENT_FILL,
    );
    const paymentMadeTrx = await transactionRepository.getPaymentTransactions(
      user,
      PaymentType.PAYMENT_MADE,
    );
    const paymentReceivedTrx = await transactionRepository.getPaymentTransactions(
      user,
      PaymentType.PAYMENT_RECEIVED,
    );
    const paymentWithdrawTrx = await transactionRepository.getPaymentTransactions(
      user,
      PaymentType.PAYMENT_WITHDRAW,
    );

    const fillTotal = paymentFillTrx.reduce(this.transactionReducer, 0);
    const madeTotal = paymentMadeTrx.reduce(this.transactionReducer, 0);
    const receivedTotal = paymentReceivedTrx.reduce(this.transactionReducer, 0);
    const withdrawTotal = paymentWithdrawTrx.reduce(this.transactionReducer, 0);

    const totalBalance = fillTotal - withdrawTotal - madeTotal + receivedTotal;

    return totalBalance;
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
    const transactionRepository = getCustomRepository(TransactionRepository);
    return transactionRepository.getTransactionsByPeriod(user, startDate, endDate, type);
  };
}
