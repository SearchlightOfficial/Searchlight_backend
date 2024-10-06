import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { AdminEntity } from "./admin.entity";
import { Repository } from "typeorm";
import { AdminWithPassword, CreateAdmin } from "./admin.interface";
import { SuccessResponse } from "src/types";

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(AdminEntity)
    private adminRepository: Repository<AdminEntity>,
  ) {}

  async getAdminWithPasswordById(
    id: string,
  ): Promise<AdminWithPassword | null> {
    const admin = await this.adminRepository.findOne({
      where: { id },
      select: ["uuid", "id", "password"],
    });
    if (!admin) {
      return null;
    }
    return {
      ...admin,
      uuid: admin.uuid.toString("hex"),
    };
  }

  async createAdminOnce(payload: CreateAdmin): Promise<SuccessResponse> {
    const adminExists = await this.adminRepository.findOne({
      where: { id: payload.id },
    });
    if (adminExists) {
      return { success: false, code: 25, message: "admin already exists" };
    }
    const admin = this.adminRepository.create({
      ...payload,
    });
    await this.adminRepository.insert(admin);
    return { success: true, code: 0 };
  }
}
