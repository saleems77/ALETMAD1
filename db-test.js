const { Client } = require("pg");

const client = new Client({
  connectionString:
    "postgres://postgres:jEVJyYZgXFZjBdndffXdrnIOupFDbRvX@trolley.proxy.rlwy.net:5432/railway",
  ssl: { rejectUnauthorized: false },
});

async function testConnection() {
  try {
    await client.connect();
    console.log("✅ Connected to database successfully!");

    const res = await client.query("SELECT NOW()");
    console.log("⏱ Current database time:", res.rows[0].now);

    await client.end();
  } catch (err) {
    console.error("❌ Connection failed:", err);
  }
}

testConnection();
