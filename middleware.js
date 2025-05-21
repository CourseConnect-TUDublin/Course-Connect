// middleware.js

import { withAuth } from "next-auth/middleware";

export default withAuth({
  callbacks: {
    authorized: ({ req, token }) => {
      // Allow access to public routes
      const publicPaths = [
        '/register',
        '/api/auth/*',
        '/api/disciplines',
        '/api/courses',
        '/api/study-paths',
        '/api/modules',
        '/_next',
        '/favicon.ico',
        '/images',
        '/fonts',
        '/static'
      ];

      const isPublicPath = publicPaths.some(path => 
        req.nextUrl.pathname.startsWith(path)
      );

      return isPublicPath || !!token;
    },
  },
});

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - register (registration page)
     * - api/auth (auth API routes)
     * - api/disciplines (public disciplines API)
     * - api/courses (public courses API)
     * - api/study-paths (public study paths API)
     * - api/modules (public modules API)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images (public images)
     * - fonts (public fonts)
     * - static (public static files)
     */
    '/((?!register|api/auth|api/disciplines|api/courses|api/study-paths|api/modules|_next/static|_next/image|favicon.ico|images|fonts|static).*)',
  ],
};
