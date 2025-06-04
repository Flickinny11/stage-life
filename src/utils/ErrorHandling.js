/**
 * Error handling and validation utilities for Stage-Life
 */

export class AudioError extends Error {
  constructor(message, code, details = {}) {
    super(message);
    this.name = 'AudioError';
    this.code = code;
    this.details = details;
    this.timestamp = new Date().toISOString();
  }
}

export class PaymentError extends Error {
  constructor(message, code, details = {}) {
    super(message);
    this.name = 'PaymentError';
    this.code = code;
    this.details = details;
    this.timestamp = new Date().toISOString();
  }
}

export class ValidationError extends Error {
  constructor(message, field, value) {
    super(message);
    this.name = 'ValidationError';
    this.field = field;
    this.value = value;
    this.timestamp = new Date().toISOString();
  }
}

export class ErrorHandler {
  constructor() {
    this.errors = [];
    this.maxErrors = 100;
    this.listeners = new Set();
  }

  logError(error, context = {}) {
    const errorInfo = {
      id: Math.random().toString(36).substr(2, 9),
      error: {
        name: error.name,
        message: error.message,
        stack: error.stack,
        code: error.code,
        details: error.details
      },
      context,
      timestamp: new Date().toISOString(),
      url: window.location.href,
      userAgent: navigator.userAgent
    };

    this.errors.push(errorInfo);
    
    // Keep only the latest errors
    if (this.errors.length > this.maxErrors) {
      this.errors = this.errors.slice(-this.maxErrors);
    }

    // Notify listeners
    this.notifyListeners(errorInfo);

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Stage-Life Error:', errorInfo);
    }

    return errorInfo.id;
  }

  addListener(callback) {
    this.listeners.add(callback);
  }

  removeListener(callback) {
    this.listeners.delete(callback);
  }

  notifyListeners(errorInfo) {
    this.listeners.forEach(callback => {
      try {
        callback(errorInfo);
      } catch (error) {
        console.error('Error in error listener:', error);
      }
    });
  }

  getErrors(count = 10) {
    return this.errors.slice(-count);
  }

  clearErrors() {
    this.errors = [];
  }

  exportErrorLog() {
    return {
      timestamp: new Date().toISOString(),
      version: process.env.REACT_APP_VERSION || '1.0.0',
      errors: this.errors,
      system: {
        platform: navigator.platform,
        userAgent: navigator.userAgent,
        language: navigator.language,
        cookieEnabled: navigator.cookieEnabled
      }
    };
  }
}

export class AudioValidator {
  static validateSampleRate(sampleRate) {
    const validRates = [44100, 48000, 96000, 192000];
    if (!validRates.includes(sampleRate)) {
      throw new ValidationError(
        `Invalid sample rate: ${sampleRate}. Must be one of: ${validRates.join(', ')}`,
        'sampleRate',
        sampleRate
      );
    }
    return true;
  }

  static validateChannelCount(channels) {
    if (!Number.isInteger(channels) || channels < 1 || channels > 16) {
      throw new ValidationError(
        `Invalid channel count: ${channels}. Must be integer between 1 and 16`,
        'channels',
        channels
      );
    }
    return true;
  }

  static validateGain(gain) {
    if (typeof gain !== 'number' || gain < 0 || gain > 4) {
      throw new ValidationError(
        `Invalid gain value: ${gain}. Must be number between 0 and 4`,
        'gain',
        gain
      );
    }
    return true;
  }

  static validateEQParameters(band, frequency, gain, Q = 0.7) {
    const validBands = ['low', 'mid', 'high'];
    if (!validBands.includes(band)) {
      throw new ValidationError(
        `Invalid EQ band: ${band}. Must be one of: ${validBands.join(', ')}`,
        'eqBand',
        band
      );
    }

    if (typeof frequency !== 'number' || frequency < 20 || frequency > 20000) {
      throw new ValidationError(
        `Invalid frequency: ${frequency}. Must be between 20 and 20000 Hz`,
        'frequency',
        frequency
      );
    }

    if (typeof gain !== 'number' || gain < -24 || gain > 24) {
      throw new ValidationError(
        `Invalid EQ gain: ${gain}. Must be between -24 and +24 dB`,
        'eqGain',
        gain
      );
    }

    if (typeof Q !== 'number' || Q < 0.1 || Q > 10) {
      throw new ValidationError(
        `Invalid Q factor: ${Q}. Must be between 0.1 and 10`,
        'qFactor',
        Q
      );
    }

    return true;
  }

