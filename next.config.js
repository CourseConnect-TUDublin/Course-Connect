// next.config.js
const withPWA = require("next-pwa")({
  dest: "public",
  // Disable PWA support in development for easier debugging
  disable: process.env.NODE_ENV === "development",
});

module.exports = withPWA({
  // Other Next.js config options can go here.
});
