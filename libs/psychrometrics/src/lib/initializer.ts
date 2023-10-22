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

import { MonotoneCubicHermitInterpolation, NumberTuple, Spline } from '@adaskothebeast/splines';

import { temperatureToSaturationVaporPressure } from './temperature-to-saturation-vapor-pressure';

export class Initializer {
  static #saturationVaporPressureToTemperatureSpline: Spline;

  /**
   * Gets spline for conversion saturation vapor pressure to temperature
   */
  static get saturationVaporPressureToTemperatureSpline(): Spline {
    if (Initializer.#saturationVaporPressureToTemperatureSpline == null) {
      throw new Error('Please call "Initializer.initialize" function before using saturationVaporPressure calculation');
    }
    return Initializer.#saturationVaporPressureToTemperatureSpline;
  }

  /**
   * Sets spline for conversion saturation vapor pressure to temperature
   */
  static set saturationVaporPressureToTemperatureSpline(spline: Spline) {
    Initializer.#saturationVaporPressureToTemperatureSpline = spline;
  }

  /**
   * Initialize interpolation for saturation vapor pressure to temperature formula
   * @param decimalPointAccuracy Decimal point accuracy 0 <= value <= 4
   */
  static initialize(decimalPointAccuracy = 2) {
    if (decimalPointAccuracy < 0) {
      throw new Error('Minimum decimal point accuracy is 0');
    }
    if (decimalPointAccuracy > 4) {
      throw new Error('Maximum decimal point accuracy is 4');
    }
    const tuples: NumberTuple[] = [];
    const multiplier = Math.pow(10, decimalPointAccuracy);
    const start = -100 * multiplier;
    const end = 100 * multiplier;
    for (let t = start; t <= end; t += 1) {
      const x = t / multiplier;
      tuples.push([temperatureToSaturationVaporPressure(x), x]);
    }

    Initializer.saturationVaporPressureToTemperatureSpline = new MonotoneCubicHermitInterpolation(tuples);
  }
}
