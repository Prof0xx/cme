import postgres from "postgres";
import { readFileSync } from "fs";
import { parse } from "csv-parse/sync";
import * as dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Get the connection string from environment variable
const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error('❌ DATABASE_URL environment variable is not set');
  process.exit(1);
}

console.log('🔍 Using database URL:', connectionString.split('@')[1]); // Log only the host part for security

const sql = postgres(connectionString, {
  ssl: 'require',
  max: 1,
  idle_timeout: 20,
  connect_timeout: 30,
});

async function main() {
  try {
    console.log('🔌 Connecting to database...');

    // Read and parse the CSV file
    console.log('📖 Reading CSV file...');
    const csvContent = readFileSync('Service List Database - Sheet1 (1).csv', 'utf-8');
    const records = parse(csvContent, {
      columns: true,
      skip_empty_lines: true
    });

    console.log(`📋 Parsed ${records.length} records from CSV`);
    console.log('📝 Sample record:', JSON.stringify(records[0], null, 2));

    // Check current data
    const beforeCount = await sql`SELECT COUNT(*) as count FROM services`;
    console.log(`📊 Current services in database: ${beforeCount[0].count}`);

    // Clear existing data
    console.log('🗑️ Clearing existing services...');
    await sql`TRUNCATE TABLE services RESTART IDENTITY`;

    // Verify truncate
    const afterTruncate = await sql`SELECT COUNT(*) as count FROM services`;
    console.log(`📊 Services after truncate: ${afterTruncate[0].count}`);

    // Insert new data
    console.log('📥 Inserting new services...');
    let inserted = 0;
    for (const record of records) {
      await sql`
        INSERT INTO services (
          category, 
          name, 
          description, 
          example_type, 
          example_content, 
          price
        ) VALUES (
          ${record.category},
          ${record.name},
          ${record.description},
          ${record.exampleType},
          ${record.exampleContent},
          ${record.price}
        )
      `;
      inserted++;
      if (inserted % 10 === 0) {
        console.log(`✓ Inserted ${inserted}/${records.length} records`);
      }
    }

    // Verify the update
    const finalCount = await sql`SELECT COUNT(*) as count FROM services`;
    console.log(`\n📊 Final services count in database: ${finalCount[0].count}`);

    // Show some sample data
    const sampleData = await sql`SELECT * FROM services LIMIT 3`;
    console.log('\n📋 Sample data from database:');
    console.log(JSON.stringify(sampleData, null, 2));

  } catch (err) {
    console.error('❌ Error:', err);
    process.exit(1);
  } finally {
    await sql.end();
    console.log('🔌 Database connection closed');
  }
}

main(); 