import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { map, Observable } from "rxjs";
import { successMessageGlobal, SuccessMessageType } from "src/common/success";
import { SUCCESS_MESSAGE_KEY } from "src/decorators/success-message.decorator";

export interface Response<T>{
    message: string,
    data:T
}

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T,Response<T>>{
    constructor(private reflector:Reflector) {}
    intercept(context: ExecutionContext, next: CallHandler): Observable<Response<T>> {
        let message = successMessageGlobal(SuccessMessageType.RETRIEVE, 'data')
        const successMessage = this.reflector.getAllAndOverride<string>(SUCCESS_MESSAGE_KEY,[
            context.getHandler(),
            context.getClass()
        ])
        if(successMessage){
            message = successMessage
        }
        return next.handle().pipe(map(data => ({message,data})))
    }
}