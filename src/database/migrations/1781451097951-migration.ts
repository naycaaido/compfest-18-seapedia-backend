import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1781451097951 implements MigrationInterface {
    name = 'Migration1781451097951'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "stores" ("createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "id" SERIAL NOT NULL, "name" character varying(100) NOT NULL, "address" text NOT NULL, "phone_number" character varying(20) NOT NULL, "image_id" text, "latitude" numeric(10,8), "longitude" numeric(11,8), "seller_id" integer, CONSTRAINT "UQ_a205ca5a37fa5e10005f003aaf3" UNIQUE ("name"), CONSTRAINT "UQ_d562055db7e3426d4d34e48d8ed" UNIQUE ("phone_number"), CONSTRAINT "UQ_f54021fe54dab228ebefc63350e" UNIQUE ("image_id"), CONSTRAINT "REL_540fd9716dec62b65e2d15a8ce" UNIQUE ("seller_id"), CONSTRAINT "PK_7aa6e7d71fa7acdd7ca43d7c9cb" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "buyers" DROP COLUMN "latitude"`);
        await queryRunner.query(`ALTER TABLE "buyers" DROP COLUMN "longitude"`);
        await queryRunner.query(`ALTER TABLE "stores" ADD CONSTRAINT "FK_540fd9716dec62b65e2d15a8ced" FOREIGN KEY ("seller_id") REFERENCES "sellers"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "stores" DROP CONSTRAINT "FK_540fd9716dec62b65e2d15a8ced"`);
        await queryRunner.query(`ALTER TABLE "buyers" ADD "longitude" numeric(11,8)`);
        await queryRunner.query(`ALTER TABLE "buyers" ADD "latitude" numeric(10,8)`);
        await queryRunner.query(`DROP TABLE "stores"`);
    }

}
