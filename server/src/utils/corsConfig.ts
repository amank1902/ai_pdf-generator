/**
 * CORS Configuration for Production
 * 
 * This configuration should be used to restrict cross-origin requests
 * to only trusted domains.
 */

export const corsOptions = {
  origin: function (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) {
    // Allow requests with no origin (like mobile apps, Postman, curl)
    if (!origin) {
      return callback(null, true);
    }

    // List of allowed origins
    const allowedOrigins = [
      process.env.CLIENT_URL || 'http://localhost:3000',
      'http://localhost:3000', // Development
      'http://127.0.0.1:3000',  // Development alternative
      // Add production domains here when deploying:
      // 'https://yourdomain.com',
      // 'https://www.yourdomain.com',
    ];

    // Check if origin is allowed
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true, // Allow cookies and authentication headers
  optionsSuccessStatus: 200, // Some legacy browsers (IE11) choke on 204
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'], // Allowed HTTP methods
  allowedHeaders: ['Content-Type', 'Authorization'], // Allowed headers
  exposedHeaders: ['RateLimit-Limit', 'RateLimit-Remaining', 'RateLimit-Reset'], // Expose rate limit headers
  maxAge: 86400, // Cache preflight requests for 24 hours
};

/**
 * Development CORS Configuration
 * More permissive for development purposes
 */
export const corsOptionsDev = {
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true,
  optionsSuccessStatus: 200,
};
