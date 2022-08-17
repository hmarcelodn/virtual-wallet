import { Service } from 'typedi';
import * as _ from 'lodash';
import { TransactionService } from '../domain';
import { PaymentType, Transaction } from '../entity';
import { UserNotFoundError } from '../errors';
import { UserRepository } from '../repository';
import { ExchangeRateService } from './exchange-rate.service';
import { SeriesResultResponseDto, SeriesInputDto } from '../model';

@Service()
export class InformationSeriesService {
  constructor(
    protected readonly exchangeRateService: ExchangeRateService,
    protected readonly transactionService: TransactionService,
    protected readonly userRepository: UserRepository,
  ) {}

  series = async (
    userId: number,
    seriesInput: SeriesInputDto,
  ): Promise<SeriesResultResponseDto> => {
    const user = await this.userRepository.findById(userId);
    const exchangeRate = await this.exchangeRateService.getExchangeRate(seriesInput.currency);

    if (!user) {
      throw new UserNotFoundError();
    }

    const filledTrx = this.transactionService.getTransactionsByPeriod(
      user,
      seriesInput.startDate,
      seriesInput.endDate,
      PaymentType.PAYMENT_FILL,
    );

    const madeTrx = this.transactionService.getTransactionsByPeriod(
      user,
      seriesInput.startDate,
      seriesInput.endDate,
      PaymentType.PAYMENT_MADE,
    );

    const receivedTrx = this.transactionService.getTransactionsByPeriod(
      user,
      seriesInput.startDate,
      seriesInput.endDate,
      PaymentType.PAYMENT_RECEIVED,
    );

    const withdrawTrx = this.transactionService.getTransactionsByPeriod(
      user,
      seriesInput.startDate,
      seriesInput.endDate,
      PaymentType.PAYMENT_WITHDRAW,
    );

    const allTrxByType = await Promise.all([filledTrx, madeTrx, receivedTrx, withdrawTrx]);

    const allTrx = allTrxByType.reduce((arr, trx) => {
      return arr.concat(trx);
    }, []);

    const trxByDateMap = new Map<string, Transaction[]>();
    allTrx.forEach((trx: Transaction) => {
      const date = trx.date.toISOString().split('T')[0];

      if (!trxByDateMap.get(date)) {
        trxByDateMap.set(date, []);
      }

      trxByDateMap.get(date)!.push(trx);
    });

    const seriesResultResponse: SeriesResultResponseDto = {
      payments_received: [],
      payments_made: [],
      withdrawn: [],
      filled: [],
      dates: [],
    };

    for (const trxDate of Array.from(trxByDateMap.keys())) {
      const trxByPaymentTypeMap = new Map<string, number>();
      const trxByDate = trxByDateMap.get(trxDate);

      trxByDate!.forEach((trx: Transaction) => {
        const amount = (trxByPaymentTypeMap.get(trx.type) || 0) + trx.value;
        trxByPaymentTypeMap.set(trx.type, amount);
      });

      seriesResultResponse.payments_received.push(
        (trxByPaymentTypeMap.get(PaymentType.PAYMENT_RECEIVED) || 0) * exchangeRate.rate,
      );

      seriesResultResponse.payments_made.push(
        (trxByPaymentTypeMap.get(PaymentType.PAYMENT_MADE) || 0) * exchangeRate.rate,
      );

      seriesResultResponse.withdrawn.push(
        (trxByPaymentTypeMap.get(PaymentType.PAYMENT_WITHDRAW) || 0) * exchangeRate.rate,
      );

      seriesResultResponse.filled.push(
        (trxByPaymentTypeMap.get(PaymentType.PAYMENT_FILL) || 0) * exchangeRate.rate,
      );

      seriesResultResponse.dates.push(trxDate);
    }

    return seriesResultResponse;
  };
}
