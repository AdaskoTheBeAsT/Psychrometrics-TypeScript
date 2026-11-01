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
  LATENT_HEAT_OF_FUSION_OF_WATER,
  SPECIFIC_HEAT_CAPACITY_OF_ICE,
  SPECIFIC_HEAT_CAPACITY_OF_LIQUID_WATER,
} from './constants';
import { validateTemperature } from './validation';

/**
 * Calculates the specific enthalpy [kJ/kg] of condensed liquid water (`t >= 0 °C`) or solid ice (`t < 0 °C`)
 * used in the thermodynamic wet-bulb / frost-bulb energy balance.
 *
 * - For `t >= 0 °C`: `h_w(t) = c_p,w * t = 4.186 * t` (ASHRAE Handbook — Fundamentals, Chapter 1, Equation 33).
 * - For `t < 0 °C`: `h_i(t) = -L_f + c_p,i * t = -333.4 + 2.1 * t` (ASHRAE Handbook — Fundamentals, Chapter 1, Equation 34).
 *
 * @param temperature Temperature [°C].
 * @returns Condensed water or ice specific enthalpy [kJ/kg].
 */
export function condensedWaterOrIceEnthalpy(temperature: number): number {
  validateTemperature(temperature);
  return temperature >= 0
    ? SPECIFIC_HEAT_CAPACITY_OF_LIQUID_WATER * temperature
    : -LATENT_HEAT_OF_FUSION_OF_WATER + SPECIFIC_HEAT_CAPACITY_OF_ICE * temperature;
}
