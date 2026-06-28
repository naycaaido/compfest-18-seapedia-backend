import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1782627260610 implements MigrationInterface {
    name = 'Migration1782627260610'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "wallet_transactions" ADD "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "wallet_transactions" ADD "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "wallet_transactions" ADD "deleted_at" TIMESTAMP`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "wallet_transactions" DROP COLUMN "deleted_at"`);
        await queryRunner.query(`ALTER TABLE "wallet_transactions" DROP COLUMN "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "wallet_transactions" DROP COLUMN "createdAt"`);
    }

}
