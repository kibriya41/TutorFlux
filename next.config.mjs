/** @type {import('next').NextConfig} */
const nextConfig = {

 images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'miro.medium.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  /* config options here */
  reactCompiler: true,
};

export default nextConfig;
