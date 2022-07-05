import { temperatureAndSpecificHumidityToEnthalpy } from './temperature-and-specific-humidity-to-enthalpy';

describe('temperatureAndSpecificHumidityToEnthalpy', () => {
  const testCases = [
    [32, 18.038226360479687, 78.347492082141],
    [20, 8.736841601662796, 42.28624082757868],
    [-20, 0.3804182346564335, -19.18230709339536],
  ];

  it.each(testCases)(
    'given temperature=%p specific humidity=%p returns %p',
    (temperature, specificHumidity, expected) => {
      const enthalpy = temperatureAndSpecificHumidityToEnthalpy(temperature, specificHumidity);

      expect(enthalpy).toBe(expected);
    }
  );
});
