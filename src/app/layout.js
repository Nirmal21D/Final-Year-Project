// src/app/layout.js
import { Providers } from "./providers";

// Define the RootLayout component that wraps its children with Providers
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <title>Finance Mastery</title>
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
