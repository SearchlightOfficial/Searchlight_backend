import { Test, TestingModule } from "@nestjs/testing";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { RegisterHospital, Login } from "./auth.dto";

describe("AuthController", () => {
  let controller: AuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });

  it("register", () => {
    expect(controller.register).toBeDefined();
  });
});
