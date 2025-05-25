import apiClient from './api';
import { User } from '../../types/User';

export const getUser = async (id: string): Promise<User | null> => {
  try {
    const response = await apiClient.get<User>(`/user/${id}`);
    return response.data;
  } catch (error) {
    console.error('Fetch user by id failed:', error);
    return null;
  }
};

export const createUser = async (userData: Partial<User>): Promise<User> => {
  const response = await apiClient.post('/user', userData);
  return response.data;
};


