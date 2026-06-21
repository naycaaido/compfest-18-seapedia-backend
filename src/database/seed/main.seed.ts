import { DataSource, DataSourceOptions, EntityManager } from 'typeorm';
import { runSeeders, SeederOptions } from 'typeorm-extension';
import { options } from '../../config/db.config';
import UserSeeder from './1_user.seed';
import StoreSeeder from './2_store.seed';
import ReviewSeeder from './0_review.seed';
import ProductCategorySeeder from './3_product_category.seed';
import ProductTypeSeeder from './5_product_type.seed';
import ProductTypeItemSeeder from './6_product_type_item.seed';
import ProductSeeder from './4_product.seed';
import ProductImageSeeder from './7_product_image.seed';
import SellerSeeder from './1.1_seller.seed';
import BuyerSeeder from './1.2_buyer.seed';
import DriverSeeder from './1.3_driver.seed';
import AdminSeeder from './1.4_admin.seed';
import CartSeeder from './8_cart.seed';
import WalletTransactionSeeder from './9_wallet_transaction.seed';

export interface Seeder {
    run(manager:EntityManager) :Promise<any>
}
(async () => {
    const dataSource = new DataSource(options);
    await dataSource.initialize();
    await dataSource.transaction(async(manager) =>{
        await new ReviewSeeder().run(manager)
        await new UserSeeder().run(manager)
        await new SellerSeeder().run(manager)
        await new BuyerSeeder().run(manager)
        await new DriverSeeder().run(manager)
        await new AdminSeeder().run(manager)
        await new StoreSeeder().run(manager)
        await new ProductCategorySeeder().run(manager)
        await new ProductSeeder().run(manager)
        await new ProductTypeSeeder().run(manager)
        await new ProductTypeItemSeeder().run(manager)
        await new ProductImageSeeder().run(manager)
        await new CartSeeder().run(manager)
        await new WalletTransactionSeeder().run(manager)
    })
})();