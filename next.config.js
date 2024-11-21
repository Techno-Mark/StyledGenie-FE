/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: process.env.BASEPATH,
  redirects: async () => {
    return [
      {
        source: '/',
        destination: '/lead',
        permanent: true,
        locale: false
      }
    ]
  },
  images: {
    domains: ['static.wixstatic.com'],
  },
  reactStrictMode: false,
}

module.exports = nextConfig;
