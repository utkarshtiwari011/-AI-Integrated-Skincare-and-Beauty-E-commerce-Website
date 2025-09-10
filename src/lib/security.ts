// Security utilities for input validation and sanitization

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

// Email validation with comprehensive checks
export const validateEmail = (email: string): ValidationResult => {
  if (!email) return { isValid: false, error: 'Email is required' };
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { isValid: false, error: 'Please enter a valid email address' };
  }
  
  if (email.length > 254) {
    return { isValid: false, error: 'Email is too long' };
  }
  
  return { isValid: true };
};

// Password validation with security requirements
export const validatePassword = (password: string): ValidationResult => {
  if (!password) return { isValid: false, error: 'Password is required' };
  
  if (password.length < 8) {
    return { isValid: false, error: 'Password must be at least 8 characters long' };
  }
  
  if (password.length > 128) {
    return { isValid: false, error: 'Password is too long' };
  }
  
  if (!/(?=.*[a-z])/.test(password)) {
    return { isValid: false, error: 'Password must contain at least one lowercase letter' };
  }
  
  if (!/(?=.*[A-Z])/.test(password)) {
    return { isValid: false, error: 'Password must contain at least one uppercase letter' };
  }
  
  if (!/(?=.*\d)/.test(password)) {
    return { isValid: false, error: 'Password must contain at least one number' };
  }
  
  return { isValid: true };
};

// Name validation (for full names, city names, etc.)
export const validateName = (name: string, fieldName = 'Name'): ValidationResult => {
  if (!name.trim()) return { isValid: false, error: `${fieldName} is required` };
  
  if (name.trim().length < 2) {
    return { isValid: false, error: `${fieldName} must be at least 2 characters` };
  }
  
  if (name.length > 100) {
    return { isValid: false, error: `${fieldName} is too long` };
  }
  
  if (!/^[a-zA-Z\s'-]+$/.test(name)) {
    return { 
      isValid: false, 
      error: `${fieldName} can only contain letters, spaces, hyphens, and apostrophes` 
    };
  }
  
  return { isValid: true };
};

// Phone number validation
export const validatePhone = (phone: string): ValidationResult => {
  if (!phone.trim()) return { isValid: false, error: 'Phone number is required' };
  
  const cleanPhone = phone.replace(/\D/g, '');
  if (cleanPhone.length < 10) {
    return { isValid: false, error: 'Phone number must be at least 10 digits' };
  }
  
  if (cleanPhone.length > 15) {
    return { isValid: false, error: 'Phone number is too long' };
  }
  
  return { isValid: true };
};

// Address validation
export const validateAddress = (address: string): ValidationResult => {
  if (!address.trim()) return { isValid: false, error: 'Address is required' };
  
  if (address.trim().length < 10) {
    return { isValid: false, error: 'Please provide a complete address' };
  }
  
  if (address.length > 200) {
    return { isValid: false, error: 'Address is too long' };
  }
  
  return { isValid: true };
};

// PIN code validation (Indian format)
export const validatePincode = (pincode: string): ValidationResult => {
  if (!pincode.trim()) return { isValid: false, error: 'PIN code is required' };
  
  const cleanPincode = pincode.replace(/\D/g, '');
  if (cleanPincode.length !== 6) {
    return { isValid: false, error: 'PIN code must be 6 digits' };
  }
  
  return { isValid: true };
};

// Input sanitization to prevent XSS
export const sanitizeInput = (input: string): string => {
  return input.trim().replace(/[<>]/g, '');
};

// Search query sanitization
export const sanitizeSearchQuery = (query: string): string => {
  const sanitized = query.trim().replace(/[<>'"]/g, '');
  
  // Limit search query length
  if (sanitized.length > 100) {
    throw new Error('Search query is too long');
  }
  
  return sanitized;
};

// Rate limiting helper (client-side basic implementation)
export class RateLimiter {
  private attempts: Map<string, number[]> = new Map();
  private readonly maxAttempts: number;
  private readonly windowMs: number;

  constructor(maxAttempts = 5, windowMs = 15 * 60 * 1000) { // 5 attempts per 15 minutes
    this.maxAttempts = maxAttempts;
    this.windowMs = windowMs;
  }

  isAllowed(identifier: string): boolean {
    const now = Date.now();
    const attempts = this.attempts.get(identifier) || [];
    
    // Clean old attempts
    const recentAttempts = attempts.filter(time => now - time < this.windowMs);
    
    if (recentAttempts.length >= this.maxAttempts) {
      return false;
    }
    
    recentAttempts.push(now);
    this.attempts.set(identifier, recentAttempts);
    
    return true;
  }
}

// Quantity validation for cart operations
export const validateQuantity = (quantity: number): ValidationResult => {
  if (!Number.isInteger(quantity) || quantity < 1) {
    return { isValid: false, error: 'Quantity must be a positive number' };
  }
  
  if (quantity > 50) {
    return { isValid: false, error: 'Quantity cannot exceed 50 items' };
  }
  
  return { isValid: true };
};

// Content Security Policy headers (for reference)
export const getCSPHeaders = (): Record<string, string> => ({
  'Content-Security-Policy': [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://mbawhsbsimdwapgrueaf.supabase.co",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: https: blob:",
    "font-src 'self' data:",
    "connect-src 'self' https://mbawhsbsimdwapgrueaf.supabase.co wss://mbawhsbsimdwapgrueaf.supabase.co",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'"
  ].join('; ')
});