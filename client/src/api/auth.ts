// src/api/auth.ts
import axios, { AxiosError } from 'axios';

const API_BASE = 'http://localhost:4000';

export interface AuthResponse {
  success: boolean;
  message: string;
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
}

export async function loginUser(
  credentials: LoginCredentials
): Promise<AuthResponse> {
  try {
    const { data } = await axios.post<AuthResponse>(
      `${API_BASE}/auth/login`,
      credentials
    );
    return data;
  } catch (error) {
    handleError(error);
  }
}

export async function registerUser(
  credentials: RegisterCredentials
): Promise<AuthResponse> {
  try {
    const { data } = await axios.post<AuthResponse>(
      `${API_BASE}/auth/register`,
      credentials
    );
    return data;
  } catch (error) {
    handleError(error);
  }
}

function handleError(error: unknown): never {
  const err = error as AxiosError<{ message?: string }>;
  if (err.response) {
    throw new Error(err.response.data?.message || 'Authentication failed.');
  } else if (err.request) {
    throw new Error('No response from server. Please try again later.');
  } else {
    throw new Error('Unexpected error occurred. Please try again.');
  }
}
