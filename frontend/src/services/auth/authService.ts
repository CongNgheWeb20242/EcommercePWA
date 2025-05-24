import authApiClient from './authApi';
import { LoginCredentials, RegisterData } from '../../types/Auth';
import { User } from '@/types/User';
import axios from 'axios';


export const login = async (credentials: LoginCredentials): Promise<{ user?: User; error?: string }> => {
  try {
    const response = await authApiClient.post('/user/login', credentials);

    localStorage.setItem('token', response.data.token);
    return { user: response.data };

  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorMessage = error.response?.data?.message || 'Unknown error';
      return { error: errorMessage };
    }
    return { error: 'Network error' };
  }
};

export const register = async (userData: RegisterData): Promise<{ user?: User; error?: string }> => {
  try {
    const response = await authApiClient.post('/user/signup', userData);

    localStorage.setItem('token', response.data.token);

    return { user: response.data };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorMessage = error.response?.data?.message || 'Unknown error';

      return { error: errorMessage };

    }
    return { error: 'Network error' };
  }
};

export const googleLoginUrl = (): string => {
  return `${authApiClient.defaults.baseURL}user/google`;
};
