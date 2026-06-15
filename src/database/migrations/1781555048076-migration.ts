import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1781555048076 implements MigrationInterface {
    name = 'Migration1781555048076'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."idx_store_name_active"`);
        await queryRunner.query(`DROP INDEX "public"."idx_store_seller_active"`);
        await queryRunner.query(`ALTER TABLE "stores" DROP CONSTRAINT "UQ_d562055db7e3426d4d34e48d8ed"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "stores" ADD CONSTRAINT "UQ_d562055db7e3426d4d34e48d8ed" UNIQUE ("phone_number")`);
        await queryRunner.query(`CREATE UNIQUE INDEX "idx_store_seller_active" ON "stores" ("seller_id") WHERE (deleted_at IS NULL)`);
        await queryRunner.query(`CREATE UNIQUE INDEX "idx_store_name_active" ON "stores" ("name") WHERE (deleted_at IS NULL)`);
    }

}
