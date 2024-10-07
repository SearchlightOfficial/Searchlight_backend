import { Module } from "@nestjs/common";
import { AmbulanceGateway } from "./ambulance.gateway";
import { AmbulanceService } from "./ambulance.service";
import { HospitalService } from "src/hospital/hospital.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { HospitalEntity } from "src/hospital/hospital.entity";
import { PassportModule } from "@nestjs/passport";
import { JwtModule } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";

@Module({
  imports: [
    TypeOrmModule.forFeature([HospitalEntity]),
    PassportModule,
    JwtModule,
  ],
  controllers: [],
  providers: [
    AmbulanceGateway,
    AmbulanceService,
    HospitalService,
    ConfigService,
  ],
})
export class AmbulanceModule {}
