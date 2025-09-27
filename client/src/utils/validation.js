import { z } from 'zod';

// Common validation schemas for frontend
export const registerSchema = z.object({
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
  
  confirmPassword: z.string()
    .min(1, 'Please confirm your password'),
  
  age: z.number()
    .int('Age must be a whole number')
    .min(18, 'You must be at least 18 years old')
    .max(120, 'Please enter a valid age')
    .optional(),
  
  phoneNumber: z.string()
    .regex(/^[\+]?[1-9][\d]{0,15}$/, 'Please enter a valid phone number')
    .optional()
    .or(z.literal('')),
  
  address: z.string()
    .max(500, 'Address must be less than 500 characters')
    .optional()
    .or(z.literal('')),
    
  termsAccepted: z.boolean()
    .refine(val => val === true, 'You must accept the terms and conditions')
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"]
});

export const loginSchema = z.object({
  emailId: z.string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address')
    .toLowerCase()
    .transform(str => str.trim()),
  
  password: z.string()
    .min(1, 'Password is required'),
    
  rememberMe: z.boolean().optional().default(false)
});

export const updateProfileSchema = z.object({
  firstName: z.string()
    .min(2, 'First name must be at least 2 characters')
    .max(50, 'First name must be less than 50 characters')
    .regex(/^[a-zA-Z\s]+$/, 'First name can only contain letters and spaces')
    .transform(str => str.trim())
    .optional(),
  
  lastName: z.string()
    .max(50, 'Last name must be less than 50 characters')
    .regex(/^[a-zA-Z\s]*$/, 'Last name can only contain letters and spaces')
    .transform(str => str.trim())
    .optional()
    .or(z.literal('')),
  
  phoneNumber: z.string()
    .regex(/^[\+]?[1-9][\d]{0,15}$/, 'Please enter a valid phone number')
    .optional()
    .or(z.literal('')),
  
  address: z.string()
    .max(500, 'Address must be less than 500 characters')
    .optional()
    .or(z.literal('')),
  
  age: z.number()
    .int('Age must be a whole number')
    .min(18, 'You must be at least 18 years old')
    .max(120, 'Please enter a valid age')
    .optional(),
    
  dateOfBirth: z.string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format')
    .optional()
    .or(z.literal('')),
    
  bio: z.string()
    .max(1000, 'Bio must be less than 1000 characters')
    .optional()
    .or(z.literal(''))
});

export const changePasswordSchema = z.object({
  currentPassword: z.string()
    .min(1, 'Current password is required'),
  
  newPassword: z.string()
    .min(8, 'New password must be at least 8 characters')
    .max(128, 'New password must be less than 128 characters')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 
      'New password must contain at least one lowercase letter, one uppercase letter, and one number'),
  
  confirmNewPassword: z.string()
    .min(1, 'Please confirm your new password')
}).refine(data => data.newPassword === data.confirmNewPassword, {
  message: "New passwords don't match",
  path: ["confirmNewPassword"]
}).refine(data => data.currentPassword !== data.newPassword, {
  message: "New password must be different from current password",
  path: ["newPassword"]
});

export const forgotPasswordSchema = z.object({
  emailId: z.string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address')
    .toLowerCase()
    .transform(str => str.trim())
});

export const resetPasswordSchema = z.object({
  token: z.string()
    .min(1, 'Reset token is required'),
  
  newPassword: z.string()
    .min(8, 'Password must be at least 8 characters')
    .max(128, 'Password must be less than 128 characters')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 
      'Password must contain at least one lowercase letter, one uppercase letter, and one number'),
  
  confirmPassword: z.string()
    .min(1, 'Please confirm your password')
}).refine(data => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"]
});

export const becomeHostSchema = z.object({
  phoneNumber: z.string()
    .min(1, 'Phone number is required for hosting')
    .regex(/^[\+]?[1-9][\d]{0,15}$/, 'Please enter a valid phone number'),
  
  address: z.string()
    .min(10, 'Please provide a complete address')
    .max(500, 'Address must be less than 500 characters'),
  
  governmentId: z.string()
    .min(1, 'Government ID is required')
    .max(50, 'Government ID must be less than 50 characters'),
  
  hostingExperience: z.enum(['none', 'beginner', 'experienced', 'professional'])
    .optional()
    .default('none'),
  
  propertyTypes: z.array(z.enum(['apartment', 'house', 'room', 'villa', 'studio', 'other']))
    .min(1, 'Select at least one property type')
    .max(6, 'Too many property types selected'),
    
  hostingMotivation: z.string()
    .max(1000, 'Please keep your motivation under 1000 characters')
    .optional()
    .or(z.literal('')),
    
  agreedToHostTerms: z.boolean()
    .refine(val => val === true, 'You must agree to hosting terms and conditions')
});

// Utility functions for validation
export const validateForm = (schema, data) => {
  try {
    const result = schema.parse(data);
    return { success: true, data: result, errors: null };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const formattedErrors = {};
      error.errors.forEach(err => {
        const field = err.path.join('.');
        formattedErrors[field] = err.message;
      });
      return { success: false, data: null, errors: formattedErrors };
    }
    throw error;
  }
};

export const validateField = (schema, fieldName, value) => {
  try {
    const fieldSchema = schema.shape[fieldName];
    if (!fieldSchema) {
      return { success: true, error: null };
    }
    
    fieldSchema.parse(value);
    return { success: true, error: null };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors[0].message };
    }
    throw error;
  }
};

// Helper to get field validation rules for forms
export const getFieldRules = (schema, fieldName) => {
  try {
    const fieldSchema = schema.shape[fieldName];
    if (!fieldSchema) return null;
    
    const rules = {};
    
    // Extract validation rules from Zod schema
    if (fieldSchema._def.checks) {
      fieldSchema._def.checks.forEach(check => {
        switch (check.kind) {
          case 'min':
            rules.minLength = check.value;
            break;
          case 'max':
            rules.maxLength = check.value;
            break;
          case 'regex':
            rules.pattern = check.regex;
            break;
          case 'email':
            rules.type = 'email';
            break;
        }
      });
    }
    
    rules.required = !fieldSchema.isOptional();
    return rules;
  } catch (error) {
    console.warn('Could not extract field rules:', error);
    return null;
  }
};