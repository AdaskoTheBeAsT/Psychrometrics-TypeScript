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

import { condensedWaterOrIceEnthalpy } from './condensed-water-or-ice-enthalpy';
import { dewPointTemperature } from './dew-point-temperature';
import { enthalpy } from './enthalpy';
import { enthalpyToSpecificHumidity } from './enthalpy-to-specific-humidity';
import { enthalpyToTemperature } from './enthalpy-to-temperature';
import { temperatureToMaximumSpecificHumidity } from './temperature-to-maximum-specific-humidity';
import { validateAirPressure, validateSpecificHumidity, validateTemperature } from './validation';
import { WetBulbFormula } from './wet-bulb-formula';

/** Default maximum number of iterations for wet bulb temperature calculation */
const DEFAULT_MAX_ITERATIONS = 1000;

/** Default convergence epsilon for wet bulb temperature calculation */
const DEFAULT_EPSILON = 0.00001;

const MIN_VALID_TEMPERATURE = -100;
const MAX_VALID_TEMPERATURE = 100;

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
  const initialEnthalpy = enthalpy(temperature, specificHumidity);
  let temperaturePrev = temperature;
  let specificHumidityPrev = specificHumidity;
  let iterations = 0;
  let temperatureDifference: number;

  do {
    iterations++;
    const dp = dewPointTemperature(airPressure, specificHumidityPrev);
    temperatureDifference = (temperaturePrev - dp) / 2;
    temperaturePrev += temperaturePrev >= dp ? -Math.abs(temperatureDifference) : Math.abs(temperatureDifference);

    specificHumidityPrev = Math.max(0, enthalpyToSpecificHumidity(initialEnthalpy, temperaturePrev));

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
  const initialEnthalpy = enthalpy(temperature, specificHumidity);
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
    specificHumidityPrev = Math.max(0, specificHumidityPrev + adjustment);

    temperaturePrev = enthalpyToTemperature(initialEnthalpy, specificHumidityPrev);

    const relativeDifference =
      specificHumidityPrev > 0 ? specificHumidityDifference / specificHumidityPrev : specificHumidityDifference;

    if (iterations >= maxIterations) {
      throw new WetBulbConvergenceError(iterations, temperaturePrev, relativeDifference);
    }
  } while (
    Math.abs(
      specificHumidityPrev > 0 ? specificHumidityDifference / specificHumidityPrev : specificHumidityDifference,
    ) > epsilon
  );

  return temperaturePrev;
}

/**
 * Calculates wet-bulb temperature [°C] from air pressure [Pa], dry-bulb temperature [°C],
 * and specific humidity [g/kg] using the European Mollier `h-x` isenthalpic approximation `h(t, x) = h(t_wb, x_s(t_wb))`.
 *
 * Reference: Recknagel, Sprenger, and Albers, *Taschenbuch für Heizung + Klimatechnik*; VDI 4670 Blatt 1.
 */
