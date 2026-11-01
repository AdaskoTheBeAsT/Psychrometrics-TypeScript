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

import { temperatureToMaximumSpecificHumidity } from './temperature-to-maximum-specific-humidity';
import { WetBulbFormula } from './wet-bulb-formula';
import { wetBulbTemperatureIsenthalpic, wetBulbTemperatureThermodynamic } from './wet-bulb-temperature';

/**
 * Calculates adiabatic saturation specific humidity [g/kg] along the isenthalpic line `h(t, x) = h(t_wb, x_s(t_wb))`.
 */
export function adiabaticSaturationSpecificHumidityIsenthalpic(
  airPressure: number,
  temperature: number,
  specificHumidity: number,
): number {
  const wbt = wetBulbTemperatureIsenthalpic(airPressure, temperature, specificHumidity);
  return temperatureToMaximumSpecificHumidity(airPressure, wbt);
}

/**
 * Calculates adiabatic saturation specific humidity [g/kg] using the ASHRAE thermodynamic wet-bulb energy balance.
 */
export function adiabaticSaturationSpecificHumidityThermodynamic(
  airPressure: number,
  temperature: number,
  specificHumidity: number,
): number {
  const wbt = wetBulbTemperatureThermodynamic(airPressure, temperature, specificHumidity);
  return temperatureToMaximumSpecificHumidity(airPressure, wbt);
}

let activeAdiabaticSaturationSpecificHumidityFunc: (
  airPressure: number,
  temperature: number,
  specificHumidity: number,
) => number = adiabaticSaturationSpecificHumidityIsenthalpic;

/**
 * Configures the active adiabatic saturation specific humidity delegate.
 * @internal
 */
export function setActiveAdiabaticSaturationSpecificHumidityFormula(
  formula: WetBulbFormula.Isenthalpic | WetBulbFormula.Thermodynamic,
): void {
  activeAdiabaticSaturationSpecificHumidityFunc =
    formula === WetBulbFormula.Thermodynamic
      ? adiabaticSaturationSpecificHumidityThermodynamic
      : adiabaticSaturationSpecificHumidityIsenthalpic;
}

/**
 * Gets the active adiabatic saturation specific humidity delegate.
 * @internal
 */
export function getActiveAdiabaticSaturationSpecificHumidityFunc(): (
  airPressure: number,
  temperature: number,
  specificHumidity: number,
) => number {
  return activeAdiabaticSaturationSpecificHumidityFunc;
}

/**
 * Calculates adiabatic saturation specific humidity [g/kg] from air pressure [Pa],
 * temperature [°C] and specific humidity [g/kg] using the active formula configured in `Initializer`.
 * Requires `Initializer.initialize()` to be called before use.
 * @param airPressure Air pressure [Pa].
 * @param temperature Temperature [°C].
 * @param specificHumidity Specific humidity [g/kg].
 * @returns Adiabatic saturation specific humidity [g/kg].
 * @throws TypeError if any parameter is not a finite number.
 * @throws RangeError if any parameter is outside valid range.
 * @throws InitializationRequiredError if `Initializer.initialize()` has not been called.
 */
export function adiabaticSaturationSpecificHumidity(
  airPressure: number,
  temperature: number,
  specificHumidity: number,
): number {
  return activeAdiabaticSaturationSpecificHumidityFunc(airPressure, temperature, specificHumidity);
}
