/** @type {import('next').NextConfig} */
const withCSS = require('@zeit/next-css');
const path = require('path')


let nextConfig = {
  presets: ["next/babel"],
  sassOptions: {
    includePaths: [path.join(__dirname, 'styles')],
  },
};

module.exports = nextConfig;