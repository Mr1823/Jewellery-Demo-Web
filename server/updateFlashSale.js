import { MongoClient, ServerApiVersion } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function updateDatabase() {
  try {
    await client.connect();
    console.log("✅ Connected to MongoDB!");

    const db = client.db("ub-jewellers");
    const productsCollection = db.collection("products");

    // Let's set flashSale: true for a few random products so they appear in the Flash Sale section
    const result = await productsCollection.updateMany(
      { badge: "Bestseller" },
      { $set: { flashSale: true } }
    );
    
    // Also set some more to ensure we have enough for the slider (it shows 3 at a time)
    const result2 = await productsCollection.updateMany(
      { badge: "Premium" },
      { $set: { flashSale: true } }
    );

    console.log(`✅ Updated ${result.modifiedCount + result2.modifiedCount} products with flashSale: true`);
  } catch (error) {
    console.error("❌ Error updating database:", error);
  } finally {
    await client.close();
    console.log("MongoDB connection closed.");
  }
}

updateDatabase();
