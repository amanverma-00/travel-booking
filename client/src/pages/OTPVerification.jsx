import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import OTPInput from '../components/OTPInput';
import { setUser, setLoading, setError } from '../store/slices/authSlice';

const OTPVerification = () => {
  const [otp, setOtp] = useState('');
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes in seconds
  const [canResend, setCanResend] = useState(false);
  const [resending, setResending] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  
  const { loading, error } = useSelector(state => state.auth);
  
  // Get email from location state (passed from registration page)
  const emailId = location.state?.emailId;
  const firstName = location.state?.firstName || '';

  // Redirect if no email is provided
  useEffect(() => {
    if (!emailId) {
      toast.error('Please start the registration process again');
      navigate('/register');
    }
  }, [emailId, navigate]);

  // Timer countdown
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [timeLeft]);

  // Format time display
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Handle OTP verification
  const handleVerifyOTP = async () => {
    if (otp.length !== 6) {
      toast.error('Please enter a valid 6-digit OTP');
      return;
    }

    try {
      dispatch(setLoading(true));
      dispatch(setError(null));

      const response = await fetch('/api/auth/verify-signup-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          emailId,
          otp
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Store user data and token
        dispatch(setUser(data.user));
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        toast.success('Account created successfully! Welcome to Wanderlust! 🎉');
        
        // Redirect to home page or dashboard
        navigate('/', { replace: true });
      } else {
        dispatch(setError(data.message));
        toast.error(data.message || 'OTP verification failed');
      }
    } catch (err) {
      console.error('OTP verification error:', err);
      dispatch(setError('Network error occurred'));
      toast.error('Network error. Please try again.');
    } finally {
      dispatch(setLoading(false));
    }
  };

  // Handle resend OTP
  const handleResendOTP = async () => {
    try {
      setResending(true);
      
      const response = await fetch('/api/auth/resend-signup-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ emailId }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success('New OTP sent to your email!');
        setTimeLeft(600); // Reset timer
        setCanResend(false);
        setOtp(''); // Clear current OTP
      } else {
        toast.error(data.message || 'Failed to resend OTP');
      }
    } catch (err) {
      console.error('Resend OTP error:', err);
      toast.error('Network error. Please try again.');
    } finally {
      setResending(false);
    }
  };

  // Handle back to registration
  const handleBackToRegistration = () => {
    navigate('/register');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="bg-red-100 rounded-full p-3">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 7.89a1 1 0 001.42 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
        </div>
        
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Verify Your Email
        </h2>
        
        <p className="mt-2 text-center text-sm text-gray-600">
          We've sent a 6-digit verification code to{' '}
          <span className="font-medium text-red-600">{emailId}</span>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {/* Greeting */}
          {firstName && (
            <div className="mb-6 text-center">
              <p className="text-lg text-gray-700">
                Hi <span className="font-semibold text-red-600">{firstName}</span>! 👋
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Enter the verification code to complete your registration
              </p>
            </div>
          )}

          {/* OTP Input */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-4 text-center">
              Enter Verification Code
            </label>
            <OTPInput
              length={6}
              value={otp}
              onChange={setOtp}
              disabled={loading}
              autoFocus={true}
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
              {error}
            </div>
          )}

          {/* Timer */}
          <div className="mb-6 text-center">
            {timeLeft > 0 ? (
              <p className="text-sm text-gray-500">
                Code expires in{' '}
                <span className="font-medium text-red-600">{formatTime(timeLeft)}</span>
              </p>
            ) : (
              <p className="text-sm text-red-500 font-medium">
                Code has expired. Please request a new one.
              </p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="space-y-4">
            {/* Verify Button */}
            <button
              onClick={handleVerifyOTP}
              disabled={loading || otp.length !== 6}
              className={`
                w-full flex justify-center py-2 px-4 border border-transparent rounded-md 
                shadow-sm text-sm font-medium text-white
                ${loading || otp.length !== 6
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500'
                }
                transition duration-150 ease-in-out
              `}
            >
              {loading ? (
                <div className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Verifying...
                </div>
              ) : (
                'Verify & Create Account'
              )}
            </button>

            {/* Resend Button */}
            <button
              onClick={handleResendOTP}
              disabled={!canResend || resending}
              className={`
                w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md 
                shadow-sm text-sm font-medium
                ${!canResend || resending
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-white text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500'
                }
                transition duration-150 ease-in-out
              `}
            >
              {resending ? (
                <div className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Sending...
                </div>
              ) : (
                'Resend Code'
              )}
            </button>

            {/* Back to Registration */}
            <button
              onClick={handleBackToRegistration}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md text-sm font-medium text-red-600 hover:text-red-500 transition duration-150 ease-in-out"
            >
              ← Back to Registration
            </button>
          </div>

          {/* Help Text */}
          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500">
              Didn't receive the code? Check your spam folder or{' '}
              <button
                onClick={handleResendOTP}
                disabled={!canResend}
                className="text-red-600 hover:text-red-500 font-medium"
              >
                try resending
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OTPVerification;