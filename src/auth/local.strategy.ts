import { Strategy } from "passport-local";
import { PassportStrategy } from "@nestjs/passport";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { HospitalService } from "src/hospital/hospital.service";
import { HospitalUuid } from "src/ambulance/ambulance.interface";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, "local") {
  constructor(
    private authService: AuthService,
    private hospitalService: HospitalService,
  ) {
    super({
      usernameField: "id",
      passwordField: "password",
    });
  }

  async validate(id: string, password: string): Promise<HospitalUuid> {
    const hospital = await this.hospitalService.getHospitalWithPasswordById(id);
    if (!hospital) {
      throw new UnauthorizedException();
    }
    const isValid = await this.authService.validatePassword(hospital, password);
    if (!isValid.success) {
      throw new UnauthorizedException();
    }
    return { uuid: hospital.uuid };
  }
}
