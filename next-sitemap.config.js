// next-sitemap.config.js

module.exports = {
	siteUrl: "https://momentum.hookerhillstudios.com",
	generateRobotsTxt: true, // (optional) Generates a robots.txt file
	exclude: [
		"/Dashboard",
		"/Customer",
		"/Dashboard/*", // Exclude all sub-routes under /Dashboard
		"/Customer/*",  // Exclude all sub-routes under /Customer
		"/stripe/callback",
		"/unsubscribe",
		"/Admin",
		"/Admin/*",
	],
	sitemapXmlPath: "public/sitemap.xml", // Custom sitemap path
	additionalPaths: async (config) => {
		const dynamicRoutes = [
			"/About/welcomeToMomentum",
			"/About/accountCreation",
			"/About/connectingStripe",
			"/About/userDashboard",
			"/About/customerDashboard",
			"/About/invoicing",
			"/About/projectPages",
		];

		return dynamicRoutes.map((route) => ({
			loc: route,
			changefreq: "daily",
			priority: 0.7,
			lastmod: new Date().toISOString(),
		}));
	},
};
