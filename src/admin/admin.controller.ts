import { Body, Controller, Post } from "@nestjs/common";
import { AdminService } from "./admin.service";
import { CreateAdmin } from "./admin.dto";
import { SuccessResponse } from "src/types";
import { ApiOperation, ApiResponse } from "@nestjs/swagger";
import { SuccessResponseType } from "src/swagger/types";

@Controller("admin")
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post()
  @ApiOperation({ summary: "Create admin once" })
  @ApiResponse({
    status: 200,
    description: "Create admin once",
    type: SuccessResponseType,
  })
  async createAdminOnce(
    @Body() payload: CreateAdmin,
  ): Promise<SuccessResponse> {
    return await this.adminService.createAdminOnce(payload);
  }
}
