import postgres from 'postgres';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error('❌ DATABASE_URL environment variable is not set');
  process.exit(1);
}

console.log('🔍 Checking packages table in the database...');

const sql = postgres(connectionString, {
  ssl: 'require',
  max: 1,
  idle_timeout: 20,
  connect_timeout: 30,
});

async function main() {
  try {
    // Get the schema of the packages table
    console.log('\n📊 Getting schema of packages table:');
    const schema = await sql`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'packages'
      ORDER BY ordinal_position
    `;
    
    console.log('Packages table schema:');
    schema.forEach(col => {
      console.log(`   - ${col.column_name} (${col.data_type})`);
    });
    
    // Get all rows from the packages table
    console.log('\n📦 Getting all rows from packages table:');
    const packages = await sql`SELECT * FROM packages`;
    
    console.log(`Found ${packages.length} packages:`);
    packages.forEach((pkg, i) => {
      console.log(`\nPackage ${i+1}:`);
      Object.entries(pkg).forEach(([key, value]) => {
        console.log(`   - ${key}: ${value}`);
      });
    });
    
    // Check if there are any related tables that might be affected
    console.log('\n🔄 Checking for related tables:');
    const relatedTables = await sql`
      SELECT c.table_name, c.column_name
      FROM information_schema.constraint_column_usage u
      JOIN information_schema.columns c ON c.table_name = u.table_name AND c.column_name = u.column_name
      WHERE u.table_name = 'packages' OR c.column_name LIKE '%package%'
    `;
    
    if (relatedTables.length > 0) {
      console.log('Found potentially related tables:');
      relatedTables.forEach(related => {
        console.log(`   - ${related.table_name}.${related.column_name}`);
      });
    } else {
      console.log('No related tables found.');
    }
    
  } catch (err) {
    console.error('❌ Database query error:', err);
  } finally {
    // Close the connection
    await sql.end();
    console.log('\n🔌 Database connection closed');
  }
}

main().catch(err => {
  console.error('❌ Unhandled error in main function:', err);
}); 