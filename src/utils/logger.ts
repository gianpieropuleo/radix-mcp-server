/**
 * Logger configuration using Pino
 * All logging goes to stderr to avoid interfering with JSON-RPC stdout communication
 */
import { pino } from 'pino';

// Create a custom write stream that formats logs like the original console.error
const customStream = {
  write(msg: string) {
    try {
      const log = JSON.parse(msg);
      const level = log.level === 30 ? 'INFO' : log.level === 40 ? 'WARN' : log.level === 50 ? 'ERR' : 'LOG';
      const message = log.msg || '';
      
      // For errors, include the error details
      if (log.err) {
        console.error(`${level}: ${message} - ${log.err.message}`);
        if (log.err.stack) {
          console.error(`Stack: ${log.err.stack}`);
        }
      } else if (log.error) {
        console.error(`${level}: ${message} - ${log.error}`);
      } else {
        console.error(`${level}: ${message}`);
      }
    } catch {
      // Fallback for non-JSON logs
      console.error(msg.trim());
    }
  }
};

// Create pino logger with custom stream
const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  base: undefined,
  timestamp: false
}, customStream);

/**
 * Simple error logging function
 */
export function logError(message: string, error?: any): void {
  if (error instanceof Error) {
    logger.error({ err: error }, message);
  } else if (error) {
    logger.error({ error: String(error) }, message);
  } else {
    logger.error(message);
  }
}

/**
 * Simple warning logging function
 */
export function logWarning(message: string): void {
  logger.warn(message);
}

/**
 * Simple info logging function
 */
export function logInfo(message: string): void {
  logger.info(message);
}