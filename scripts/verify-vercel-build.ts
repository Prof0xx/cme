import 'dotenv/config';
import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { registerRoutes } from '../server/routes';
import session from 'express-session';
import pg from 'pg';
import connectPgSimple from 'connect-pg-simple';
import axios from 'axios';
import { storage } from '../api/lib/storage';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function testEndpoint(url: string, method = 'GET', data?: any, headers?: Record<string, string>) {
  try {
    console.log(`Making ${method} request to ${url}`);
    if (data) {
      console.log('Request data:', JSON.stringify(data, null, 2));
    }
    if (headers) {
      console.log('Request headers:', headers);
    }

    const config: any = {
      method,
      url,
      validateStatus: null,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...(headers || {})
      }
    };

    if (data) {
      config.data = data;
    }

    const response = await axios(config);

    console.log('Response:', {
      status: response.status,
      data: response.data
    });

    // For service requests, we expect a 201 status
    const expectedStatus = method === 'POST' && url.endsWith('/api/service-requests') ? 201 : 200;
    const success = response.status === expectedStatus;

    if (!success) {
      console.error(`Response status ${response.status}, expected ${expectedStatus}`);
      if (response.data?.message) {
        console.error('Error message:', response.data.message);
      }
    }

    return {
      success,
      status: response.status,
      data: response.data
    };
  } catch (error) {
    console.error('Request error:', error.message);
    return {
      success: false,
      error: error.message
    };
  }
}

async function verifyBuild() {
  console.log('🔍 Verifying Vercel build compatibility...\n');

  // 1. Check if all required environment variables are set
  console.log('1️⃣ Checking environment variables...');
  const requiredEnvVars = ['DATABASE_URL', 'TELEGRAM_BOT_TOKEN', 'TELEGRAM_CHAT_ID'];
  const missingEnvVars = requiredEnvVars.filter(v => !process.env[v]);
  
  if (missingEnvVars.length > 0) {
    console.error('❌ Missing required environment variables:', missingEnvVars.join(', '));
    console.error('These must be configured in your Vercel project settings');
    return false;
  }
  console.log('✅ All required environment variables are set\n');

  // 2. Check if the database connection works
  console.log('2️⃣ Testing database connection...');
  try {
    const services = await storage.getAllServices();
    console.log(`✅ Database connection successful (found ${services.length} services)\n`);
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    console.error('Verify your DATABASE_URL and database SSL settings');
    return false;
  }

  // 3. Start test server
  console.log('3️⃣ Starting test server...');
  const app = express();
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));

  // Set up session
  const PgSession = connectPgSimple(session);
  const sessionOptions = {
    store: new PgSession({
      pool: new pg.Pool({ 
        connectionString: process.env.DATABASE_URL,
        ssl: 'require'
      }),
      tableName: 'session'
    }),
    secret: process.env.SESSION_SECRET || 'test-secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: true,
      httpOnly: true
    }
  };

  app.use(session(sessionOptions));

  // Serve static files
  const distPath = join(__dirname, '..', 'dist');
  app.use(express.static(distPath));

  // Set up API routes
  const server = await registerRoutes(app);

  // Client-side routing fallback
  app.get('*', (req, res) => {
    if (!req.path.startsWith('/api/')) {
      res.sendFile(join(distPath, 'index.html'));
    }
  });

  // Start server
  const port = 5555; // Use different port to avoid conflicts
  await new Promise<void>(resolve => server.listen(port, resolve));
  console.log(`✅ Test server running on port ${port}\n`);

  // 4. Test API endpoints
  console.log('4️⃣ Testing API endpoints...');
  
  const endpoints = [
    { path: '/api/services', method: 'GET' },
    { path: '/api/services/pr', method: 'GET' },
    { path: '/api/categories', method: 'GET' },
    { 
      path: '/api/service-requests',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      data: {
        telegram: '@test_user',
        requestedService: 'Test request for verification'
      }
    }
  ];

  for (const endpoint of endpoints) {
    const result = await testEndpoint(
      `http://localhost:${port}${endpoint.path}`,
      endpoint.method,
      endpoint.data ? endpoint.data : undefined,
      endpoint.headers
    );

    if (!result.success) {
      console.error(`❌ ${endpoint.method} ${endpoint.path} failed:`, result.error || result.status);
      console.error('Response:', result.data);
      server.close();
      return false;
    }
    console.log(`✅ ${endpoint.method} ${endpoint.path} working`);
  }
  console.log('✅ All API endpoints working\n');

  // 5. Check static files
  console.log('5️⃣ Verifying static files...');
  const staticFiles = [
    '/index.html',
    '/assets/css/index-ByOUmjvZ.css',
    '/assets/js/index-Dkp7DpNs.js'
  ];

  for (const file of staticFiles) {
    const result = await testEndpoint(`http://localhost:${port}${file}`);
    if (!result.success) {
      console.error(`❌ Static file ${file} not found:`, result.status);
      console.error('Response:', result.data);
      server.close();
      return false;
    }
    console.log(`✅ Static file ${file} verified`);
  }
  console.log('✅ Static files verified\n');

  // Clean up
  server.close();

  // Final verdict
  console.log('\n🎉 Verification complete!');
  console.log('✅ Your build should work correctly on Vercel');
  console.log('\nReminders:');
  console.log('1. Configure all environment variables in Vercel project settings');
  console.log('2. Set NODE_ENV to "production" in Vercel');
  console.log('3. Enable "Automatically expose System Environment Variables"');
  return true;
}

verifyBuild().then(success => {
  process.exit(success ? 0 : 1);
}); 