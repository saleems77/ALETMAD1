const { MongoClient } = require("mongodb");

const uri =
  "mongodb+srv://mohammednourteeby:54mCywbTSqIolmTb@cluster0.crqkmds.mongodb.net/elearning?retryWrites=true&w=majority";

async function run() {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    console.log("✅ Connected successfully to server");
    const db = client.db("elearning");
    const collections = await db.listCollections().toArray();
    console.log(
      "📂 Collections:",
      collections.map((c) => c.name)
    );
  } catch (err) {
    console.error("❌ Connection failed:", err);
  } finally {
    await client.close();
  }
}

run();
