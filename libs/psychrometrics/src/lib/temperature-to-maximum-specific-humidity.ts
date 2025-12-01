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
import { temperatureToSaturationVaporPressure } from './temperature-to-saturation-vapor-pressure';
import { validateAirPressure, validatePressureRatio, validateTemperature } from './validation';

/**
 * Converts temperature to maximum specific humidity.
 * @param airPressure Air pressure [Pa].
 * @param temperature Temperature [°C].
 * @returns Maximum specific humidity [g/kg].
 * @throws TypeError if any parameter is not a finite number.
 * @throws RangeError if any parameter is outside valid range.
 * @throws Error if saturation vapor pressure exceeds air pressure.
 */
export function temperatureToMaximumSpecificHumidity(airPressure: number, temperature: number): number {
  validateAirPressure(airPressure);
  validateTemperature(temperature);

  const saturatedPress = temperatureToSaturationVaporPressure(temperature);

  // Guard against division by zero
  validatePressureRatio(saturatedPress, airPressure);

  const saturatedSpecificHumidity = (MOLAR_MASS_RATIO * saturatedPress) / (airPressure - saturatedPress);
  return 1000 * saturatedSpecificHumidity;
}
