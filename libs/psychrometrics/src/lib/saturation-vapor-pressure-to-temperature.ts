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

import { Spline } from '@adaskothebeast/splines';
import { temperatureToSaturationVaporPressure } from './temperature-to-saturation-vapor-pressure';

/**
 * Error thrown when attempting to use saturation vapor pressure interpolation
 * before initialization.
 */
export class InitializationRequiredError extends Error {
  constructor() {
    super(
      'Initializer.initialize() must be called before using saturationVaporPressureToTemperature. ' +
        'Call Initializer.initialize() at application startup or use Initializer.ensureInitialized() ' +
        'for lazy initialization.',
    );
    this.name = 'InitializationRequiredError';
  }
}

let activeSpline: Spline | null = null;

/**
 * Gets the active saturation vapor pressure to temperature spline.
 * @throws InitializationRequiredError if initialize() has not been called.
 * @internal
 */
export function getSaturationVaporPressureToTemperatureSpline(): Spline {
  if (activeSpline == null) {
    throw new InitializationRequiredError();
  }
  return activeSpline;
}

/**
 * Sets the active saturation vapor pressure to temperature spline.
 * @internal
 */
export function setSaturationVaporPressureToTemperatureSpline(spline: Spline | null): void {
  activeSpline = spline;
}

/** Minimum valid pressure for saturation vapor pressure to temperature conversion (at -100°C) */
export let minValidSaturationPressure = temperatureToSaturationVaporPressure(-100);

/** Maximum valid pressure for saturation vapor pressure to temperature conversion (at 100°C) */
export let maxValidSaturationPressure = temperatureToSaturationVaporPressure(100);

/** Saturation vapor pressure threshold at 100°C for clamping floating-point round-off */
export let boilingPointSaturationPressure = maxValidSaturationPressure - 1e-5;

/**
 * Updates the valid saturation vapor pressure bounds for the active formula.
 * @internal
 */
export function updateSaturationVaporPressureBounds(minPressure: number, maxPressure: number): void {
  minValidSaturationPressure = minPressure;
  maxValidSaturationPressure = maxPressure;
  boilingPointSaturationPressure = maxPressure - 1e-5;
}

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

  if (pressure < minValidSaturationPressure) {
    throw new RangeError(
      `Pressure too low (${pressure} Pa). Must be at least ${minValidSaturationPressure} Pa (corresponds to -100°C).`,
    );
  }

  if (pressure > maxValidSaturationPressure) {
    throw new RangeError(
      `Pressure too high (${pressure} Pa). Must be at most ${maxValidSaturationPressure} Pa (corresponds to 100°C).`,
    );
  }

  const spline = getSaturationVaporPressureToTemperatureSpline();

  if (pressure >= boilingPointSaturationPressure) {
    return 100;
  }

  return Number(spline.interpolate(pressure).toFixed(12));
}
