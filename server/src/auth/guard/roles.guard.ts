import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from '../../schema/user.schema';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(
      'roles',
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();

    if (user.role === UserRole.SUPER_ADMIN) {
      return true;
    }

    if (
      user.role === UserRole.ADMIN &&
      !requiredRoles.includes(UserRole.SUPER_ADMIN)
    ) {
      return true;
    }

    if (
      user.role === UserRole.SUB_ADMIN &&
      !requiredRoles.includes(UserRole.SUPER_ADMIN) &&
      !requiredRoles.includes(UserRole.ADMIN)
    ) {
      return true;
    }

    return requiredRoles.includes(user.role);
  }
}
