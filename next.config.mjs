/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: [
            'res.cloudinary.com',
            'dmbd60etr.cloudinary.com',
            'thumbs.dreamstime.com'
        ],
<<<<<<< HEAD
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
=======
    },
    // Add other performance optimizations
    poweredByHeader: false, // Remove X-Powered-By header
    reactStrictMode: true,
    compress: true, // Enable gzip compression
};

export default nextConfig;
>>>>>>> 9eef924d051b62204fab6f3200e78c906dd27d30
