import axios from 'axios';
import { Service } from 'typedi';
import { ExchangeRateRepository } from '../repository';
import { ExchangeRateResponseDto } from '../model';
import { ExchangeRate } from '../entity';
import { ExchangeRateNotFoundError } from '../errors';
import { GENERAL } from '../shared/constants';
import { AppDataSource } from '../shared/data/config';

@Service()
export class ExchangeRateService {
  constructor(protected readonly exchangeRateRepository: ExchangeRateRepository) {}

  sync = async () => {
    const todayRates = await this.exchangeRateRepository.getTodayRates();

    if (todayRates > 0) {
      return;
    }

    const exchangeRatesResponse = await axios.get<ExchangeRateResponseDto>(
      'http://api.currencylayer.com/live?access_key=c651b82abba16d81e83cc550e0b3eb33&format=1',
    );

    if (exchangeRatesResponse.status !== 200) {
      throw new Error();
    }

    const exchangeRateEntries = Object.entries(exchangeRatesResponse.data.quotes);
    const newExchangeRates = new Array<ExchangeRate>();

    for (const [key, value] of exchangeRateEntries) {
      const newExchangeRate = new ExchangeRate();
      newExchangeRate.quote = key;
      newExchangeRate.rate = value;
      newExchangeRates.push(newExchangeRate);
    }

    await AppDataSource.createQueryBuilder()
      .insert()
      .into(ExchangeRate)
      .values(newExchangeRates)
      .execute();
  };

  convert = async (amount: number, currency: string) => {
    await this.sync();
    const exchangeRate = await this.exchangeRateRepository.getConversionRate(
      GENERAL.DEFAULT_CURRENCY,
      currency,
    );

    if (!exchangeRate) {
      throw new ExchangeRateNotFoundError(currency);
    }

    return amount * exchangeRate.rate;
  };

  getExchangeRate = async (currency: string): Promise<ExchangeRate> => {
    await this.sync();
    const exchangeRate = await this.exchangeRateRepository.getConversionRate(
      GENERAL.DEFAULT_CURRENCY,
      currency,
    );

    if (!exchangeRate) {
      throw new ExchangeRateNotFoundError(currency);
    }

    return exchangeRate;
  };
}
