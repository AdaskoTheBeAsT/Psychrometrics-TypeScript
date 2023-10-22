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

import {
  AVERAGE_PRESSURE_AT_SEA_LEVEL,
  GRAVITATIONAL_ACCELERATION,
  MOLAR_MASS_OF_DRY_AIR,
  STANDARD_TEMPERATURE,
  TEMPERATURE_LAPSE_RATE,
  UNIVERSAL_GAS_CONSTANT,
} from './constants';

/**
 * Converts air pressure to altitude (above mean sea level)
 * @param airPressure air pressure [Pa]
 * @returns meters above mean see level [m]
 */
export function airPressureToAltitude(airPressure: number): number {
  if (airPressure < 31444.24523603051) {
    throw new Error('Air press too low. Should be higher than or equal 31444.24523603051');
  }
  if (airPressure > 106604.6217946672) {
    throw new Error('Air press too high. Should be lower than or equal 106604.6217946672');
  }
  return (
    (STANDARD_TEMPERATURE / TEMPERATURE_LAPSE_RATE) *
    (Math.pow(
      airPressure / AVERAGE_PRESSURE_AT_SEA_LEVEL,
      (UNIVERSAL_GAS_CONSTANT * TEMPERATURE_LAPSE_RATE) / (-GRAVITATIONAL_ACCELERATION * MOLAR_MASS_OF_DRY_AIR)
    ) -
      1)
  );
}
