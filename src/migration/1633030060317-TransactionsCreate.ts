import { MigrationInterface, QueryRunner } from 'typeorm';

export class TransactionsCreate1633030060317 implements MigrationInterface {
  name = 'TransactionsCreate1633030060317';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      "CREATE TYPE \"transaction_type_enum\" AS ENUM('payment_received', 'payment_made', 'payment_withdraw', 'payment_fill')",
    );
    await queryRunner.query(
      'CREATE TABLE "transaction" ("id" SERIAL NOT NULL, "type" "transaction_type_enum" NOT NULL, "value" integer NOT NULL, "userId" integer, CONSTRAINT "PK_89eadb93a89810556e1cbcd6ab9" PRIMARY KEY ("id"))',
    );
    await queryRunner.query(
      'ALTER TABLE "transaction" ADD CONSTRAINT "FK_605baeb040ff0fae995404cea37" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE "transaction" DROP CONSTRAINT "FK_605baeb040ff0fae995404cea37"',
    );
    await queryRunner.query('DROP TABLE "transaction"');
    await queryRunner.query('DROP TYPE "transaction_type_enum"');
  }
}
