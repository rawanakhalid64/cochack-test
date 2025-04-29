/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: "http",
                hostname: "localhost",
                port: "",
                pathname: "/**",
            },
            {
                protocol: "https",
                hostname: "res.cloudinary.com",
                port: "",
                pathname: "/**",
            },
            {
                protocol: "https",
                hostname: "*.cloudinary.com", // Allow all Cloudinary subdomains
                port: "",
                pathname: "/**",
            },
            {
                protocol: "https",
                hostname: "img.youtube.com",
                port: "",
                pathname: "/**",
            },
            {
                protocol: "https",
                hostname: "placehold.co",
                port: "",
                pathname: "/**",
            }
        ],
        unoptimized: false, // Enable image optimization
        minimumCacheTTL: 60, // Cache optimized images for 60 seconds
    },
    // Add other performance optimizations
    poweredByHeader: false, // Remove X-Powered-By header
    reactStrictMode: true,
    compress: true, // Enable gzip compression
};

export default nextConfig;
