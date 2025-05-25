import authApiClient from './authApi';
import { LoginCredentials, RegisterData } from '../../types/Auth';
import { User } from '@/types/User';

export const login = async (credentials: LoginCredentials): Promise<User | null> => {
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
    
    return {
      _id: userData._id,
      name: userData.name,
      email: userData.email,
      profilePic: userData.profilePic || '',
      isAdmin,
      token: userData.token,
    };
  } catch (error) {
    console.error('Login failed:', error);
    return null;
  }
};

export const register = async (userData: RegisterData): Promise<User | null> => {
  try {
    const response = await authApiClient.post('/user/signup', userData);
    const user = response.data;
    
    return {
      _id: user._id,
      name: user.name,
      email: user.email,
      profilePic: user.profilePic || '',
      isAdmin: false, // Người đăng ký mới luôn là user thường
      token: user.token,
    };
  } catch (error) {
    console.error('Register failed:', error);
    return null;
  }
};
