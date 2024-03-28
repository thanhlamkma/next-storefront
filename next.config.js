const { i18n } = require("./next-i18next.config");
const withAntdLess = require("next-plugin-antd-less");
const TransformCreateGetServerSidePropsWithJobs = require("./src/core/ssr/serverSideJobs/babel");

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  i18n,
  eslint: {
    ignoreDuringBuilds: true,
  },
  experimental: {
    outputStandalone: true,
  },
  images: {
    domains: ["res.cloudinary.com", "cdn.storefront-dev.abcsoft.vn"],
  },
  webpack(config, { isServer, defaultLoaders }) {
    if (!isServer) {
      defaultLoaders.babel.options.nextConfig.experimental.plugins = [
        () => TransformCreateGetServerSidePropsWithJobs,
      ];
      config.module.rules.push({
        test: /\.(js|jsx|ts|tsx)$/,
        use: [defaultLoaders.babel],
      });
    }

    return config;
  },
};

module.exports = withAntdLess({
  modifyVars: {}, // optional
  lessVarsFilePath: "./src/styles/antd/index.less", // optional
  lessVarsFilePathAppendToEndOfContent: false, // optional
  // optional https://github.com/webpack-contrib/css-loader#object
  cssLoaderOptions: {
    // ...
    mode: "local",
    localIdentName: "[hash:base64:8]", // invalid! for Unify getLocalIdent (Next.js / CRA), Cannot set it, but you can rewritten getLocalIdentFn
    exportLocalsConvention: "camelCase",
    exportOnlyLocals: false,
    // ...
    getLocalIdent: (context, localIdentName, localName, options) => {
      return "whatever_random_class_name";
    },
  },
  images: {
    domains: [
      "res.cloudinary.com",
      "cdn.storefront-dev.abcsoft.vn",
      "103.77.167.22:5001",
    ],
  },

  // for Next.js ONLY
  nextjs: {
    localIdentNameFollowDev: true, // default false, for easy to debug on PROD mode
  },

  // Other Config Here...
  ...nextConfig,
});
