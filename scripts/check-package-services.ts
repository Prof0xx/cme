import postgres from 'postgres';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error('❌ DATABASE_URL environment variable is not set');
  process.exit(1);
}

console.log('🔍 Checking package_services table in the database...');

const sql = postgres(connectionString, {
  ssl: 'require',
  max: 1,
  idle_timeout: 20,
  connect_timeout: 30,
});

async function main() {
  try {
    // Get the schema of the package_services table
    console.log('\n📊 Getting schema of package_services table:');
    const schema = await sql`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'package_services'
      ORDER BY ordinal_position
    `;
    
    console.log('Package_services table schema:');
    schema.forEach(col => {
      console.log(`   - ${col.column_name} (${col.data_type})`);
    });
    
    // Get all rows from the package_services table
    console.log('\n📦 Getting all rows from package_services table:');
    const packageServices = await sql`SELECT * FROM package_services`;
    
    console.log(`Found ${packageServices.length} package_services entries:`);
    packageServices.forEach((entry, i) => {
      console.log(`\nEntry ${i+1}:`);
      Object.entries(entry).forEach(([key, value]) => {
        console.log(`   - ${key}: ${value}`);
      });
    });
    
    // Check foreign key constraints
    console.log('\n🔄 Checking for foreign key constraints:');
    const foreignKeys = await sql`
      SELECT
        tc.table_name, kcu.column_name,
        ccu.table_name AS foreign_table_name,
        ccu.column_name AS foreign_column_name
      FROM
        information_schema.table_constraints AS tc
        JOIN information_schema.key_column_usage AS kcu
          ON tc.constraint_name = kcu.constraint_name
        JOIN information_schema.constraint_column_usage AS ccu
          ON ccu.constraint_name = tc.constraint_name
      WHERE tc.constraint_type = 'FOREIGN KEY' 
        AND (tc.table_name = 'package_services' OR ccu.table_name = 'package_services')
    `;
    
    if (foreignKeys.length > 0) {
      console.log('Found foreign key relationships:');
      foreignKeys.forEach(fk => {
        console.log(`   - ${fk.table_name}.${fk.column_name} -> ${fk.foreign_table_name}.${fk.foreign_column_name}`);
      });
    } else {
      console.log('No foreign key constraints found.');
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