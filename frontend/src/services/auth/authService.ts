import authApiClient from './authApi';
import { LoginCredentials, RegisterData } from '../../types/Auth';
import { User } from '@/types/User';
import axios from 'axios';

interface loginRes {
  user?: User,
  error?: string
}

export const login = async (credentials: LoginCredentials): Promise<loginRes> => {
  try {
    const response = await authApiClient.post('/user/login', credentials);
    var normalUser: User = response.data;
    normalUser.isAdmin = false

    localStorage.setItem('token', response.data.token);

    const { user } = await getUserDetail(response.data._id)

    if (user && user.isAdmin == true)
      normalUser.isAdmin = true

    return {
      user: normalUser
    };

  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorMessage = error.response?.data?.message || 'Unknown error';
      return { error: errorMessage };
    }
    return { error: 'Network error' };
  }
};

interface getUserDetailRes {
  user?: User,
  error?: string
}

export const getUserDetail = async (userId: string): Promise<getUserDetailRes> => {
  try {
    const response = await authApiClient.get(`/user/${userId}`);
    return {
      user: response.data,
    };
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
    const user = response.data;
    localStorage.setItem('token', response.data.token);
    return {
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        profilePic: user.profilePic || '',
        isAdmin: false,
        token: user.token,
      }
    };
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


interface forget_password_prop {
  email: string;
}

export const forget_password = async (forget_password_prop: forget_password_prop): Promise<Boolean> => {
  try {
    await authApiClient.post('/user/forget-password', forget_password_prop);
    return true;
  } catch (error) {
    console.log("Send email failed")
    return false
  }
};

interface reset_password_prop {
  token: string,
  password: string
}

export const reset_password = async (reset_password_prop: reset_password_prop): Promise<string | null> => {
  try {
    await authApiClient.post('/user/reset-password', reset_password_prop);
    return null;

  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorMessage = error.response?.data?.message || 'Unknown error';

      return errorMessage;

    }
    return 'Network error';
  }
};