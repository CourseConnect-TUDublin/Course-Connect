// /src/app/api/programmeData/route.js

import { connectToDatabase } from "@/lib/dbConnect"; // Ensure this path is correct

export async function GET(request) {
  try {
    const { db } = await connectToDatabase();
    // Use the exact collection name "Programmes" as created in Compass
    const programmes = await db.collection("Programmes").find({}).toArray();

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
