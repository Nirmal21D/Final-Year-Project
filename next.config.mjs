/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  productionBrowserSourceMaps: false, // Disable source maps in production
  env: {
    GEMINI_API_KEY: process.env.GEMINI_API_KEY,
    MARKETAUX_API_TOKEN: process.env.NEXT_PUBLIC_MARKETAUX_API_TOKEN,
  },
  async rewrites() {
    return [
      {
        source: "/api/news",
        destination: "https://marketaux.com/api/v1/news/all",
      },
    ];
  },
  async headers() {
    return [
      {
        source: "/api/news",
        headers: [
          { key: "Access-Control-Allow-Origin", value: "*" },
          {
            key: "Access-Control-Allow-Methods",
            value: "GET,OPTIONS,PATCH,DELETE,POST,PUT",
          },
          {
            key: "Access-Control-Allow-Headers",
            value:
              "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
