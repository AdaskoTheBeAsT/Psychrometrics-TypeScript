const { withNx } = require('@nx/rollup/with-nx');

// These options were migrated by @nx/rollup:convert-to-inferred from project.json
const options = {
  outputPath: '../../dist/libs/psychrometrics',
  main: './src/index.ts',
  additionalEntryPoints: [
    './src/adiabatic-saturation-specific-humidity.ts',
    './src/air-density-by-relative-humidity.ts',
    './src/air-density-by-specific-humidity.ts',
    './src/air-pressure-to-altitude.ts',
    './src/altitude-to-air-pressure.ts',
    './src/condensed-water-or-ice-enthalpy.ts',
    './src/constants.ts',
    './src/dew-point-temperature.ts',
    './src/enthalpy-to-specific-humidity.ts',
    './src/enthalpy-to-temperature.ts',
    './src/enthalpy.ts',
    './src/initializer.ts',
    './src/moist-air-enthalpy-formula.ts',
    './src/psychrometric-standard.ts',
    './src/relative-to-specific-humidity.ts',
    './src/saturation-vapor-pressure-formula.ts',
    './src/saturation-vapor-pressure-to-temperature.ts',
    './src/specific-and-relative-humidity-to-temperature.ts',
    './src/specific-to-relative-humidity.ts',
    './src/temperature-to-maximum-specific-humidity.ts',
    './src/temperature-to-saturation-vapor-pressure.ts',
    './src/wet-bulb-formula.ts',
    './src/wet-bulb-temperature-to-specific-humidity.ts',
    './src/wet-bulb-temperature.ts',
  ],
  tsConfig: './tsconfig.lib.json',
  assets: [
    { input: '.', glob: 'README.md', output: '.' },
    { input: '.', glob: 'LICENSE', output: '.' },
    { input: 'doc', glob: '*.md', output: './doc' },
  ],
  format: ['esm', 'cjs'],
  generateExportsField: true,
  compiler: 'babel',
  external: ['core-js', '@adaskothebeast/splines'],
};

const config = withNx(options, {
  // Provide additional rollup configuration here. See: https://rollupjs.org/configuration-options
  // e.g.
  // output: { sourcemap: true },
});

module.exports = config;