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

import { condensedWaterOrIceEnthalpy } from './condensed-water-or-ice-enthalpy';
import { enthalpy } from './enthalpy';
import { enthalpyToSpecificHumidity } from './enthalpy-to-specific-humidity';
import { temperatureToMaximumSpecificHumidity } from './temperature-to-maximum-specific-humidity';
import { validateAirPressure, validateWetBulbTemperature } from './validation';
import { WetBulbFormula } from './wet-bulb-formula';

/**
 * Calculates specific humidity [g/kg] from air pressure [Pa], dry-bulb temperature [°C], and wet-bulb temperature [°C]
 * using the European Mollier `h-x` isenthalpic approximation `h(t, x) = h(t_wb, x_s(t_wb))`.
 *
 * Reference: Recknagel, Sprenger, and Albers, *Taschenbuch für Heizung + Klimatechnik*; VDI 4670 Blatt 1.
 */
export function wetBulbTemperatureToSpecificHumidityIsenthalpic(
  airPressure: number,
  temperature: number,
  wetBulbTemperature: number,
): number {
  validateAirPressure(airPressure);
  validateWetBulbTemperature(wetBulbTemperature, temperature);

  const wetBulbSpecificHumidity = temperatureToMaximumSpecificHumidity(airPressure, wetBulbTemperature);
  const e = enthalpy(wetBulbTemperature, wetBulbSpecificHumidity);
  return Math.max(0, enthalpyToSpecificHumidity(e, temperature));
}

/**
 * Calculates specific humidity [g/kg] from air pressure [Pa], dry-bulb temperature [°C], and thermodynamic wet-bulb temperature [°C]
 * using the ASHRAE adiabatic saturation energy balance `h(t, x) + ((x_s(t*) - x) / 1000) * h_w/i(t*) = h(t*, x_s(t*))`.
 *
 * Reference: ASHRAE Handbook — Fundamentals, Chapter 1 (*Psychrometrics*), Equations 32–34.
 */
export function wetBulbTemperatureToSpecificHumidityThermodynamic(
  airPressure: number,
  temperature: number,
  wetBulbTemperature: number,
): number {
  validateAirPressure(airPressure);
  validateWetBulbTemperature(wetBulbTemperature, temperature);

  const wetBulbSaturationSpecificHumidity = temperatureToMaximumSpecificHumidity(airPressure, wetBulbTemperature);
  const wetBulbSaturationEnthalpy = enthalpy(wetBulbTemperature, wetBulbSaturationSpecificHumidity);
  const dryAirEnthalpyAtTemp = enthalpy(temperature, 0);
  const waterVaporEnthalpyAtTemp = enthalpy(temperature, 1000) - dryAirEnthalpyAtTemp;
  const condensedEnthalpyAtWetBulb = condensedWaterOrIceEnthalpy(wetBulbTemperature);

  const numerator =
    wetBulbSaturationEnthalpy -
    dryAirEnthalpyAtTemp -
    (wetBulbSaturationSpecificHumidity / 1000) * condensedEnthalpyAtWetBulb;
  const denominator = waterVaporEnthalpyAtTemp - condensedEnthalpyAtWetBulb;
  const specificHumidity = 1000 * (numerator / denominator);
  return Math.max(0, specificHumidity);
}

let activeWetBulbTemperatureToSpecificHumidityFunc: (
  airPressure: number,
  temperature: number,
  wetBulbTemperature: number,
) => number = wetBulbTemperatureToSpecificHumidityIsenthalpic;

/**
 * Configures the active wet-bulb-to-specific-humidity delegate.
 * @internal
 */
export function setActiveWetBulbTemperatureToSpecificHumidityFormula(
  formula: WetBulbFormula.Isenthalpic | WetBulbFormula.Thermodynamic,
): void {
  activeWetBulbTemperatureToSpecificHumidityFunc =
    formula === WetBulbFormula.Thermodynamic
      ? wetBulbTemperatureToSpecificHumidityThermodynamic
      : wetBulbTemperatureToSpecificHumidityIsenthalpic;
}

/**
 * Gets the active wet-bulb-to-specific-humidity delegate.
 * @internal
 */
export function getActiveWetBulbTemperatureToSpecificHumidityFunc(): (
  airPressure: number,
  temperature: number,
  wetBulbTemperature: number,
) => number {
  return activeWetBulbTemperatureToSpecificHumidityFunc;
}

/**
 * Calculates specific humidity [g/kg] from air pressure [Pa], dry bulb temperature [°C]
 * and wet bulb temperature [°C] using the active formula configured in `Initializer`.
 * @param airPressure Air pressure [Pa].
 * @param temperature Dry bulb temperature [°C].
 * @param wetBulbTemperature Wet bulb temperature [°C] (must be <= dry bulb temperature).
 * @returns Specific humidity [g/kg].
 * @throws TypeError if any parameter is not a finite number.
 * @throws Error if any parameter is outside valid range or wetBulbTemperature > temperature.
 */
export function wetBulbTemperatureToSpecificHumidity(
  airPressure: number,
  temperature: number,
  wetBulbTemperature: number,
): number {
  return activeWetBulbTemperatureToSpecificHumidityFunc(airPressure, temperature, wetBulbTemperature);
}
