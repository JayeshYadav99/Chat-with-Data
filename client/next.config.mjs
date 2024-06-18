/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    pageExtensions: ["page.tsx",'ts', 'tsx'],
    webpack(config, { isServer }) {
      if (!isServer) {
        config.resolve.fallback = {
          ...config.resolve.fallback,
          fs: false
        };
      }
  
      return config;
    }
  };
  
  
  export default nextConfig;
