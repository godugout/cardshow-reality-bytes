
import DOMPurify from 'dompurify';
import { z } from 'zod';

// Input validation schemas
export const cardInputSchema = z.object({
  title: z.string()
    .min(1, 'Title is required')
    .max(100, 'Title too long')
    .regex(/^[a-zA-Z0-9\s\-_]+$/, 'Invalid characters in title'),
  description: z.string()
    .max(1000, 'Description too long')
    .optional(),
  tags: z.array(z.string().regex(/^[a-zA-Z0-9\-_]+$/)).max(10, 'Too many tags'),
  price: z.number().min(0).max(10000, 'Price out of range').optional(),
});

export const userProfileSchema = z.object({
  username: z.string()
    .min(3, 'Username too short')
    .max(30, 'Username too long')
    .regex(/^[a-zA-Z0-9_]+$/, 'Username contains invalid characters'),
  email: z.string().email('Invalid email format'),
  bio: z.string().max(500, 'Bio too long').optional(),
});

export const tradeOfferSchema = z.object({
  recipient_id: z.string().uuid('Invalid recipient ID'),
  offered_cards: z.array(z.object({
    id: z.string().uuid('Invalid card ID'),
    quantity: z.number().int().min(1).max(100).optional(),
    condition: z.enum(['mint', 'near_mint', 'excellent', 'good', 'fair', 'poor']).optional(),
  })).min(1, 'At least one card must be offered'),
  requested_cards: z.array(z.object({
    id: z.string().uuid('Invalid card ID'),
    quantity: z.number().int().min(1).max(100).optional(),
    condition: z.enum(['mint', 'near_mint', 'excellent', 'good', 'fair', 'poor']).optional(),
  })).min(1, 'At least one card must be requested'),
  cash_included: z.number().min(0).max(10000).optional(),
  trade_note: z.string().max(500).optional(),
});

// Content sanitization
export const sanitizeContent = (content: string): string => {
  return DOMPurify.sanitize(content, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'p', 'br'],
    ALLOWED_ATTR: [],
  });
};

// File upload validation
export const validateFileUpload = (file: File): { valid: boolean; error?: string } => {
  // Check file size (max 10MB)
  if (file.size > 10 * 1024 * 1024) {
    return { valid: false, error: 'File size exceeds 10MB limit' };
  }

  // Check file type
  const allowedTypes = [
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/gif'
  ];
  
  if (!allowedTypes.includes(file.type)) {
    return { valid: false, error: 'File type not allowed' };
  }

  // Check filename for malicious patterns
  const maliciousPatterns = [
    /\.exe$/i,
    /\.bat$/i,
    /\.cmd$/i,
    /\.sh$/i,
    /\.php$/i,
    /\.jsp$/i,
    /\.asp$/i,
    /\.\./g, // Path traversal
  ];

  for (const pattern of maliciousPatterns) {
    if (pattern.test(file.name)) {
      return { valid: false, error: 'Filename contains suspicious patterns' };
    }
  }

  return { valid: true };
};

// Rate limiting utilities
export class RateLimiter {
  private attempts: Map<string, { count: number; resetTime: number }> = new Map();

  isAllowed(identifier: string, limit: number, windowMs: number): boolean {
    const now = Date.now();
    const attempt = this.attempts.get(identifier);

    if (!attempt || now > attempt.resetTime) {
      this.attempts.set(identifier, { count: 1, resetTime: now + windowMs });
      return true;
    }

    if (attempt.count >= limit) {
      return false;
    }

    attempt.count++;
    return true;
  }

  getRemainingAttempts(identifier: string, limit: number): number {
    const attempt = this.attempts.get(identifier);
    if (!attempt) return limit;
    return Math.max(0, limit - attempt.count);
  }

  getResetTime(identifier: string): number | null {
    const attempt = this.attempts.get(identifier);
    return attempt ? attempt.resetTime : null;
  }
}

// Password strength validation
export const validatePasswordStrength = (password: string): { 
  valid: boolean; 
  score: number; 
  feedback: string[] 
} => {
  const feedback: string[] = [];
  let score = 0;

  // Length check
  if (password.length >= 12) {
    score += 2;
  } else if (password.length >= 8) {
    score += 1;
  } else {
    feedback.push('Password should be at least 12 characters long');
  }

  // Character variety
  if (/[a-z]/.test(password)) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/[0-9]/.test(password)) score += 1;
  if (/[^a-zA-Z0-9]/.test(password)) score += 1;

  if (!/[a-z]/.test(password)) feedback.push('Add lowercase letters');
  if (!/[A-Z]/.test(password)) feedback.push('Add uppercase letters');
  if (!/[0-9]/.test(password)) feedback.push('Add numbers');
  if (!/[^a-zA-Z0-9]/.test(password)) feedback.push('Add special characters');

  // Common password patterns
  const commonPatterns = [
    /123456/,
    /password/i,
    /qwerty/i,
    /admin/i,
    /letmein/i,
  ];

  for (const pattern of commonPatterns) {
    if (pattern.test(password)) {
      feedback.push('Avoid common password patterns');
      score = Math.max(0, score - 2);
      break;
    }
  }

  return {
    valid: score >= 4,
    score: Math.min(5, score),
    feedback
  };
};

// SQL injection detection (additional layer)
export const detectSQLInjection = (input: string): boolean => {
  const sqlPatterns = [
    /(\%27)|(\')|(\-\-)|(\%23)|(#)/i,
    /((\%3D)|(=))[^\n]*((\%27)|(\')|(\-\-)|(\%3B)|(;))/i,
    /\w*((\%27)|(\'))((\%6F)|o|(\%4F))((\%72)|r|(\%52))/i,
    /((\%27)|(\'))union/i,
    /exec(\s|\+)+(s|x)p\w+/i,
    /union[^a-zA-Z]*select/i,
    /\bdrop\b.*\btable\b/i,
    /\binsert\b.*\binto\b/i,
    /\bdelete\b.*\bfrom\b/i,
    /\bupdate\b.*\bset\b/i,
  ];

  return sqlPatterns.some(pattern => pattern.test(input));
};

// XSS detection
export const detectXSS = (input: string): boolean => {
  const xssPatterns = [
    /<script[^>]*>.*?<\/script>/gi,
    /<iframe[^>]*>.*?<\/iframe>/gi,
    /javascript:/gi,
    /on\w+\s*=/gi,
    /<img[^>]*onerror[^>]*>/gi,
    /<svg[^>]*onload[^>]*>/gi,
    /eval\s*\(/gi,
    /expression\s*\(/gi,
  ];

  return xssPatterns.some(pattern => pattern.test(input));
};

// CSRF token validation
export const generateCSRFToken = (): string => {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
};

export const validateCSRFToken = (token: string, storedToken: string): boolean => {
  if (!token || !storedToken || token.length !== storedToken.length) {
    return false;
  }
  
  // Constant-time comparison to prevent timing attacks
  let result = 0;
  for (let i = 0; i < token.length; i++) {
    result |= token.charCodeAt(i) ^ storedToken.charCodeAt(i);
  }
  
  return result === 0;
};

// Export all validation functions
export const securityValidation = {
  cardInputSchema,
  userProfileSchema,
  tradeOfferSchema,
  sanitizeContent,
  validateFileUpload,
  validatePasswordStrength,
  detectSQLInjection,
  detectXSS,
  generateCSRFToken,
  validateCSRFToken,
  RateLimiter,
};
