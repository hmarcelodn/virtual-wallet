import { EntityRepository, LessThan, MoreThan, Repository } from 'typeorm';
import { PaymentType, Transaction } from '../entity/transaction';
import { User } from '../entity/user';
import { ForecastProjectionResultDto } from '../model/forecast-projection-result.dto';

@EntityRepository(Transaction)
export class TransactionRepository extends Repository<Transaction> {
  getTransactionsByUserId(user: User): Promise<Array<Transaction>> {
    return this.find({ user });
  }

  getPaymentTransactions = (user: User, type: PaymentType) => {
    return this.find({ user, type });
  };

  getTransactionsByPeriod = (
    user: User,
    startDate: Date,
    endDate: Date,
    type: PaymentType,
  ): Promise<Transaction[]> => {
    return this.find({
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

    return this.query(
      `
            select substring(cast(date as varchar) from 1 for 10) as date, SUM(value) as amount
            from public.transaction
            where type=$1
            group by substring(cast(date as varchar) from 1 for 10);
        `,
      [type],
    );
  };
}
