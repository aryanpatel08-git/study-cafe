import type { Metadata } from "next";
import "./cafe.css";

export const metadata: Metadata = {
  title: "Study Cafe",
  description: "Study with a cozy cafe crew.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Fredoka:wght@500;600&family=Nunito:wght@400;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="welcome">{children}</body>
    </html>
  );
}
