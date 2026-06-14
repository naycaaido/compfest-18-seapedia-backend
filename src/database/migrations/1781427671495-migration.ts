import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1781427671495 implements MigrationInterface {
    name = 'Migration1781427671495'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "app_review" ("id" SERIAL NOT NULL, "reviewer_name" character varying(255) NOT NULL, "comment" character varying(255) NOT NULL, "rating" smallint NOT NULL, "user_id" integer, CONSTRAINT "PK_80c5faa110e633ec6073e01b7d7" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "app_review" ADD CONSTRAINT "FK_cfcc5d74707152337f8ee8b2659" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "app_review" DROP CONSTRAINT "FK_cfcc5d74707152337f8ee8b2659"`);
        await queryRunner.query(`DROP TABLE "app_review"`);
    }

}
