import { Service } from 'typedi';
import { PaymentType } from '../entity';
import { UserNotFoundError } from '../errors';
import { ForecastInputDto, ForecastResponseDto } from '../model';
import { TransactionRepository, UserRepository } from '../repository';
import { ExchangeRateService } from './exchange-rate.service';

@Service()
export class InformationForecastService {
  constructor(
    protected readonly exchangeRateService: ExchangeRateService,
    protected readonly transactionRepository = new TransactionRepository(),
    protected readonly userRepository: UserRepository,
  ) {}

  forecast = async (userId: number, forecastInput: ForecastInputDto) => {
    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new UserNotFoundError();
    }

    const exchangeRate = await this.exchangeRateService.getExchangeRate(forecastInput.currency);
    const lastNDaysTrx = await this.transactionRepository.getTransactionsByLastNDays(
      user,
      forecastInput.days,
      forecastInput.type,
    );
    const forecastResponse: ForecastResponseDto = {
      dates: [],
    };

    for (const aggregatedTrx of lastNDaysTrx) {
      forecastResponse.dates!.push(aggregatedTrx.date.toString());
      const totalAmount = exchangeRate.rate * aggregatedTrx.amount;

      if (forecastInput.type === PaymentType.PAYMENT_FILL.toString()) {
        forecastResponse.payment_fill = [totalAmount];
      }

      if (forecastInput.type === PaymentType.PAYMENT_MADE.toString()) {
        forecastResponse.payment_made = [totalAmount];
      }

      if (forecastInput.type === PaymentType.PAYMENT_RECEIVED.toString()) {
        forecastResponse.payment_received = [totalAmount];
      }

      if (forecastInput.type === PaymentType.PAYMENT_WITHDRAW.toString()) {
        forecastResponse.payment_withdraw = [totalAmount];
      }
    }

    return forecastResponse;
  };
}
