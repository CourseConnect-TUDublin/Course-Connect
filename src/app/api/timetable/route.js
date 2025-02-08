let timetableData = [];

// GET endpoint for fetching timetable entries.
export async function GET(req) {
  return new Response(
    JSON.stringify({ data: timetableData }),
    {
      status: 200,
      headers: { "Content-Type": "application/json" },
    }
  );
}

// POST endpoint for adding a new timetable entry.
export async function POST(req) {
  try {
    const body = await req.json();
    console.log("Received Data from Frontend:", body);

    // Validate required fields
    if (!body.course || !body.lecturer || !body.room || !body.date || !body.time) {
      console.error("Missing field in API request:", body);
      return new Response(
        JSON.stringify({ error: "All fields are required!" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Validate the date and time formats
    const date = new Date(body.date);
    const time = new Date(`1970-01-01T${body.time}`);

    if (isNaN(date.getTime()) || isNaN(time.getTime())) {
      console.error("Invalid Date/Time format received:", { date: body.date, time: body.time });
      return new Response(
        JSON.stringify({ error: "Invalid date or time format!" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Combine date and time into one Date object.
    const combinedDateTime = new Date(date);
    combinedDateTime.setHours(time.getHours(), time.getMinutes(), time.getSeconds());

    console.log("Final Stored Event Date:", combinedDateTime);

    // Create a new entry with a unique id and store it
    const newEntry = {
      id: Date.now(),
      ...body,
      fullDateTime: combinedDateTime,
    };
    timetableData.push(newEntry);

    return new Response(
      JSON.stringify({ message: "Schedule added successfully", entry: newEntry }),
      {
        status: 201,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("API Error:", error);
    return new Response(
      JSON.stringify({ error: "Internal Server Error" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
