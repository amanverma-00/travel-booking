import { z } from 'zod';

// OTP signup request validation schema
export const sendSignupOTPSchema = z.object({
  firstName: z
    .string({
      required_error: "First name is required",
    })
    .min(1, "First name is required")
    .max(50, "First name must be less than 50 characters")
    .regex(/^[a-zA-Z\s]+$/, "First name can only contain letters and spaces")
    .trim(),
    
  lastName: z
    .string()
    .max(50, "Last name must be less than 50 characters")
    .regex(/^[a-zA-Z\s]*$/, "Last name can only contain letters and spaces")
    .trim()
    .optional(),
    
  emailId: z
    .string({
      required_error: "Email is required",
    })
    .email("Please enter a valid email address")
    .min(5, "Email must be at least 5 characters")
    .max(100, "Email must be less than 100 characters")
    .toLowerCase()
    .trim(),
    
  password: z
    .string({
      required_error: "Password is required",
    })
    .min(6, "Password must be at least 6 characters")
    .max(128, "Password must be less than 128 characters"),
});

// OTP verification validation schema
export const verifyOTPSchema = z.object({
  emailId: z
    .string({
      required_error: "Email is required",
    })
    .email("Please enter a valid email address")
    .toLowerCase()
    .trim(),
    
  otp: z
    .string({
      required_error: "OTP is required",
    })
    .min(6, "OTP must be 6 digits")
    .max(6, "OTP must be 6 digits")
    .regex(/^\d{6}$/, "OTP must be 6 digits"),
});

// Resend OTP validation schema
export const resendOTPSchema = z.object({
  emailId: z
    .string({
      required_error: "Email is required",
    })
    .email("Please enter a valid email address")
    .toLowerCase()
    .trim(),
});

// User registration validation schema (simplified to match frontend)
export const registerSchema = z.object({
  firstName: z
    .string({
      required_error: "First name is required",
    })
    .min(1, "First name is required")
    .max(50, "First name must be less than 50 characters")
    .regex(/^[a-zA-Z\s]+$/, "First name can only contain letters and spaces")
    .trim(),
    
  emailId: z
    .string({
      required_error: "Email is required",
    })
    .email("Please enter a valid email address")
    .min(5, "Email must be at least 5 characters")
    .max(100, "Email must be less than 100 characters")
    .toLowerCase()
    .trim(),
    
  password: z
    .string({
      required_error: "Password is required",
    })
    .min(6, "Password must be at least 6 characters") // Reduced to match frontend
    .max(128, "Password must be less than 128 characters"),
    
  // Optional fields that might be sent by frontend
  confirmPassword: z.string().optional(),
  role: z.enum(['guest', 'host', 'admin']).optional().default('guest'),
  phoneNumber: z.string().optional(),
  address: z.string().optional(),
  termsAccepted: z.boolean().optional()
});

// User login validation schema
export const loginSchema = z.object({
  emailId: z
    .string({
      required_error: "Email is required",
    })
    .email("Please enter a valid email address")
    .min(5, "Email must be at least 5 characters")
    .max(100, "Email must be less than 100 characters")
    .toLowerCase()
    .trim(),
    
  password: z
    .string({
      required_error: "Password is required",
    })
    .min(1, "Password is required")
    .max(128, "Password is too long"),
    
  rememberMe: z
    .boolean()
    .optional()
    .default(false),
});

// Password reset request schema
export const forgotPasswordSchema = z.object({
  emailId: z
    .string({
      required_error: "Email is required",
    })
    .email("Please enter a valid email address")
    .toLowerCase()
    .trim(),
});

