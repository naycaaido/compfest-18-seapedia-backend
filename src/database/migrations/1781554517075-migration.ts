import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1781554517075 implements MigrationInterface {
    name = 'Migration1781554517075'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."user_roles_role_enum" AS ENUM('Admin', 'Buyer', 'Seller', 'Driver')`);
        await queryRunner.query(`CREATE TABLE "user_roles" ("createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "id" SERIAL NOT NULL, "role" "public"."user_roles_role_enum" NOT NULL, "user_id" integer, CONSTRAINT "UQ_09d115a69b6014d324d592f9c42" UNIQUE ("user_id", "role"), CONSTRAINT "PK_8acd5cf26ebd158416f477de799" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "idx_user_role_user_id" ON "user_roles" ("user_id") `);
        await queryRunner.query(`CREATE TABLE "buyers" ("createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "id" SERIAL NOT NULL, "delivery_address" character varying(255), "user_id" integer, CONSTRAINT "REL_00d0563e17355f153e8a05fbc2" UNIQUE ("user_id"), CONSTRAINT "PK_aff372821d05bac04a18ff8eb87" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "product_categories" ("createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "id" SERIAL NOT NULL, "name" character varying(255) NOT NULL, CONSTRAINT "PK_7069dac60d88408eca56fdc9e0c" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "product_images" ("createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "id" SERIAL NOT NULL, "image_id" text, "product_id" integer, CONSTRAINT "UQ_2212515ba306c79f42c46a99db7" UNIQUE ("image_id"), CONSTRAINT "PK_1974264ea7265989af8392f63a1" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "idx_product_images_product_id" ON "product_images" ("product_id") `);
        await queryRunner.query(`CREATE TABLE "product_type_items" ("createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "id" SERIAL NOT NULL, "name" character varying(255) NOT NULL, "stock" integer NOT NULL DEFAULT '0', "price" integer NOT NULL DEFAULT '0', "product_type_id" integer, CONSTRAINT "CHK_63c91a20ccf3058817d1a12f04" CHECK (price >= 0), CONSTRAINT "CHK_87cd660bb3fb42b54c2ce5ad67" CHECK (stock >= 0), CONSTRAINT "PK_67031cdd9d01f144758e390a6f2" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "idx_product_type_item_product_type_id" ON "product_type_items" ("product_type_id") `);
        await queryRunner.query(`CREATE TABLE "product_types" ("createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "id" SERIAL NOT NULL, "name" character varying(255) NOT NULL, "is_multiple" boolean NOT NULL DEFAULT false, "is_required" boolean NOT NULL DEFAULT true, "product_id" integer, CONSTRAINT "PK_6ad7b08e6491a02ebc9ed82019d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "idx_product_type_product_id" ON "product_types" ("product_id") `);
        await queryRunner.query(`CREATE TABLE "products" ("createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "id" SERIAL NOT NULL, "name" character varying(255) NOT NULL, "price" integer NOT NULL DEFAULT '0', "stock" integer NOT NULL DEFAULT '0', "is_available" boolean NOT NULL DEFAULT false, "store_id" integer, "category_id" integer, CONSTRAINT "CHK_4f89fdb25537b37409d3b781c8" CHECK ("price" >= 0), CONSTRAINT "CHK_aea3ee263e1d44e36e5f5b5783" CHECK ("stock" >= 0), CONSTRAINT "PK_0806c755e0aca124e67c0cf6d7d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "idx_product_store_id" ON "products" ("store_id") `);
        await queryRunner.query(`CREATE INDEX "idx_product_product_category_id" ON "products" ("category_id") `);
        await queryRunner.query(`CREATE INDEX "idx_product_store_type" ON "products" ("store_id", "category_id") `);
        await queryRunner.query(`CREATE TABLE "stores" ("createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "id" SERIAL NOT NULL, "name" character varying(100) NOT NULL, "address" text NOT NULL, "phone_number" character varying(20) NOT NULL, "image_id" text, "latitude" numeric(10,8), "longitude" numeric(11,8), "seller_id" integer, CONSTRAINT "UQ_d562055db7e3426d4d34e48d8ed" UNIQUE ("phone_number"), CONSTRAINT "UQ_f54021fe54dab228ebefc63350e" UNIQUE ("image_id"), CONSTRAINT "PK_7aa6e7d71fa7acdd7ca43d7c9cb" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "sellers" ("createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "id" SERIAL NOT NULL, "user_id" integer, CONSTRAINT "REL_83f4670f0e114d0be3731bade8" UNIQUE ("user_id"), CONSTRAINT "PK_97337ccbf692c58e6c7682de8a2" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "drivers" ("id" SERIAL NOT NULL, "user_id" integer, CONSTRAINT "REL_8e224f1b8f05ace7cfc7c76d03" UNIQUE ("user_id"), CONSTRAINT "PK_92ab3fb69e566d3eb0cae896047" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "admins" ("id" SERIAL NOT NULL, "user_id" integer, CONSTRAINT "REL_2b901dd818a2a6486994d915a6" UNIQUE ("user_id"), CONSTRAINT "PK_e3b38270c97a854c48d2e80874e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "app_review" ("id" SERIAL NOT NULL, "reviewer_name" character varying(255) NOT NULL, "comment" character varying(255) NOT NULL, "rating" smallint NOT NULL, "user_id" integer, CONSTRAINT "PK_80c5faa110e633ec6073e01b7d7" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "users" ("createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "id" SERIAL NOT NULL, "full_name" character varying(255) NOT NULL, "email" character varying(255) NOT NULL, "password" text NOT NULL, CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."wallet_transactions_type_enum" AS ENUM('Top Up', 'Payment', 'Refund')`);
        await queryRunner.query(`CREATE TABLE "wallet_transactions" ("id" SERIAL NOT NULL, "type" "public"."wallet_transactions_type_enum" NOT NULL, "amount" integer NOT NULL, "description" character varying(255) NOT NULL, "sender_id" integer, "receiver_id" integer, "wallet_id" integer, CONSTRAINT "PK_5120f131bde2cda940ec1a621db" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "wallets" ("id" SERIAL NOT NULL, "balance" integer NOT NULL DEFAULT '0', "user_id" integer, CONSTRAINT "REL_92558c08091598f7a4439586cd" UNIQUE ("user_id"), CONSTRAINT "PK_8402e5df5a30a229380e83e4f7e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "user_roles" ADD CONSTRAINT "FK_87b8888186ca9769c960e926870" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "buyers" ADD CONSTRAINT "FK_00d0563e17355f153e8a05fbc20" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "product_images" ADD CONSTRAINT "FK_4f166bb8c2bfcef2498d97b4068" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "product_type_items" ADD CONSTRAINT "FK_7405983a98aa65e87b7919ded7d" FOREIGN KEY ("product_type_id") REFERENCES "product_types"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "product_types" ADD CONSTRAINT "FK_1909f55ada79c4c8f3d58c9fcb6" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "products" ADD CONSTRAINT "FK_68863607048a1abd43772b314ef" FOREIGN KEY ("store_id") REFERENCES "stores"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "products" ADD CONSTRAINT "FK_9a5f6868c96e0069e699f33e124" FOREIGN KEY ("category_id") REFERENCES "product_categories"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "stores" ADD CONSTRAINT "FK_540fd9716dec62b65e2d15a8ced" FOREIGN KEY ("seller_id") REFERENCES "sellers"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "sellers" ADD CONSTRAINT "FK_83f4670f0e114d0be3731bade87" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "drivers" ADD CONSTRAINT "FK_8e224f1b8f05ace7cfc7c76d03b" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "admins" ADD CONSTRAINT "FK_2b901dd818a2a6486994d915a68" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "app_review" ADD CONSTRAINT "FK_cfcc5d74707152337f8ee8b2659" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "wallet_transactions" ADD CONSTRAINT "FK_fe71d9d868a527f2f25cb928601" FOREIGN KEY ("sender_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "wallet_transactions" ADD CONSTRAINT "FK_17cfacdbf6c3519cf2d39b870f2" FOREIGN KEY ("receiver_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "wallet_transactions" ADD CONSTRAINT "FK_c57d19129968160f4db28fc8b28" FOREIGN KEY ("wallet_id") REFERENCES "wallets"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "wallets" ADD CONSTRAINT "FK_92558c08091598f7a4439586cda" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "wallets" DROP CONSTRAINT "FK_92558c08091598f7a4439586cda"`);
        await queryRunner.query(`ALTER TABLE "wallet_transactions" DROP CONSTRAINT "FK_c57d19129968160f4db28fc8b28"`);
        await queryRunner.query(`ALTER TABLE "wallet_transactions" DROP CONSTRAINT "FK_17cfacdbf6c3519cf2d39b870f2"`);
        await queryRunner.query(`ALTER TABLE "wallet_transactions" DROP CONSTRAINT "FK_fe71d9d868a527f2f25cb928601"`);
        await queryRunner.query(`ALTER TABLE "app_review" DROP CONSTRAINT "FK_cfcc5d74707152337f8ee8b2659"`);
        await queryRunner.query(`ALTER TABLE "admins" DROP CONSTRAINT "FK_2b901dd818a2a6486994d915a68"`);
        await queryRunner.query(`ALTER TABLE "drivers" DROP CONSTRAINT "FK_8e224f1b8f05ace7cfc7c76d03b"`);
        await queryRunner.query(`ALTER TABLE "sellers" DROP CONSTRAINT "FK_83f4670f0e114d0be3731bade87"`);
        await queryRunner.query(`ALTER TABLE "stores" DROP CONSTRAINT "FK_540fd9716dec62b65e2d15a8ced"`);
        await queryRunner.query(`ALTER TABLE "products" DROP CONSTRAINT "FK_9a5f6868c96e0069e699f33e124"`);
        await queryRunner.query(`ALTER TABLE "products" DROP CONSTRAINT "FK_68863607048a1abd43772b314ef"`);
        await queryRunner.query(`ALTER TABLE "product_types" DROP CONSTRAINT "FK_1909f55ada79c4c8f3d58c9fcb6"`);
        await queryRunner.query(`ALTER TABLE "product_type_items" DROP CONSTRAINT "FK_7405983a98aa65e87b7919ded7d"`);
        await queryRunner.query(`ALTER TABLE "product_images" DROP CONSTRAINT "FK_4f166bb8c2bfcef2498d97b4068"`);
        await queryRunner.query(`ALTER TABLE "buyers" DROP CONSTRAINT "FK_00d0563e17355f153e8a05fbc20"`);
        await queryRunner.query(`ALTER TABLE "user_roles" DROP CONSTRAINT "FK_87b8888186ca9769c960e926870"`);
        await queryRunner.query(`DROP TABLE "wallets"`);
        await queryRunner.query(`DROP TABLE "wallet_transactions"`);
        await queryRunner.query(`DROP TYPE "public"."wallet_transactions_type_enum"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TABLE "app_review"`);
        await queryRunner.query(`DROP TABLE "admins"`);
        await queryRunner.query(`DROP TABLE "drivers"`);
        await queryRunner.query(`DROP TABLE "sellers"`);
        await queryRunner.query(`DROP TABLE "stores"`);
        await queryRunner.query(`DROP INDEX "public"."idx_product_store_type"`);
        await queryRunner.query(`DROP INDEX "public"."idx_product_product_category_id"`);
        await queryRunner.query(`DROP INDEX "public"."idx_product_store_id"`);
        await queryRunner.query(`DROP TABLE "products"`);
        await queryRunner.query(`DROP INDEX "public"."idx_product_type_product_id"`);
        await queryRunner.query(`DROP TABLE "product_types"`);
        await queryRunner.query(`DROP INDEX "public"."idx_product_type_item_product_type_id"`);
        await queryRunner.query(`DROP TABLE "product_type_items"`);
        await queryRunner.query(`DROP INDEX "public"."idx_product_images_product_id"`);
        await queryRunner.query(`DROP TABLE "product_images"`);
        await queryRunner.query(`DROP TABLE "product_categories"`);
        await queryRunner.query(`DROP TABLE "buyers"`);
        await queryRunner.query(`DROP INDEX "public"."idx_user_role_user_id"`);
        await queryRunner.query(`DROP TABLE "user_roles"`);
        await queryRunner.query(`DROP TYPE "public"."user_roles_role_enum"`);
    }

}
