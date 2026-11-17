import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable, tap } from 'rxjs';

@Injectable()
export class TimingInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext, 
    next: CallHandler
  ): Observable<any> {
    const start = Date.now();

    const request = context.switchToHttp().getRequest();

    return next
      .handle()
      .pipe(
        tap(() => {
          const end = Date.now();
          const responseTime = end - start;
          request.responseTime = responseTime;
          console.log(
            `${request.method} ${request.url} ${responseTime}ms`,)
        }),
      );
  }
}
