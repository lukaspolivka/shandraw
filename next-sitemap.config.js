/** @type {import('next-sitemap').IConfig} */

const siteURL = 'https://shandraw.vercel.app';
const config = {
  siteUrl: siteURL,
  generateRobotsTxt: true,
  generateIndexSitemap: true,
  sitemapSize: 5000,
  exclude: ['/auth/*'],
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
      },
    ],
  },
};

export default config;
