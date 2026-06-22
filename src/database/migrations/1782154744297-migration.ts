import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1782154744297 implements MigrationInterface {
    name = 'Migration1782154744297'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "products" DROP COLUMN "is_available"`);
        await queryRunner.query(`ALTER TABLE "products" ADD "is_available" boolean GENERATED ALWAYS AS (CASE WHEN stock = 0 THEN false ELSE true END) STORED NOT NULL`);
        await queryRunner.query(`INSERT INTO "typeorm_metadata"("database", "schema", "table", "type", "name", "value") VALUES ($1, $2, $3, $4, $5, $6)`, ["compfest_18_db","public","products","GENERATED_COLUMN","is_available","CASE WHEN stock = 0 THEN false ELSE true END"]);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DELETE FROM "typeorm_metadata" WHERE "type" = $1 AND "name" = $2 AND "database" = $3 AND "schema" = $4 AND "table" = $5`, ["GENERATED_COLUMN","is_available","compfest_18_db","public","products"]);
        await queryRunner.query(`ALTER TABLE "products" DROP COLUMN "is_available"`);
        await queryRunner.query(`ALTER TABLE "products" ADD "is_available" boolean NOT NULL DEFAULT false`);
    }

}
