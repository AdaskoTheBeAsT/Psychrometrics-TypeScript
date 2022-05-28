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
  AveragePressureAtSeaLevel,
  GravitationalAcceleration,
  MolecularWeightOfDryAir,
  StandardTemperature,
  TemperatureLapseRate,
  UniversalGasConstant,
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
    (StandardTemperature / TemperatureLapseRate) *
    (Math.pow(
      airPressure / AveragePressureAtSeaLevel,
      (UniversalGasConstant * TemperatureLapseRate) / (-GravitationalAcceleration * MolecularWeightOfDryAir)
    ) -
      1)
  );
}
