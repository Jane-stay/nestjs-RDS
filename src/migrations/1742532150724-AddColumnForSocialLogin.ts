import { MigrationInterface, QueryRunner } from "typeorm";

export class AddColumnForSocialLogin1742532150724 implements MigrationInterface {
    name = 'AddColumnForSocialLogin1742532150724'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "socialId" character varying`);
        await queryRunner.query(`ALTER TABLE "user" ADD "registerType" character varying NOT NULL DEFAULT 'common'`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "password" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "password" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "registerType"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "socialId"`);
    }

}
