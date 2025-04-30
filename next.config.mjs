/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: [
            'res.cloudinary.com',
            'dmbd60etr.cloudinary.com'
        ],
    },
    // Add other performance optimizations
    poweredByHeader: false, // Remove X-Powered-By header
    reactStrictMode: true,
    compress: true, // Enable gzip compression
};

export default nextConfig;
