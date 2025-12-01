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

import { MonotoneCubicHermiteInterpolation, NumberTuple, Spline } from '@adaskothebeast/splines';

import { temperatureToSaturationVaporPressure } from './temperature-to-saturation-vapor-pressure';

/** Minimum allowed decimal point accuracy */
const MIN_DECIMAL_ACCURACY = 0;

/** Maximum allowed decimal point accuracy */
const MAX_DECIMAL_ACCURACY = 4;

/** Default decimal point accuracy */
const DEFAULT_DECIMAL_ACCURACY = 2;

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

/**
 * Manages initialization of interpolation splines for psychrometric calculations.
 *
 * The Initializer class provides a singleton pattern for managing the spline
 * used to convert saturation vapor pressure back to temperature. This reverse
 * calculation requires interpolation because there's no simple inverse formula.
 *
 * @example
 * ```typescript
 * // Option 1: Explicit initialization at startup
 * Initializer.initialize(2); // 2 decimal places of accuracy
 *
 * // Option 2: Lazy initialization (auto-initializes on first use)
 * Initializer.ensureInitialized();
 *
 * // Now you can use saturationVaporPressureToTemperature
 * const temp = saturationVaporPressureToTemperature(1000);
 * ```
 */
export class Initializer {
  static #saturationVaporPressureToTemperatureSpline: Spline | null = null;
  static #isInitialized = false;
  static #currentAccuracy: number | null = null;

  /**
   * Gets whether the initializer has been initialized.
   */
  static get isInitialized(): boolean {
    return Initializer.#isInitialized;
  }

  /**
   * Gets the current decimal point accuracy, or null if not initialized.
   */
  static get currentAccuracy(): number | null {
    return Initializer.#currentAccuracy;
  }

  /**
   * Gets spline for conversion saturation vapor pressure to temperature.
   * @throws InitializationRequiredError if initialize() has not been called.
   */
  static get saturationVaporPressureToTemperatureSpline(): Spline {
    if (Initializer.#saturationVaporPressureToTemperatureSpline == null) {
      throw new InitializationRequiredError();
    }
    return Initializer.#saturationVaporPressureToTemperatureSpline;
  }

  /**
   * Sets spline for conversion saturation vapor pressure to temperature.
   * @internal This setter is primarily for testing purposes.
   */
  static set saturationVaporPressureToTemperatureSpline(spline: Spline) {
    Initializer.#saturationVaporPressureToTemperatureSpline = spline;
    Initializer.#isInitialized = true;
  }

  /**
   * Ensures the initializer is ready for use, initializing with defaults if needed.
   * This provides a lazy initialization option for convenience.
   *
   * @param decimalPointAccuracy Optional decimal point accuracy (0-4). Defaults to 2.
   * @returns true if initialization was performed, false if already initialized.
   */
  static ensureInitialized(decimalPointAccuracy = DEFAULT_DECIMAL_ACCURACY): boolean {
    if (Initializer.#isInitialized) {
      return false;
    }
    Initializer.initialize(decimalPointAccuracy);
    return true;
  }

  /**
   * Resets the initializer state. Useful for testing or changing accuracy.
   */
  static reset(): void {
    Initializer.#saturationVaporPressureToTemperatureSpline = null;
    Initializer.#isInitialized = false;
    Initializer.#currentAccuracy = null;
  }

  /**
   * Initialize interpolation for saturation vapor pressure to temperature formula.
   *
   * This method precomputes temperature values for a range of saturation vapor
   * pressures from -100°C to 100°C and creates an interpolation spline for
   * reverse lookups.
   *
   * @param decimalPointAccuracy Decimal point accuracy (0-4).
   *   - 0: 200 values stored (~minimal memory)
   *   - 1: 2,000 values stored
   *   - 2: 20,000 values stored (default, good balance)
   *   - 3: 200,000 values stored
   *   - 4: 2,000,000 values stored (~maximum precision)
   *
   * @throws RangeError if decimalPointAccuracy is outside valid range (0-4).
   *
   * @example
   * ```typescript
   * // Initialize with default accuracy (2 decimal places)
   * Initializer.initialize();
   *
   * // Initialize with high precision
   * Initializer.initialize(4);
   * ```
   */
  static initialize(decimalPointAccuracy = DEFAULT_DECIMAL_ACCURACY): void {
    if (decimalPointAccuracy < MIN_DECIMAL_ACCURACY) {
      throw new RangeError(
        `decimalPointAccuracy must be at least ${MIN_DECIMAL_ACCURACY}. Received: ${decimalPointAccuracy}`,
      );
    }
    if (decimalPointAccuracy > MAX_DECIMAL_ACCURACY) {
      throw new RangeError(
        `decimalPointAccuracy must be at most ${MAX_DECIMAL_ACCURACY}. Received: ${decimalPointAccuracy}`,
      );
    }

    const tuples: NumberTuple[] = [];
    const multiplier = Math.pow(10, decimalPointAccuracy);
    const start = -100 * multiplier;
    const end = 100 * multiplier;

    for (let t = start; t <= end; t += 1) {
      const x = t / multiplier;
      tuples.push([temperatureToSaturationVaporPressure(x), x]);
    }

    Initializer.#saturationVaporPressureToTemperatureSpline = new MonotoneCubicHermiteInterpolation(tuples);
    Initializer.#isInitialized = true;
    Initializer.#currentAccuracy = decimalPointAccuracy;
  }
}
