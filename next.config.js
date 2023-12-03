// const i18nConfig = require
const withNextIntl = require("next-intl/plugin")(
  // Specify a custom path here
  "./src/i18n.ts"
);

/** @type {import('next').NextConfig} */
const nextConfig = withNextIntl({
  images: {
    domains: ["lh3.googleusercontent.com"],
  },
});

module.exports = nextConfig;
