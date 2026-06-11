const isProd = process.env.NODE_ENV === 'production';

function requireEnv(name) {
  const value = process.env[name];
  if (!value?.trim()) {
    throw new Error(`${name} is required when NODE_ENV=production`);
  }
  return value.trim();
}
// comment
function loadConfig() {
  let jwtSecret;

  if (isProd) {
    jwtSecret = requireEnv('JWT_SECRET');
    if (jwtSecret === 'change-this-to-a-long-random-string' || jwtSecret === 'ketelelema-dev-secret') {
      throw new Error('JWT_SECRET must be set to a strong random value in production');
    }
    if (jwtSecret.length < 32) {
      throw new Error('JWT_SECRET must be at least 32 characters in production');
    }
  } else {
    jwtSecret = process.env.JWT_SECRET || 'ketelelema-dev-secret';
  }

  const corsOrigin = process.env.CORS_ORIGIN || 'http://localhost:5173';

  return {
    isProd,
    port: Number(process.env.PORT) || 5000,
    jwtSecret,
    corsOrigin,
    db: {
      host: process.env.DB_HOST || 'localhost',
      port: Number(process.env.DB_PORT) || 3306,
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'ketelelema_audit',
    },
  };
}

module.exports = loadConfig();
