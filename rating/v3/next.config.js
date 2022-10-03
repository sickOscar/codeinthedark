/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  env:{
    authClientId: "6jXh1PMXdoj6GQdFYH2EjAMoAyCxPxHf",
    authUrl:"codeinthedarkve.eu.auth0.com"
  }
}

module.exports = nextConfig
