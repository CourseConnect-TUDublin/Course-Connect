// src/app/layout.js
import "./globals.css";

export const metadata = {
  title: "Course Connect",
  description: "Manage your academic tasks and timetables.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {/* Common header */}
        <header style={{ padding: "1rem", background: "#f7f7f7" }}>
          <h1>Course Connect</h1>
        </header>

        {/* Page content */}
        <main>{children}</main>

        {/* Common footer */}
        <footer style={{ padding: "1rem", textAlign: "center", marginTop: "2rem", background: "#f7f7f7" }}>
          &copy; {new Date().getFullYear()} Course Connect. All rights reserved.
        </footer>
      </body>
    </html>
  );
}
