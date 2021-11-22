/** @type {import('next').NextConfig} */
const withCSS = require('@zeit/next-css');
const path = require('path')


let nextConfig = {
  presets: ["next/babel"],
  sassOptions: {
    includePaths: [path.join(__dirname, 'styles')],
  },
  async rewrites() {
    return [
      {
        source: '/rpc/:path*',
        destination: 'https://node-clarity-mainnet.make.services/rpc/:path*' // Proxy to Backend
      }
    ]
  }
};

module.exports = nextConfig;