import { Injectable } from "@nestjs/common";
import { createClient, RedisClientType } from "redis";
import { PatientData } from "./ambulance.interface";

@Injectable()
export class AmbulanceService {
  private client: RedisClientType;

  constructor() {
    this.client = createClient({
      url: `redis://default:${process.env.REDIS_PASSWORD}@${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
    });

    this.client.connect().catch(console.error);
  }

  async addAmbulanceData(
    hospitalUuid: string,
    socketId: string,
    patientData: PatientData,
  ): Promise<void> {
    const key = `hospital:${hospitalUuid}:ambulance:${socketId}`;
    const value = JSON.stringify(patientData);
    await this.client.set(key, value);
  }

  async getAmbulanceData(
    hospitalUuid: string,
    socketId: string,
  ): Promise<PatientData | null> {
    const key = `hospital:${hospitalUuid}:ambulance:${socketId}`;
    const data = await this.client.get(key);
    return data ? JSON.parse(data) : null;
  }

  async updateAmbulanceData(
    hospitalUuid: string,
    socketId: string,
    patientData: PatientData,
  ): Promise<void> {
    const key = `hospital:${hospitalUuid}:ambulance:${socketId}`;
    const value = JSON.stringify(patientData);
    await this.client.set(key, value);
  }

  async removeAmbulanceData(
    hospitalUuid: string,
    socketId: string,
  ): Promise<void> {
    const key = `hospital:${hospitalUuid}:ambulance:${socketId}`;
    await this.client.del(key);
  }

  async getAllAmbulanceData(hospitalUuid: string): Promise<PatientData[]> {
    const keys = await this.client.keys(`hospital:${hospitalUuid}:ambulance:*`);
    const allData: PatientData[] = [];

    for (const key of keys) {
      const data = await this.client.get(key);
      if (data) {
        allData.push(JSON.parse(data));
      }
    }

    return allData;
  }

  async addClient(hospitalUuid: string, socketId: string): Promise<void> {
    const key = `hospital:${hospitalUuid}`;
    await this.client.set(key, socketId);
  }

  async getClient(hospitalUuid: string): Promise<string | null> {
    const key = `hospital:${hospitalUuid}`;
    return await this.client.get(key);
  }

  async removeClient(hospitalUuid: string): Promise<void> {
    const key = `hospital:${hospitalUuid}`;
    await this.client.del(key);
  }

  async clearAllHospitalData(): Promise<void> {
    const keys = await this.client.keys("hospital:*");
    if (keys.length) {
      await this.client.del(keys);
    }
  }
}
