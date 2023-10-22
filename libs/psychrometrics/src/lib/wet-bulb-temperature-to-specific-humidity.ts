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

import { enthalpy } from './enthalpy';
import { enthalpyToSpecificHumidity } from './enthalpy-to-specific-humidity';
import { temperatureToMaximumSpecificHumidity } from './temperature-to-maximum-specific-humidity';

/**
 * Calculate specific humidity from air pressure, temperature and wet bulb temperature.
 * @param airPressure Air pressure in [Pa].
 * @param temperature Temperature in [°C].
 * @param wetBulbTemperature Wet bulb temperature in [°C].
 * @returns Specific humidity in [g/kg].
 */
export function wetBulbTemperatureToSpecificHumidity(
  airPressure: number,
  temperature: number,
  wetBulbTemperature: number
): number {
  const maxSpecificHumidity = temperatureToMaximumSpecificHumidity(airPressure, wetBulbTemperature);
  const ent = enthalpy(wetBulbTemperature, maxSpecificHumidity);
  return enthalpyToSpecificHumidity(ent, temperature);
}
