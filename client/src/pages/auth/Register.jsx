import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FaShieldAlt } from 'react-icons/fa';
import { loginStart, loginFailure } from '../../store/authSlice';
import toast from 'react-hot-toast';

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading } = useSelector((state) => state.auth);
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    emailId: '',
    password: '',
    confirmPassword: ''
  });
  
  const [useOTP, setUseOTP] = useState(true);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleOTPRegistration = async (e) => {
    e.preventDefault();
    
    if (!formData.firstName || !formData.emailId || !formData.password) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    dispatch(loginStart());
    
    console.log('Sending OTP request with data:', {
      firstName: formData.firstName,
      lastName: formData.lastName,
      emailId: formData.emailId,
      password: formData.password
    });
    
    try {
      const response = await fetch('/api/auth/send-signup-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          emailId: formData.emailId,
          password: formData.password
        })
      });
      
      const data = await response.json();
      
      if (response.ok && data.success) {
        toast.success('OTP sent to your email!');
        navigate('/verify-otp', { 
          state: { 
            emailId: formData.emailId,
            firstName: formData.firstName
          } 
        });
      } else {
        console.log('OTP request failed with response:', data);
        console.log('Status code:', response.status);
        dispatch(loginFailure(data.message || 'Failed to send OTP'));
        toast.error(data.message || 'Failed to send OTP');
      }
    } catch (error) {
      console.log('Network error during OTP request:', error);
      dispatch(loginFailure('Network error'));
      toast.error('Network error. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">Create your account</h2>
          <div className="mt-4 bg-white rounded-lg p-1 border inline-flex">
            <button
              type="button"
              onClick={() => setUseOTP(true)}
              className={`px-4 py-2 rounded-md text-sm ${
                useOTP ? 'bg-red-600 text-white' : 'text-gray-500'
              }`}
            >
              <FaShieldAlt className="inline mr-2" />
              OTP Signup
            </button>
            <button
              type="button"
              onClick={() => setUseOTP(false)}
              className={`px-4 py-2 rounded-md text-sm ${
                !useOTP ? 'bg-red-600 text-white' : 'text-gray-500'
              }`}
            >
              Quick Signup
            </button>
          </div>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleOTPRegistration}>
          <div className="space-y-4">
            <input
              name="firstName"
              type="text"
              value={formData.firstName}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="First Name"
              required
            />
            
            <input
              name="lastName"
              type="text"
              value={formData.lastName}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="Last Name (optional)"
            />
            
            <input
              name="emailId"
              type="email"
              value={formData.emailId}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="Email Address"
              required
            />
            
            <input
              name="password"
              type="password"
              value={formData.password}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="Password"
              required
            />
            
            <input
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="Confirm Password"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2 px-4 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:bg-gray-400"
          >
            {isLoading ? 'Processing...' : (useOTP ? 'Send OTP' : 'Create Account')}
          </button>

          <div className="text-center">
            <Link to="/login" className="text-red-600 hover:text-red-700">
              Already have an account? Sign in
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;