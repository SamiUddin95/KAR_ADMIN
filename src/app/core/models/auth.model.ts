export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  status: string;
  data: {
    userId: number;
    userType: string | null;
    fullName: string;
    token: string;
    expiresUtc: string;
    expiresLocal: string;
  };
  statusCode: number;
  errorMessage: string | null;
}

export interface UserData {
  userId: number;
  userType: string | null;
  fullName: string;
  token: string;
  expiresUtc: string;
  expiresLocal: string;
}