// Password reset schema
export const resetPasswordSchema = z.object({
  token: z
    .string({
      required_error: "Reset token is required",
    })
    .min(1, "Invalid reset token"),
    
  password: z
    .string({
      required_error: "New password is required",
    })
    .min(8, "Password must be at least 8 characters")
    .max(128, "Password must be less than 128 characters")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
    ),
    
  confirmPassword: z
    .string({
      required_error: "Please confirm your password",
    }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

// Change password schema
export const changePasswordSchema = z.object({
  currentPassword: z
    .string({
      required_error: "Current password is required",
    })
    .min(1, "Current password is required"),
    
  newPassword: z
    .string({
      required_error: "New password is required",
    })
    .min(8, "Password must be at least 8 characters")
    .max(128, "Password must be less than 128 characters")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
    ),
    
  confirmNewPassword: z
    .string({
      required_error: "Please confirm your new password",
    }),
}).refine((data) => data.newPassword === data.confirmNewPassword, {
  message: "New passwords do not match",
  path: ["confirmNewPassword"],
}).refine((data) => data.currentPassword !== data.newPassword, {
  message: "New password must be different from current password",
  path: ["newPassword"],
});

// Profile update schema
export const updateProfileSchema = z.object({
  firstName: z
    .string()
    .min(2, "First name must be at least 2 characters")
    .max(50, "First name must be less than 50 characters")
    .regex(/^[a-zA-Z\s]+$/, "First name can only contain letters and spaces")
    .trim()
    .optional(),
    
  lastName: z
    .string()
    .min(2, "Last name must be at least 2 characters")
    .max(50, "Last name must be less than 50 characters")
    .regex(/^[a-zA-Z\s]+$/, "Last name can only contain letters and spaces")
    .trim()
    .optional(),
    
  phoneNumber: z
    .string()
    .regex(/^\+?[1-9]\d{1,14}$/, "Please enter a valid phone number")
    .optional()
    .or(z.literal('')),
    
  dateOfBirth: z
    .string()
    .refine((date) => {
      if (!date) return true; // Optional field
      const birthDate = new Date(date);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      return age >= 18 && age <= 120;
    }, "Please enter a valid date of birth (age 18-120)")
    .optional()
    .or(z.literal('')),
    
  bio: z
    .string()
    .max(500, "Bio must be less than 500 characters")
    .optional()
    .or(z.literal('')),
    
  languages: z
    .array(z.string())
    .max(10, "You can select up to 10 languages")
    .optional(),
    
  location: z
    .object({
      city: z.string().max(100, "City name is too long").optional(),
      country: z.string().max(100, "Country name is too long").optional(),
    })
    .optional(),
});

// Email verification schema
export const verifyEmailSchema = z.object({
  token: z
    .string({
      required_error: "Verification token is required",
    })
    .min(1, "Invalid verification token"),
});

// JWT token validation
export const tokenSchema = z.object({
  token: z
    .string({
      required_error: "Authorization token is required",
    })
    .min(1, "Invalid authorization token"),
});

// Role-based access validation
export const roleSchema = z.object({
  role: z.enum(['guest', 'host', 'admin'], {
    errorMap: () => ({ message: "Invalid role specified" }),
  }),
});

// Admin user creation schema (stricter validation)
export const createAdminSchema = z.object({
  firstName: z.string()
    .min(1, 'First name is required')
    .min(2, 'First name must be at least 2 characters')
    .max(50, 'First name must be less than 50 characters')
    .regex(/^[a-zA-Z\s]+$/, 'First name can only contain letters and spaces')
    .transform(str => str.trim()),
  
  emailId: z.string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address')
    .max(255, 'Email must be less than 255 characters')
    .toLowerCase()
    .transform(str => str.trim()),
  
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .max(128, 'Password must be less than 128 characters')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 
      'Password must contain at least one lowercase letter, one uppercase letter, and one number'),
  
  role: z.literal('admin'),
  
  adminKey: z
    .string({
      required_error: "Admin key is required",
    })
    .min(1, "Invalid admin key"),
});

// Become host schema
export const becomeHostSchema = z.object({
  phoneNumber: z
    .string({
      required_error: "Phone number is required for hosting",
    })
    .min(1, "Phone number is required for hosting")
    .regex(/^\+?[1-9]\d{1,14}$/, "Please enter a valid phone number"),
  
  address: z
    .string({
      required_error: "Address is required for hosting",
    })
    .min(10, "Please provide a complete address")
    .max(500, "Address must be less than 500 characters"),
  
  governmentId: z
    .string({
      required_error: "Government ID is required",
    })
    .min(1, "Government ID is required")
    .max(50, "Government ID must be less than 50 characters"),
  
  hostingExperience: z.enum(['none', 'beginner', 'experienced', 'professional'], {
    errorMap: () => ({ message: "Invalid hosting experience level" }),
  }).optional().default('none'),
  
  propertyTypes: z
    .array(z.enum(['apartment', 'house', 'room', 'villa', 'studio', 'other']))
    .min(1, "Select at least one property type")
    .max(6, "Too many property types selected"),
    
  hostingMotivation: z
    .string()
    .max(1000, "Please keep your motivation under 1000 characters")
    .optional(),
    
  agreedToHostTerms: z
    .boolean({
      required_error: "You must agree to hosting terms and conditions",
    })
    .refine(val => val === true, "You must agree to hosting terms and conditions"),
});