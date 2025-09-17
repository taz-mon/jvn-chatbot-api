const fs = require('fs');

class SecretsManager {
  constructor() {
    this.environment = process.env.NODE_ENV || 'development';
  }

  // Method 1: Environment Variables
  getEnvironmentSecret(key) {
    return process.env[key];
  }

  // Method 2: File-based secrets (Docker/Kubernetes)
  getFileSecret(key) {
    const secretFile = process.env[`${key}_FILE`];
    if (secretFile && fs.existsSync(secretFile)) {
      return fs.readFileSync(secretFile, 'utf8').trim();
    }
    return null;
  }

  // Unified secret retrieval with validation
  async getSecret(key, options = {}) {
    const { useFiles = true } = options;

    // Try file-based secrets first (production)
    if (useFiles) {
      const fileSecret = this.getFileSecret(key);
      if (fileSecret) return fileSecret;
    }

    // Fallback to environment variables
    return this.getEnvironmentSecret(key);
  }

  // MongoDB URI with component validation
  async getMongoDBURI() {
    // Try complete URI first
    const fullURI = await this.getSecret('MONGODB_URI', { useFiles: true });
    if (fullURI && this.validateMongoURI(fullURI)) {
      return fullURI;
    }

    // Build from components if full URI not available
    return this.buildMongoDBURI();
  }

  // Build from individual secrets (most secure)
  async buildMongoDBURI() {
    try {
      const username = await this.getSecret('MONGODB_USERNAME');
      const password = await this.getSecret('MONGODB_PASSWORD');
      const cluster = await this.getSecret('MONGODB_CLUSTER');
      const database = await this.getSecret('MONGODB_DATABASE') || 'jvn_chatbot';
      
      if (!username || !password || !cluster) {
        throw new Error('Missing required MongoDB connection components');
      }

      const uri = `mongodb+srv://${username}:${password}@${cluster}/${database}?retryWrites=true&w=majority`;
      
      if (!this.validateMongoURI(uri)) {
        throw new Error('Constructed MongoDB URI failed validation');
      }
      
      return uri;
    } catch (error) {
      console.error('Error building MongoDB URI:', error);
      return null;
    }
  }

  // URI validation
  validateMongoURI(uri) {
    if (!uri || typeof uri !== 'string') return false;
    return uri.startsWith('mongodb://') || uri.startsWith('mongodb+srv://');
  }

  // Validate all required secrets exist
  validateRequiredSecrets(requiredSecrets = []) {
    const missing = [];
    
    requiredSecrets.forEach(secret => {
      if (!this.getEnvironmentSecret(secret) && !this.getFileSecret(secret)) {
        missing.push(secret);
      }
    });

    if (missing.length > 0) {
      throw new Error(`Missing required secrets: ${missing.join(', ')}`);
    }
    
    return true;
  }
}

module.exports = SecretsManager;