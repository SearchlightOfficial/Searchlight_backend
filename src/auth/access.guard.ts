import { Injectable, CanActivate, ExecutionContext } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

@Injectable()
export class AccessGuard
  extends AuthGuard("jwt-access-token")
  implements CanActivate
{
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    // WebSocket인지 HTTP 요청인지 구분
    if (request.handshake) {
      const client = request.client;
      // WebSocket에서 인증된 사용자 정보가 있는지 확인
      return client;
    } else {
      return (await super.canActivate(context)) as boolean;
    }
  }
}
