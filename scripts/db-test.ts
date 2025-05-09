import postgres from 'postgres';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error('❌ DATABASE_URL environment variable is not set');
  process.exit(1);
}

console.log('🔍 Testing database connection with URL:', connectionString.substring(0, 35) + '...');

const sql = postgres(connectionString, {
  ssl: 'require',
  max: 1,
  idle_timeout: 20,
  connect_timeout: 30,
});

async function main() {
  try {
    console.log('🔌 Attempting to connect to database...');
    
    // Test basic connection
    const result = await sql`SELECT 1 as connection_test`;
    console.log('✅ Database connection successful:', result);
    
    // Check if services table exists
    console.log('🔍 Checking schema information for services table...');
    const schemaInfo = await sql`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'services'
      ORDER BY ordinal_position
    `;
    
    if (schemaInfo.length === 0) {
      console.error('❌ The services table does not exist in the database!');
      process.exit(1);
    }
    
    console.log('✅ Services table schema:');
    schemaInfo.forEach(col => {
      console.log(`   - ${col.column_name} (${col.data_type})`);
    });
    
    // Check services data
    console.log('🔍 Checking data in services table...');
    const services = await sql`SELECT * FROM services`;
    
    if (services.length === 0) {
      console.log('⚠️ The services table exists but contains no data!');
    } else {
      console.log(`✅ Found ${services.length} service entries in the database.`);
      console.log('📋 First few services:');
      services.slice(0, 3).forEach((service, i) => {
        console.log(`   ${i+1}. ${service.name} (${service.category}) - ${service.price}`);
      });
    }
    
  } catch (err) {
    console.error('❌ Database connection/query error:', err);
    process.exit(1);
  } finally {
    // Close the connection
    await sql.end();
    console.log('🔌 Database connection closed');
  }
}

main().catch(err => {
  console.error('❌ Unhandled error in main function:', err);
  process.exit(1);
}); 