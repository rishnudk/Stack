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
    ],
  },
};


module.exports = nextConfig;
