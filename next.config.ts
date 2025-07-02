// next.config.ts
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    domains: ['res.cloudinary.com'], // ✅ allow Cloudinary images
  },
};

export default nextConfig;
