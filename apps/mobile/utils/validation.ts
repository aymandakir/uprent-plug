/**
 * Form validation utilities
 */

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

export const validateEmail = (email: string): ValidationResult => {
  if (!email) {
    return { isValid: false, error: 'Email is required' };
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { isValid: false, error: 'Please enter a valid email address' };
  }
  
  return { isValid: true };
};

export const validatePassword = (password: string, isSignUp = false): ValidationResult => {
  if (!password) {
    return { isValid: false, error: 'Password is required' };
  }
  
  if (isSignUp) {
    if (password.length < 6) {
      return { isValid: false, error: 'Password must be at least 6 characters' };
    }
    
    // Optional: Add more password strength requirements
    if (password.length < 8) {
      return { isValid: true }; // Allow but could show warning
    }
  } else {
    // For sign in, just check it's not empty
    if (password.length === 0) {
      return { isValid: false, error: 'Password is required' };
    }
  }
  
  return { isValid: true };
};

export const validateFullName = (fullName: string): ValidationResult => {
  // Full name is optional, but if provided, should be valid
  if (fullName && fullName.trim().length < 2) {
    return { isValid: false, error: 'Name must be at least 2 characters' };
  }
  
  return { isValid: true };
};

export const getPasswordStrength = (password: string): {
  strength: 'weak' | 'medium' | 'strong';
  feedback: string[];
} => {
  const feedback: string[] = [];
  let score = 0;
  
  if (password.length >= 8) {
    score += 1;
  } else {
    feedback.push('At least 8 characters');
  }
  
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) {
    score += 1;
  } else {
    feedback.push('Mix of uppercase and lowercase');
  }
  
  if (/\d/.test(password)) {
    score += 1;
  } else {
    feedback.push('Include numbers');
  }
  
  if (/[^a-zA-Z0-9]/.test(password)) {
    score += 1;
  } else {
    feedback.push('Include special characters');
  }
  
  if (score <= 1) {
    return { strength: 'weak', feedback };
  } else if (score <= 2) {
    return { strength: 'medium', feedback };
  } else {
    return { strength: 'strong', feedback: [] };
  }
};

