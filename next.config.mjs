/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.googleusercontent.com", // Allow images from Google user content
      },
      {
        protocol: "https",
        hostname: "*.gstatic.com", // Allow images from Google search (including encrypted-tbn0.gstatic.com)
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com", // Allow images from Cloudinary
      },
    ],
  },

  async headers() {
    return [
      {
        // Prevent caching for all API routes
        source: "/api/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "no-store", // Prevent caching for API responses
          },
        ],
      },
    ];
  },
};

export default nextConfig;
