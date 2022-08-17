import { MigrationInterface, QueryRunner } from 'typeorm';

export class ExchangeRateCreate1633109423860 implements MigrationInterface {
  name = 'ExchangeRateCreate1633109423860';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'CREATE TABLE "exchange_rate" ("id" SERIAL NOT NULL, "quote" character varying NOT NULL, "rate" numeric NOT NULL, "date" TIMESTAMP NOT NULL, CONSTRAINT "PK_5c5d27d2b900ef6cdeef0398472" PRIMARY KEY ("id"))',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE "exchange_rate"');
  }
}
