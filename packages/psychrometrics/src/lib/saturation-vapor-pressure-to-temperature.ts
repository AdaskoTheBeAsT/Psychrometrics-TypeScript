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

import { Initializer } from './initializer';

/**
 * Calculates temperature by saturation vapor pressure.
 * @param pressure Saturation vapor pressure [Pa].
 * @returns Temperature [°C].
 */
export function saturationVaporPressureToTemperature(pressure: number): number {
  if (pressure < 0.0014049735954231866) {
    throw new Error('Pressure to low. Needs to be higher than 0.0014049735954231866.');
  }

  if (pressure > 101416.99487195771) {
    throw new Error('Pressure to high. Needs to be lower than 101416.99487195771.');
  }

  if (pressure >= 101416.99487) {
    return 100;
  }

  return Number(Initializer.saturationVaporPressureToTemperatureSpline.interpolate(pressure).toFixed(12));
}
