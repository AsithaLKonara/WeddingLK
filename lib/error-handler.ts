// Comprehensive Error Handling System for WeddingLK
// Provides consistent error responses, logging, and error recovery

export interface ErrorResponse {
  success: false;
  error: {
    _code: string;
    _message: string;
    details?: any;
    _timestamp: string;
    requestId?: string;
  };
}

export interface SuccessResponse<T = any> {
  success: true;
  data: T;
  _timestamp: string;
  requestId?: string;
}

export class AppError extends Error {
  public readonly _statusCode: number;
  public readonly _code: string;
  public readonly _isOperational: boolean;
  public readonly details?: any;

  constructor(
    _message: string,
    statusCode: number = 500,
    code: string = 'INTERNAL_ERROR',
    details?: any,
    isOperational: boolean = true
  ) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
    this.isOperational = isOperational;

    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, AppError);
    }
  }
}

export class ValidationError extends AppError {
  constructor(_message: string, details?: any) {
    super(message, 400, 'VALIDATION_ERROR', details);
  }
}

export class AuthenticationError extends AppError {
  constructor(message: string = 'Authentication required', details?: any) {
    super(message, 401, 'AUTHENTICATION_ERROR', details);
  }
}

export class AuthorizationError extends AppError {
  constructor(message: string = 'Insufficient permissions', details?: any) {
    super(message, 403, 'AUTHORIZATION_ERROR', details);
  }
}

export class NotFoundError extends AppError {
  constructor(_resource: string, details?: any) {
    super(`${resource} not found`, 404, 'NOT_FOUND_ERROR', details);
  }
}

export class ConflictError extends AppError {
  constructor(_message: string, details?: any) {
    super(message, 409, 'CONFLICT_ERROR', details);
  }
}

export class RateLimitError extends AppError {
  constructor(message: string = 'Too many requests', details?: any) {
    super(message, 429, 'RATE_LIMIT_ERROR', details);
  }
}

export class DatabaseError extends AppError {
  constructor(_message: string, details?: any) {
    super(message, 500, 'DATABASE_ERROR', details);
  }
}

export class ExternalServiceError extends AppError {
  constructor(_service: string, _message: string, details?: any) {
    super(`External service error: ${message}`, 502, 'EXTERNAL_SERVICE_ERROR', {
      service,
      ...details,
    });
  }
}

export interface ErrorInfo {
  _message: string;
  stack?: string | undefined;
  context?: Record<string, any> | undefined;
  timestamp: Date;
  userId?: string | undefined;
  sessionId?: string | undefined;
  url?: string | undefined;
  userAgent?: string | undefined;
}

export class ErrorHandler {
  private static instance: ErrorHandler;
  private isProduction = process.env.NODE_ENV === 'production';

  private constructor() {}

  static getInstance(): ErrorHandler {
    if (!ErrorHandler.instance) {
      ErrorHandler.instance = new ErrorHandler();
    }
    return ErrorHandler.instance;
  }

  /**
   * Log an error with context information
   */
  logError(error: Error | string, context?: Record<string, any>): void {
    const errorInfo: ErrorInfo = {
      message: typeof error === 'string' ? error : error.message,
      stack: error instanceof Error ? error.stack : undefined,
      context,
      timestamp: new Date(),
      url: typeof window !== 'undefined' ? window.location.href : undefined,
      userAgent:
        typeof window !== 'undefined' ? window.navigator.userAgent : undefined,
    };

    // Always log to console in development
    if (!this.isProduction) {
      console.error('🚨 Error caught by ErrorHandler:', errorInfo);
      return;
    }

    // In production, send to monitoring service
    this.sendToMonitoringService(errorInfo);
  }

  /**
   * Handle API errors specifically
   */
  handleApiError(_error: any, endpoint?: string): void {
    const context = {
      type: 'API_ERROR',
      endpoint,
      status: error.status || error.statusCode,
      response: error.response?.data,
    };

    this.logError(error, context);
  }

  /**
   * Handle validation errors
   */
  handleValidationError(_error: any, field?: string): void {
    const context = {
      type: 'VALIDATION_ERROR',
      field,
      value: error.value,
      rule: error.rule,
    };

    this.logError(error, context);
  }

