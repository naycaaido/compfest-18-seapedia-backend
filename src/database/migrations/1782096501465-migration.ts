import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1782096501465 implements MigrationInterface {
    name = 'Migration1782096501465'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "buyers" RENAME COLUMN "delivery_address" TO "active_address_id"`);
        await queryRunner.query(`CREATE TABLE "address" ("createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "id" SERIAL NOT NULL, "name" character varying(255) NOT NULL, "receiver_name" character varying(255) NOT NULL, "address_detail" text NOT NULL, "latitude" numeric(10,8), "longitude" numeric(11,8), "buyer_id" integer, CONSTRAINT "PK_d92de1f82754668b5f5f5dd4fd5" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "buyers" DROP COLUMN "active_address_id"`);
        await queryRunner.query(`ALTER TABLE "buyers" ADD "active_address_id" integer`);
        await queryRunner.query(`ALTER TABLE "address" ADD CONSTRAINT "FK_f2f10a9335015f7ab3fd339e557" FOREIGN KEY ("buyer_id") REFERENCES "buyers"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "address" DROP CONSTRAINT "FK_f2f10a9335015f7ab3fd339e557"`);
        await queryRunner.query(`ALTER TABLE "buyers" DROP COLUMN "active_address_id"`);
        await queryRunner.query(`ALTER TABLE "buyers" ADD "active_address_id" character varying(255)`);
        await queryRunner.query(`DROP TABLE "address"`);
        await queryRunner.query(`ALTER TABLE "buyers" RENAME COLUMN "active_address_id" TO "delivery_address"`);
    }

}
