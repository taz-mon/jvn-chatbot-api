// defines the standardized response Utilities
const createSuccessResponse = (data, message = 'Success', meta = {}) => {
  return {
    success: true,
    message,
    data,
    meta: {
      timestamp: new Date().toISOString(),
      ...meta
    }
  };
};

const createErrorResponse = (message, code = 'ERROR', details = {}) => {
  return {
    success: false,
    error: {
      message,
      code,
      ...details
    },
    meta: {
      timestamp: new Date().toISOString()
    }
  };
};

const createPaginatedResponse = (data, pagination, message = 'Success') => {
  return {
    success: true,
    message,
    data,
    pagination,
    meta: {
      timestamp: new Date().toISOString()
    }
  };
};

module.exports = {
  createSuccessResponse,
  createErrorResponse,
  createPaginatedResponse
};

