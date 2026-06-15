import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1781493191201 implements MigrationInterface {
    name = 'Migration1781493191201'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "buyers" ADD "deleted_at" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "stores" ADD "deleted_at" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "sellers" ADD "deleted_at" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "users" ADD "deleted_at" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "user_roles" ADD "deleted_at" TIMESTAMP`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_roles" DROP COLUMN "deleted_at"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "deleted_at"`);
        await queryRunner.query(`ALTER TABLE "sellers" DROP COLUMN "deleted_at"`);
        await queryRunner.query(`ALTER TABLE "stores" DROP COLUMN "deleted_at"`);
        await queryRunner.query(`ALTER TABLE "buyers" DROP COLUMN "deleted_at"`);
    }

}
