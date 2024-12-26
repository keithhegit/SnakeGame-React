/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // 允许在服务器端导入 Phaser
  webpack: (config) => {
    config.externals = [...config.externals, { canvas: 'canvas' }]
    return config
  },
  // 如果需要导出静态网站
  output: 'export',
  // 禁用图片优化（如果使用自定义图片加载）
  images: {
    unoptimized: true
  }
}

module.exports = nextConfig 