import { z } from 'zod';

/**
 * Validation middleware factory
 * Creates middleware to validate request data against Zod schemas
 */
export const validate = (schema, source = 'body') => {
  return (req, res, next) => {
    try {
      let dataToValidate;
      
      // Determine which part of the request to validate
      switch (source) {
        case 'body':
          dataToValidate = req.body;
          break;
        case 'query':
          dataToValidate = req.query;
          break;
        case 'params':
          dataToValidate = req.params;
          break;
        case 'headers':
          dataToValidate = req.headers;
          break;
        default:
          dataToValidate = req.body;
      }

      // Validate the data against the schema
      const validatedData = schema.parse(dataToValidate);
      
      // Replace the original data with validated (and potentially transformed) data
      switch (source) {
        case 'body':
          req.body = validatedData;
          break;
        case 'query':
          req.query = validatedData;
          break;
        case 'params':
          req.params = validatedData;
          break;
        case 'headers':
          req.headers = validatedData;
          break;
      }
      
      next();
    } catch (error) {
      // Handle Zod validation errors
      console.log('❌ Validation error:', error);
      console.log('❌ Error type:', typeof error);
      console.log('❌ Error properties:', Object.keys(error));
      
      if (error instanceof z.ZodError) {
        const errors = error.issues ? error.issues.map(err => ({
          field: err.path.join('.'),
          message: err.message,
          code: err.code,
        })) : [{ field: 'unknown', message: error.message || 'Validation error', code: 'invalid' }];

        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors
        });
      }
      
      // Handle other errors
      console.error('Validation middleware error:', error);
      return res.status(500).json({
        success: false,
        message: 'Internal server error during validation',
        error: error.message
      });
    }
  };
};

/**
 * Async validation middleware for complex validations
 * Use when validation needs to check database or external services
 */
export const validateAsync = (schema, source = 'body', customValidator = null) => {
  return async (req, res, next) => {
    try {
      let dataToValidate;
      
      switch (source) {
        case 'body':
          dataToValidate = req.body;
          break;
        case 'query':
          dataToValidate = req.query;
          break;
        case 'params':
          dataToValidate = req.params;
          break;
        case 'headers':
          dataToValidate = req.headers;
          break;
        default:
          dataToValidate = req.body;
      }

      // First run Zod validation
      const validatedData = schema.parse(dataToValidate);
      
      // Run custom async validation if provided
      if (customValidator) {
        await customValidator(validatedData, req);
      }
      
      // Replace the original data with validated data
      switch (source) {
        case 'body':
          req.body = validatedData;
          break;
        case 'query':
          req.query = validatedData;
          break;
        case 'params':
          req.params = validatedData;
          break;
        case 'headers':
          req.headers = validatedData;
          break;
      }
      
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors = error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message,
          code: err.code,
        }));

        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors,
          details: error.errors
        });
      }
      
      // Handle custom validation errors
      if (error.name === 'ValidationError') {
        return res.status(400).json({
          success: false,
          message: error.message,
          field: error.field || 'unknown'
        });
      }
      
      console.error('Async validation middleware error:', error);
      return res.status(500).json({
        success: false,
        message: 'Internal server error during validation',
        error: error.message
      });
    }
  };
};

/**
 * Custom validation error class
 */
export class ValidationError extends Error {
  constructor(message, field = null) {
    super(message);
    this.name = 'ValidationError';
    this.field = field;
  }
}

/**
 * Helper function to validate data without middleware
 * Useful for validating data in service functions
 */
export const validateData = (schema, data) => {
  try {
    return {
      success: true,
      data: schema.parse(data),
      errors: null
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors = error.errors.map(err => ({
        field: err.path.join('.'),
        message: err.message,
        code: err.code,
      }));

      return {
        success: false,
        data: null,
        errors: errors
      };
    }
    
    throw error; // Re-throw non-Zod errors
  }
};

/**
 * Middleware to validate file uploads
 */
export const validateFile = (options = {}) => {
  const {
    maxSize = 5 * 1024 * 1024, // 5MB default
    allowedTypes = ['image/jpeg', 'image/png', 'image/webp'],
    required = true,
    fieldName = 'file'
  } = options;

  return (req, res, next) => {
    try {
      const file = req.file || req.files?.[fieldName];
      
      if (!file && required) {
        return res.status(400).json({
          success: false,
          message: 'File is required',
          field: fieldName
        });
      }
      
      if (file) {
        // Check file size
        if (file.size > maxSize) {
          return res.status(400).json({
            success: false,
            message: `File size must be less than ${Math.round(maxSize / (1024 * 1024))}MB`,
            field: fieldName
          });
        }
        
        // Check file type
        if (!allowedTypes.includes(file.mimetype)) {
          return res.status(400).json({
            success: false,
            message: `File type must be one of: ${allowedTypes.join(', ')}`,
            field: fieldName
          });
        }
      }
      
      next();
    } catch (error) {
      console.error('File validation error:', error);
      return res.status(500).json({
        success: false,
        message: 'File validation failed',
        error: error.message
      });
    }
  };
};

/**
 * Middleware to sanitize request data
 * Removes potentially dangerous characters and scripts
 */
export const sanitizeRequest = (fields = ['body']) => {
  return (req, res, next) => {
    try {
      fields.forEach(field => {
        const data = req[field];
        if (data && typeof data === 'object') {
          req[field] = sanitizeObject(data);
        }
      });
      next();
    } catch (error) {
      console.error('Sanitization error:', error);
      next(); // Continue even if sanitization fails
    }
  };
};

/**
 * Helper function to sanitize object recursively
 */
const sanitizeObject = (obj) => {
  const sanitized = {};
  
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'string') {
      // Remove potential XSS attempts
      sanitized[key] = value
        .replace(/<script[^>]*>.*?<\/script>/gi, '')
        .replace(/<[^>]*>/g, '')
        .trim();
    } else if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      sanitized[key] = sanitizeObject(value);
    } else if (Array.isArray(value)) {
      sanitized[key] = value.map(item => 
        typeof item === 'string' 
          ? item.replace(/<script[^>]*>.*?<\/script>/gi, '').replace(/<[^>]*>/g, '').trim()
          : typeof item === 'object' && item !== null
            ? sanitizeObject(item)
            : item
      );
    } else {
      sanitized[key] = value;
    }
  }
  
  return sanitized;
};

// Rate limiting validation schema
export const rateLimitSchema = z.object({
  windowMs: z.number().positive().default(15 * 60 * 1000), // 15 minutes
  maxRequests: z.number().positive().default(100),
  message: z.string().default('Too many requests from this IP'),
});

// ID parameter validation
export const mongoIdSchema = z.object({
  id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid ID format')
});

// Pagination validation
export const paginationSchema = z.object({
  page: z.string().regex(/^\d+$/).transform(Number).refine(n => n > 0).default('1'),
  limit: z.string().regex(/^\d+$/).transform(Number).refine(n => n > 0 && n <= 100).default('10'),
  sort: z.string().optional(),
  order: z.enum(['asc', 'desc']).default('desc')
});