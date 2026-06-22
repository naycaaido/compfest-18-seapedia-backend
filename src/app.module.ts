import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule} from '@nestjs/typeorm'
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { join } from 'path';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { ResponseInterceptor } from './interceptors/response.interceptor';
import { UserModule } from './features/user/user.module';
import { BuyerModule } from './features/buyer/buyer.module';
import { SellerModule } from './features/seller/seller.module';
import { DriverModule } from './features/driver/driver.module';
import { AdminModule } from './features/admin/admin.module';
import { AuthGuard } from './guards/auth.guard';
import { WalletModule } from './features/wallet/wallet/wallet.module';
import { ReviewModule } from './features/review/review.module';
import { StoreModule } from './features/store/store.module';
import { ImageModule } from './features/image/image.module';
import { ProductModule } from './features/product/product/product.module';
import { ProductCategoryModule } from './features/product/product-category/product-category.module';
import { ProductImageModule } from './features/product/product-image/product-image.module';
import { ProductTypeModule } from './features/product/product-type/product-type.module';
import { ProductTypeItemModule } from './features/product/product-type-item/product-type-item.module';
import { WalletTransactionModule } from './features/wallet/wallet-transaction/wallet-transaction.module';
import { CartModule } from './features/cart/cart/cart.module';
import { CartItemModule } from './features/cart/cart-item/cart-item.module';
import { CartProductTypeModule } from './features/cart/cart-product-type/cart-product-type.module';
import { CartProductTypeItemModule } from './features/cart/cart-product-type-item/cart-product-type-item.module';
import { AddressModule } from './features/address/address.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type:"postgres",
      host:process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT ?? '5432', 10),
      database:process.env.DB_DATABASE,
      username:process.env.DB_USERNAME,
      password:process.env.DB_PASSWORD,

      // Supabase
      // url: process.env.DATABASE_URL,
      // ssl: { rejectUnauthorized: false },
      // retryAttempts: 1,
      // retryDelay: 1000,

      // Common
      synchronize:false,
      entities: [join(__dirname, '**', '*.entity.{ts,js}')],
      autoLoadEntities:true,
    }),
    JwtModule.register({
      global:true,
      secret:process.env.JWT_CONSTANT,
      signOptions:{
        expiresIn:'1d'
      }
    }),
    ImageModule,
    UserModule,
    BuyerModule,
    SellerModule,
    DriverModule,
    AdminModule,
    WalletModule,
    ReviewModule,
    StoreModule,
    ProductModule,
    ProductCategoryModule,
    ProductImageModule,
    ProductTypeModule,
    ProductTypeItemModule,
    WalletTransactionModule,
    CartModule,
    CartItemModule,
    CartProductTypeModule,
    CartProductTypeItemModule,
    AddressModule
  ],
  controllers: [AppController],
  providers: [
     {
      provide:APP_GUARD,
      useClass:AuthGuard
    },
    {
      provide:APP_INTERCEPTOR,
      useClass:ResponseInterceptor
    },
    AppService
  ],
})
export class AppModule {}
