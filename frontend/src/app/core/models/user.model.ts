export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user' | 'company';
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  user: User;
}
