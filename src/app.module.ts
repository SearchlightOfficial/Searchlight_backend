import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { DatabaseModule } from "./database.module";
import { HospitalModule } from "./hospital/hospital.module";
import { AuthModule } from "./auth/auth.module";
import { FieldSelectorModule } from "./field-selector";
import { AmbulanceModule } from "./ambulance/ambulance.module";
import { GeocodingModule } from "./geocoding/geocoding.module";
import { AdminModule } from "./admin/admin.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    FieldSelectorModule,
    DatabaseModule,
    HospitalModule,
    AuthModule,
    AmbulanceModule,
    GeocodingModule,
    AdminModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
