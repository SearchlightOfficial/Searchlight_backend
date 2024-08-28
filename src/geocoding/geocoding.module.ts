import { Module } from "@nestjs/common";
import { GeocodingService } from "./geocoding.service";
import { GeocodingController } from "./geocoding.controller";

@Module({
  imports: [],
  controllers: [GeocodingController],
  providers: [GeocodingService],
})
export class GeocodingModule {}
