export interface CreateHospital {
  id: string;
  name: string;
  email: string;
  address: string;
  latitude: number;
  longitude: number;
}

export interface Hospital {
  uuid: string;
  id: string;
  email: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  createdAt: Date;
}

export interface UpdateHospital {
  uuid: string;
  name: string;
  email: string;
  address: string;
  latitude: number;
  longitude: number;
}

export interface DeleteHospital {
  uuid: string;
}

export interface GetHospitalByUuid {
  uuid: string;
}

export interface GetHospitalById {
  id: string;
}

export interface GetHospitalByName {
  name: string;
}

export interface HospitalWithPassword {
  uuid: string;
  id: string;
  password: string;
}

export interface HospitalWithRefreshToken {
  uuid: string;
  refreshToken: string;
}

export interface FetchHospitalData {
  lat: string;
  lon: string;
  rltmEmerCds: string[];
}

export interface BedInfo {
  type: string;
  count: string;
}

export interface HospitalInfo {
  name: string;
  distance: string;
  address: string;
  beds: BedInfo[];
  emergencyMessage: string[];
  impossibleMessage: string[];
}
