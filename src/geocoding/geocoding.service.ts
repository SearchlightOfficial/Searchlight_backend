import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import axios from "axios";
import { Address, Location } from "./geocoding.interface";

@Injectable()
export class GeocodingService {
  constructor(private readonly configService: ConfigService) {}

  async getAddressFromCoordinates(payload: Location): Promise<Address> {
    const { lat, lon } = payload;
    const url = `https://dapi.kakao.com/v2/local/geo/coord2address.json?x=${lon}&y=${lat}`;

    try {
      const response = await axios.get(url, {
        headers: {
          Authorization: `KakaoAK ${this.configService.get<string>("KAKAO_REST_API_KEY")}`,
        },
      });

      const documents = response.data.documents;

      if (documents.length > 0) {
        const address = documents[0].road_address
          ? documents[0].road_address.address_name
          : documents[0].address.address_name;
        return { address };
      } else {
        return { address: "No address found" };
      }
    } catch {
      return { address: "No address found" };
    }
  }
}
