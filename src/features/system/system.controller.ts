
import { UserRoleDecorator } from 'src/decorators/user-role.decorator';
import { UserRole } from '../user/entities/role_user.enum';
import { SuccessMessage } from 'src/decorators/success-message.decorator';
import { successMessageGlobal, SuccessMessageType } from 'src/common/success';
import { SystemService } from './system.service';
import { Controller, forwardRef, Inject, Post } from '@nestjs/common';
import { OrderSchedulerService } from 'src/schedulers/refund';

@UserRoleDecorator(UserRole.ADMIN)
@Controller('system')
export class SystemController {
  constructor(
    private readonly systemService: SystemService,
    private readonly orderSchedulerService: OrderSchedulerService,
) {}
  @SuccessMessage(successMessageGlobal(SuccessMessageType.RETRIEVE,'Next day'))
  @Post('simulate-next-day')
  async simulateNextDay(
  ) {
    const result = await this.systemService.nextDay();

    await this.orderSchedulerService.processOverdueOrders();
    return result
  }
}
