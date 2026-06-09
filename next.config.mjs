/** @type {import('next').NextConfig} */
const nextConfig = {
  // Static export so the web app can be bundled inside the Capacitor Android shell.
  output: 'export',
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
}

export default nextConfig
