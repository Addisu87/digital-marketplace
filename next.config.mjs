/** @type {import('next').NextConfig} */
const nextConfig = {
	images: {
		formats: ['image/avif', 'image/webp'],
		remotePatterns: [
			{
				hostname: '*',
				protocol: 'http',
			},
		],
	},
};

export default nextConfig;
