import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddUserRole1742200614758 implements MigrationInterface {
  name = 'AddUserRole1742200614758';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user" ADD "role" character varying NOT NULL DEFAULT 'common'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "role"`);
  }
}
