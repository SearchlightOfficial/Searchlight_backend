import { ApiProperty } from "@nestjs/swagger";
import {
  IsEmail,
  IsLatitude,
  IsLongitude,
  IsNotEmpty,
  IsString,
} from "class-validator";
import {
  GetHospitalByUuid as IGetHospitalByUuid,
  GetHospitalById as IGetHospitalById,
  GetHospitalByName as IGetHospitalByName,
  CreateHospital as ICreateHospital,
  UpdateHospital as IUpdateHospital,
  DeleteHospital as IDeleteHospital,
  FetchHospitalData as IFetchHospitalData,
} from "./hospital.interface";

export class GetHospitalByUuid implements IGetHospitalByUuid {
  @ApiProperty({
    description: "uuid",
    example: "3f3b3b3b3b3b3b3b3b3b3b3b3b3b3b3b",
  })
  @IsString()
  @IsNotEmpty()
  uuid: string;
}

export class GetHospitalById implements IGetHospitalById {
  @ApiProperty({
    description: "아이디",
    example: "asdf1234",
  })
  @IsString()
  @IsNotEmpty()
  id: string;
}

export class GetHospitalByName implements IGetHospitalByName {
  @ApiProperty({
    description: "병원 이름",
    example: "김성빈병원",
  })
  @IsString()
  @IsNotEmpty()
  name: string;
}

export class CreateHospital implements ICreateHospital {
  @ApiProperty({
    description: "아이디",
    example: "asdf1234",
  })
  @IsString()
  @IsNotEmpty()
  id: string;

  @ApiProperty({
    description: "병원 이름",
    example: "김성빈병원",
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: "이메일",
    example: "op@plebea.com",
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: "병원 주소",
    example: "김성빈로 123번길 45",
  })
  @IsString()
  @IsNotEmpty()
  address: string;

  @ApiProperty({
    description: "위도",
    example: 37.5172852105915,
  })
  @IsLatitude()
  @IsNotEmpty()
  latitude: number;

  @ApiProperty({
    description: "경도",
    example: 126.982167988487,
  })
  @IsLongitude()
  @IsNotEmpty()
  longitude: number;
}

export class UpdateHospital implements IUpdateHospital {
  @ApiProperty({
    description: "uuid",
    example: "3f3b3b3b3b3b3b3b3b3b3b3b3b3b3b3b",
  })
  @IsString()
  @IsNotEmpty()
  uuid: string;

  @ApiProperty({
    description: "병원 이름",
    example: "김성빈병원",
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: "이메일",
    example: "op@plebea.com",
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: "병원 주소",
    example: "김성빈로 123번길 45",
  })
  @IsString()
  @IsNotEmpty()
  address: string;

  @ApiProperty({
    description: "위도",
    example: 37.5172852105915,
  })
  @IsLatitude()
  @IsNotEmpty()
  latitude: number;

  @ApiProperty({
    description: "경도",
    example: 126.982167988487,
  })
  @IsLongitude()
  @IsNotEmpty()
  longitude: number;
}

export class DeleteHospital implements IDeleteHospital {
  @ApiProperty({
    description: "uuid",
    example: "3f3b3b3b3b3b3b3b3b3b3b3b3b3b3b3b",
  })
  @IsString()
  @IsNotEmpty()
  uuid: string;
}

export class FetchHospitalData implements IFetchHospitalData {
  @ApiProperty({
    description: "위도",
    example: "37.5172852105915",
  })
  @IsString()
  @IsNotEmpty()
  lat: string;

  @ApiProperty({
    description: "경도",
    example: "126.982167988487",
  })
  @IsString()
  @IsNotEmpty()
  lon: string;

  @ApiProperty({
    description: `병상 코드
      일반: O001
      코호트 격리: O059
      음압격리: O003
      일반격리: O004
      외상소생실: O060
      소아: O002
      소아음압격리: O048
      소아일반격리: O049`,
    example: ["O001", "O059", "O004"],
  })
  @IsString({ each: true })
  @IsNotEmpty()
  rltmEmerCds: string[];
}
