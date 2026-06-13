import { SetMetadata } from '@nestjs/common';
import { UserRole } from 'src/features/user/entities/role_user.enum';

export const USER_ROLE_DECORATOR_KEY = 'userRoleDecoratorKey';
export const UserRoleDecorator = (...roles: UserRole[]) => SetMetadata(USER_ROLE_DECORATOR_KEY, roles);
