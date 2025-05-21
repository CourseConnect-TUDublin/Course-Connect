// src/app/api/programmeData/route.js

import { connectToDatabase } from "../../../lib/dbConnect";
import Programme from "../../../models/Programme";

export async function GET(request) {
  try {
    const conn = await connectToDatabase();

    // List all collections in the connected database
    const collections = await conn.connection.db.listCollections().toArray();
    console.log("Collections in DB:", collections.map(c => c.name));

    // Query the Programme collection using the Mongoose model.
    const programmes = await Programme.find();
    console.log("Fetched programmes:", programmes);

    return new Response(
      JSON.stringify({ success: true, data: programmes }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error fetching programme data:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
