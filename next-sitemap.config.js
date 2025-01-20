// next-sitemap.config.js

module.exports = {
	siteUrl: "https://momentum.hookerhillstudios.com",
	generateRobotsTxt: true, // (optional) Generates a robots.txt file
	exclude: [
		'/Dashboard',
		'/Customer',
		'/Dashboard/*', // Exclude all sub-routes under /Dashboard
		'/Customer/*',  // Exclude all sub-routes under /Customer
		'/stripe/callback',
		'/unsubscribe',
		'/Admin',
		'/Admin/*',
	],
	sitemapXmlPath: 'public/sitemap.xml', // Custom sitemap path
};