  static validateCompressorParameters(threshold, ratio, attack, release, knee) {
    if (typeof threshold !== 'number' || threshold < -60 || threshold > 0) {
      throw new ValidationError(
        `Invalid compressor threshold: ${threshold}. Must be between -60 and 0 dB`,
        'threshold',
        threshold
      );
    }

    if (typeof ratio !== 'number' || ratio < 1 || ratio > 20) {
      throw new ValidationError(
        `Invalid compressor ratio: ${ratio}. Must be between 1 and 20`,
        'ratio',
        ratio
      );
    }

    if (typeof attack !== 'number' || attack < 0.001 || attack > 1) {
      throw new ValidationError(
        `Invalid attack time: ${attack}. Must be between 0.001 and 1 second`,
        'attack',
        attack
      );
    }

    if (typeof release !== 'number' || release < 0.01 || release > 5) {
      throw new ValidationError(
        `Invalid release time: ${release}. Must be between 0.01 and 5 seconds`,
        'release',
        release
      );
    }

    if (typeof knee !== 'number' || knee < 0 || knee > 10) {
      throw new ValidationError(
        `Invalid knee value: ${knee}. Must be between 0 and 10`,
        'knee',
        knee
      );
    }

    return true;
  }
}

export class PaymentValidator {
  static validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new ValidationError(
        'Invalid email address format',
        'email',
        email
      );
    }
    return true;
  }

  static validateName(name) {
    if (typeof name !== 'string' || name.trim().length < 2) {
      throw new ValidationError(
        'Name must be at least 2 characters long',
        'name',
        name
      );
    }
    if (name.trim().length > 100) {
      throw new ValidationError(
        'Name must be less than 100 characters',
        'name',
        name
      );
    }
    return true;
  }

  static validateAmount(amount) {
    if (!Number.isInteger(amount) || amount < 100 || amount > 100000) {
      throw new ValidationError(
        'Invalid payment amount. Must be between $1.00 and $1000.00',
        'amount',
        amount
      );
    }
    return true;
  }

  static validateActivationKey(key) {
    const keyRegex = /^[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}$/;
    if (!keyRegex.test(key)) {
      throw new ValidationError(
        'Invalid activation key format',
        'activationKey',
        key
      );
    }
    return true;
  }
}

export class PerformanceMonitor {
  constructor() {
    this.metrics = {
      audioLatency: [],
      cpuUsage: [],
      memoryUsage: [],
      frameDrops: 0,
      errors: 0
    };
    this.isMonitoring = false;
  }

  start() {
    if (this.isMonitoring) return;
    
    this.isMonitoring = true;
    this.monitoringInterval = setInterval(() => {
      this.collectMetrics();
    }, 1000);
    
    console.log('Performance monitoring started');
  }

  stop() {
    if (!this.isMonitoring) return;
    
    this.isMonitoring = false;
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
    }
    
    console.log('Performance monitoring stopped');
  }

  collectMetrics() {
    // Collect performance metrics
    if (performance.memory) {
      this.metrics.memoryUsage.push({
        used: performance.memory.usedJSHeapSize,
        total: performance.memory.totalJSHeapSize,
        limit: performance.memory.jsHeapSizeLimit,
        timestamp: Date.now()
      });
    }

    // Keep only recent metrics
    const maxEntries = 60; // 1 minute of data
    Object.keys(this.metrics).forEach(key => {
      if (Array.isArray(this.metrics[key]) && this.metrics[key].length > maxEntries) {
        this.metrics[key] = this.metrics[key].slice(-maxEntries);
      }
    });
  }

  recordAudioLatency(latency) {
    this.metrics.audioLatency.push({
      value: latency,
      timestamp: Date.now()
    });
  }

  recordError() {
    this.metrics.errors++;
  }

  recordFrameDrop() {
    this.metrics.frameDrops++;
  }

  getMetrics() {
    return {
      ...this.metrics,
      isMonitoring: this.isMonitoring,
      timestamp: Date.now()
    };
  }

  getAverageLatency() {
    if (this.metrics.audioLatency.length === 0) return 0;
    
    const sum = this.metrics.audioLatency.reduce((acc, entry) => acc + entry.value, 0);
    return sum / this.metrics.audioLatency.length;
  }

  getMemoryUsage() {
    if (this.metrics.memoryUsage.length === 0) return null;
    
    const latest = this.metrics.memoryUsage[this.metrics.memoryUsage.length - 1];
    return {
      usedMB: Math.round(latest.used / 1024 / 1024),
      totalMB: Math.round(latest.total / 1024 / 1024),
      limitMB: Math.round(latest.limit / 1024 / 1024),
      usagePercent: Math.round((latest.used / latest.limit) * 100)
    };
  }
}

// Create global instances
export const errorHandler = new ErrorHandler();
export const performanceMonitor = new PerformanceMonitor();

// Set up global error handling
window.addEventListener('error', (event) => {
  errorHandler.logError(new Error(event.message), {
    filename: event.filename,
    lineno: event.lineno,
    colno: event.colno,
    type: 'global'
  });
});

window.addEventListener('unhandledrejection', (event) => {
  errorHandler.logError(event.reason, {
    type: 'unhandledPromise'
  });
});

export default {
  AudioError,
  PaymentError,
  ValidationError,
  ErrorHandler,
  AudioValidator,
  PaymentValidator,
  PerformanceMonitor,
  errorHandler,
  performanceMonitor
};