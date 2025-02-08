let users = []; // Temporary storage (Replace with a DB later)

export async function POST(req) {
  try {
    const { name, email, password } = await req.json();

    // Check if user already exists
    if (users.some((u) => u.email === email)) {
      return new Response(JSON.stringify({ message: "User already exists" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Store the new user
    const newUser = { name, email, password };
    users.push(newUser);

    return new Response(JSON.stringify({ message: "Registration successful" }), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ message: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
