/** @type {import('next').NextConfig} */
const nextConfig = {
  distDir: 'dist',
  
  // The following is required for the app to be properly deployed on Vercel
  output: 'standalone',
};

module.exports = nextConfig;
