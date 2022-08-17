import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddDateColumnTransaction1633102455108 implements MigrationInterface {
  name = 'AddDateColumnTransaction1633102455108';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE "public"."transaction" ADD "date" TIMESTAMP NOT NULL');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE "public"."transaction" DROP COLUMN "date"');
  }
}
