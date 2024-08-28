export interface PatientData {
  age: number;
  gender: number;
  bedType: string[];
  ktas: string;
  latitude: number;
  longitude: number;
  symptom: string;
  hospitalName: string;
}

export interface LocationUpdate {
  latitude: number;
  longitude: number;
}

export interface HospitalUuid {
  uuid: string;
}

export interface AmbulancePatientData extends PatientData {
  ambulanceId: string;
}
