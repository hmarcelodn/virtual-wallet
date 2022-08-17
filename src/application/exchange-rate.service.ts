import axios from 'axios';
import { getConnection, getCustomRepository } from 'typeorm';
import { ExchangeRateRepository } from '../repository/exchange-rate.repository';
import { ExchangeRateResponseDto } from '../model/exchange-rate-response.dto';
import { ExchangeRate } from '../entity/exchange-rate';
import { Service } from 'typedi';
import { ExchangeRateNotFoundError } from '../errors/exchange-rate-not-found.error';
import { GENERAL } from '../infrastructure/constants';

@Service()
export class ExchangeRateService {
  sync = async () => {
    const exchangeRateRepository = getCustomRepository(ExchangeRateRepository);
    const todayRates = await exchangeRateRepository.getTodayRates();

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

    await getConnection()
      .createQueryBuilder()
      .insert()
      .into(ExchangeRate)
      .values(newExchangeRates)
      .execute();
  };

  convert = async (amount: number, currency: string) => {
    await this.sync();
    const exchangeRateRepository = getCustomRepository(ExchangeRateRepository);
    const exchangeRate = await exchangeRateRepository.getConversionRate(
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
    const exchangeRateRepository = getCustomRepository(ExchangeRateRepository);
    const exchangeRate = await exchangeRateRepository.getConversionRate(
      GENERAL.DEFAULT_CURRENCY,
      currency,
    );

    if (!exchangeRate) {
      throw new ExchangeRateNotFoundError(currency);
    }

    return exchangeRate;
  };
}
