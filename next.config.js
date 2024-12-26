/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config) => {
    // 添加 Phaser 支持
    config.module.rules.push({
      test: /\.js$/,
      include: /node_modules/,
      exclude: /node_modules\/(?!phaser)/,
      use: {
        loader: 'babel-loader',
        options: {
          presets: ['next/babel'],
        },
      },
    })
    return config
  },
  // 如果需要导出静态网站
  output: 'export',
  images: {
    unoptimized: true
  }
}

module.exports = nextConfig 