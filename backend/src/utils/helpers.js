const fs = require('fs');
const path = require('path');

// File system utilities
const ensureDirectoryExists = (dirPath) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
};

const deleteFile = (filePath) => {
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error deleting file:', error);
    return false;
  }
};

const getFileSize = (filePath) => {
  try {
    const stats = fs.statSync(filePath);
    return stats.size;
  } catch (error) {
    return 0;
  }
};

// Data formatting utilities
const formatBytes = (bytes, decimals = 2) => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

const formatDuration = (seconds) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  return `${minutes}:${secs.toString().padStart(2, '0')}`;
};

// Audio utilities
const getSupportedAudioFormats = () => {
  return ['mp3', 'wav', 'm4a', 'flac', 'aac', 'ogg'];
};

const isValidAudioFormat = (filename) => {
  const extension = path.extname(filename).toLowerCase().substring(1);
  return getSupportedAudioFormats().includes(extension);
};

// Validation utilities
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const sanitizeFilename = (filename) => {
  return filename.replace(/[^a-z0-9.-]/gi, '_').toLowerCase();
};

// Date utilities
const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

const getTimestamp = () => {
  return new Date().toISOString();
};

const addDays = (date, days) => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

// API utilities
const createSuccessResponse = (data, message = 'Success') => {
  return {
    success: true,
    message,
    data,
    timestamp: getTimestamp()
  };
};

const createErrorResponse = (error, statusCode = 500) => {
  return {
    success: false,
    error: error.message || error,
    statusCode,
    timestamp: getTimestamp()
  };
};

// Performance utilities
const measureExecutionTime = (fn) => {
  return async (...args) => {
    const start = process.hrtime.bigint();
    const result = await fn(...args);
    const end = process.hrtime.bigint();
    const executionTime = Number(end - start) / 1000000; // Convert to milliseconds
    
    console.log(`Function ${fn.name} executed in ${executionTime.toFixed(2)}ms`);
    return result;
  };
};

// Cache utilities
const generateCacheKey = (...parts) => {
  return parts.filter(Boolean).join(':');
};

module.exports = {
  // File system
  ensureDirectoryExists,
  deleteFile,
  getFileSize,
  
  // Formatting
  formatBytes,
  formatDuration,
  formatDate,
  
  // Audio
  getSupportedAudioFormats,
  isValidAudioFormat,
  
  // Validation
  isValidEmail,
  sanitizeFilename,
  
  // Date
  getTimestamp,
  addDays,
  
  // API
  createSuccessResponse,
  createErrorResponse,
  
  // Performance
  measureExecutionTime,
  
  // Cache
  generateCacheKey
};