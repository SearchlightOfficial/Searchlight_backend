import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { Socket } from "socket.io";

@Injectable()
export class SocketAccessGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const client: Socket = context.switchToWs().getClient<Socket>();
    const token = client.handshake.auth.token;

    if (!token) {
      throw new UnauthorizedException("Missing authorization token");
    }

    try {
      const payload = this.jwtService.verify(token, {
        secret: this.configService.get("ACCESS_TOKEN_SECRET"),
      });

      client.user = { uuid: payload.uuid };
      return true;
    } catch {
      throw new UnauthorizedException("Invalid authorization token");
    }
  }
}
