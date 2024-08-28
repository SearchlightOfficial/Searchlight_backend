import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";
import { Login as ILogin } from "./auth.interface";

export class Login implements ILogin {
  @ApiProperty({
    description: "아이디",
    example: "아이디",
  })
  @IsString()
  @IsNotEmpty()
  id: string;

  @ApiProperty({
    description: "비밀번호",
    example: "비밀번호",
  })
  @IsString()
  @IsNotEmpty()
  password: string;
}
