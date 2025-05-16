// frontend/app/layout.js
import "./globals.css";
import ClientProviders from "./ClientProviders";
import MainLayout from "./components/MainLayout";

export const metadata = {
  title: "Course Connect",
  description: "Modern Course Connect Application",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ClientProviders>
          <MainLayout drawerWidth={240}>{children}</MainLayout>
        </ClientProviders>
      </body>
    </html>
  );
}
