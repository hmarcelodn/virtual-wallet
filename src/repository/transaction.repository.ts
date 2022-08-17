import { Service } from 'typedi';
import { LessThan, MoreThan } from 'typeorm';
import { PaymentType, Transaction } from '../entity/transaction';
import { User } from '../entity/user';
import { ForecastProjectionResultDto } from '../model/forecast-projection-result.dto';
import { AppDataSource } from '../shared/data/config/data-source';

@Service()
export class TransactionRepository {
  constructor(private readonly transactionRepository = AppDataSource.getRepository(Transaction)) {}

  getTransactionsByUserId(user: User): Promise<Array<Transaction>> {
    return this.transactionRepository.find({ where: { user } });
  }

  getPaymentTransactions = (user: User, type: PaymentType) => {
    return this.transactionRepository.find({ where: { user, type } });
  };

  getTransactionsByPeriod = (
    user: User,
    startDate: Date,
    endDate: Date,
    type: PaymentType,
  ): Promise<Transaction[]> => {
    return this.transactionRepository.find({
      where: {
        user: user,
        date: MoreThan(startDate) && LessThan(endDate),
        type: type,
      },
    });
  };

  getTransactionsByLastNDays = (
    user: User,
    days: number,
    type: string,
  ): Promise<ForecastProjectionResultDto[]> => {
    const nDaysBefore = new Date();
    nDaysBefore.setHours(0, 0, 0, 0);
    nDaysBefore.setDate(nDaysBefore.getDate() - days);

    return this.transactionRepository.query(
      `
            select substring(cast(date as varchar) from 1 for 10) as date, SUM(value) as amount
            from public.transaction
            where type=$1
            group by substring(cast(date as varchar) from 1 for 10);
        `,
      [type],
    );
  };

  save = (transaction: Transaction): Promise<Transaction | null> => {
    return this.transactionRepository.save(transaction);
  };
}
