// Script to test Neon PostgreSQL connection
const { Pool } = require('pg');

// Connection string
const connectionString = "postgresql://neondb_owner:npg_Mpw9SLoE5tGC@ep-rapid-snowflake-a2p1o17h-pooler.eu-central-1.aws.neon.tech/neondb?sslmode=require";

// Create a connection pool
const pool = new Pool({
  connectionString,
});

async function testConnection() {
  try {
    // Connect to the database
    console.log('Connecting to Neon PostgreSQL database...');
    const client = await pool.connect();
    
    // Test the connection with a simple query
    const result = await client.query('SELECT current_timestamp as current_time');
    console.log('Connection successful!');
    console.log('Current server time:', result.rows[0].current_time);
    
    // Query to get table information
    const tables = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `);
    
    console.log('\nTables in database:');
    if (tables.rows.length > 0) {
      tables.rows.forEach(row => {
        console.log(`- ${row.table_name}`);
      });
    } else {
      console.log('No tables found');
    }
    
    // Release the client
    client.release();
  } catch (err) {
    console.error('Error connecting to the database:', err);
  } finally {
    // Close the pool
    await pool.end();
  }
}

// Run the test
testConnection(); 