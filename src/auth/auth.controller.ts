import {
  Controller,
  Get,
  Post,
  HttpCode,
  UseGuards,
  Res,
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthGuard } from "@nestjs/passport";
import { SuccessResponse } from "src/types";
import { ConfigService } from "@nestjs/config";
import { Response } from "express";
import { User } from "src/decorators/user.decorator";
import { AccessToken } from "./auth.interface";
import { ApiBody, ApiOperation, ApiResponse } from "@nestjs/swagger";
import { Login } from "./auth.dto";
import { AccessTokenType, SuccessResponseType } from "src/swagger/types";

@Controller("auth")
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  @Post("login")
  @HttpCode(200)
  @UseGuards(AuthGuard("local"))
  @ApiOperation({ summary: "Login" })
  @ApiBody({ type: Login, description: "Login" })
  @ApiResponse({
    status: 200,
    description: "Login success",
    type: SuccessResponseType,
  })
  @ApiResponse({
    status: 401,
    description: "Unauthorized",
  })
  async login(
    @User() { uuid }: { uuid: string },
    @Res({ passthrough: true }) res: Response,
  ): Promise<SuccessResponse> {
    const { refreshToken } = this.authService.getRefreshToken(uuid, false);
    res.cookie("refreshToken", refreshToken, {
      domain: this.configService.get("SERVICE_DOMAIN"),
      httpOnly: this.configService.get("NODE_ENV") === "production",
      secure: this.configService.get("NODE_ENV") === "production",
      maxAge: 60 * 60 * 24 * 7 * 1000,
    });
    return { success: true, code: 0 };
  }

  @Get("logout")
  @UseGuards(AuthGuard("jwt-refresh-token"))
  @ApiOperation({ summary: "Logout" })
  @ApiResponse({
    status: 200,
    description: "Logout success",
    type: SuccessResponseType,
  })
  async logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie("refreshToken", {
      domain: this.configService.get("SERVICE_DOMAIN"),
    });
    return { success: true, code: 0 };
  }

  @Get("refresh")
  @UseGuards(AuthGuard("jwt-refresh-token"))
  @ApiOperation({ summary: "Refresh access token" })
  @ApiResponse({
    status: 200,
    description: "Refresh access token",
    type: AccessTokenType,
  })
  async getAccessToken(
    @User() { uuid, isAdmin }: { uuid: string; isAdmin: boolean },
  ): Promise<AccessToken> {
    return this.authService.getAccessToken(uuid, isAdmin || false);
  }

  @Post("admin/login")
  @HttpCode(200)
  @UseGuards(AuthGuard("admin-local"))
  @ApiOperation({ summary: "Admin login" })
  @ApiBody({ type: Login, description: "Admin login" })
  @ApiResponse({
    status: 200,
    description: "Admin login success",
    type: SuccessResponseType,
  })
  @ApiResponse({
    status: 401,
    description: "Unauthorized",
  })
  async adminLogin(
    @User() { uuid }: { uuid: string },
    @Res({ passthrough: true }) res: Response,
  ): Promise<SuccessResponse> {
    const { refreshToken } = this.authService.getRefreshToken(uuid, true);
    res.cookie("refreshToken", refreshToken, {
      domain: this.configService.get("SERVICE_DOMAIN"),
      httpOnly: this.configService.get("NODE_ENV") === "production",
      secure: this.configService.get("NODE_ENV") === "production",
      maxAge: 60 * 60 * 24 * 7 * 1000,
    });
    return { success: true, code: 0 };
  }
}
