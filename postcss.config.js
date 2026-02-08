// postcss.config.js
module.exports = {
  plugins: {
    '@tailwindcss/postcss': {},
    'postcss-preset-env': {
      stage: 3,
      features: {
        'nesting-rules': true,
        'custom-properties': true,
      },
      autoprefixer: {
        grid: 'autoplace',
      },
    },
    'autoprefixer': {},
  },
}