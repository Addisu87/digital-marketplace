/** @type {import('next').NextConfig} */
const nextConfig = {
	images: {
		formats: ['image/avif', 'image/webp'],
		remotePatterns: [
			{
				hostname: '127.0.0.1',
				protocol: 'http',
			},
		],
	},
};

export default nextConfig;
