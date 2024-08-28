import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { InsertResult, Repository, UpdateResult } from "typeorm";
import { HospitalService } from "./hospital.service";
import { HospitalEntity } from "./hospital.entity";
import { CreateHospital, UpdateHospital } from "./hospital.interface";

const mockHospitalRepository = () => ({
  find: jest.fn(),
  findOne: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
  insert: jest.fn(),
  update: jest.fn(),
  softDelete: jest.fn(),
});

describe("HospitalService", () => {
  let hospitalService: HospitalService;
  let hospitalRepository: Repository<HospitalEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HospitalService,
        {
          provide: getRepositoryToken(HospitalEntity),
          useValue: mockHospitalRepository,
        },
      ],
    }).compile();

    hospitalService = module.get<HospitalService>(HospitalService);
    hospitalRepository = module.get(getRepositoryToken(HospitalEntity));
  });

  const hospital: Partial<HospitalEntity> = {
    uuid: Buffer.from("3e7a", "hex"),
    id: "test id",
    name: "test name",
    email: "test@test.com",
    address: "test address",
    createdAt: new Date().toISOString(),
  };

  it("should be defined", () => {
    expect(hospitalService).toBeDefined();
  });

  describe("createHospital", () => {
    it("should create hospital", async () => {
      const createHospital: CreateHospital = {
        id: "test id",
        password: "test password",
        name: "test name",
        email: "test@test.com",
        address: "test address",
      };

      const insertSpy = jest
        .spyOn(hospitalRepository, "insert")
        .mockResolvedValue({
          identifiers: [{ id: 1 }],
        } as unknown as InsertResult);
      const createSpy = jest
        .spyOn(hospitalRepository, "create")
        .mockReturnValue(createHospital as HospitalEntity);
      const result = await hospitalService.createHospital(createHospital);
      expect(createSpy).toHaveBeenCalledWith(createHospital);
      expect(insertSpy).toHaveBeenCalledWith(createHospital);
      expect(result).toStrictEqual({ success: true, code: 1 });
    });
  });

  describe("getHospitalByUuid", () => {
    it("should return hospital", async () => {
      const uuid = "3e7a";

      const findOneSpy = jest
        .spyOn(hospitalRepository, "findOne")
        .mockResolvedValue(hospital as HospitalEntity);
      const result = await hospitalService.getHospitalByUuid(uuid);
      expect(findOneSpy).toHaveBeenCalledWith({
        where: { uuid: Buffer.from(uuid, "hex") },
      });
      expect(result).toStrictEqual({
        ...hospital,
        uuid,
      });
    });
    it("should return null when hospital is not found", async () => {
      const uuid = "3e7a";

      const findOneSpy = jest
        .spyOn(hospitalRepository, "findOne")
        .mockResolvedValue(null);
      const result = await hospitalService.getHospitalByUuid(uuid);
      expect(findOneSpy).toHaveBeenCalledWith({
        where: { uuid: Buffer.from(uuid, "hex") },
      });
      expect(result).toBeNull();
    });
  });

  describe("getHospitalsByNames", () => {
    it("should return hospitals", async () => {
      const name = "test name";

      const findSpy = jest
        .spyOn(hospitalRepository, "find")
        .mockResolvedValue([hospital] as HospitalEntity[]);
      const result = await hospitalService.getHospitalsByName(name);
      expect(findSpy).toHaveBeenCalledWith({
        where: { name: name },
      });
      expect(result).toStrictEqual([
        {
          ...hospital,
          uuid: hospital.uuid.toString("hex"),
        },
      ]);
    });
  });

  describe("getHospitalWithPasswordByUuid", () => {
    it("should return hospital with password", async () => {
      const uuid = "3e7a";

      const findOneSpy = jest
        .spyOn(hospitalRepository, "findOne")
        .mockResolvedValue(hospital as HospitalEntity);
      const result = await hospitalService.getHospitalWithPasswordByUuid(uuid);
      expect(findOneSpy).toHaveBeenCalledWith({
        where: { uuid: Buffer.from(uuid, "hex") },
        select: ["uuid", "id", "password"],
      });
      expect(result).toStrictEqual({
        ...hospital,
        uuid,
      });
    });
    it("should return null when hospital is not found", async () => {
      const uuid = "3e7a";

      const findOneSpy = jest
        .spyOn(hospitalRepository, "findOne")
        .mockResolvedValue(null);
      const result = await hospitalService.getHospitalWithPasswordByUuid(uuid);
      expect(findOneSpy).toHaveBeenCalledWith({
        where: { uuid: Buffer.from(uuid, "hex") },
        select: ["uuid", "id", "password"],
      });
      expect(result).toBeNull();
    });
  });

  describe("getHospitalWithRefreshTokenByUuid", () => {
    it("should return hospital with refresh token", async () => {
      const uuid = "3e7a";

      const findOneSpy = jest
        .spyOn(hospitalRepository, "findOne")
        .mockResolvedValue(hospital as HospitalEntity);
      const result =
        await hospitalService.getHospitalWithRefreshTokenByUuid(uuid);
      expect(findOneSpy).toHaveBeenCalledWith({
        where: { uuid: Buffer.from(uuid, "hex") },
        select: ["uuid", "refreshToken"],
      });
      expect(result).toStrictEqual({
        ...hospital,
        uuid,
      });
    });
    it("should return null when hospital is not found", async () => {
      const uuid = "3e7a";

      const findOneSpy = jest
        .spyOn(hospitalRepository, "findOne")
        .mockResolvedValue(null);
      const result =
        await hospitalService.getHospitalWithRefreshTokenByUuid(uuid);
      expect(findOneSpy).toHaveBeenCalledWith({
        where: { uuid: Buffer.from(uuid, "hex") },
        select: ["uuid", "refreshToken"],
      });
      expect(result).toBeNull();
    });
  });

  describe("getHospitalWithPasswordByID", () => {
    it("should return hospital with password", async () => {
      const id = "test id";

      const findOneSpy = jest
        .spyOn(hospitalRepository, "findOne")
        .mockResolvedValue(hospital as HospitalEntity);
      const result = await hospitalService.getHospitalWithPasswordByID(id);
      expect(findOneSpy).toHaveBeenCalledWith({
        where: { id },
        select: ["uuid", "id", "password"],
      });
      expect(result).toStrictEqual({
        ...hospital,
        uuid: hospital.uuid.toString("hex"),
      });
    });
    it("should return null when hospital is not found", async () => {
      const id = "test id";

      const findOneSpy = jest
        .spyOn(hospitalRepository, "findOne")
        .mockResolvedValue(null);
      const result = await hospitalService.getHospitalWithPasswordByID(id);
      expect(findOneSpy).toHaveBeenCalledWith({
        where: { id },
        select: ["uuid", "id", "password"],
      });
      expect(result).toBeNull();
    });
  });

  describe("updateHospital", () => {
    it("should update hospital", async () => {
      const updateHospital: UpdateHospital = {
        uuid: "3e7a",
        name: "test name",
        email: "test@test.com",
        address: "test address",
      };
      const { uuid: _uuid, ...update } = updateHospital;

      const updateSpy = jest
        .spyOn(hospitalRepository, "update")
        .mockResolvedValue({ affected: 1 } as UpdateResult);
      const result = await hospitalService.updateHospital(updateHospital);
      expect(updateSpy).toHaveBeenCalledWith(
        { uuid: Buffer.from(_uuid, "hex") },
        { ...update },
      );
      expect(result).toStrictEqual({ success: true, code: 2 });
    });
  });

  describe("deleteHospital", () => {
    it("should delete hospital", async () => {
      const uuid = "3e7a";

      const softDeleteSpy = jest
        .spyOn(hospitalRepository, "softDelete")
        .mockResolvedValue({ affected: 1 } as UpdateResult);
      const result = await hospitalService.deleteHospital(uuid);
      expect(softDeleteSpy).toHaveBeenCalledWith({
        uuid: Buffer.from(uuid, "hex"),
      });
      expect(result).toStrictEqual({ success: true, code: 3 });
    });
  });
});
