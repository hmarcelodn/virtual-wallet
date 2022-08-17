import { EntityRepository, MoreThan, Repository } from 'typeorm';
import { ExchangeRate } from '../entity/exchange-rate';

@EntityRepository(ExchangeRate)
export class ExchangeRateRepository extends Repository<ExchangeRate> {
  getTodayRates = (): Promise<number> => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return this.count({
      where: {
        date: MoreThan(today),
      },
    });
  };

  getConversionRate = (from: string, to: string): Promise<ExchangeRate | undefined> => {
    return this.findOne({
      where: {
        quote: `${from}${to}`,
      },
      order: { id: 'DESC' },
    });
  };
}
