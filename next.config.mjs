/** @type {import('next').NextConfig} */
const nextConfig = {
	images: {
		formats: ['image/avif', 'image/webp'],
		remotePatterns: [
			{
				hostname: 'localhost',
				protocol: 'http',
			},
		],
	},
};

export default nextConfig;
