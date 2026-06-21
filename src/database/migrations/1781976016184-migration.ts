import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1781976016184 implements MigrationInterface {
    name = 'Migration1781976016184'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "app_review" ADD "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "app_review" ADD "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "app_review" ADD "deleted_at" TIMESTAMP`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "app_review" DROP COLUMN "deleted_at"`);
        await queryRunner.query(`ALTER TABLE "app_review" DROP COLUMN "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "app_review" DROP COLUMN "createdAt"`);
    }

}
