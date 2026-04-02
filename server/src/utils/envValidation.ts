/**
 * Validates that all required environment variables are present
 * Throws error if any required variables are missing
 */
export function validateEnv(): void {
  const requiredEnvVars = [
    'MONGODB_URI',
    'JWT_SECRET',
    'GEMINI_API_KEY',
    'PORT'
  ];

  const missing: string[] = [];

  for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
      missing.push(envVar);
    }
  }

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(', ')}\n` +
      'Please ensure all required variables are set in your .env file'
    );
  }

  // Validate JWT_SECRET strength
  const jwtSecret = process.env.JWT_SECRET;
  if (jwtSecret && jwtSecret.length < 32) {
    console.warn(
      '⚠️  WARNING: JWT_SECRET should be at least 32 characters long for security'
    );
  }

  console.log('✓ Environment variables validated successfully');
}

/**
 * Validates environment-specific configuration
 */
export function validateConfig(): void {
  const nodeEnv = process.env.NODE_ENV || 'development';

  if (nodeEnv === 'production') {
    // Additional production checks
    if (process.env.CORS_ORIGIN === '*') {
      console.warn(
        '⚠️  WARNING: CORS_ORIGIN is set to "*" in production. ' +
        'This allows any domain to access your API.'
      );
    }
  }

  console.log(`✓ Running in ${nodeEnv} mode`);
}
