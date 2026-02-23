const { Client } = require('pg');

const connectionString = "postgresql://rishnu:123@localhost:5432/mydb?schema=public";

const client = new Client({
  connectionString: connectionString,
});

async function testConnection() {
  try {
    await client.connect();
    console.log("SUCCESS: Connected to database!");
    const res = await client.query('SELECT current_user, current_database();');
    console.log("Details:", res.rows[0]);
    await client.end();
  } catch (err) {
    console.error("FAILURE: Could not connect to database.");
    console.error(err.message);
    process.exit(1);
  }
}

testConnection();
