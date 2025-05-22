// moveProtectedRoutes.js
const fs = require("fs");
const path = require("path");

const appDir = path.join(__dirname, "src", "app");
const protectedDir = path.join(appDir, "(protected)");

// List ONLY the folders you want protected!
const protectedPages = [
  "dashboard",
  "calendar",
  "flashcards",
  "focus-history",
  "FocusTimer",
  "leaderboard",
  "profile",
  "rewards",
  "root",
  "session",
  "settings",
  "TaskManager",
  "timetable"
];

// Create the (protected) folder if it doesn't exist
if (!fs.existsSync(protectedDir)) {
  fs.mkdirSync(protectedDir);
  console.log("Created: (protected)/");
}

// Move each protected page into (protected)
protectedPages.forEach((folder) => {
  const src = path.join(appDir, folder);
  const dest = path.join(protectedDir, folder);

  if (fs.existsSync(src)) {
    // Move the folder
    fs.renameSync(src, dest);
    console.log(`Moved: ${folder} → (protected)/${folder}`);
  } else {
    console.log(`Skip: ${folder} (not found in /src/app)`);
  }
});

console.log("\n✅ Done! Now add your layout.js auth guard to /src/app/(protected)/ if not already there.");
