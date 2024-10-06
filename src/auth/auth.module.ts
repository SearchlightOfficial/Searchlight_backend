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
import { AdminService } from "src/admin/admin.service";
import { AdminEntity } from "src/admin/admin.entity";
import { AdminLocalStrategy } from "./admin-local.strategy";
import { AdminStrategy } from "./admin.strategy";

@Module({
  imports: [
    JwtModule,
    PassportModule,
    TypeOrmModule.forFeature([HospitalEntity, AdminEntity]),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    LocalStrategy,
    RefreshStrategy,
    AdminLocalStrategy,
    JWTStrategy,
    AdminStrategy,
    ConfigService,
    AccessStrategy,
    HospitalService,
    AdminService,
  ],
})
export class AuthModule {}
