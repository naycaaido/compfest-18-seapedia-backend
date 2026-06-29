import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1782641215189 implements MigrationInterface {
    name = 'Migration1782641215189'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "address" ADD "provinceId" integer`);
        await queryRunner.query(`ALTER TABLE "address" ADD "cityId" integer`);
        await queryRunner.query(`ALTER TABLE "address" ADD "districtId" integer`);
        await queryRunner.query(`ALTER TABLE "address" ADD "villageId" integer`);
        await queryRunner.query(`ALTER TABLE "address" ADD CONSTRAINT "FK_6b08d352c02976faa2b4b2933c3" FOREIGN KEY ("provinceId") REFERENCES "provinces"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "address" ADD CONSTRAINT "FK_3624b3085165071df70276a4000" FOREIGN KEY ("cityId") REFERENCES "cities"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "address" ADD CONSTRAINT "FK_89e09cf52a27eec4a04378bbdda" FOREIGN KEY ("districtId") REFERENCES "districts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "address" ADD CONSTRAINT "FK_91331164b63335373ef13d99088" FOREIGN KEY ("villageId") REFERENCES "villages"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "buyers" ADD CONSTRAINT "FK_62eadc143592736262fd369e4c9" FOREIGN KEY ("active_address_id") REFERENCES "address"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "buyers" DROP CONSTRAINT "FK_62eadc143592736262fd369e4c9"`);
        await queryRunner.query(`ALTER TABLE "address" DROP CONSTRAINT "FK_91331164b63335373ef13d99088"`);
        await queryRunner.query(`ALTER TABLE "address" DROP CONSTRAINT "FK_89e09cf52a27eec4a04378bbdda"`);
        await queryRunner.query(`ALTER TABLE "address" DROP CONSTRAINT "FK_3624b3085165071df70276a4000"`);
        await queryRunner.query(`ALTER TABLE "address" DROP CONSTRAINT "FK_6b08d352c02976faa2b4b2933c3"`);
        await queryRunner.query(`ALTER TABLE "address" DROP COLUMN "villageId"`);
        await queryRunner.query(`ALTER TABLE "address" DROP COLUMN "districtId"`);
        await queryRunner.query(`ALTER TABLE "address" DROP COLUMN "cityId"`);
        await queryRunner.query(`ALTER TABLE "address" DROP COLUMN "provinceId"`);
    }

}
