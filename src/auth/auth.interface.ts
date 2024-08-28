export interface Login {
  id: string;
  password: string;
}

export interface RefreshToken {
  refreshToken: string;
}

export interface AccessToken {
  accessToken: string;
}

export interface ValidatePassword {
  uuid: string;
  password: string;
}
