import { apiClient } from "./client";

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  jwt: string;
  expiration: string;
}

export interface UserCreateData {
  password?: string;
  role: 'USER' | 'ADMIN';
  firstName: string;
  lastName: string;
  email: string;
}

export interface UserUpdateData {
  id: string;
  password?: string;
  role: 'USER' | 'ADMIN';
  firstName: string;
  lastName: string;
  email: string;
}

export async function loginApi(credentials: LoginCredentials): Promise<AuthResponse> {
  const response = await apiClient.post<AuthResponse>('/auth/login', credentials);
  return response.data;
}

export async function registerApi(data: UserCreateData): Promise<any> {
  const response = await apiClient.post('/auth/create', data);
  return response.data;
}
