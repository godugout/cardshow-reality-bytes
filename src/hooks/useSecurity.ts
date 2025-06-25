
import { useState, useCallback, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { securityValidation, RateLimiter } from '@/utils/securityValidation';

interface SecurityConfig {
  rateLimiting: {
    enabled: boolean;
    limits: {
      auth: { requests: number; windowMs: number };
      api: { requests: number; windowMs: number };
      upload: { requests: number; windowMs: number };
    };
  };
  contentSecurity: {
    sanitizeInputs: boolean;
    detectXSS: boolean;
    detectSQLInjection: boolean;
  };
  fileUpload: {
    maxSize: number;
    allowedTypes: string[];
    scanForMalware: boolean;
  };
}

const defaultSecurityConfig: SecurityConfig = {
  rateLimiting: {
    enabled: true,
    limits: {
      auth: { requests: 5, windowMs: 15 * 60 * 1000 }, // 5 attempts per 15 minutes
      api: { requests: 100, windowMs: 60 * 1000 }, // 100 requests per minute
      upload: { requests: 10, windowMs: 60 * 1000 }, // 10 uploads per minute
    },
  },
  contentSecurity: {
    sanitizeInputs: true,
    detectXSS: true,
    detectSQLInjection: true,
  },
  fileUpload: {
    maxSize: 10 * 1024 * 1024, // 10MB
    allowedTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
    scanForMalware: true,
  },
};

export const useSecurity = (config: Partial<SecurityConfig> = {}) => {
  const [securityConfig] = useState<SecurityConfig>({
    ...defaultSecurityConfig,
    ...config,
  });
  const [rateLimiters] = useState({
    auth: new RateLimiter(),
    api: new RateLimiter(),
    upload: new RateLimiter(),
  });
  const [securityAlerts, setSecurityAlerts] = useState<Array<{
    id: string;
    type: 'rate_limit' | 'xss' | 'sql_injection' | 'file_upload' | 'csrf';
    severity: 'low' | 'medium' | 'high' | 'critical';
    message: string;
    timestamp: Date;
  }>>([]);
  
  const { toast } = useToast();

  // Rate limiting check
  const checkRateLimit = useCallback((
    type: 'auth' | 'api' | 'upload',
    identifier: string
  ): boolean => {
    if (!securityConfig.rateLimiting.enabled) return true;

    const limiter = rateLimiters[type];
    const limit = securityConfig.rateLimiting.limits[type];
    
    const allowed = limiter.isAllowed(identifier, limit.requests, limit.windowMs);
    
    if (!allowed) {
      const alert = {
        id: crypto.randomUUID(),
        type: 'rate_limit' as const,
        severity: 'high' as const,
        message: `Rate limit exceeded for ${type} from ${identifier}`,
        timestamp: new Date(),
      };
      
      setSecurityAlerts(prev => [...prev, alert]);
      
      toast({
        title: 'Rate limit exceeded',
        description: 'Too many requests. Please wait before trying again.',
        variant: 'destructive',
      });
    }
    
    return allowed;
  }, [securityConfig, rateLimiters, toast]);

  // Content validation
  const validateContent = useCallback((content: string, context: string): {
    valid: boolean;
    sanitized: string;
    issues: string[];
  } => {
    const issues: string[] = [];
    let sanitized = content;

    // XSS detection
    if (securityConfig.contentSecurity.detectXSS && securityValidation.detectXSS(content)) {
      issues.push('Potential XSS attack detected');
      setSecurityAlerts(prev => [...prev, {
        id: crypto.randomUUID(),
        type: 'xss',
        severity: 'critical',
        message: `XSS attempt detected in ${context}`,
        timestamp: new Date(),
      }]);
    }

    // SQL injection detection
    if (securityConfig.contentSecurity.detectSQLInjection && securityValidation.detectSQLInjection(content)) {
      issues.push('Potential SQL injection detected');
      setSecurityAlerts(prev => [...prev, {
        id: crypto.randomUUID(),
        type: 'sql_injection',
        severity: 'critical',
        message: `SQL injection attempt detected in ${context}`,
        timestamp: new Date(),
      }]);
    }

    // Content sanitization
    if (securityConfig.contentSecurity.sanitizeInputs) {
      sanitized = securityValidation.sanitizeContent(content);
    }

    return {
      valid: issues.length === 0,
      sanitized,
      issues,
    };
  }, [securityConfig]);

  // File upload validation
  const validateFileUpload = useCallback((file: File): {
    valid: boolean;
    error?: string;
  } => {
    // Basic validation
    const basicValidation = securityValidation.validateFileUpload(file);
    if (!basicValidation.valid) {
      setSecurityAlerts(prev => [...prev, {
        id: crypto.randomUUID(),
        type: 'file_upload',
        severity: 'medium',
        message: `File upload rejected: ${basicValidation.error}`,
        timestamp: new Date(),
      }]);
      return basicValidation;
    }

    // Additional size check based on config
    if (file.size > securityConfig.fileUpload.maxSize) {
      const error = `File size exceeds ${securityConfig.fileUpload.maxSize / (1024 * 1024)}MB limit`;
      setSecurityAlerts(prev => [...prev, {
        id: crypto.randomUUID(),
        type: 'file_upload',
        severity: 'medium',
        message: `File upload rejected: ${error}`,
        timestamp: new Date(),
      }]);
      return { valid: false, error };
    }

    // Type check based on config
    if (!securityConfig.fileUpload.allowedTypes.includes(file.type)) {
      const error = 'File type not allowed';
      setSecurityAlerts(prev => [...prev, {
        id: crypto.randomUUID(),
        type: 'file_upload',
        severity: 'medium',
        message: `File upload rejected: ${error}`,
        timestamp: new Date(),
      }]);
      return { valid: false, error };
    }

    return { valid: true };
  }, [securityConfig]);

  // Password strength validation
  const validatePassword = useCallback((password: string) => {
    return securityValidation.validatePasswordStrength(password);
  }, []);

  // CSRF token management
  const [csrfToken, setCsrfToken] = useState<string>('');

  const generateCSRFToken = useCallback(() => {
    const token = securityValidation.generateCSRFToken();
    setCsrfToken(token);
    return token;
  }, []);

  const validateCSRFToken = useCallback((token: string): boolean => {
    const valid = securityValidation.validateCSRFToken(token, csrfToken);
    if (!valid) {
      setSecurityAlerts(prev => [...prev, {
        id: crypto.randomUUID(),
        type: 'csrf',
        severity: 'high',
        message: 'CSRF token validation failed',
        timestamp: new Date(),
      }]);
    }
    return valid;
  }, [csrfToken]);

  // Initialize CSRF token
  useEffect(() => {
    generateCSRFToken();
  }, [generateCSRFToken]);

  // Clear old security alerts
  useEffect(() => {
    const interval = setInterval(() => {
      const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
      setSecurityAlerts(prev => prev.filter(alert => alert.timestamp > oneHourAgo));
    }, 5 * 60 * 1000); // Clean up every 5 minutes

    return () => clearInterval(interval);
  }, []);

  // Get security status
  const getSecurityStatus = useCallback(() => {
    const recentAlerts = securityAlerts.filter(
      alert => alert.timestamp > new Date(Date.now() - 24 * 60 * 60 * 1000)
    );

    const criticalAlerts = recentAlerts.filter(alert => alert.severity === 'critical');
    const highAlerts = recentAlerts.filter(alert => alert.severity === 'high');

    return {
      status: criticalAlerts.length > 0 ? 'critical' : 
              highAlerts.length > 0 ? 'warning' : 'normal',
      alertCount: recentAlerts.length,
      criticalCount: criticalAlerts.length,
      highCount: highAlerts.length,
      recentAlerts: recentAlerts.slice(0, 10), // Latest 10 alerts
    };
  }, [securityAlerts]);

  return {
    // Rate limiting
    checkRateLimit,
    
    // Content security
    validateContent,
    
    // File upload security
    validateFileUpload,
    
    // Password security
    validatePassword,
    
    // CSRF protection
    csrfToken,
    generateCSRFToken,
    validateCSRFToken,
    
    // Security monitoring
    securityAlerts,
    getSecurityStatus,
    
    // Configuration
    securityConfig,
  };
};

export type SecurityHook = ReturnType<typeof useSecurity>;
