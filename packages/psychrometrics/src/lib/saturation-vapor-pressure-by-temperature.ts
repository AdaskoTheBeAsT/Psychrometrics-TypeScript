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
 * Calculates saturation vapor pressure of water by temperature.
 * @param temperature Temperature [°C].
 * @returns Saturation vapor pressure of water [Pa].
 */
export function saturationVaporPressureOfWaterByTemperature(temperature: number): number {
  if (temperature <= 0) {
    throw new Error(`Temperature too low. Needs to be greater than 0°C.`);
  }

  if (temperature > 100) {
    throw new Error(`Temperature too high. Needs to be less than 100°C.`);
  }

  return Math.exp(34.494 - 4924.99 / (temperature + 237.1)) / Math.pow(temperature + 105, 1.57);
}

/**
 * Calculates saturation vapor pressure of ice by temperature.
 * @param temperature Temperature [°C].
 * @returns Saturation vapor pressure of ice [Pa].
 */
export function saturationVaporPressureOfIceByTemperature(temperature: number): number {
  if (temperature > 0) {
    throw new Error(`Temperature too high. Needs to be less than or equal 0°C.`);
  }

  if (temperature < -100) {
    throw new Error(`Temperature too low. Needs to be greater than -100°C.`);
  }

  return Math.exp(43.494 - 6545.8 / (temperature + 278)) / Math.pow(temperature + 868, 2);
}

/**
 * Calculates saturation vapor pressure by temperature.
 * @param temperature Temperature [°C].
 * @returns Saturation vapor pressure [Pa].
 */
export function saturationVaporPressureByTemperature(temperature: number): number {
  if (temperature > 0) {
    return saturationVaporPressureOfWaterByTemperature(temperature);
  }

  return saturationVaporPressureOfIceByTemperature(temperature);
}
