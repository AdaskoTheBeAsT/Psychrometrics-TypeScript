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
import { validateAirPressure, validateRelativeHumidity, validateSpecificHumidity } from './validation';

/**
 * Converts air pressure, specific and relative humidity to temperature
 * @param airPressure Air pressure [Pa]
 * @param specificHumidity Specific humidity [g/kg]
 * @param relativeHumidity Relative humidity [%]
 * @returns Temperature [°C]
 * @throws TypeError if any parameter is not a finite number.
 * @throws RangeError if any parameter is outside valid range.
 */
export function specificAndRelativeHumidityToTemperature(
  airPressure: number,
  specificHumidity: number,
  relativeHumidity: number,
): number {
  validateAirPressure(airPressure);
  validateSpecificHumidity(specificHumidity);
  validateRelativeHumidity(relativeHumidity);

  const relativeHumidityNormalized = relativeHumidity / 100;
  const specificHumidityNormalized = specificHumidity / 1000;
  const ratio =
    specificHumidityNormalized /
    (relativeHumidityNormalized + ((relativeHumidityNormalized - 1) * specificHumidityNormalized) / MOLAR_MASS_RATIO);
  const saturationVaporPressure = (ratio * airPressure) / (MOLAR_MASS_RATIO + ratio);
  return saturationVaporPressureToTemperature(saturationVaporPressure);
}
