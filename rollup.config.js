module.exports.default = {
  external: ['chartist'],
  input: 'dist/chartist-plugin-tooltip.js',
  output: {
    format: 'umd',
    file: 'dist/chartist-plugin-tooltip.umd.js',
    name: 'ChartistPluginTooltip',
    globals: {
      chartist: 'Chartist'
    }
  }
};
