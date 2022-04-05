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
        destination: 'http://135.125.98.178:7777/rpc/:path*' // Proxy to Backend
      }
    ]
  }
};

module.exports = nextConfig;