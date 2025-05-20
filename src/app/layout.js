import "./globals.css";
import SplashWrapper from "../components/SplashWrapper";
import { Toaster } from "react-hot-toast";

export const metadata = {
  title: "Course Connect",
  description: "Modern Course Connect Application",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Toaster position="top-center" />
        <SplashWrapper>{children}</SplashWrapper>
      </body>
    </html>
  );
}
