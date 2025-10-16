import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { FastifyRequest } from 'fastify';
import { AuthUser } from '../interfaces/user.interface';

declare module 'fastify' {
  interface FastifyRequest {
    user?: AuthUser;
  }
}

export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): AuthUser => {
    const request = ctx.switchToHttp().getRequest<FastifyRequest>();
    if (!request.user) {
      throw new Error('User not found in request context');
    }
    return request.user;
  },
);
