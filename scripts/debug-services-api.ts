import postgres from 'postgres';
import * as dotenv from 'dotenv';
import { drizzle } from 'drizzle-orm/postgres-js';
import { sql } from 'drizzle-orm';

// Load environment variables
dotenv.config();

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error('❌ DATABASE_URL environment variable is not set');
  process.exit(1);
}

console.log('🔍 Debugging Services API issue...');

// Create postgres connection
const client = postgres(connectionString, {
  ssl: 'require',
  max: 1,
  idle_timeout: 20,
  connect_timeout: 30,
});

// Create drizzle db instance (similar to what your API uses)
const db = drizzle(client);

// Simulate what the API is doing
async function main() {
  try {
    console.log('🔌 Testing both direct SQL and Drizzle ORM approaches:');
    
    // First, test with direct SQL (bypassing Drizzle)
    console.log('\n📊 1. Testing with direct SQL:');
    const rawServices = await client`SELECT * FROM services`;
    console.log(`Raw SQL query returned ${rawServices.length} services`);
    
    if (rawServices.length > 0) {
      console.log('First service from raw SQL:');
      console.log(rawServices[0]);
    }
    
    // Now test with a raw SQL executed through Drizzle
    console.log('\n📊 2. Testing with Drizzle raw SQL execution:');
    try {
      const drizzleRawResults = await db.execute(sql`SELECT * FROM services`);
      console.log(`Drizzle raw SQL execution returned ${drizzleRawResults.length} services`);
      
      if (drizzleRawResults.length > 0) {
        console.log('First service from Drizzle raw SQL:');
        console.log(drizzleRawResults[0]);
      }
    } catch (err) {
      console.error('❌ Drizzle raw SQL execution error:', err);
    }
    
    // Try to replicate the exact code from your storage.ts file
    console.log('\n📊 3. Testing with db.select().from():');
    try {
      console.log('Attempting to query services with db.select().from()...');
      
      // This replicates exactly what your storage.getAllServices() is doing
      const servicesResult = await db.select().from({ services: 'services' });
      console.log(`db.select().from() returned ${servicesResult ? servicesResult.length : 0} services`);
      
      if (servicesResult && servicesResult.length > 0) {
        console.log('First service from db.select().from():');
        console.log(servicesResult[0]);
      }
    } catch (err) {
      console.error('❌ db.select().from() error:', err);
      console.log('\n❓ Possible issues:');
      console.log('1. Missing schema import (the "services" table reference might not be properly defined)');
      console.log('2. Schema mismatch between your code and the actual database');
    }
    
  } catch (err) {
    console.error('❌ General error:', err);
  } finally {
    // Close connections
    await client.end();
    console.log('\n🔌 Database connections closed');
  }
}

main().catch(err => {
  console.error('❌ Unhandled error in main function:', err);
}); 