import postgres from 'postgres';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error('❌ DATABASE_URL environment variable is not set');
  process.exit(1);
}

console.log('🔍 Checking all tables in the database...');

const sql = postgres(connectionString, {
  ssl: 'require',
  max: 1,
  idle_timeout: 20,
  connect_timeout: 30,
});

async function main() {
  try {
    // Get list of all tables
    console.log('\n📊 Getting list of all tables:');
    const tables = await sql`
      SELECT 
        table_name, 
        (SELECT COUNT(*) FROM information_schema.columns WHERE table_name = t.table_name) AS column_count
      FROM 
        information_schema.tables t
      WHERE 
        table_schema = 'public'
      ORDER BY 
        table_name
    `;
    
    if (tables.length === 0) {
      console.log('No tables found in the database.');
    } else {
      console.log(`Found ${tables.length} tables:`);
      
      // Print table list with column counts
      for (const table of tables) {
        console.log(`- ${table.table_name} (${table.column_count} columns)`);
        
        // Get row count for each table
        const rowCountResult = await sql`SELECT COUNT(*) AS count FROM ${sql(table.table_name)}`;
        const rowCount = rowCountResult[0].count;
        console.log(`  └─ ${rowCount} rows`);
        
        // Get sample data for non-empty tables (max 3 rows)
        if (rowCount > 0) {
          const sampleRows = await sql`SELECT * FROM ${sql(table.table_name)} LIMIT 3`;
          if (sampleRows.length > 0) {
            console.log(`  └─ Sample columns: ${Object.keys(sampleRows[0]).join(', ')}`);
          }
        }
      }
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