/** @type {import('next').NextConfig} */
const withCSS = require('@zeit/next-css');
const path = require('path')


const ContentSecurityPolicy = `
  default-src 'unsafe-inline';
  script-src 'unsafe-inline';
  child-src https://dhfi.online;
  style-src 'unsafe-inline' https://dhfi.online;
  font-src 'unsafe-inline';
`

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
          value: ContentSecurityPolicy.replace(/\s{2,}/g, ' ').trim()
        }
        ],
      },
    ]
  },
};

module.exports = nextConfig;
