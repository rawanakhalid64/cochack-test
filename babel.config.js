module.exports = {
  presets: [
    ['next/babel', {
      'preset-react': {
        runtime: 'automatic'
      }
    }]
  ],
  plugins: [
    ['@babel/plugin-transform-runtime', {
      regenerator: true,
      corejs: 3,
      helpers: true,
      useESModules: true
    }]
  ]
}; 