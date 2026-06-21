import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1782055596789 implements MigrationInterface {
    name = 'Migration1782055596789'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "cart_item" ADD "sub_total" integer NOT NULL DEFAULT '0'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "cart_item" DROP COLUMN "sub_total"`);
    }

}
