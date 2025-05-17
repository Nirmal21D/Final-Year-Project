// src/app/layout.js
import { Providers } from "./providers";
import { Inter } from 'next/font/google'

export const metadata = {
  title: 'Finance Mastery',
  description: 'Your financial planning platform',
  // Add the verification meta tag
  verification: {
    google: 'a6ipmZTCbqs_Acp5HcOh2sxOttY84GkUcz55gUU3I7M',
  },
}

// Define the RootLayout component that wraps its children with Providers
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* If you need to add it directly in the head instead of using the metadata API */}
        <meta name="google-site-verification" content="a6ipmZTCbqs_Acp5HcOh2sxOttY84GkUcz55gUU3I7M" />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
