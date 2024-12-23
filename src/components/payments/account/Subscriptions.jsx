'use client'

import React from 'react'
import Link from 'next/link'

// Define the pageData object
const pageData = {
	header: {
		title: "Subscription Plans",
		description: "Choose the best plan for you",
	},
	plans: [
		{
			name: "Free",
			price: "0.00",
			period: "/month",
			description: "Perfect for getting started.",
			features: ["No Cost", "1 Project", "Basic Analytics", "Basic Support"],
			href: "/Signup",
		},
		{
			name: "Monthly",
			price: "9.99",
			period: "/month",
			description: "Perfect for small businesses.",
			features: ["$9.99 per month", "Unlimited Projects", "Full Analytics", "24/7 Support"],
			href: "/Signup",
		},
		{
			name: "Yearly",
			price: "99.99",
			period: "/year",
			description: "Ideal for medium to large businesses.",
			features: ["$99.99 per year", "Unlimited Projects", "Full Analytics", "24/7 Support"],
			href: "/Signup",
		},
	],
};

function Subscriptions() {
	return (
		<div className="min-h-screen my-auto h-full flex flex-col mx-auto justify-center font-semibold" style={{ backgroundImage: `url("/warmshop.png")`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
			<div className="inset-0 flex flex-col min-h-screen my-auto px-2 py-4 sm:py-1 justify-center items-center gap-6" style={{ backgroundColor: 'rgba(0, 0, 0, 0.85)' }}>
				<div className="max-w-4xl sm:px-5 px-2 pb-8 text-white text-center">
					<h1 className="text-3xl mt-4 sm:text-4xl font-bold mb-4">
						{pageData.header.title}
					</h1>
					<p className="text-lg mb-6">
						{pageData.header.description}
					</p>
					{pageData.plans.map((plan, index) => (
						<div key={index} className="border border-white rounded-lg p-6 mb-8">
							<h2 className="text-xl font-semibold mb-4">
								{plan.name}
							</h2>
							<div className="flex items-center justify-center mb-4">
								<span className="text-3xl text-emerald-500 font-bold mr-2">$</span>
								<span className="text-4xl font-bold text-yellow-500">{plan.price}</span>
								<span className="text-sm textwhite font-bold ml-1">{plan.period}</span>
							</div>
							<p className="mb-4">
								{plan.description}
							</p>
							<ul className="text-left list-disc pl-6 mb-4">
								{plan.features.map((feature, i) => (
									<li key={i}>{feature}</li>
								))}
							</ul>
							<Link href={plan.href} className="duration-300 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-4 rounded">
								Get Started
							</Link>
						</div>
					))}
				</div>
			</div>
		</div>
	)
}

export default Subscriptions
