import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1781378266841 implements MigrationInterface {
    name = 'Migration1781378266841'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "wallets" ("id" SERIAL NOT NULL, "balance" integer NOT NULL DEFAULT '0', "user_id" integer, CONSTRAINT "REL_92558c08091598f7a4439586cd" UNIQUE ("user_id"), CONSTRAINT "PK_8402e5df5a30a229380e83e4f7e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."wallet_transactions_type_enum" AS ENUM('Top Up', 'Payment', 'Refund')`);
        await queryRunner.query(`CREATE TABLE "wallet_transactions" ("id" SERIAL NOT NULL, "type" "public"."wallet_transactions_type_enum" NOT NULL, "amount" integer NOT NULL, "description" character varying(255) NOT NULL, "sender_id" integer, "receiver_id" integer, "wallet_id" integer, CONSTRAINT "PK_5120f131bde2cda940ec1a621db" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "buyers" DROP COLUMN "wallet_balance"`);
        await queryRunner.query(`ALTER TABLE "sellers" DROP COLUMN "wallet_balance"`);
        await queryRunner.query(`ALTER TABLE "drivers" DROP COLUMN "wallet_balance"`);
        await queryRunner.query(`ALTER TABLE "wallets" ADD CONSTRAINT "FK_92558c08091598f7a4439586cda" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "wallet_transactions" ADD CONSTRAINT "FK_fe71d9d868a527f2f25cb928601" FOREIGN KEY ("sender_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "wallet_transactions" ADD CONSTRAINT "FK_17cfacdbf6c3519cf2d39b870f2" FOREIGN KEY ("receiver_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "wallet_transactions" ADD CONSTRAINT "FK_c57d19129968160f4db28fc8b28" FOREIGN KEY ("wallet_id") REFERENCES "wallets"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "wallet_transactions" DROP CONSTRAINT "FK_c57d19129968160f4db28fc8b28"`);
        await queryRunner.query(`ALTER TABLE "wallet_transactions" DROP CONSTRAINT "FK_17cfacdbf6c3519cf2d39b870f2"`);
        await queryRunner.query(`ALTER TABLE "wallet_transactions" DROP CONSTRAINT "FK_fe71d9d868a527f2f25cb928601"`);
        await queryRunner.query(`ALTER TABLE "wallets" DROP CONSTRAINT "FK_92558c08091598f7a4439586cda"`);
        await queryRunner.query(`ALTER TABLE "drivers" ADD "wallet_balance" integer NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "sellers" ADD "wallet_balance" integer NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "buyers" ADD "wallet_balance" integer NOT NULL DEFAULT '0'`);
        await queryRunner.query(`DROP TABLE "wallet_transactions"`);
        await queryRunner.query(`DROP TYPE "public"."wallet_transactions_type_enum"`);
        await queryRunner.query(`DROP TABLE "wallets"`);
    }

}
