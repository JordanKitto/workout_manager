/** @type {import('next').NextConfig} */
module.exports = {
    reactStrictMode: true,
    transpilePackages: ["@workout/ui"],
    eslint: { ignoreDuringBuilds: true },
    webpack: (config) => {
        config.resolve.alias = {
            ...(config.resolve.alias || {}),
            "react-native$": "react-native-web"
        };
        return config;
    }
};
