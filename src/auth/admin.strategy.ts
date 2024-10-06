import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";

@Injectable()
export class AdminStrategy extends PassportStrategy(Strategy, "admin-jwt") {
  constructor(private readonly config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req) => {
          if (req.handshake) {
            return req.handshake.auth.token;
          } else {
            return ExtractJwt.fromAuthHeaderAsBearerToken()(req);
          }
        },
      ]),
      secretOrKey: config.get("ACCESS_TOKEN_SECRET"),
      passReqToCallback: false,
      ignoreExpiration: false,
    });
  }

  async validate(payload: { uuid: string; isAdmin: boolean }) {
    if (!payload.isAdmin) {
      return false;
    }
    return { uuid: payload.uuid };
  }
}
