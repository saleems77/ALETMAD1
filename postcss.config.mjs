//postcss.config.mjs
const config = {
  plugins: {
    tailwindcss: {}, // ✅ استخدم tailwindcss بدلاً من @tailwindcss/postcss
    autoprefixer: {},
  },
};

export default config;
