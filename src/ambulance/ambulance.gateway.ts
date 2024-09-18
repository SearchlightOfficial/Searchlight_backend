import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  OnGatewayDisconnect,
  OnGatewayConnection,
  ConnectedSocket,
  MessageBody,
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { AmbulanceService } from "./ambulance.service";
import { HospitalService } from "src/hospital/hospital.service";
import {
  PatientData,
  LocationUpdate,
  AmbulancePatientData,
} from "./ambulance.interface";
import { UseGuards } from "@nestjs/common";
import { AccessGuard } from "src/auth/access.guard";

@WebSocketGateway({ namespace: "ambulance", cors: true })
export class AmbulanceGateway
  implements OnGatewayDisconnect, OnGatewayConnection
{
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly ambulanceService: AmbulanceService,
    private readonly hospitalService: HospitalService,
  ) {}

  private connectedClients: Map<string, string> = new Map();
  private hospitalUuidMap: Map<string, string> = new Map();

  async onModuleInit(): Promise<void> {
    await this.ambulanceService.clearAllHospitalData();
  }

  async handleConnection(@ConnectedSocket() client: Socket): Promise<void> {
    console.log(`Client connected: ${client.id}`);
  }

  async handleDisconnect(@ConnectedSocket() client: Socket): Promise<void> {
    const socketId = client.id;
    const hospitalUuid = this.connectedClients.get(socketId);

    if (hospitalUuid) {
      await this.ambulanceService.removeAmbulanceData(hospitalUuid, socketId);
      this.connectedClients.delete(socketId);
      this.notifyHospitalUpdate(hospitalUuid);
    }
  }

  @SubscribeMessage("hospital_connect")
  @UseGuards(AccessGuard)
  async handleHospitalConnect(
    @ConnectedSocket() client: Socket,
  ): Promise<void> {
    const uuid = client.user?.uuid;
    if (!uuid) {
      return;
    }

    const socketId = client.id;
    this.hospitalUuidMap.set(socketId, uuid);
    await this.ambulanceService.addClient(uuid, socketId);

    const allPatientData =
      await this.ambulanceService.getAllAmbulanceData(uuid);

    client.emit("update_all_patient_info", allPatientData);
  }

  @SubscribeMessage("patient_info")
  async handlePatientInfo(
    @ConnectedSocket() client: Socket,
    @MessageBody() patientData: PatientData,
  ): Promise<void> {
    if (!patientData) {
      return;
    }

    if (typeof patientData === "string") {
      patientData = JSON.parse(patientData);
    }
    const { hospitalName } = patientData;
    const socketId = client.id;

    let hospitalUuid = this.connectedClients.get(socketId);

    if (!hospitalUuid) {
      const hospital =
        await this.hospitalService.getHospitalByName(hospitalName);
      if (!hospital) {
        client.emit("hospital_not_found", {
          success: false,
          code: 20,
          message: "Hospital not found",
        });
        return;
      }
      hospitalUuid = hospital.uuid;

      this.connectedClients.set(socketId, hospitalUuid);
    }

    const ambulanceData: AmbulancePatientData = {
      ...patientData,
      ambulanceId: socketId,
    };

    await this.ambulanceService.addAmbulanceData(
      hospitalUuid,
      socketId,
      ambulanceData,
    );

    this.notifyHospitalUpdate(hospitalUuid);
  }

  @SubscribeMessage("update_location")
  async handleLocationUpdate(
    @ConnectedSocket() client: Socket,
    @MessageBody() location: LocationUpdate,
  ): Promise<void> {
    const socketId = client.id;
    const hospitalUuid = this.connectedClients.get(socketId);
    if (!hospitalUuid) {
      return;
    }

    if (!location) {
      return;
    }
    if (typeof location === "string") {
      location = JSON.parse(location);
    }
    const patientData = await this.ambulanceService.getAmbulanceData(
      hospitalUuid,
      socketId,
    );
    if (patientData) {
      patientData.latitude = location.latitude;
      patientData.longitude = location.longitude;

      await this.ambulanceService.updateAmbulanceData(
        hospitalUuid,
        socketId,
        patientData,
      );

      this.notifyHospitalUpdate(hospitalUuid);
    }
  }

  @SubscribeMessage("hospital_disconnect_ambulance")
  async handleHospitalDisconnectAmbulance(
    @ConnectedSocket() client: Socket,
    { ambulanceId }: { ambulanceId: string },
  ): Promise<void> {
    const hospitalUuid = this.hospitalUuidMap.get(client.id);

    if (!hospitalUuid) {
      return;
    }

    await this.ambulanceService.removeAmbulanceData(hospitalUuid, ambulanceId);
    this.connectedClients.delete(ambulanceId);

    this.notifyHospitalUpdate(hospitalUuid);

    this.server.to(ambulanceId).emit("hospital_disconnect", {
      success: true,
      code: 30,
      message: "You have been disconnected by the hospital.",
    });

    const ambulanceSocket = this.server.sockets.sockets.get(ambulanceId);
    if (ambulanceSocket) {
      ambulanceSocket.disconnect();
    }
  }

  private async notifyHospitalUpdate(hospitalUuid: string): Promise<void> {
    const allPatientData =
      await this.ambulanceService.getAllAmbulanceData(hospitalUuid);
    const hospitalSocketId =
      await this.ambulanceService.getClient(hospitalUuid);

    if (hospitalSocketId) {
      this.server
        .to(hospitalSocketId)
        .emit("update_all_patient_info", allPatientData);
    }
  }
}
