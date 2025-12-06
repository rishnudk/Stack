 /** @type {import('next').NextConfig}  */
const  nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'stack.s3.amazonaws.com',
        pathname: '/uploads/**',
      },
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'github.com',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
};


module.exports = nextConfig;
