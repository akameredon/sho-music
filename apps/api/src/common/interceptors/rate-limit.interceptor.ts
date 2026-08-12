import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Observable } from 'rxjs';

const buckets = new Map<string, { count: number; resetAt: number }>();

@Injectable()
export class RateLimitInterceptor implements NestInterceptor {
  constructor(
    private readonly maxRequests = 120,
    private readonly windowMs = 60_000,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();
    const key =
      (req.user?.id as string) ||
      (req.headers['x-forwarded-for'] as string) ||
      req.ip ||
      'anonymous';

    const now = Date.now();
    let bucket = buckets.get(key);
    if (!bucket || bucket.resetAt < now) {
      bucket = { count: 0, resetAt: now + this.windowMs };
      buckets.set(key, bucket);
    }
    bucket.count += 1;
    if (bucket.count > this.maxRequests) {
      throw new HttpException(
        {
          statusCode: HttpStatus.TOO_MANY_REQUESTS,
          message: 'Rate limit exceeded',
          retryAfterMs: bucket.resetAt - now,
        },
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }
    return next.handle();
  }
}
