import { ExtractJwt, Strategy } from "passport-jwt";
import { PassportStrategy } from "@nestjs/passport";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class JWTStrategy extends PassportStrategy(Strategy, "jwt") {
  constructor(private config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.get("ACCESS_TOKEN_SECRET"),
    });
  }

  async validate(payload: any) {
    return { id: payload.id, name: payload.name };
  }
}
