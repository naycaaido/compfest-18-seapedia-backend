import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1781555061314 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        CREATE UNIQUE INDEX idx_store_seller_active
        ON stores(seller_id)
        WHERE deleted_at IS NULL
    `);
    await queryRunner.query(`
        CREATE UNIQUE INDEX idx_store_name_active
        ON stores(name)
        WHERE deleted_at IS NULL
    `);

    await queryRunner.query(`
        CREATE UNIQUE INDEX idx_store_phone_active
        ON stores(phone_number)
        WHERE deleted_at IS NULL`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        DROP INDEX IF EXISTS idx_store_seller_active
    `);
    await queryRunner.query(`
        DROP INDEX IF EXISTS idx_store_name_active
    `);
    await queryRunner.query(`
        DROP INDEX IF EXISTS idx_store_phone_number_active
    `)
  }
}
