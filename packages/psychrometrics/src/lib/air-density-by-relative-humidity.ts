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

import { GasConstantForDryAir, GasConstantForWaterVapor } from './constants';
import { temperatureToSaturationVaporPressure } from './temperature-to-saturation-vapor-pressure';

/**
 * Calculates air density by relative humidity [kg/m³].
 * @param airPressure Air pressure [Pa].
 * @param temperature Temperature [°C].
 * @param relativeHumidity Relative humidity [%].
 * @returns Air density [kg/m³].
 */
export function airDensityByRelativeHumidity(
  airPressure: number,
  temperature: number,
  relativeHumidity: number
): number {
  const svp = temperatureToSaturationVaporPressure(temperature);
  const pv = (svp * relativeHumidity) / 100;
  const pd = airPressure - pv;
  const temperatureKelvin = temperature + 273.15;
  return pd / (GasConstantForDryAir * temperatureKelvin) + pv / (GasConstantForWaterVapor * temperatureKelvin);
}
