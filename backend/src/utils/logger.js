// src/utils/logger.js

/**
 * Simple logger that doesn't require any external modules
 */
module.exports = {
  info: (message, meta = {}) => {
    console.log(`INFO: ${message}`, meta);
  },
  
  warn: (message, meta = {}) => {
    console.log(`WARNING: ${message}`, meta);
  },
  
  error: (message, error = null) => {
    if (error && error instanceof Error) {
      console.error(`ERROR: ${message}: ${error.message}`, { stack: error.stack });
    } else {
      console.error(`ERROR: ${message}`, error || {});
    }
  },
  
  debug: (message, meta = {}) => {
    console.log(`DEBUG: ${message}`, meta);
  }
};
