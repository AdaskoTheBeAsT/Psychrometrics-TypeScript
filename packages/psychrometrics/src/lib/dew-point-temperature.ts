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

import { MOLAR_MASS_RATIO } from './constants';
import { saturationVaporPressureToTemperature } from './saturation-vapor-pressure-to-temperature';

/**
 * Calculates dew point temperature from specific humidity [°C].
 * @param airPressure Air pressure [Pa].
 * @param specificHumidity Specific humidity [g/kg].
 * @returns Dew point temperature [°C].
 */
export function dewPointTemperature(airPressure: number, specificHumidity: number): number {
  const specificHumidityNormalized = specificHumidity / 1000.0;
  const saturatedPress = (specificHumidityNormalized * airPressure) / (specificHumidityNormalized + MOLAR_MASS_RATIO);
  return saturationVaporPressureToTemperature(saturatedPress);
}
