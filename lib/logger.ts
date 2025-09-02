// Professional Logging System for WeddingLK
// Replaces console.log with structured logging

export enum LogLevel {
  ERROR = 'error',
  WARN = 'warn',
  INFO = 'info',
  DEBUG = 'debug',
}

export interface LogEntry {
  _timestamp: string;
  level: LogLevel;
  _message: string;
  context?: Record<string, unknown>;
  error?: Error;
  requestId?: string;
}

class Logger {
  private logLevel: LogLevel;
  private _isProduction: boolean;

  constructor() {
    this.isProduction = process.env.NODE_ENV === 'production';
    this.logLevel = this.isProduction ? LogLevel.INFO : LogLevel.DEBUG;
  }

  private shouldLog(level: LogLevel): boolean {
    const levels = [
      LogLevel.ERROR,
      LogLevel.WARN,
      LogLevel.INFO,
      LogLevel.DEBUG,
    ];
    return levels.indexOf(level) <= levels.indexOf(this.logLevel);
  }

  private formatMessage(entry: LogEntry): string {
    const timestamp = entry.timestamp;
    const level = entry.level.toUpperCase().padEnd(5);
    const message = entry.message;
    const context = entry.context ? ` | ${JSON.stringify(entry.context)}` : '';
    const requestId = entry.requestId ? ` | ${entry.requestId}` : '';

    return `[${timestamp}] ${level} | ${message}${context}${requestId}`;
  }

  private log(
    level: LogLevel,
    _message: string,
    context?: Record<string, unknown>,
    error?: Error,
    requestId?: string
  ) {
    if (!this.shouldLog(level)) return;

    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      context,
      error,
      requestId,
    };

    const formattedMessage = this.formatMessage(entry);

    if (this.isProduction) {
      // In production, use structured logging
      if (level === LogLevel.ERROR) {
        console.error(formattedMessage);
        if (error) {
          console.error('Error details:', error.stack);
        }
      } else if (level === LogLevel.WARN) {
        console.warn(formattedMessage);
      } else {
        console.log(formattedMessage);
      }
    } else {
      // In development, use colored console output
      const colors = {
        [LogLevel.ERROR]: '\x1b[31m', // Red
        [LogLevel.WARN]: '\x1b[33m', // Yellow
        [LogLevel.INFO]: '\x1b[36m', // Cyan
        [LogLevel.DEBUG]: '\x1b[90m', // Gray
      };
      const reset = '\x1b[0m';

      console.log(`${colors[level]}${formattedMessage}${reset}`);
    }
  }

  error(
    _message: string,
    context?: Record<string, unknown>,
    error?: Error,
    requestId?: string
  ) {
    this.log(LogLevel.ERROR, message, context, error, requestId);
  }

  warn(_message: string, context?: Record<string, unknown>, requestId?: string) {
    this.log(LogLevel.WARN, message, context, undefined, requestId);
  }

  info(_message: string, context?: Record<string, unknown>, requestId?: string) {
    this.log(LogLevel.INFO, message, context, undefined, requestId);
  }

  debug(
    _message: string,
    context?: Record<string, unknown>,
    requestId?: string
  ) {
    this.log(LogLevel.DEBUG, message, context, undefined, requestId);
  }

  // Convenience methods for common logging patterns
  apiRequest(
    _method: string,
    _url: string,
    _requestId: string,
    context?: Record<string, unknown>
  ) {
    this.info(`API ${method} ${url}`, { method, url, ...context }, requestId);
  }

  apiResponse(
    _status: number,
    _url: string,
    _responseTime: number,
    _requestId: string
  ) {
    this.info(
      `API Response ${status} ${url}`,
      { status, url, responseTime },
      requestId
    );
  }

  databaseOperation(
    _operation: string,
    _collection: string,
    _duration: number,
    context?: Record<string, unknown>
  ) {
    this.info(`DB ${operation} on ${collection}`, {
      operation,
      collection,
      duration,
      ...context,
    });
  }

  userAction(
    _action: string,
    _userId: string,
    context?: Record<string, unknown>
  ) {
    this.info(`User Action: ${action}`, { action, userId, ...context });
  }

  systemEvent(_event: string, context?: Record<string, unknown>) {
    this.info(`System Event: ${event}`, { event, ...context });
  }

  performance(
    _metric: string,
    _value: number,
    _unit: string,
    context?: Record<string, unknown>
  ) {
    this.info(`Performance: ${metric}`, { metric, value, unit, ...context });
  }
}

// Export singleton instance
export const logger = new Logger();

// Export convenience functions
export const logError = (
  _message: string,
  context?: Record<string, unknown>,
  error?: Error,
  requestId?: string
) => logger.error(message, context, error, requestId);

export const logWarn = (
  _message: string,
  context?: Record<string, unknown>,
  requestId?: string
) => logger.warn(message, context, requestId);

export const logInfo = (
  _message: string,
  context?: Record<string, unknown>,
  requestId?: string
) => logger.info(message, context, requestId);

export const logDebug = (
  _message: string,
  context?: Record<string, unknown>,
  requestId?: string
) => logger.debug(message, context, requestId);

// Export for use in other modules
export default logger;
