import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import google_icon from '../../assets/common/google_icon.png';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { login } from '@/services/auth/authService';
import axios from 'axios';
import { useUserStore } from '@/store/userStore';

const SignInForm = () => {
  const navigate = useNavigate();
  const setUser = useUserStore((state) => state.setUser);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [passwordVisible, setPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');


  const handleInputChange = (id: string, value: string) => {
    setFormData({
      ...formData,
      [id]: value
    });
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const handleSignupClick = () => {
    navigate("/user/register");
  };

  const handleSignIn = async () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address');
      return;
    }

    if (!formData.password) {
      setError('Please enter valid password');
      return;
    }

    setLoading(true);
    setError('');

    try {

      const userData = {
        email: formData.email,
        password: formData.password,
      };

      const user = await login(userData);

      if (user) {
        setUser(user);
        await new Promise(resolve => setTimeout(resolve, 1000)); //wait 1 sec
        
        // Điều hướng dựa trên vai trò
        if (user.isAdmin) {
          navigate('/admin/products');
        } else {
          navigate('/home');
        }
      } else {
        alert('Đăng nhập thất bại!');
      }

    } catch (error) {
      console.error('Login error:', error);

      if (axios.isAxiosError(error)) {
        if (error.response?.data?.message) {
          setError(error.response.data.message);
        } else {
          setError('Login failed. Please try again later.');
        }
      } else {
        setError('Login failed. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-[700px] items-center justify-center bg-gray-100">
      <div className="bg-white w-[400px] p-8 rounded-lg shadow-md">
        {/* Tiêu đề */}
        <h1 className="text-2xl font-bold mb-6 text-center">Login to your account</h1>

        {/* Error */}
        {error && (
          <div className="mb-4 p-2 bg-red-100 text-red-700 rounded-md text-sm">
            {error}
          </div>
        )}

        {/* Email Field */}
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            id="email"
            placeholder="youremail@gmail.com"
            className="w-full border rounded-md px-4 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            required
          />
        </div>

        {/* Password Field */}
        <div className="mb-4">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Password
          </label>
          <div className="flex items-center border rounded-md px-4 py-2 mt-1">
            <input
              type={passwordVisible ? 'text' : 'password'}
              id="password"
              placeholder="Enter your password"
              className="w-full focus:outline-none"
              value={formData.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              required
            />
            <button 
              className="text-gray-500 hover:text-gray-700 ml-2" 
              onClick={togglePasswordVisibility}
              aria-label={passwordVisible ? "Hide password" : "Show password"}
            >
              <FontAwesomeIcon icon={passwordVisible ? faEyeSlash : faEye} />
            </button>
          </div>
          <a href="#" className="text-sm text-blue-500 hover:underline mt-1 block text-right">
            Forgot password?
          </a>
        </div>

        {/* Create Account Button */}
        <button
          className="w-full bg-blue-600 text-white py-2 rounded-md font-bold hover:bg-blue-700 transition mb-4"
          disabled={loading}
          onClick={handleSignIn}
        >
          {loading ? 'Logging in...' : 'Login now'}

        </button>

        {/* Continue with Google */}
        <button className="w-full bg-gray-100 flex items-center justify-center py-2 rounded-md font-medium hover:bg-gray-200 transition mb-4">
          <img src={google_icon} alt="Google Logo" className="w-5 h-5 mr-2" />
          Continue with Google
        </button>

        {/* Footer */}
        <p className="text-sm text-center text-gray-500">
          Don't have an account?{' '}
          <button
            onClick={handleSignupClick}
            className="text-blue-500 hover:underline"
          >
            Sign up
          </button>
        </p>
      </div>
    </div>
  );
};


export default SignInForm;
