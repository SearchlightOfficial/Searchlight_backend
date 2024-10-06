import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  UseGuards,
} from "@nestjs/common";
import { HospitalService } from "./hospital.service";
import { Hospital, HospitalInfo } from "./hospital.interface";
import {
  CreateHospital,
  FetchHospitalData,
  GetHospitalByName,
  UpdateHospital,
} from "./hospital.dto";
import { SuccessResponse } from "src/types";
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
} from "@nestjs/swagger";
import {
  HospitalInfoType,
  HospitalType,
  SuccessResponseType,
} from "src/swagger/types";
import { AccessGuard } from "src/auth/access.guard";
import { User } from "src/decorators/user.decorator";
import { AdminGuard } from "src/auth/admin.guard";

@Controller("hospital")
export class HospitalController {
  constructor(private hospitalService: HospitalService) {}

  @Get()
  @UseGuards(AccessGuard)
  @ApiOperation({ summary: "Get my hospital data" })
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: "Get my hospital data",
    type: HospitalType,
  })
  async getMyData(
    @User() { uuid }: { uuid: string },
  ): Promise<Hospital | null> {
    return this.hospitalService.getMyData(uuid);
  }

  @Post("name")
  @HttpCode(200)
  @ApiOperation({ summary: "Get hospital by name" })
  @ApiResponse({
    status: 200,
    description: "Get hospital by name",
    type: HospitalType,
  })
  async getHospitalByName(
    @Body() payload: GetHospitalByName,
  ): Promise<Hospital | null> {
    return this.hospitalService.getHospitalByName(payload.name);
  }

  @Post("create")
  @UseGuards(AdminGuard)
  @ApiOperation({ summary: "Create hospital" })
  @ApiBearerAuth()
  @ApiResponse({
    status: 201,
    description: "Create hospital",
    example: { success: true, code: 0, message: "generated password" },
  })
  async createHospital(
    @Body() payload: CreateHospital,
  ): Promise<SuccessResponse> {
    return this.hospitalService.createHospital(payload);
  }

  @Patch()
  @UseGuards(AdminGuard)
  @ApiOperation({ summary: "Update hospital" })
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: "Update hospital",
    type: SuccessResponseType,
  })
  async updateHospital(
    @Body() payload: UpdateHospital,
  ): Promise<SuccessResponse> {
    return this.hospitalService.updateHospital(payload);
  }

  @Post("fetch")
  @HttpCode(200)
  @ApiOperation({ summary: "Fetch hospital data" })
  @ApiResponse({
    status: 200,
    description: "Fetch hospital data",
    type: HospitalInfoType,
    isArray: true,
  })
  async getHospitalData(
    @Body() payload: FetchHospitalData,
  ): Promise<HospitalInfo[]> {
    return await this.hospitalService.fetchHospitalData(payload);
  }

  @Get(":uuid")
  @ApiOperation({ summary: "Get hospital by uuid" })
  @ApiParam({ name: "uuid", description: "Hospital uuid" })
  @ApiResponse({
    status: 200,
    description: "Get hospital by uuid",
    type: HospitalType,
  })
  async getHospitalByUuid(
    @Param("uuid") uuid: string,
  ): Promise<Hospital | null> {
    return this.hospitalService.getHospitalByUuid(uuid);
  }

  @Delete(":uuid")
  @HttpCode(200)
  @UseGuards(AdminGuard)
  @ApiOperation({ summary: "Delete hospital" })
  @ApiBearerAuth()
  @ApiParam({ name: "uuid", description: "Hospital uuid" })
  @ApiResponse({
    status: 200,
    description: "Delete hospital",
    type: SuccessResponseType,
  })
  async deleteHospital(@Param("uuid") uuid: string): Promise<SuccessResponse> {
    return this.hospitalService.deleteHospital(uuid);
  }
}
