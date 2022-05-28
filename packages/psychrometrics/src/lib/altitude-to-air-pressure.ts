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
 * Converts altitude (above mean sea level) to air pressure
 * @param altitude meters above mean see level [m]
 * @returns air pressure [Pa]
 */
export function altitudeToAirPressure(altitude: number): number {
  if (altitude > 8848) {
    throw new Error('Altitude too high. Should be lower than 8848[m]');
  }
  if (altitude < -430.5) {
    throw new Error('Altitude too low. Should be higher than -430.5[m]');
  }
  return (
    AveragePressureAtSeaLevel *
    Math.pow(
      1 + (TemperatureLapseRate * altitude) / StandardTemperature,
      (-GravitationalAcceleration * MolecularWeightOfDryAir) / (UniversalGasConstant * TemperatureLapseRate)
    )
  );
}
