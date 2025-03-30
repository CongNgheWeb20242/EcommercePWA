import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import google_icon from '../../assets/common/google_icon.png';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';
import { useNavigate } from "react-router-dom";

const SignInForm = () => {
    const [passwordVisible, setPasswordVisible] = useState(false);
    const navigate = useNavigate();

    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
      };

    const handleSignupClick = () => {
        navigate("/user/register"); 
    };

  return (
    <div className="flex h-[700px] items-center justify-center bg-gray-100">
      <div className="bg-white w-[400px] p-8 rounded-lg shadow-md">
        {/* Tiêu đề */}
        <h1 className="text-2xl font-bold mb-6 text-center">Login to your account</h1>

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
            />
            <button className="text-gray-500 hover:text-gray-700 ml-2" onClick={togglePasswordVisibility}>
                <FontAwesomeIcon icon={passwordVisible ? faEyeSlash : faEye} />
            </button>
          </div>
          <a href="#" className="text-sm text-blue-500 hover:underline mt-1 block text-right">
            Forgot password?
          </a>
        </div>

        {/* Create Account Button */}
        <button className="w-full bg-blue-600 text-white py-2 rounded-md font-bold hover:bg-blue-700 transition mb-4">
            Login now
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
