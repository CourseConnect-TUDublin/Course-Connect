export async function GET() {
    return new Response(JSON.stringify({ message: "Login API is working!" }), { 
      status: 200, 
      headers: { "Content-Type": "application/json" } 
    });
  }
  
  export async function POST(req) {
    try {
      const body = await req.json();
      console.log("Received Login Data:", body);
  
      const { email, password } = body;
  
      // Validate input
      if (!email || !password) {
        return new Response(JSON.stringify({ error: "Email and password are required!" }), { 
          status: 400, 
          headers: { "Content-Type": "application/json" }
        });
      }
  
      // Mock database user (Replace this with real authentication logic)
      const mockUser = {
        email: "user@example.com",
        password: "password123",
      };
  
      // Check credentials
      if (email === mockUser.email && password === mockUser.password) {
        return new Response(
          JSON.stringify({ message: "Login successful", token: "mock-jwt-token" }),
          { status: 200, headers: { "Content-Type": "application/json" } }
        );
      } else {
        return new Response(JSON.stringify({ error: "Invalid email or password" }), { 
          status: 401, 
          headers: { "Content-Type": "application/json" }
        });
      }
    } catch (error) {
      console.error("API Error:", error);
      return new Response(JSON.stringify({ error: "Internal Server Error" }), { 
        status: 500, 
        headers: { "Content-Type": "application/json" }
      });
    }
  }
  