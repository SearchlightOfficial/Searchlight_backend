import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { AccessToken, RefreshToken } from "./auth.interface";
import { SuccessResponse } from "src/types";
import * as bcrypt from "bcrypt";
import { HospitalWithPassword } from "src/hospital/hospital.interface";

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  getRefreshToken(uuid: string): RefreshToken {
    const refreshToken = this.jwtService.sign(
      { uuid },
      {
        secret: this.configService.get<string>("REFRESH_TOKEN_SECRET"),
        expiresIn: this.configService.get<string>("REFRESH_TOKEN_EXPIRES_IN"),
      },
    );
    return { refreshToken };
  }

  getAccessToken(uuid: string): AccessToken {
    const accessToken = this.jwtService.sign(
      { uuid },
      {
        secret: this.configService.get<string>("ACCESS_TOKEN_SECRET"),
        expiresIn: this.configService.get<string>("ACCESS_TOKEN_EXPIRES_IN"),
      },
    );
    return { accessToken };
  }

  async validatePassword(
    hospital: HospitalWithPassword,
    password: string,
  ): Promise<SuccessResponse> {
    const result = await bcrypt.compare(hospital.password, password);
    if (!result) {
      return { success: false, code: 23, message: "password not matched" };
    }
    return { success: true, code: 0 };
  }

  async validateRefreshToken(
    refreshToken: string,
    uuid: string,
  ): Promise<SuccessResponse> {
    try {
      this.jwtService.verify(refreshToken, {
        secret: this.configService.get<string>("REFRESH_TOKEN_SECRET"),
      });
    } catch {
      return { success: false, code: 24, message: "invalid refresh token" };
    }
    if (this.jwtService.decode(refreshToken).uuid !== uuid) {
      return { success: false, code: 25, message: "invalid refresh token" };
    }
    return { success: true, code: 0 };
  }
}
