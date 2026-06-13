import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { log } from 'console';
import { FastifyRequest } from 'fastify';
import { PUBLICK_KEY } from 'src/decorators/public.decorator';
import { USER_ROLE_DECORATOR_KEY } from 'src/decorators/user-role.decorator';
import { UserRole } from "../features/user/entities/role_user.enum"


@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtSevice :JwtService, private reflector:Reflector){}

  async canActivate(
    context: ExecutionContext,
  ):Promise<boolean>{
    try{

    const ctx = context.switchToHttp()

    const isPublic = this.reflector.getAllAndOverride<Boolean>(PUBLICK_KEY,[
      context.getHandler(),
      context.getClass()
    ])
    log(isPublic)

    const roles = this.reflector.getAllAndOverride<Array<UserRole>>(USER_ROLE_DECORATOR_KEY,[
      context.getHandler(),
      context.getClass()
    ])
  
    if(isPublic){
      return true
    }
    const request = ctx.getRequest<FastifyRequest>()
    const token = await this.extractFromHeader(request);
    if(!token){
      throw new UnauthorizedException("Token is not provided");
    }
    const payloadVerify = await this.jwtSevice.verifyAsync(token)
    request['user'] = payloadVerify;
    if(roles != null && roles.includes(payloadVerify.role)){
      return true
    }if(roles == null){
      return true
    } else {
      return false
    }
    }catch(e:any){
      throw new UnauthorizedException();
    }
  }

  private async extractFromHeader(request:FastifyRequest){
    
    const bearer = request.headers['authorization']
    if(!bearer){
      return null
    }else{
      const token = bearer.slice(7,bearer.length)
      return token
    }
  }
}
