import { Test, TestingModule } from "@nestjs/testing";
import { AuthService } from "./auth.service";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { RegisterHospital } from "./auth.interface";

describe("AuthService", () => {
  let authService: AuthService;
  let configService: ConfigService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      providers: [AuthService, ConfigService, JwtService],
    }).compile();

    authService = app.get<AuthService>(AuthService);
    configService = app.get<ConfigService>(ConfigService);
    jwtService = app.get<JwtService>(JwtService);
  });

  describe("getRefreshToken", () => {
    it("should return refresh token", () => {
      const jwtSpy = jest
        .spyOn(jwtService, "sign")
        .mockReturnValue("testRefreshToken");
      const result = authService.getRefreshToken("test");
      expect(jwtSpy).toHaveBeenCalledWith(
        { uuid: "test" },
        {
          secret: configService.get<string>("REFRESH_TOKEN_SECRET"),
          expiresIn: configService.get<string>("REFRESH_TOKEN_EXPIRES_IN"),
        },
      );
      expect(result).toStrictEqual({ refreshToken: "testRefreshToken" });
    });
  });

  describe("getAccessToken", () => {
    it("should return access token", () => {
      const jwtSpy = jest
        .spyOn(jwtService, "sign")
        .mockReturnValue("testAccessToken");
      const result = authService.getAccessToken("test");
      expect(jwtSpy).toHaveBeenCalledWith(
        { uuid: "test" },
        {
          secret: configService.get<string>("ACCESS_TOKEN_SECRET"),
          expiresIn: configService.get<string>("ACCESS_TOKEN_EXPIRES_IN"),
        },
      );
      expect(result).toStrictEqual({
        accessToken: "testAccessToken",
      });
    });
  });
});
