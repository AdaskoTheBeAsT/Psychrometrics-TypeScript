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

/**
 * Converts temperature to saturation vapor pressure of water.
 * Valid for temperatures > 0°C and <= 100°C.
 * @param temperature Temperature [°C].
 * @returns Saturation vapor pressure of water [Pa].
 * @throws Error if temperature is outside valid range.
 */
export function temperatureToSaturationVaporPressureOfWater(temperature: number): number {
  if (temperature <= 0) {
    throw new RangeError(`Temperature too low (${temperature}°C). Must be greater than 0°C for water vapor pressure.`);
  }

  if (temperature > 100) {
    throw new RangeError(`Temperature too high (${temperature}°C). Must be at most 100°C for water vapor pressure.`);
  }

  return Math.exp(34.494 - 4924.99 / (temperature + 237.1)) / Math.pow(temperature + 105, 1.57);
}

/**
 * Converts temperature to saturation vapor pressure of ice.
 * Valid for temperatures >= -100°C and <= 0°C.
 * @param temperature Temperature [°C].
 * @returns Saturation vapor pressure of ice [Pa].
 * @throws Error if temperature is outside valid range.
 */
export function temperatureToSaturationVaporPressureOfIce(temperature: number): number {
  if (temperature > 0) {
    throw new RangeError(`Temperature too high (${temperature}°C). Must be at most 0°C for ice vapor pressure.`);
  }

  if (temperature < -100) {
    throw new RangeError(`Temperature too low (${temperature}°C). Must be at least -100°C for ice vapor pressure.`);
  }

  return Math.exp(43.494 - 6545.8 / (temperature + 278)) / Math.pow(temperature + 868, 2);
}

/**
 * Converts temperature to saturation vapor pressure.
 * Uses ice formula for temperatures <= 0°C and water formula for temperatures > 0°C.
 * Valid for temperatures from -100°C to 100°C.
 * @param temperature Temperature [°C].
 * @returns Saturation vapor pressure [Pa].
 * @throws RangeError if temperature is outside valid range (-100°C to 100°C).
 */
export function temperatureToSaturationVaporPressure(temperature: number): number {
  if (!Number.isFinite(temperature)) {
    throw new TypeError('Temperature must be a finite number.');
  }

  if (temperature < -100 || temperature > 100) {
    throw new RangeError(`Temperature (${temperature}°C) is outside valid range. Must be between -100°C and 100°C.`);
  }

  if (temperature > 0) {
    return temperatureToSaturationVaporPressureOfWater(temperature);
  }

  return temperatureToSaturationVaporPressureOfIce(temperature);
}
