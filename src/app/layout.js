import "./globals.css";
import SplashWrapper from "../components/SplashWrapper";

export const metadata = {
  title: "Course Connect",
  description: "Modern Course Connect Application",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <SplashWrapper>{children}</SplashWrapper>
      </body>
    </html>
  );
}
