import { ApiProperty } from "@nestjs/swagger";
import { Location as ILocation } from "./geocoding.interface";
import { IsNotEmpty, IsNumber } from "class-validator";

export class Location implements ILocation {
  @ApiProperty({
    description: "위도",
    example: 37.123456,
  })
  @IsNumber()
  @IsNotEmpty()
  lat: number;

  @ApiProperty({
    description: "경도",
    example: 127.123456,
  })
  @IsNumber()
  @IsNotEmpty()
  lon: number;
}
