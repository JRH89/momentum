// next-sitemap.config.js

module.exports = {
	siteUrl: process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000',
	sitemapXmlPath: 'public/sitemap.xml',
};
