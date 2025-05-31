import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import google_icon from '../../assets/common/google_icon.png';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { googleLoginUrl } from '@/services/auth/authService';
import { userStore } from '@/store/userStore';


const SignUpForm = () => {
  const navigate = useNavigate();
  const { signUp, error, setError, loading } = userStore();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setconfirmPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const toggleConfirmPasswordVisibility = () => {
    setconfirmPasswordVisible(!confirmPasswordVisible);
  };

  const handleSigninClick = () => {
    navigate("/user/login");
  };

  const handleGoogleSignIn = () => {
    window.location.href = googleLoginUrl();
  }

  const handleInputChange = (id: string, value: string) => {
    setFormData({
      ...formData,
      [id]: value
    });
  };

  const handleSignUp = async () => {
    if (!formData.name) {
      setError('Please enter valid name');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    const userData = {
      name: formData.name,
      email: formData.email,
      password: formData.password,
    };

    const success = await signUp(userData);

    if (success) navigate('/home');
  };

  return (
    <div className="flex h-[700px] items-center justify-center bg-gray-100">
      <div className="bg-white w-[400px] p-8 rounded-lg shadow-md">
        {/* Tiêu đề */}
        <h1 className="text-2xl font-bold mb-6 text-center">Create an account</h1>

        {/* Error */}
        {error && (
          <div className="mb-4 p-2 bg-red-100 text-red-700 rounded-md text-sm">
            {error}
          </div>
        )}

        {/* Name Field */}
        <div className="mb-4">
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Name
          </label>
          <input
            type="name"
            id="name"
            placeholder="your name"
            className="w-full border rounded-md px-4 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            required
          />
        </div>

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
            <button className="text-gray-500 hover:text-gray-700 ml-2" onClick={togglePasswordVisibility}>
              <FontAwesomeIcon icon={passwordVisible ? faEyeSlash : faEye} />
            </button>
          </div>

          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mt-4">
            Confirm Password
          </label>
          <div className="flex items-center border rounded-md px-4 py-2 mt-1">
            <input
              type={confirmPasswordVisible ? 'text' : 'password'}
              id="password"
              placeholder="Enter your password"
              className="w-full focus:outline-none"
              value={formData.confirmPassword}
              onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
              required
            />
            <button className="text-gray-500 hover:text-gray-700 ml-2" onClick={toggleConfirmPasswordVisibility}>
              <FontAwesomeIcon icon={confirmPasswordVisible ? faEyeSlash : faEye} />
            </button>
          </div>
        </div>

        {/* Create Account Button */}
        <button
          className="w-full bg-blue-600 text-white py-2 rounded-md font-bold hover:bg-blue-700 transition mb-4"
          onClick={handleSignUp}
          disabled={loading}
        >
          {loading ? 'Creating account...' : 'Create account'}
        </button>

        {/* Continue with Google */}
        <button className="w-full bg-gray-100 flex items-center justify-center py-2 rounded-md font-medium hover:bg-gray-200 transition mb-4"
          onClick={handleGoogleSignIn}>
          <img src={google_icon} alt="Google Logo" className="w-5 h-5 mr-2" />
          Continue with Google
        </button>

        {/* Footer */}
        <p className="text-sm text-center text-gray-500">
          Already Have An Account?{' '}
          <button
            onClick={handleSigninClick}
            className="text-blue-500 hover:underline"
          >
            Log In
          </button>
        </p>
      </div>
    </div>
  );
};


export default SignUpForm;
