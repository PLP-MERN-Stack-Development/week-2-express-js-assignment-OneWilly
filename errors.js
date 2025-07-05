/**
 * errors.js - Custom error classes for Express API
 * 
 * Creates specific error types with status codes for better error handling
 */

/**
 * Base Application Error (not used directly)
 * - All custom errors extend this class
 */
class ApplicationError extends Error {
  constructor(message, status = 500, details = []) {
    super(message);
    this.name = this.constructor.name;
    this.status = status;
    this.details = details;
  }
}

/**
 * Not Found Error (404)
 * - Used when a requested resource doesn't exist
 */
class NotFoundError extends ApplicationError {
  constructor(message = 'Resource not found') {
    super(message, 404);
  }
}

/**
 * Validation Error (400 Bad Request)
 * - Used when user input is invalid
 * - Includes details about what's wrong
 */
class ValidationError extends ApplicationError {
  constructor(message = 'Validation failed', details = []) {
    super(message, 400, details);
  }
}

/**
 * Unauthorized Error (401 Unauthorized)
 * - Used when authentication fails
 */
class UnauthorizedError extends ApplicationError {
  constructor(message = 'Authentication required') {
    super(message, 401);
  }
}

// Export error classes
module.exports = {
  NotFoundError,
  ValidationError,
  UnauthorizedError,
  ApplicationError
};
