import { DataSource } from 'typeorm';
import { ExchangeRate } from '../../../entity/exchange-rate';
import { TokenBlackList } from '../../../entity/token-black-list';
import { Transaction } from '../../../entity/transaction';
import { User } from '../../../entity/user';
import { UserSchemaCreate1632942351633 } from '../../../migration/1632942351633-UserSchemaCreate';
import { TokenBlackListCreate1633008133169 } from '../../../migration/1633008133169-TokenBlackListCreate';
import { TransactionsCreate1633030060317 } from '../../../migration/1633030060317-TransactionsCreate';
import { AddDateColumnTransaction1633102455108 } from '../../../migration/1633102455108-AddDateColumnTransaction';
import { ExchangeRateCreate1633109423860 } from '../../../migration/1633109423860-ExchangeRateCreate';
import { TransactionAmountChangeToDecimal1634007905832 } from '../../../migration/1634007905832-TransactionAmountChangeToDecimal';
import { environment } from './environment';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: environment.TYPEORM_HOST,
  port: Number(environment.TYPEORM_PORT),
  username: environment.TYPEORM_USERNAME,
  password: environment.TYPEORM_PASSWORD,
  database: environment.TYPEORM_DATABASE,
  synchronize: false,
  logging: true,
  entities: [ExchangeRate, TokenBlackList, Transaction, User],
  migrations: [
    UserSchemaCreate1632942351633,
    TokenBlackListCreate1633008133169,
    TransactionsCreate1633030060317,
    AddDateColumnTransaction1633102455108,
    ExchangeRateCreate1633109423860,
    TransactionAmountChangeToDecimal1634007905832,
  ],
  migrationsRun: true,
});
