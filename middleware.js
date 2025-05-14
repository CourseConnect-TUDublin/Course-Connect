// middleware.js

import { withAuth } from "next-auth/middleware";

export default withAuth({
  // Protect all API routes by default,
  // but exclude /api/studybuddies and /api/session-requests
  matcher: [
    /*
     * Apply to everything under /api except:
     *   - /api/studybuddies/*
     *   - /api/session-requests/*
     */
    "/api/:path*",              
    "!/api/studybuddies/:path*", 
    "!/api/session-requests/:path*"
  ]
});
