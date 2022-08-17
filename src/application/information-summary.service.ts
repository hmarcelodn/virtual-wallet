import { Service } from 'typedi';
import { TransactionService } from '../domain';
import { PaymentType } from '../entity';
import { UserNotFoundError } from '../errors';
import { SummaryInputDto } from '../model';
import { UserRepository } from '../repository';
import { ExchangeRateService } from './exchange-rate.service';

@Service()
export class InformationSummaryService {
  constructor(
    protected readonly transactionService: TransactionService,
    protected readonly exchangeRateService: ExchangeRateService,
    protected readonly userRepository: UserRepository,
  ) {}

  summary = async (userId: number, summaryInput: SummaryInputDto) => {
    const user = await this.userRepository.findById(userId);

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
