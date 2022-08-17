import { MigrationInterface, QueryRunner } from 'typeorm';

export class UserSchemaCreate1632942351633 implements MigrationInterface {
  name = 'UserSchemaCreate1632942351633';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'CREATE TABLE "user" ("id" SERIAL NOT NULL, "firstName" character varying NOT NULL, "lastName" character varying NOT NULL, "birthDate" TIMESTAMP NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "userIdentity" character varying NOT NULL, CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE "user"');
  }
}
