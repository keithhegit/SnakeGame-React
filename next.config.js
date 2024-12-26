/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // 确保静态资源可以被正确访问
  assetPrefix: process.env.NODE_ENV === 'production' ? '/your-repo-name' : '',
  // 配置图片域名
  images: {
    domains: ['localhost'],
    // 允许本地图片优化
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
}

module.exports = nextConfig 