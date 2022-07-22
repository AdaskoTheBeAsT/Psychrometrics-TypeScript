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

/**
 * Converts air pressure, temperature and specific humidity to relative humidity
 * @param airPressure Air pressure [Pa]
 * @param temperature Temperature [°C]
 * @param specificHumidity Specific humidity [g/kg]
 * @returns Relative humidity [%]
 */
export function specificToRelativeHumidity(airPressure: number, temperature: number, specificHumidity: number): number {
  const saturationVaporPressure = temperatureToSaturationVaporPressure(temperature);
  const saturatedHumidityRatio = (MOLAR_MASS_RATIO * saturationVaporPressure) / (airPressure - saturationVaporPressure);
  const specificHumidityNormalized = specificHumidity / 1000.0;
  return (
    (100.0 * specificHumidityNormalized * (1.0 + saturatedHumidityRatio / MOLAR_MASS_RATIO)) /
    (saturatedHumidityRatio * (1.0 + specificHumidityNormalized / MOLAR_MASS_RATIO))
  );
}
