import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import google_icon from '../../assets/common/google_icon.png';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { userStore } from '@/store/userStore';
import { googleLoginUrl } from '@/services/auth/authService';
import useCartStore from '@/store/useCartStore';

const SignInForm = () => {
  const navigate = useNavigate();
  const { logIn, error, setError, loading } = userStore();
  const { clearCart } = useCartStore();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [passwordVisible, setPasswordVisible] = useState(false);

  useEffect(() => {
    setError(null)
  }, []);

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

  const handleForgetPasswordClick = () => {
    navigate("/user/forgetpassword");
  };

  const handleSignIn = async () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Vui lòng nhập đúng định dạng email');
      return;
    }

    if (!formData.password) {
      setError('Vui lòng nhập mật khẩu');
      return;
    }

    const userData = {
      email: formData.email,
      password: formData.password,
    };

    const user = await logIn(userData);

    if (user != null) {
      clearCart();
      if (user.isAdmin == true) {
        console.log('Admin user detected, navigating to admin dashboard');
        navigate('/admin/products');
      }
      else
        navigate('/home');
    }
  };

  const handleGoogleSignIn = () => {
    window.location.href = googleLoginUrl();
  }

  return (
    <div className="flex h-[700px] items-center justify-center bg-gray-100">
      <div className="bg-white w-[400px] p-8 rounded-lg shadow-md">
        {/* Tiêu đề */}
        <h1 className="text-2xl font-bold mb-6 text-center">Đăng nhập vào tài khoản</h1>

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
            Mật khẩu
          </label>
          <div className="flex items-center border rounded-md px-4 py-2 mt-1">
            <input
              type={passwordVisible ? 'text' : 'password'}
              id="password"
              placeholder="Nhập mật khẩu"
              className="w-full focus:outline-none"
              value={formData.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              required
            />
            <button
              className="text-gray-500 hover:text-gray-700 ml-2"
              onClick={togglePasswordVisibility}
              aria-label={passwordVisible ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
            >
              <FontAwesomeIcon icon={passwordVisible ? faEyeSlash : faEye} />
            </button>
          </div>
          <button className="text-sm text-blue-500 hover:underline mt-1 block text-right"
            onClick={handleForgetPasswordClick}>
            Quên mật khẩu?
          </button>
        </div>

        {/* Create Account Button */}
        <button
          className="w-full bg-blue-600 text-white py-2 rounded-md font-bold hover:bg-blue-700 transition mb-4"
          disabled={loading}
          onClick={handleSignIn}
        >
          {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
        </button>

        {/* Continue with Google */}
        <button className="w-full bg-gray-100 flex items-center justify-center py-2 rounded-md font-medium hover:bg-gray-200 transition mb-4"
          onClick={handleGoogleSignIn}>
          <img src={google_icon} alt="Google Logo" className="w-5 h-5 mr-2" />
          Đăng nhập với Google
        </button>

        {/* Footer */}
        <p className="text-sm text-center text-gray-500">
          Bạn chưa có tài khoản?{' '}
          <button
            onClick={handleSignupClick}
            className="text-blue-500 hover:underline"
          >
            Đăng ký
          </button>
        </p>
      </div>
    </div>
  );
};

export default SignInForm;
