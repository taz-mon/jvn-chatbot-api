// manages errors - Error Handling Middleware
const { createErrorResponse } = require('../utils/responses');

const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map(e => e.message);
    return res.status(400).json(createErrorResponse(
      'Validation Error',
      'VALIDATION_ERROR',
      { details: errors }
    ));
  }

  // Mongoose cast error (invalid ObjectId, etc.)
  if (err.name === 'CastError') {
    return res.status(400).json(createErrorResponse(
      'Invalid data format',
      'CAST_ERROR'
    ));
  }

  // MongoDB duplicate key error
  if (err.code === 11000) {
    return res.status(409).json(createErrorResponse(
      'Duplicate entry',
      'DUPLICATE_ERROR'
    ));
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json(createErrorResponse(
      'Invalid token',
      'INVALID_TOKEN'
    ));
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json(createErrorResponse(
      'Token expired',
      'TOKEN_EXPIRED'
    ));
  }

  // Default server error
  res.status(err.status || 500).json(createErrorResponse(
    err.message || 'Ach! A computational catastrophe occurred!',
    err.code || 'INTERNAL_SERVER_ERROR'
  ));
};

module.exports = errorHandler;

