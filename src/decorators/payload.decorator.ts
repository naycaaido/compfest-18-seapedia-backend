import { createParamDecorator, ExecutionContext, SetMetadata } from '@nestjs/common';
import { log } from 'console';
import { Payload } from 'src/common/utils';

export const PayloadJWT = createParamDecorator(
    (data:unknown,ctx:ExecutionContext) =>{
        const request = ctx.switchToHttp().getRequest()
        const payload = Payload.toEntity(request)
        return payload
    }
)
