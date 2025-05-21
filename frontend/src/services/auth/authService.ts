import authApiClient from './authApi';
import { LoginCredentials, RegisterData } from '../../types/Auth';
import { User } from '@/types/User';

export const login = async (credentials: LoginCredentials): Promise<User | null> => {
  try {
    const response = await authApiClient.post('/user/login', credentials);
    return response.data;
  } catch (error) {
    console.error('Login failed:', error);
    return null;
  }
};

export const register = async (userData: RegisterData): Promise<User | null> => {
  try {
    const response = await authApiClient.post('/user/signup', userData);
    return response.data;
  } catch (error) {
    console.error('Register failed:', error);
    return null;
  }
};
