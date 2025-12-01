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

import { Initializer } from './initializer';

/** Minimum valid pressure for saturation vapor pressure to temperature conversion */
const MIN_PRESSURE = 0.0014049735954231866;

/** Maximum valid pressure for saturation vapor pressure to temperature conversion */
const MAX_PRESSURE = 101416.99487195771;

/**
 * Calculates temperature by saturation vapor pressure.
 * Uses interpolation from precomputed values (requires Initializer.initialize() to be called first).
 *
 * @param pressure Saturation vapor pressure [Pa].
 * @returns Temperature [°C].
 * @throws TypeError if pressure is not a finite number.
 * @throws RangeError if pressure is outside valid range.
 * @throws InitializationRequiredError if Initializer.initialize() has not been called.
 */
export function saturationVaporPressureToTemperature(pressure: number): number {
  if (!Number.isFinite(pressure)) {
    throw new TypeError('Pressure must be a finite number.');
  }

  if (pressure < MIN_PRESSURE) {
    throw new RangeError(
      `Pressure too low (${pressure} Pa). Must be at least ${MIN_PRESSURE} Pa (corresponds to -100°C).`,
    );
  }

  if (pressure > MAX_PRESSURE) {
    throw new RangeError(
      `Pressure too high (${pressure} Pa). Must be at most ${MAX_PRESSURE} Pa (corresponds to 100°C).`,
    );
  }

  // Handle edge case at exactly 100°C
  if (pressure >= 101416.99487) {
    return 100;
  }

  return Number(Initializer.saturationVaporPressureToTemperatureSpline.interpolate(pressure).toFixed(12));
}
