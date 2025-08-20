/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable standalone output for Docker
  output: 'standalone',
  
  // Server external packages
  serverExternalPackages: ['mongoose'],
  
  // Image optimization
  images: {
    domains: ['localhost', 'res.cloudinary.com'],
    formats: ['image/webp', 'image/avif'],
  },
  
  // Environment variables
  env: {
    CUSTOM_KEY: 'my-value',
  },
  
  // Webpack configuration
  webpack: (config, { isServer }) => {
    // Add custom webpack config here if needed
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }
    
    return config;
  },
  
  // Headers for security
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
    ];
  },
  
  // Redirects
  async redirects() {
    return [
      {
        source: '/old-page',
        destination: '/new-page',
        permanent: true,
      },
    ];
  },
  
  // Rewrites
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: '/api/:path*',
      },
    ];
  },
};

export default nextConfig;
