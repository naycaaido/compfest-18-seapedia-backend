import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const MultipartData = createParamDecorator(
    (data:string, ctx:ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest()
        return {
            dto:(request as any).dto,
            file:(request as any).files?.[data]
        }
    }
)
