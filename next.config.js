// next.config.js
const withPWA = require("next-pwa")({
  dest: "public", // Where the service worker will be generated
  register: true, // Auto-register service worker
  skipWaiting: true, // Update service worker without waiting
  disable: process.env.NODE_ENV === "development", // Disable in development mode
});

module.exports = withPWA({
  // Next.js config options:
  reactStrictMode: true,
  // You can include other Next.js options here
  // Note: Do not include these options inside the `pwa` property!
  typescript: {
    ignoreBuildErrors: true, // This is optional if you’re using TypeScript
  },
});

const nextConfig = {
  reactStrictMode: true,
};