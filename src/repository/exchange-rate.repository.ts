import { Service } from 'typedi';
import { MoreThan } from 'typeorm';
import { ExchangeRate } from '../entity';
import { AppDataSource } from '../shared/data/config';

@Service()
export class ExchangeRateRepository {
  constructor(
    private readonly exchangeRateRepository = AppDataSource.getRepository(ExchangeRate),
  ) {}

  getTodayRates = (): Promise<number> => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return this.exchangeRateRepository.count({
      where: {
        date: MoreThan(today),
      },
    });
  };

  getConversionRate = (from: string, to: string): Promise<ExchangeRate | null> => {
    return this.exchangeRateRepository.findOne({
      where: {
        quote: `${from}${to}`,
      },
      order: { id: 'DESC' },
    });
  };
}
