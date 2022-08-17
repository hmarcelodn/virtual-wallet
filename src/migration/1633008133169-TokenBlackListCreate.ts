import { MigrationInterface, QueryRunner } from 'typeorm';

export class TokenBlackListCreate1633008133169 implements MigrationInterface {
  name = 'TokenBlackListCreate1633008133169';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'CREATE TABLE "token_black_list" ("id" SERIAL NOT NULL, "token" character varying NOT NULL, CONSTRAINT "PK_65eae93c8ed8803c5777f5593f8" PRIMARY KEY ("id"))',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE "token_black_list"');
  }
}
