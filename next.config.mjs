/** @type {import('next').NextConfig} */
// Static export for GitHub Pages. No API routes / server actions.
// Repo is named `tarot` → project site serves under /tarot.
// basePath only applies to production builds so `npm run dev` stays at root.
const isPages = process.env.GITHUB_ACTIONS === "true";

const nextConfig = {
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
  ...(isPages ? { basePath: "/tarot", assetPrefix: "/tarot/" } : {}),
};

export default nextConfig;
