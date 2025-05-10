/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: [
            'res.cloudinary.com',
            'dmbd60etr.cloudinary.com',
            'thumbs.dreamstime.com'
        ],
        remotePatterns: [
            {
                protocol: 'http',
                hostname: 'res.cloudinary.com',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'res.cloudinary.com',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'dmbd60etr.cloudinary.com',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: '*.cloudinary.com',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'thumbs.dreamstime.com',
                pathname: '/**',
            }
        ],
    },
    poweredByHeader: false,
    reactStrictMode: true,
    compress: true,
};

// Use ES modules export syntax for .mjs files
export default nextConfig;