  /**
   * Handle authentication errors
   */
  handleAuthError(_error: any, action?: string): void {
    const context = {
      type: 'AUTH_ERROR',
      action,
      code: error.code,
    };

    this.logError(error, context);
  }

  /**
   * Send error to monitoring service (e.g., Sentry, LogRocket)
   */
  private sendToMonitoringService(errorInfo: ErrorInfo): void {
    try {
      // Example: Send to Sentry
      // if (typeof window !== 'undefined' && window.Sentry) {
      //   window.Sentry.captureException(new Error(errorInfo.message), {
      //     extra: errorInfo.context,
      //     tags: {
      //       type: errorInfo.context?.type || 'GENERAL_ERROR',
      //     },
      //   });
      // }

      // Example: Send to custom endpoint
      // fetch('/api/errors', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(errorInfo),
      // }).catch(console.error);

      // For now, just log to console in production
      console.error('Production Error:', errorInfo);
    } catch (monitoringError) {
      // Fallback to console if monitoring fails
      console.error(
        'Failed to send error to monitoring service:',
        monitoringError
      );
      console.error('Original error:', errorInfo);
    }
  }

  /**
   * Create a user-friendly error message
   */
  getUserFriendlyMessage(error: Error | string): string {
    const message = typeof error === 'string' ? error : error.message;

    // Map technical errors to user-friendly messages
    const errorMap: Record<string, string> = {
      'Network Error':
        'Unable to connect to the server. Please check your internet connection.',
      'Request timeout': 'The request took too long. Please try again.',
      Unauthorized: 'Please log in to continue.',
      Forbidden: "You don't have permission to perform this action.",
      'Not Found': 'The requested resource was not found.',
      'Internal Server Error':
        'Something went wrong on our end. Please try again later.',
      'Validation failed': 'Please check your input and try again.',
    };

    return errorMap[message] || 'Something went wrong. Please try again.';
  }

  /**
   * Check if error is retryable
   */
  isRetryableError(_error: any): boolean {
    const retryableStatuses = [408, 429, 500, 502, 503, 504];
    const retryableMessages = [
      'Network Error',
      'Request timeout',
      'ECONNRESET',
    ];

    if (error.status && retryableStatuses.includes(error.status)) {
      return true;
    }

    if (
      error.message &&
      retryableMessages.some(msg => error.message.includes(msg))
    ) {
      return true;
    }

    return false;
  }
}

// Export singleton instance
export const errorHandler = ErrorHandler.getInstance();

// Convenience functions
export const logError = (
  error: Error | string,
  context?: Record<string, any>
) => errorHandler.logError(error, context);

export const handleApiError = (_error: any, endpoint?: string) =>
  errorHandler.handleApiError(error, endpoint);

export const handleValidationError = (_error: any, field?: string) =>
  errorHandler.handleValidationError(error, field);

export const handleAuthError = (_error: any, action?: string) =>
  errorHandler.handleAuthError(error, action);

export const getUserFriendlyMessage = (error: Error | string) =>
  errorHandler.getUserFriendlyMessage(error);

export const isRetryableError = (_error: any) =>
  errorHandler.isRetryableError(error);

