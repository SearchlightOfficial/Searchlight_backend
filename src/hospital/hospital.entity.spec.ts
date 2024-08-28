import { Test, TestingModule } from "@nestjs/testing";
import { HospitalEntity } from "./hospital.entity";
import * as bcrypt from "bcrypt";

describe("HospitalEntity", () => {
  let hospitalEntity: HospitalEntity;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HospitalEntity],
    }).compile();

    hospitalEntity = await module.resolve(HospitalEntity);
  });

  describe("setUuid", () => {
    it("should set uuid", () => {
      hospitalEntity.setUuid();
      expect(hospitalEntity.uuid).toBeDefined();
    });
  });

  describe("savePassword", () => {
    it("should password be hashed", async () => {
      const password = "test";

      hospitalEntity.password = password;
      await hospitalEntity.savePassword();
      expect(
        await bcrypt.compare(password, hospitalEntity.password),
      ).toBeTruthy();
    });
  });
});
