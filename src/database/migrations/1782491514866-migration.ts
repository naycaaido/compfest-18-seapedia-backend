import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1782491514866 implements MigrationInterface {
    name = 'Migration1782491514866'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "provinces" ("createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "id" integer NOT NULL, "name" character varying(255) NOT NULL, CONSTRAINT "PK_2e4260eedbcad036ec53222e0c7" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "cities" ("createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "id" integer NOT NULL, "name" character varying(255) NOT NULL, CONSTRAINT "PK_4762ffb6e5d198cfec5606bc11e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "districts" ("createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "id" integer NOT NULL, "name" character varying(255) NOT NULL, CONSTRAINT "PK_972a72ff4e3bea5c7f43a2b98af" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "villages" ("createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "id" integer NOT NULL, "name" character varying(255) NOT NULL, CONSTRAINT "PK_3d9cf7c71c05c7ef684331317bd" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "stores" ADD "provinceId" integer`);
        await queryRunner.query(`ALTER TABLE "stores" ADD "cityId" integer`);
        await queryRunner.query(`ALTER TABLE "stores" ADD "districtId" integer`);
        await queryRunner.query(`ALTER TABLE "stores" ADD "villageId" integer`);
        await queryRunner.query(`ALTER TABLE "stores" ADD CONSTRAINT "FK_c00b5ece8d9d8a133c7c04adf84" FOREIGN KEY ("provinceId") REFERENCES "provinces"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "stores" ADD CONSTRAINT "FK_2d4b77997b25a4c1e6d04f2579b" FOREIGN KEY ("cityId") REFERENCES "cities"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "stores" ADD CONSTRAINT "FK_8ea583e3bcebb9ebf9aa0b0e016" FOREIGN KEY ("districtId") REFERENCES "districts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "stores" ADD CONSTRAINT "FK_a52fd1953b384ce6329798ffb35" FOREIGN KEY ("villageId") REFERENCES "villages"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "stores" DROP CONSTRAINT "FK_a52fd1953b384ce6329798ffb35"`);
        await queryRunner.query(`ALTER TABLE "stores" DROP CONSTRAINT "FK_8ea583e3bcebb9ebf9aa0b0e016"`);
        await queryRunner.query(`ALTER TABLE "stores" DROP CONSTRAINT "FK_2d4b77997b25a4c1e6d04f2579b"`);
        await queryRunner.query(`ALTER TABLE "stores" DROP CONSTRAINT "FK_c00b5ece8d9d8a133c7c04adf84"`);
        await queryRunner.query(`ALTER TABLE "stores" DROP COLUMN "villageId"`);
        await queryRunner.query(`ALTER TABLE "stores" DROP COLUMN "districtId"`);
        await queryRunner.query(`ALTER TABLE "stores" DROP COLUMN "cityId"`);
        await queryRunner.query(`ALTER TABLE "stores" DROP COLUMN "provinceId"`);
        await queryRunner.query(`DROP TABLE "villages"`);
        await queryRunner.query(`DROP TABLE "districts"`);
        await queryRunner.query(`DROP TABLE "cities"`);
        await queryRunner.query(`DROP TABLE "provinces"`);
    }

}
