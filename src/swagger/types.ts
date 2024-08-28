import { ApiProperty } from "@nestjs/swagger";
import { AccessToken } from "src/auth/auth.interface";
import {
  BedInfo,
  Hospital,
  HospitalInfo,
} from "src/hospital/hospital.interface";
import { Address } from "src/geocoding/geocoding.interface";
import { SuccessResponse } from "src/types";

export class SuccessResponseType implements SuccessResponse {
  @ApiProperty({ example: true, description: "Success status" })
  success: boolean;

  @ApiProperty({ example: 0, description: "Response code" })
  code: number;

  @ApiProperty({
    example: "Operation completed successfully",
    description: "Optional message",
  })
  message?: string;
}

export class HospitalType implements Hospital {
  @ApiProperty({ example: "uuid", description: "uuid" })
  uuid: string;

  @ApiProperty({ example: "asdf1234", description: "아이디" })
  id: string;

  @ApiProperty({ example: "op@plebea.com", description: "이메일" })
  email: string;

  @ApiProperty({ example: "김성빈병원", description: "병원 이름" })
  name: string;

  @ApiProperty({ example: "김성빈로 123번길 45", description: "병원 주소" })
  address: string;

  @ApiProperty({ example: 37.123456, description: "위도" })
  latitude: number;

  @ApiProperty({ example: 126.123456, description: "경도" })
  longitude: number;

  @ApiProperty({ example: new Date(), description: "생성일" })
  createdAt: Date;
}

export class AccessTokenType implements AccessToken {
  @ApiProperty({ example: "access token", description: "Access token" })
  accessToken: string;
}

export class BedInfoType implements BedInfo {
  @ApiProperty({ example: "일반", description: "병상 정보" })
  type: string;

  @ApiProperty({ example: "10", description: "병상 수" })
  count: string;
}

export class HospitalInfoType implements HospitalInfo {
  @ApiProperty({ example: "김성빈병원", description: "병원 이름" })
  name: string;

  @ApiProperty({ example: "1km", description: "거리" })
  distance: string;

  @ApiProperty({ example: "김성빈로 123번길 45", description: "주소" })
  address: string;

  beds: BedInfoType[];

  @ApiProperty({ example: ["응급실 운영 중"], description: "응급 메시지" })
  emergencyMessage: string[];

  @ApiProperty({ example: ["정보 없음"], description: "불가 메시지" })
  impossibleMessage: string[];
}

export class AddressType implements Address {
  @ApiProperty({
    example: "서울특별시 강남구 역삼동 123-45",
    description: "주소",
  })
  address: string;
}
