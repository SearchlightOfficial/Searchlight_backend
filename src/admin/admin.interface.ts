export interface Admin {
  id: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
}

export interface AdminWithPassword {
  uuid: string;
  id: string;
  password: string;
}

export interface AdminUuid {
  uuid: string;
}

export interface CreateAdmin {
  id: string;
  email: string;
  password: string;
}