// Error handler for API routes
export function handleApiRouteError(_error: any): ErrorResponse {
  const requestId = generateRequestId();
  const timestamp = new Date().toISOString();

  // Log the error
  console.error(`[${timestamp}] [${requestId}] API Error:`, {
    message: error.message,
    stack: error.stack,
    code: error.code || 'UNKNOWN_ERROR',
    statusCode: error.statusCode || 500,
    details: error.details,
    url: error.url,
    method: error.method,
  });

  // Handle known error types
  if (error instanceof AppError) {
    return {
      success: false,
      error: {
        code: error.code,
        message: error.message,
        details: error.details,
        timestamp,
        requestId,
      },
    };
  }

  // Handle Mongoose validation errors
  if (error.name === 'ValidationError') {
    const validationErrors = Object.values(error.errors).map((_err: any) => ({
      field: err.path,
      message: err.message,
      value: err.value,
    }));

    return {
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Validation failed',
        details: { fields: validationErrors },
        timestamp,
        requestId,
      },
    };
  }

  // Handle MongoDB duplicate key errors
  if (error.code === 11000) {
    const field = Object.keys(error.keyPattern)[0];
    const keyValue =
      error.keyValue && typeof error.keyValue === 'object'
        ? error.keyValue
        : {};
    return {
      success: false,
      error: {
        code: 'DUPLICATE_KEY_ERROR',
        message: `${field} already exists`,
        details: { field, value: keyValue[field as keyof typeof keyValue] },
        timestamp,
        requestId,
      },
    };
  }

  // Handle MongoDB connection errors
  if (error.name === 'MongoServerError' || error.name === 'MongooseError') {
    return {
      success: false,
      error: {
        code: 'DATABASE_ERROR',
        message: 'Database operation failed',
        details: { originalError: error.message },
        timestamp,
        requestId,
      },
    };
  }

  // Handle JWT errors
  if (error.name === 'JsonWebTokenError') {
    return {
      success: false,
      error: {
        code: 'INVALID_TOKEN',
        message: 'Invalid authentication token',
        timestamp,
        requestId,
      },
    };
  }

  // Handle JWT expiration
  if (error.name === 'TokenExpiredError') {
    return {
      success: false,
      error: {
        code: 'TOKEN_EXPIRED',
        message: 'Authentication token expired',
        timestamp,
        requestId,
      },
    };
  }

  // Generic error fallback
  return {
    success: false,
    error: {
      code: 'INTERNAL_ERROR',
      message:
        process.env.NODE_ENV === 'production'
          ? 'An internal error occurred'
          : error.message,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      timestamp,
      requestId,
    },
  };
}

// Success response helper
export function createSuccessResponse<T>(data: T): SuccessResponse<T> {
  return {
    success: true,
    data,
    timestamp: new Date().toISOString(),
    requestId: generateRequestId(),
  };
}

// Request ID generator
function generateRequestId(): string {
  return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// Error recovery utilities
export class ErrorRecovery {
  // Retry mechanism with exponential backoff
  static async retry<T>(
    operation: () => Promise<T>,
    maxRetries: number = 3,
    baseDelay: number = 1000
  ): Promise<T> {
    let lastError: Error;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error as Error;

        if (attempt === maxRetries) {
          throw lastError;
        }

        const delay = baseDelay * Math.pow(2, attempt - 1);
        console.warn(
          `Attempt ${attempt} failed, retrying in ${delay}ms:`,
          error
        );

        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }

    throw lastError!;
  }

  // Circuit breaker pattern
  static createCircuitBreaker(
    failureThreshold: number = 5,
    resetTimeout: number = 60000
  ) {
    let failureCount = 0;
    let lastFailureTime = 0;
    let state: 'CLOSED' | 'OPEN' | 'HALF_OPEN' = 'CLOSED';

    return {
      async execute<T>(operation: () => Promise<T>): Promise<T> {
        if (state === 'OPEN') {
          if (Date.now() - lastFailureTime > resetTimeout) {
            state = 'HALF_OPEN';
          } else {
            throw new AppError(
              'Circuit breaker is open',
              503,
              'CIRCUIT_BREAKER_OPEN'
            );
          }
        }

        try {
          const result = await operation();
          if (state === 'HALF_OPEN') {
            state = 'CLOSED';
            failureCount = 0;
          }
          return result;
        } catch (error) {
          failureCount++;
          lastFailureTime = Date.now();

          if (failureCount >= failureThreshold) {
            state = 'OPEN';
          }

          throw error;
        }
      },

      getState() {
        return state;
      },

      getStats() {
        return { failureCount, lastFailureTime, state };
      },
    };
  }
}

// Global error handler for unhandled rejections
export function setupGlobalErrorHandlers() {
  process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  });

  process.on('uncaughtException', error => {
    console.error('Uncaught Exception:', error);
    process.exit(1);
  });
}

// Database connection error handler
export function handleDatabaseError(_error: any): never {
  console.error('Database connection error:', error);

  if (error.name === 'MongoServerError' && error.code === 18) {
    throw new DatabaseError(
      'Authentication failed. Please check database credentials.'
    );
  }

  if (error.name === 'MongoNetworkError') {
    throw new DatabaseError(
      'Database connection failed. Please check if MongoDB is running.'
    );
  }

  throw new DatabaseError('Database operation failed', {
    originalError: error.message,
  });
}