export function wetBulbTemperatureIsenthalpic(
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

function evaluateThermodynamicWetBulbResidual(
  airPressure: number,
  candidateWetBulbTemperature: number,
  specificHumidity: number,
  targetEnthalpy: number,
): number {
  const saturationSpecificHumidity = temperatureToMaximumSpecificHumidity(airPressure, candidateWetBulbTemperature);
  const saturationEnthalpy = enthalpy(candidateWetBulbTemperature, saturationSpecificHumidity);
  const condensedEnthalpy = condensedWaterOrIceEnthalpy(candidateWetBulbTemperature);
  return (
    saturationEnthalpy -
    targetEnthalpy -
    ((saturationSpecificHumidity - specificHumidity) / 1000) * condensedEnthalpy
  );
}

function getThermodynamicWetBulbBracket(
  airPressure: number,
  temperature: number,
  specificHumidity: number,
  targetEnthalpy: number,
  residualAtTemp: number,
): [number, number] {
  if (residualAtTemp <= 0) {
    return [temperature, MAX_VALID_TEMPERATURE];
  }

  let tLow = MIN_VALID_TEMPERATURE;
  if (specificHumidity > 0) {
    try {
      tLow = Math.max(MIN_VALID_TEMPERATURE, dewPointTemperature(airPressure, specificHumidity));
    } catch {
      tLow = MIN_VALID_TEMPERATURE;
    }
  }

  if (evaluateThermodynamicWetBulbResidual(airPressure, tLow, specificHumidity, targetEnthalpy) > 0) {
    tLow = MIN_VALID_TEMPERATURE;
  }

  return [tLow, temperature];
}

/**
 * Calculates thermodynamic wet-bulb (or frost-bulb) temperature [°C] from air pressure [Pa], dry-bulb temperature [°C],
 * and specific humidity [g/kg] by solving the ASHRAE adiabatic saturation energy balance:
 * `h(t, x) + ((x_s(t*) - x) / 1000) * h_w/i(t*) = h(t*, x_s(t*))`.
 *
 * Reference: ASHRAE Handbook — Fundamentals, Chapter 1 (*Psychrometrics*), Equations 32–34.
 */
export function wetBulbTemperatureThermodynamic(
  airPressure: number,
  temperature: number,
  specificHumidity: number,
  epsilon = DEFAULT_EPSILON,
  maxIterations = DEFAULT_MAX_ITERATIONS,
): number {
  validateWetBulbParams(airPressure, temperature, specificHumidity, epsilon, maxIterations);

  const targetEnthalpy = enthalpy(temperature, specificHumidity);
  const residualAtTemp = evaluateThermodynamicWetBulbResidual(
    airPressure,
    temperature,
    specificHumidity,
    targetEnthalpy,
  );
  if (Math.abs(residualAtTemp) <= 1e-12) {
    return temperature;
  }

  let [tLow, tHigh] = getThermodynamicWetBulbBracket(
    airPressure,
    temperature,
    specificHumidity,
    targetEnthalpy,
    residualAtTemp,
  );

  let iterations = 0;
  while (0.5 * (tHigh - tLow) > epsilon * 1e-2) {
    iterations++;
    const tMid = 0.5 * (tLow + tHigh);
    if (iterations >= maxIterations) {
      throw new WetBulbConvergenceError(iterations, tMid, 0.5 * (tHigh - tLow));
    }

    const residualMid = evaluateThermodynamicWetBulbResidual(airPressure, tMid, specificHumidity, targetEnthalpy);
    if (Math.abs(residualMid) <= 1e-12) {
      return tMid;
    }

    if (residualMid > 0) {
      tHigh = tMid;
    } else {
      tLow = tMid;
    }
  }

  return 0.5 * (tLow + tHigh);
}

let activeWetBulbTemperatureFunc: (
  airPressure: number,
  temperature: number,
  specificHumidity: number,
  epsilon?: number,
  maxIterations?: number,
) => number = wetBulbTemperatureIsenthalpic;

/**
 * Configures the active wet-bulb temperature delegate.
 * @internal
 */
export function setActiveWetBulbTemperatureFormula(
  formula: WetBulbFormula.Isenthalpic | WetBulbFormula.Thermodynamic,
): void {
  activeWetBulbTemperatureFunc =
    formula === WetBulbFormula.Thermodynamic ? wetBulbTemperatureThermodynamic : wetBulbTemperatureIsenthalpic;
}

/**
 * Gets the active wet-bulb temperature delegate.
 * @internal
 */
export function getActiveWetBulbTemperatureFunc(): (
  airPressure: number,
  temperature: number,
  specificHumidity: number,
  epsilon?: number,
  maxIterations?: number,
) => number {
  return activeWetBulbTemperatureFunc;
}

/**
 * Calculate wet bulb temperature from air pressure, temperature and specific humidity
 * using the active formula configured in `Initializer`.
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
  return activeWetBulbTemperatureFunc(airPressure, temperature, specificHumidity, epsilon, maxIterations);
}
