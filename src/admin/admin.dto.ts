import { ApiProperty } from "@nestjs/swagger";
import { CreateAdmin as ICreateAdmin } from "./admin.interface";
import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class CreateAdmin implements ICreateAdmin {
  @ApiProperty({
    description: "아이디",
    example: "admin1234",
  })
  @IsString()
  @IsNotEmpty()
  id: string;

  @ApiProperty({
    description: "이메일",
    example: "admin@admin.com",
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: "비밀번호",
    example: "admin1234",
  })
  @IsString()
  @IsNotEmpty()
  password: string;
}
