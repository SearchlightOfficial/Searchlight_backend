import { Body, Controller, HttpCode, Post } from "@nestjs/common";
import { GeocodingService } from "./geocoding.service";
import { Location } from "./geocoding.dto";
import { ApiOperation, ApiResponse } from "@nestjs/swagger";
import { AddressType } from "src/swagger/types";
import { Address } from "./geocoding.interface";

@Controller("geocoding")
export class GeocodingController {
  constructor(private readonly geocodingService: GeocodingService) {}

  @Post()
  @HttpCode(200)
  @ApiOperation({ summary: "Get address from coordinates" })
  @ApiResponse({
    status: 200,
    description: "Get address from coordinates",
    type: AddressType,
  })
  async getAddress(@Body() payload: Location): Promise<Address> {
    return this.geocodingService.getAddressFromCoordinates(payload);
  }
}
