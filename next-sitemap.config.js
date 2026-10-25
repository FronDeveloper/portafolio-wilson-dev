// next-sitemap.config.js
/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://wvalencia-dev.vercel.app/',
  generateRobotsTxt: true,
  exclude: ['/panel', '/panel/*'],
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/panel'],
      },
    ],
  },
}