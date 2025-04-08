import apiClient from './api';
import { User } from '../../types/User';

export const getUser = async (id: string): Promise<User> => {
  const response = await apiClient.get(`/users/${id}`);
  return response.data;
};

export const createUser = async (userData: Partial<User>): Promise<User> => {
  const response = await apiClient.post('/users', userData);
  return response.data;
};

