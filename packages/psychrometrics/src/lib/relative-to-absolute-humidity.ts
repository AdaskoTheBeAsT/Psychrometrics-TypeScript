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

import { MolecularWeightRatio } from './constants';
import { temperatureToSaturationVaporPressure } from './temperature-to-saturation-vapor-pressure';

/**
 * Converts relative to absolute humidity
 * @param airPressure Air pressure [Pa]
 * @param temperature Temperature [°C]
 * @param relativeHumidity Relative humidity [%]
 * @returns Absolute humidity [g/kg]
 */
export function relativeToAbsoluteHumidity(airPressure: number, temperature: number, relativeHumidity: number): number {
  const relativeHumidityNormalized = relativeHumidity / 100.0;
  const saturationVaporPressure = temperatureToSaturationVaporPressure(temperature);
  const saturatedHumidityRatio =
    (MolecularWeightRatio * saturationVaporPressure) / (airPressure - saturationVaporPressure);
  return (
    (1000.0 * relativeHumidityNormalized * saturatedHumidityRatio) /
    (1.0 + ((1.0 - relativeHumidityNormalized) * saturatedHumidityRatio) / MolecularWeightRatio)
  );
}
