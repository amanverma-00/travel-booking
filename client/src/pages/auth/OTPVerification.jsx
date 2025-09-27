import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { FaArrowLeft, FaEnvelope, FaCheckCircle } from 'react-icons/fa';
import { loginSuccess } from '../../store/authSlice';
import toast from 'react-hot-toast';
import OTPInput from '../../components/OTPInput';

const OTPVerification = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { emailId, firstName } = location.state || {};
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [resendTimeLeft, setResendTimeLeft] = useState(90); // 90 seconds for resend
  const [canResend, setCanResend] = useState(false);
  const [isVerified, setIsVerified] = useState(false);

  // Redirect if no email in state
  useEffect(() => {
    if (!emailId) {
      toast.error('Invalid access. Please start registration again.');
      navigate('/register');
    }
  }, [emailId, navigate]);

  // Resend countdown timer
  useEffect(() => {
    if (resendTimeLeft > 0 && !canResend && !isVerified) {
      const timer = setTimeout(() => setResendTimeLeft(resendTimeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (resendTimeLeft === 0 && !canResend) {
      setCanResend(true);
    }
  }, [resendTimeLeft, canResend, isVerified]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const maskEmail = (email) => {
    if (!email) return '';
    const [username, domain] = email.split('@');
    const maskedUsername = username.length > 2 
      ? username[0] + '*'.repeat(username.length - 2) + username[username.length - 1]
      : username[0] + '*';
    return `${maskedUsername}@${domain}`;
  };

  const handleVerifyOTP = async () => {
    if (otp.length !== 6) {
      toast.error('Please enter a valid 6-digit OTP');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/verify-signup-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          emailId,
          otp
        })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setIsVerified(true);
        
        // Store auth data
        if (data.token) {
          localStorage.setItem('token', data.token);
        }
        localStorage.setItem('user', JSON.stringify(data.user));
        
        // Update Redux state
        dispatch(loginSuccess({
          user: data.user,
          token: data.token
        }));

        toast.success(`Welcome ${firstName || 'to Wanderlust'}! Account created successfully.`);
        
        // Redirect after a short delay
        setTimeout(() => {
          navigate('/', { replace: true });
        }, 1500);
      } else {
        toast.error(data.message || 'Invalid OTP. Please try again.');
        setOtp(''); // Clear OTP input
      }
    } catch (error) {
      console.error('OTP verification error:', error);
      toast.error('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/auth/resend-signup-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ emailId })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        toast.success('New OTP sent to your email!');
        setResendTimeLeft(90); // Reset resend timer to 90 seconds
        setCanResend(false);
        setOtp(''); // Clear current OTP
      } else {
        toast.error(data.message || 'Failed to resend OTP');
      }
    } catch (error) {
      console.error('Resend OTP error:', error);
      toast.error('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToRegister = () => {
    navigate('/register');
  };

  if (isVerified) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center py-12 px-4">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="mb-6">
              <FaCheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900">Account Created!</h2>
              <p className="text-gray-600 mt-2">
                Welcome to Wanderlust! You'll be redirected shortly.
              </p>
            </div>
            
            <div className="animate-pulse">
              <div className="w-8 h-1 bg-green-500 rounded mx-auto"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <button
            onClick={handleBackToRegister}
            className="inline-flex items-center text-gray-600 hover:text-gray-800 mb-6 transition-colors"
          >
            <FaArrowLeft className="mr-2" />
            Back to Registration
          </button>
          
          <div className="bg-blue-100 rounded-full p-4 w-20 h-20 mx-auto mb-6">
            <FaEnvelope className="w-12 h-12 text-blue-600 mx-auto" />
          </div>
          
          <h2 className="text-3xl font-bold text-gray-900">Check your email</h2>
          <p className="mt-2 text-gray-600">
            We sent a verification code to
          </p>
          <p className="font-semibold text-gray-900 mt-1">
            {maskEmail(emailId)}
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Enter verification code
            </label>
            <OTPInput 
              value={otp} 
              onChange={setOtp}
              disabled={isLoading || isVerified}
            />
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-500">
              Enter the 6-digit code sent to your email
            </p>
          </div>

          <div className="space-y-3">
            <button
              onClick={handleVerifyOTP}
              disabled={isLoading || otp.length !== 6 || isVerified}
              className={`w-full py-3 px-4 rounded-lg font-medium transition-all ${
                isLoading || otp.length !== 6 
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
              }`}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Verifying...
                </div>
              ) : (
                'Verify Account'
              )}
            </button>

            <button
              onClick={handleResendOTP}
              disabled={!canResend || isLoading || isVerified}
              className={`w-full py-2 px-4 rounded-lg font-medium transition-all ${
                canResend && !isLoading
                  ? 'text-blue-600 hover:text-blue-800 hover:bg-blue-50'
                  : 'text-gray-400 cursor-not-allowed'
              }`}
            >
              {canResend ? "Didn't receive code? Resend" : `Resend in ${resendTimeLeft}s`}
            </button>
          </div>
        </div>

        <div className="text-center">
          <p className="text-xs text-gray-500">
            Didn't receive an email? Check your spam folder or contact support.
          </p>
        </div>
      </div>
    </div>
  );
};

export default OTPVerification;