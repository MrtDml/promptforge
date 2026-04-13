import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';

/**
 * Pass-through interceptor — returns the controller response as-is so that
 * each endpoint can own its own response shape without an extra wrapper layer.
 */
@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, T> {
  intercept(_context: ExecutionContext, next: CallHandler): Observable<T> {
    return next.handle();
  }
}
