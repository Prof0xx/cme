import postgres from 'postgres';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error('❌ DATABASE_URL environment variable is not set');
  process.exit(1);
}

console.log('🔍 Checking schema in production database...');

const sql = postgres(connectionString, {
  ssl: 'require',
  max: 1,
  idle_timeout: 20,
  connect_timeout: 30,
});

async function main() {
  try {
    // Check if services table exists and get schema
    console.log('🔍 Checking schema information for services table...');
    const schemaInfo = await sql`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'services'
      ORDER BY ordinal_position
    `;
    
    if (schemaInfo.length === 0) {
      console.error('❌ The services table does not exist in the database!');
    } else {
      console.log('✅ Services table schema:');
      schemaInfo.forEach(col => {
        console.log(`   - ${col.column_name} (${col.data_type})`);
      });
    }
    
  } catch (err) {
    console.error('❌ Database query error:', err);
  } finally {
    // Close the connection
    await sql.end();
    console.log('🔌 Database connection closed');
  }
}

main().catch(err => {
  console.error('❌ Unhandled error in main function:', err);
}); 