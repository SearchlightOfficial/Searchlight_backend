import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { LocalStrategy } from "./local.strategy";
import { RefreshStrategy } from "./refresh.strategy";
import { JWTStrategy } from "./jwt.strategy";
import { ConfigService } from "@nestjs/config";
import { AccessStrategy } from "./access.strategy";
import { HospitalService } from "src/hospital/hospital.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { HospitalEntity } from "src/hospital/hospital.entity";

@Module({
  imports: [
    JwtModule,
    PassportModule,
    TypeOrmModule.forFeature([HospitalEntity]),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    LocalStrategy,
    RefreshStrategy,
    JWTStrategy,
    ConfigService,
    AccessStrategy,
    HospitalService,
  ],
})
export class AuthModule {}
