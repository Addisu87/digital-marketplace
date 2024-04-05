/** @type {import('next').NextConfig} */
const nextConfig = {
	images: {
		formats: ["image/avif", "image/webp"],
		remotePatterns: [
			{
				hostname: 'localhost',
				pathname: '**',
				port: '3000',
				protocol: 'http',
			},
		],
	},
};

export default nextConfig;
