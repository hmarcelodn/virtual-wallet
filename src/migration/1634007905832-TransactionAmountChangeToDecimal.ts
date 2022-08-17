import { MigrationInterface, QueryRunner } from 'typeorm';

export class TransactionAmountChangeToDecimal1634007905832 implements MigrationInterface {
  name = 'TransactionAmountChangeToDecimal1634007905832';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE "public"."transaction" DROP COLUMN "value"');
    await queryRunner.query('ALTER TABLE "public"."transaction" ADD "value" numeric NOT NULL');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE "public"."transaction" DROP COLUMN "value"');
    await queryRunner.query('ALTER TABLE "public"."transaction" ADD "value" integer NOT NULL');
  }
}
