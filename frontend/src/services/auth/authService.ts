import authApiClient from './authApi';
import { LoginCredentials, RegisterData } from '../../types/Auth';
import { User } from '@/types/User';
import axios from 'axios';

interface LoginResponse {
  _id: string;
  name: string;
  token: string;
  email: string;
  profilePic: string;
}


export const login = async (credentials: LoginCredentials): Promise<{ user?: User; error?: string }> => {
  try {
    const response = await authApiClient.post('/user/login', credentials);
    const userData = response.data;

    // Gọi API để kiểm tra nếu người dùng là admin
    let isAdmin = false;
    try {
      // Gọi API để lấy thông tin người dùng chi tiết nếu có token
      if (userData.token) {
        const userDetailResponse = await authApiClient.get('/user/' + userData._id, {
          headers: {
            'Authorization': `Bearer ${userData.token}`
          }
        });

        // Cập nhật thông tin isAdmin từ dữ liệu trả về
        if (userDetailResponse.data && typeof userDetailResponse.data.isAdmin === 'boolean') {
          isAdmin = userDetailResponse.data.isAdmin;
        }
      }
    } catch (detailError) {
      console.warn('Không thể lấy thông tin chi tiết người dùng:', detailError);
      // Fallback: kiểm tra theo email nếu API không trả về isAdmin
      isAdmin = credentials.email.toLowerCase() === 'admin@example.com';
    }
    localStorage.setItem('token', response.data.token);
    const user: User = {
      _id: userData._id,
      name: userData.name,
      email: userData.email,
      profilePic: userData.profilePic || '',
      isAdmin,
      token: userData.token,
    }
    return { user: user };


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
        isAdmin: false, // Người đăng ký mới luôn là user thường
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
