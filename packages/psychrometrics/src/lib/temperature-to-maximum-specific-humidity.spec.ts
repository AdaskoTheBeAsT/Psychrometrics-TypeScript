import { temperatureToMaximumSpecificHumidity } from './temperature-to-maximum-specific-humidity';

describe('temperatureToMaximumSpecificHumidity', () => {
  const testCases = [
    [101325, 20, 14.699054061706954],
    [101325, -20, 0.6342890248947272],
  ];

  it.each(testCases)('given air pressure=%p temperature=%p returns %p', (airPressure, temperature, expected) => {
    const specificHumidity = temperatureToMaximumSpecificHumidity(airPressure, temperature);

    expect(specificHumidity).toBe(expected);
  });
});
