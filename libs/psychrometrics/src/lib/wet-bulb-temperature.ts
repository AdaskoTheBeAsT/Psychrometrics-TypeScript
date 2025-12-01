/**
 * Copyright (C) 2022 Adam Pluciński
 *
 *  This program is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU Affero General Public License as published
 *  by the Free Software Foundation, either version 3 of the License, or
 *  (at your option) any later version.
 *
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU Affero General Public License for more details.
 *
 *  You should have received a copy of the GNU Affero General Public License
 *  along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

import { dewPointTemperature } from './dew-point-temperature';
import { enthalpy } from './enthalpy';
import { enthalpyToSpecificHumidity } from './enthalpy-to-specific-humidity';
import { enthalpyToTemperature } from './enthalpy-to-temperature';
import { temperatureToMaximumSpecificHumidity } from './temperature-to-maximum-specific-humidity';
import { validateAirPressure, validateSpecificHumidity, validateTemperature } from './validation';

/** Default maximum number of iterations for wet bulb temperature calculation */
const DEFAULT_MAX_ITERATIONS = 1000;

/** Default convergence epsilon for wet bulb temperature calculation */
const DEFAULT_EPSILON = 0.00001;

/**
 * Error thrown when wet bulb temperature calculation fails to converge.
 */
export class WetBulbConvergenceError extends Error {
  constructor(
    public readonly iterations: number,
    public readonly lastValue: number,
    public readonly lastDifference: number,
  ) {
    super(
      `Wet bulb temperature calculation failed to converge after ${iterations} iterations. ` +
        `Last value: ${lastValue}, last difference: ${lastDifference}`,
    );
    this.name = 'WetBulbConvergenceError';
  }
}

/**
 * Validates wet bulb calculation parameters.
 */
function validateWetBulbParams(
  airPressure: number,
  temperature: number,
  specificHumidity: number,
  epsilon: number,
  maxIterations: number,
): void {
  validateAirPressure(airPressure);
  validateTemperature(temperature);
  validateSpecificHumidity(specificHumidity);

  if (epsilon <= 0) {
    throw new RangeError(`Epsilon must be positive. Received: ${epsilon}`);
  }
  if (maxIterations < 1) {
    throw new RangeError(`maxIterations must be at least 1. Received: ${maxIterations}`);
  }
}

/**
 * Calculates wet bulb temperature for temperatures >= 0°C using dew point iteration.
 */
function calculateWetBulbAboveZero(
  airPressure: number,
  temperature: number,
  specificHumidity: number,
  epsilon: number,
  maxIterations: number,
): number {
  let temperaturePrev = temperature;
  let specificHumidityPrev = specificHumidity;
  let iterations = 0;
  let temperatureDifference: number;

  do {
    iterations++;
    const dp = dewPointTemperature(airPressure, specificHumidityPrev);
    temperatureDifference = (temperaturePrev - dp) / 2;
    temperaturePrev += temperaturePrev >= dp ? -Math.abs(temperatureDifference) : Math.abs(temperatureDifference);

    const ent = enthalpy(temperature, specificHumidity);
    specificHumidityPrev = enthalpyToSpecificHumidity(ent, temperaturePrev);

    if (iterations >= maxIterations) {
      throw new WetBulbConvergenceError(iterations, temperaturePrev, temperatureDifference);
    }
  } while (Math.abs(temperatureDifference) > epsilon);

  return temperaturePrev;
}

/**
 * Calculates wet bulb temperature for temperatures < 0°C using specific humidity iteration.
 */
function calculateWetBulbBelowZero(
  airPressure: number,
  temperature: number,
  specificHumidity: number,
  epsilon: number,
  maxIterations: number,
): number {
  let temperaturePrev = temperature;
  let specificHumidityPrev = specificHumidity;
  let iterations = 0;
  let specificHumidityDifference: number;

  do {
    iterations++;
    const maxSpecificHumidity = temperatureToMaximumSpecificHumidity(airPressure, temperaturePrev);
    specificHumidityDifference = (maxSpecificHumidity - specificHumidityPrev) / 2;
    const adjustment =
      specificHumidityPrev >= maxSpecificHumidity
        ? -Math.abs(specificHumidityDifference)
        : Math.abs(specificHumidityDifference);
    specificHumidityPrev += adjustment;

    const ent = enthalpy(temperature, specificHumidity);
    temperaturePrev = enthalpyToTemperature(ent, specificHumidityPrev);

    if (iterations >= maxIterations) {
      throw new WetBulbConvergenceError(iterations, temperaturePrev, specificHumidityDifference / specificHumidityPrev);
    }
  } while (Math.abs(specificHumidityDifference / specificHumidityPrev) > epsilon);

  return temperaturePrev;
}

/**
 * Calculate wet bulb temperature from air pressure, temperature and specific humidity.
 * @param airPressure Air pressure in [Pa].
 * @param temperature Temperature in [°C].
 * @param specificHumidity Specific humidity in [g/kg].
 * @param epsilon Convergence threshold (default: 0.00001).
 * @param maxIterations Maximum number of iterations (default: 1000).
 * @returns Wet bulb temperature in [°C].
 * @throws TypeError if any parameter is not a finite number.
 * @throws RangeError if any parameter is outside valid range.
 * @throws WetBulbConvergenceError if calculation fails to converge.
 */
export function wetBulbTemperature(
  airPressure: number,
  temperature: number,
  specificHumidity: number,
  epsilon = DEFAULT_EPSILON,
  maxIterations = DEFAULT_MAX_ITERATIONS,
): number {
  validateWetBulbParams(airPressure, temperature, specificHumidity, epsilon, maxIterations);

  if (temperature >= 0) {
    return calculateWetBulbAboveZero(airPressure, temperature, specificHumidity, epsilon, maxIterations);
  }

  return calculateWetBulbBelowZero(airPressure, temperature, specificHumidity, epsilon, maxIterations);
}
