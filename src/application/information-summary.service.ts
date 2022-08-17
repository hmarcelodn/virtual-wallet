import { Service } from 'typedi';
import { getCustomRepository } from 'typeorm';
import { TransactionService } from '../domain/transaction.service';
import { PaymentType } from '../entity/transaction';
import { UserNotFoundError } from '../errors/user-not-found.error';
import { SummaryInputDto } from '../model/summary-input.dto';
import { UserRepository } from '../repository/user.repository';
import { ExchangeRateService } from './exchange-rate.service';

@Service()
export class InformationSummaryService {
  constructor(
    protected readonly transactionService: TransactionService,
    protected readonly exchangeRateService: ExchangeRateService,
  ) {}

  summary = async (userId: number, summaryInput: SummaryInputDto) => {
    const userRepository = getCustomRepository(UserRepository);

    const user = await userRepository.findOne({ id: userId });

    if (!user) {
      throw new UserNotFoundError();
    }

    let filledAmount = await this.transactionService.getTransactionsAmountByPeriod(
      user,
      summaryInput!.startDate,
      summaryInput.endDate,
      PaymentType.PAYMENT_FILL,
    );
    let madeAmount = await this.transactionService.getTransactionsAmountByPeriod(
      user,
      summaryInput!.startDate,
      summaryInput.endDate,
      PaymentType.PAYMENT_MADE,
    );
    let receivedAmount = await this.transactionService.getTransactionsAmountByPeriod(
      user,
      summaryInput!.startDate,
      summaryInput.endDate,
      PaymentType.PAYMENT_RECEIVED,
    );
    let withdrawAmount = await this.transactionService.getTransactionsAmountByPeriod(
      user,
      summaryInput!.startDate,
      summaryInput.endDate,
      PaymentType.PAYMENT_WITHDRAW,
    );

    filledAmount = await this.exchangeRateService.convert(filledAmount, summaryInput!.currency);
    madeAmount = await this.exchangeRateService.convert(madeAmount, summaryInput.currency);
    receivedAmount = await this.exchangeRateService.convert(receivedAmount, summaryInput.currency);
    withdrawAmount = await this.exchangeRateService.convert(withdrawAmount, summaryInput.currency);

    return {
      payments_received: receivedAmount,
      payments_made: madeAmount,
      withdrawn: withdrawAmount,
      filled: filledAmount,
    };
  };
}
