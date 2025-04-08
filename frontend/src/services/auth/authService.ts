import authApiClient from './authApi';
import { LoginCredentials, RegisterData } from '../../types/Auth';
import { User } from '@/types/User';

export const login = async (credentials: LoginCredentials) : Promise<User> => {
  const response = await authApiClient.post('/user/login', credentials);
  return response.data;
};

export const register = async (userData: RegisterData) : Promise<User> => {
  const response = await authApiClient.post('/user/signup', userData);
  return response.data;
};
