/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['react-day-picker'],
  
  webpack: (config, { isServer }) => {
    // Only apply to CSS files in specific directories if needed
    config.module.rules.push({
      test: /\.css$/i,
      include: [path.join(__dirname, 'app')], // Be more specific
      use: [
        isServer ? 'ignore-loader' : 'style-loader',
        {
          loader: 'css-loader',
          options: {
            importLoaders: 1,
            modules: {
              auto: true,
            },
          },
        },
        'postcss-loader'
      ],
    });
    return config;
  },

  experimental: {
    turbo: {
      rules: {
        '*.css': {
          loaders: ['postcss-loader'],
        },
      }
    }
  }
};