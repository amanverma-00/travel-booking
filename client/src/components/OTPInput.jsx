import React, { useState, useRef, useEffect } from 'react';

const OTPInput = ({ length = 6, value, onChange, disabled = false, autoFocus = false }) => {
  const [otp, setOtp] = useState(new Array(length).fill(''));
  const inputRefs = useRef([]);

  // Update local state when value prop changes
  useEffect(() => {
    if (value && value !== otp.join('')) {
      setOtp(value.split('').slice(0, length));
    }
  }, [value, length, otp]);

  // Focus first input on mount if autoFocus is true
  useEffect(() => {
    if (autoFocus && inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, [autoFocus]);

  const handleChange = (element, index) => {
    if (isNaN(element.value)) return false;

    const newOtp = [...otp];
    newOtp[index] = element.value;
    setOtp(newOtp);

    // Call onChange with the complete OTP
    if (onChange) {
      onChange(newOtp.join(''));
    }

    // Focus next input if current field is filled
    if (element.value && index < length - 1) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    // Handle backspace
    if (e.key === 'Backspace') {
      if (!otp[index] && index > 0) {
        // If current field is empty, move to previous field and clear it
        const newOtp = [...otp];
        newOtp[index - 1] = '';
        setOtp(newOtp);
        if (onChange) onChange(newOtp.join(''));
        inputRefs.current[index - 1].focus();
      } else {
        // Clear current field
        const newOtp = [...otp];
        newOtp[index] = '';
        setOtp(newOtp);
        if (onChange) onChange(newOtp.join(''));
      }
    }
    
    // Handle arrow keys
    if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1].focus();
    }
    if (e.key === 'ArrowRight' && index < length - 1) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, length);
    const pastedArray = pastedData.split('').filter(char => !isNaN(char));
    
    if (pastedArray.length > 0) {
      const newOtp = new Array(length).fill('');
      pastedArray.forEach((char, index) => {
        if (index < length) {
          newOtp[index] = char;
        }
      });
      setOtp(newOtp);
      if (onChange) onChange(newOtp.join(''));
      
      // Focus the next empty input or last input
      const nextEmptyIndex = newOtp.findIndex((val, idx) => !val && idx > 0);
      const focusIndex = nextEmptyIndex !== -1 ? nextEmptyIndex : Math.min(pastedArray.length, length - 1);
      inputRefs.current[focusIndex]?.focus();
    }
  };

  return (
    <div className="flex gap-2 justify-center">
      {otp.map((data, index) => (
        <input
          key={index}
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={1}
          value={data}
          ref={(el) => (inputRefs.current[index] = el)}
          onChange={(e) => handleChange(e.target, index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          onPaste={handlePaste}
          disabled={disabled}
          className={`
            w-12 h-12 text-center text-lg font-semibold border-2 rounded-lg
            focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500
            transition-all duration-200
            ${disabled 
              ? 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed' 
              : 'bg-white border-gray-300 text-gray-900 hover:border-gray-400'
            }
            ${data ? 'border-red-500 bg-red-50' : ''}
          `}
          autoComplete="off"
        />
      ))}
    </div>
  );
};

export default OTPInput;