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

import { altitudeToAirPressure } from './altitude-to-air-pressure';
import {
  AVERAGE_PRESSURE_AT_SEA_LEVEL,
  GRAVITATIONAL_ACCELERATION,
  MOLAR_MASS_OF_DRY_AIR,
  STANDARD_TEMPERATURE,
  TEMPERATURE_LAPSE_RATE,
  UNIVERSAL_GAS_CONSTANT,
} from './constants';

export let minValidBarometricPressure = altitudeToAirPressure(8848);
export let maxValidBarometricPressure = altitudeToAirPressure(-430.5);

/**
 * Updates cached barometric pressure bounds when the active dry-air standard changes.
 * @internal
 */
export function updateBarometricPressureBounds(): void {
  minValidBarometricPressure = altitudeToAirPressure(8848);
  maxValidBarometricPressure = altitudeToAirPressure(-430.5);
}

/**
 * Calculates altitude over sea level [m] from atmospheric pressure [Pa]
 * based on barometric formula https://en.wikipedia.org/wiki/Barometric_formula
 * Valid for pressures corresponding to altitudes from -430.5m (Dead Sea) to 8848m (Mt. Everest).
 * @param airPressure Atmospheric pressure [Pa].
 * @returns Altitude over sea level [m].
 * @throws TypeError if airPressure is not a finite number.
 * @throws RangeError if airPressure is outside valid range (~31,444 Pa to ~106,605 Pa).
 */
export function airPressureToAltitude(airPressure: number): number {
  if (!Number.isFinite(airPressure)) {
    throw new TypeError('Air pressure must be a finite number.');
  }

  if (airPressure > maxValidBarometricPressure) {
    throw new RangeError(`Air pressure too high (${airPressure} Pa). Maximum is ${maxValidBarometricPressure} Pa.`);
  }

  if (airPressure < minValidBarometricPressure) {
    throw new RangeError(`Air pressure too low (${airPressure} Pa). Minimum is ${minValidBarometricPressure} Pa.`);
  }

  const exponent =
    (-UNIVERSAL_GAS_CONSTANT * TEMPERATURE_LAPSE_RATE) / (GRAVITATIONAL_ACCELERATION * MOLAR_MASS_OF_DRY_AIR);
  return (
    (STANDARD_TEMPERATURE / TEMPERATURE_LAPSE_RATE) *
    (Math.pow(airPressure / AVERAGE_PRESSURE_AT_SEA_LEVEL, exponent) - 1)
  );
}
