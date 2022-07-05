import { dewPoint } from './dew-point';
import { Initializer } from './initializer';

describe('dewPoint', () => {
  beforeAll(() => {
    Initializer.initialize(2);
  });

  const testCases = [
    [101325, 8.736841601662796, 12.008179492113],
    [101325, 0.3804182346564335, -25.212484391024],
  ];

  it.each(testCases)(
    'given air pressure=%p specific humidity=%p returns %p',
    (airPressure, specificHumidity, expected) => {
      const temperature = dewPoint(airPressure, specificHumidity);

      expect(temperature).toBe(expected);
    }
  );
});
