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
import { WalletModule } from './features/wallet/wallet.module';
import { ReviewModule } from './features/review/review.module';

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
    UserModule,
    BuyerModule,
    SellerModule,
    DriverModule,
    AdminModule,
    WalletModule,
    ReviewModule,
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
