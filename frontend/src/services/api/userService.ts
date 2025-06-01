import apiClient from './api';
import { User } from '../../types/User';
import axios from 'axios';

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

interface UpdateProfileProp {
  name?: string,
  password?: string,
  profilePic?: string,
}

interface UpdateProfileRes {
  user?: User,
  error?: string
}

export const updateProfile = async (body: UpdateProfileProp): Promise<UpdateProfileRes> => {
  try {
    const response = await apiClient.put('/user/profile', body);
    const user: User = response.data
    return {
      user: user
    };

  } catch (error) {
    console.log("Update user error:", error)
    if (axios.isAxiosError(error)) {
      const errorMessage = error.response?.data?.message || 'Unknown error';
      return { error: errorMessage };
    }
    return { error: 'Network error' };
  }
};


