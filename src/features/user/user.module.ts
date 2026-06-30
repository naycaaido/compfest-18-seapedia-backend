import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User} from './entities/user.entity';
import { UserRoles } from './entities/user_role.entity';
import { BuyerModule } from '../buyer/buyer.module';
import { SellerModule } from '../seller/seller.module';
import { DriverModule } from '../driver/driver.module';
import { AdminModule } from '../admin/admin.module';
import { SupabaseService } from 'src/supabase/supabase.service';


@Module({
  controllers: [UserController],
  imports:[
    TypeOrmModule.forFeature([
      User,
      UserRoles,
    ]),
    BuyerModule,
    SellerModule,
    DriverModule,
    AdminModule
  ],
  providers: [UserService,SupabaseService],
})
export class UserModule {}
