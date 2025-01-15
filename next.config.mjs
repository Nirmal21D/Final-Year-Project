/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
  productionBrowserSourceMaps: false, // Disable source maps in production
  env: {
    GEMINI_API_KEY: process.env.GEMINI_API_KEY,
  },
};
  
export default nextConfig;