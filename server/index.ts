import 'dotenv/config';
import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import session from "express-session";
import { db } from "../api/lib/db";
import pg from "pg";
import connectPgSimple from "connect-pg-simple";
import path from "path";
import { fileURLToPath } from 'url';
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

declare module "express-session" {
  interface SessionData {
    userId?: number;
    isAdmin?: boolean;
  }
}

console.log('🚀 Starting server...');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

console.log('📁 Setting up static files...');
// Serve static files from public directory
app.use(express.static(path.resolve(__dirname, '..', 'public')));

console.log('🔐 Setting up session middleware...');
// Set up session middleware
const PgSession = connectPgSimple(session);
const sessionOptions: session.SessionOptions = {
  store: new PgSession({
    pool: new pg.Pool({ 
      connectionString: process.env.DATABASE_URL 
    }),
    tableName: 'session', // Default table name
    createTableIfMissing: true,
  }),
  secret: process.env.SESSION_SECRET || 'crypto-marketing-secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
  }
};

app.use(session(sessionOptions));

console.log('📝 Setting up request logging...');
app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  console.log('🛣️ Setting up routes...');
  const server = await registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (app.get("env") === "development") {
    console.log('🛠️ Setting up Vite in development mode...');
    await setupVite(app, server);
  } else {
    console.log('📦 Setting up static serving in production mode...');
    serveStatic(app);
  }

  // ALWAYS serve the app on port 5000
  // this serves both the API and the client.
  // It is the only port that is not firewalled.
  const port = 5000;
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true,
  }, () => {
    console.log(`🌐 Server listening on http://localhost:${port}`);
    log(`serving on port ${port}`);
  });
})();
