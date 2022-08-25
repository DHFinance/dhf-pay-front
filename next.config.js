/** @type {import('next').NextConfig} */
const withCSS = require('@zeit/next-css');
const path = require('path')


const ContentSecurityPolicy = `script-src 'unsafe-inline'`;

let nextConfig = {
  presets: ['next/babel'],
  sassOptions: {
    includePaths: [path.join(__dirname, 'styles')],
  },
  async rewrites() {
    return [
      {
        source: '/rpc/:path*',
        destination: 'http://3.14.161.135:7777/rpc/:path*', // Proxy to Backend
      },
    ]
  },
  async headers() {
    return [
      {
        // Apply these headers to all routes in your application.
        source: '/:path*',
        headers: [{
          key: 'Content-Security-Policy',
          value: ContentSecurityPolicy
        }
        ],
      },
    ]
  },
};

module.exports = nextConfig;
