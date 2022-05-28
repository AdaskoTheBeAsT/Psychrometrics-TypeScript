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
import { saturationVaporPressureToTemperature } from './saturation-vapor-pressure-to-temperature';

/**
 * Converts air pressure, absolute and relative humidity to temperature
 * @param airPressure Air pressure [Pa]
 * @param absoluteHumidity Absolute humidity [g/kg]
 * @param relativeHumidity Relative humidity [%]
 * @returns Temperature [°C]
 */
export function absoluteAndRelativeHumidityToTemperature(
  airPressure: number,
  absoluteHumidity: number,
  relativeHumidity: number
): number {
  const relativeHumidityNormalized = relativeHumidity / 100.0;
  const absoluteHumidityNormalized = absoluteHumidity / 1000.0;
  const ratio =
    absoluteHumidityNormalized /
    (relativeHumidityNormalized +
      ((relativeHumidityNormalized - 1.0) * absoluteHumidityNormalized) / MolecularWeightRatio);
  const saturationVaporPressure = (ratio * airPressure) / (MolecularWeightRatio + ratio);
  return saturationVaporPressureToTemperature(saturationVaporPressure);
}
