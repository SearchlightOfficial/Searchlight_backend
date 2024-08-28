import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { HospitalEntity } from "./hospital.entity";
import {
  BedInfo,
  CreateHospital,
  FetchHospitalData,
  Hospital,
  HospitalInfo,
  HospitalWithPassword,
  UpdateHospital,
} from "./hospital.interface";
import { SuccessResponse } from "src/types";
import axios from "axios";
import * as cheerio from "cheerio";

@Injectable()
export class HospitalService {
  constructor(
    @InjectRepository(HospitalEntity)
    private hospitalRepository: Repository<HospitalEntity>,
  ) {}

  async getMyData(uuid: string): Promise<Hospital | null> {
    const hospital = await this.hospitalRepository.findOne({
      where: { uuid: Buffer.from(uuid, "hex") },
    });
    if (!hospital) {
      return null;
    }
    return {
      ...hospital,
      uuid: hospital.uuid.toString("hex"),
    };
  }

  async getHospitalByUuid(uuid: string): Promise<Hospital | null> {
    const hospital = await this.hospitalRepository.findOne({
      where: { uuid: Buffer.from(uuid, "hex") },
    });
    if (!hospital) {
      return null;
    }
    return {
      ...hospital,
      uuid: hospital.uuid.toString("hex"),
    };
  }

  async getHospitalByName(name: string): Promise<Hospital | null> {
    const hospital = await this.hospitalRepository.findOne({
      where: { name },
    });
    if (!hospital) {
      return null;
    }
    return {
      ...hospital,
      uuid: hospital.uuid.toString("hex"),
    };
  }

  async getHospitalWithPasswordById(
    id: string,
  ): Promise<HospitalWithPassword | null> {
    const hospital = await this.hospitalRepository.findOne({
      where: { id },
      select: ["uuid", "id", "password"],
    });
    if (!hospital) {
      return null;
    }
    return {
      ...hospital,
      uuid: hospital.uuid.toString("hex"),
    };
  }

  async createHospital(
    createHospital: CreateHospital,
  ): Promise<SuccessResponse> {
    const password = Array.from(
      { length: 16 },
      () => Math.random().toString(36)[2],
    ).join("");
    const hospital = this.hospitalRepository.create({
      ...createHospital,
      password,
    });
    const result = await this.hospitalRepository.insert(hospital);
    if (!result.identifiers[0]) {
      return { success: false, code: 20, message: "failed to create hospital" };
    }
    return { success: true, code: 0, message: password };
  }

  async updateHospital(
    updateHospital: UpdateHospital,
  ): Promise<SuccessResponse> {
    const { uuid: _uuid, ...update } = updateHospital;
    const uuid = Buffer.from(_uuid, "hex");
    const result = await this.hospitalRepository.update(
      { uuid },
      { ...update },
    );
    if (!result.affected) {
      return { success: false, code: 21, message: "failed to update hospital" };
    }
    return { success: true, code: 1 };
  }

  async deleteHospital(uuid: string): Promise<SuccessResponse> {
    const result = await this.hospitalRepository.delete({
      uuid: Buffer.from(uuid, "hex"),
    });
    if (!result.affected) {
      return { success: false, code: 22, message: "failed to delete hospital" };
    }
    return { success: true, code: 2 };
  }

  async fetchHospitalData(payload: FetchHospitalData): Promise<HospitalInfo[]> {
    try {
      const { lon, lat, rltmEmerCds } = payload;
      const url = this.buildUrl(lon, lat, rltmEmerCds);
      const response = await axios.get(url);
      const html = response.data;
      const $ = cheerio.load(html);

      const hospitals: HospitalInfo[] = [];

      $(".main_container2 .sub_container .dash_box").each((index, element) => {
        const hospital: HospitalInfo = {
          name: "",
          distance: "",
          address: "",
          beds: [],
          emergencyMessage: [],
          impossibleMessage: [],
        };

        // 병원이름 정리
        const nameRaw = $(element).find(".org-name a").text().trim();
        const nameClean = nameRaw
          .replace(/\n|\t/g, "")
          .replace(/\s{2,}/g, "")
          .replace(/\[.*?\]/g, "")
          .trim();
        hospital.name = nameClean;

        // 거리 추출
        hospital.distance = $(element)
          .find(".info")
          .text()
          .trim()
          .split(" ")[0];

        // 주소 추출
        hospital.address =
          $(element).find(".info span[title]").attr("title") || "";

        const beds: BedInfo[] = [];
        $(element)
          .find(".bed_row .data_data")
          .each((i, el) => {
            let bedType = $(el).prev().text().trim();
            let bedCount = $(el).text().trim().replace(/\s+/g, " ");

            // ● 기호 제거
            bedCount = bedCount.replace("●", "").trim();

            // 병상 type 정보가 붙어있는 경우 분리
            // 예를 들어, "일반격리응급실일반격리+격리진료구역일반격리"를 "일반격리"로 정리
            bedType = bedType.split(/응급실|격리진료구역/)[0].trim();

            if (bedType && bedCount) {
              beds.push({ type: bedType, count: bedCount });
            }
          });
        hospital.beds = beds;

        // 병상이 존재하는 경우만 hospital.beds에 추가
        if (beds.length > 0) {
          hospital.beds = beds;
        }

        // 응급실 메시지 추출
        hospital.emergencyMessage = $(element)
          .find(".msg_list.emer_list ul li")
          .not(".bottom-msg-list li")
          .map((i, el) =>
            $(el)
              .text()
              .trim()
              .replace(/\n|\t/g, "")
              .replace(/\s{2,}/g, " ")
              .trim(),
          )
          .get();

        // 진료불가능 메시지 추출
        hospital.impossibleMessage = $(element)
          .find(".msg_list.impossible_list ul li")
          .not(".bottom-msg-list li")
          .map((i, el) =>
            $(el)
              .text()
              .trim()
              .replace(/\n|\t/g, "")
              .replace(/\s{2,}/g, " ")
              .trim(),
          )
          .get();

        hospitals.push(hospital);
      });

      return hospitals;
    } catch (error) {
      console.error("Error fetching or parsing hospital data:", error);
      throw new HttpException(
        "Failed to fetch or parse hospital data",
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  private buildUrl(lon: string, lat: string, rltmEmerCds: string[]): string {
    const baseUrl =
      "https://portal.nemc.or.kr:444/medi_info/dashboards/dash_total_emer_org_popup_for_egen.do";
    const params = new URLSearchParams({
      lon,
      lat,
      con: "on",
      radius: "20",
      afterSearch: "map",
      theme: "WHITE",
      refreshTime: "60",
      spreadAllMsg: "allClose",
      searchYn: "Y",
    });

    params.append("asort", "A");
    params.append("asort", "C");
    params.append("asort", "D");

    rltmEmerCds.forEach((code) => params.append("rltmEmerCd", code));

    return `${baseUrl}?${params.toString()}`;
  }
}
