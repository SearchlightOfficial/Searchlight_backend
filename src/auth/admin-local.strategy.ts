import { Strategy } from "passport-local";
import { PassportStrategy } from "@nestjs/passport";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AdminService } from "src/admin/admin.service";
import { AdminUuid } from "src/admin/admin.interface";

@Injectable()
export class AdminLocalStrategy extends PassportStrategy(
  Strategy,
  "admin-local",
) {
  constructor(
    private authService: AuthService,
    private adminService: AdminService,
  ) {
    super({
      usernameField: "id",
      passwordField: "password",
    });
  }

  async validate(id: string, password: string): Promise<AdminUuid> {
    const admin = await this.adminService.getAdminWithPasswordById(id);
    if (!admin) {
      throw new UnauthorizedException();
    }
    const isValid = await this.authService.validatePassword(admin, password);
    if (!isValid.success) {
      throw new UnauthorizedException();
    }
    return { uuid: admin.uuid };
  }
}
