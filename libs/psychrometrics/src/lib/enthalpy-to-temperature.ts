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
  EVAPORATION_HEAT,
  GLUCK_DRY_AIR_ENTHALPY_OFFSET,
  GLUCK_DRY_AIR_TEMPERATURE_THRESHOLD,
  SPECIFIC_HEAT_CAPACITY_OF_DRY_AIR_ASHRAE,
  SPECIFIC_HEAT_CAPACITY_OF_DRY_AIR_EUROVENT,
  SPECIFIC_HEAT_CAPACITY_OF_DRY_AIR_GLUCK_ABOVE_THRESHOLD,
  SPECIFIC_HEAT_CAPACITY_OF_WATER_VAPOR_LEGACY,
  SPECIFIC_HEAT_CAPACITY_OF_WATER_VAPOR_STANDARD,
} from './constants';
import { MoistAirEnthalpyFormula } from './moist-air-enthalpy-formula';
import { validateEnthalpy, validateSpecificHumidity } from './validation';

function calculateLinearEnthalpyToTemperature(
  e: number,
  specificHumidity: number,
  cpDryAir: number,
  cpWaterVapor: number,
): number {
  validateEnthalpy(e);
  validateSpecificHumidity(specificHumidity);
  const specificHumidityNormalized = specificHumidity / 1000;
  return (e - EVAPORATION_HEAT * specificHumidityNormalized) / (cpDryAir + cpWaterVapor * specificHumidityNormalized);
}

function calculatePiecewiseGluckEnthalpyToTemperature(
  e: number,
  specificHumidity: number,
  thresholdTemperature: number,
): number {
  validateEnthalpy(e);
  validateSpecificHumidity(specificHumidity);
  const specificHumidityNormalized = specificHumidity / 1000;
  const t1 =
    (e + GLUCK_DRY_AIR_ENTHALPY_OFFSET - EVAPORATION_HEAT * specificHumidityNormalized) /
    (SPECIFIC_HEAT_CAPACITY_OF_DRY_AIR_GLUCK_ABOVE_THRESHOLD +
      SPECIFIC_HEAT_CAPACITY_OF_WATER_VAPOR_LEGACY * specificHumidityNormalized);

  if (t1 >= thresholdTemperature) {
    return t1;
  }

  return (
    (e - EVAPORATION_HEAT * specificHumidityNormalized) /
    (SPECIFIC_HEAT_CAPACITY_OF_DRY_AIR_EUROVENT +
      SPECIFIC_HEAT_CAPACITY_OF_WATER_VAPOR_LEGACY * specificHumidityNormalized)
  );
}

/**
 * Calculates dry-bulb temperature [°C] from enthalpy [kJ/kg dry air] and specific humidity [g/kg dry air]
 * using the Recknagel / VDI 4670 / Eurovent formula (`c_p,da = 1.005`, `c_p,w = 1.86`, `r_0 = 2501.0`).
 */
export function enthalpyToTemperatureRecknagel(e: number, specificHumidity: number): number {
  return calculateLinearEnthalpyToTemperature(
    e,
    specificHumidity,
    SPECIFIC_HEAT_CAPACITY_OF_DRY_AIR_EUROVENT,
    SPECIFIC_HEAT_CAPACITY_OF_WATER_VAPOR_STANDARD,
  );
}

/**
 * Calculates dry-bulb temperature [°C] from enthalpy [kJ/kg dry air] and specific humidity [g/kg dry air]
 * using the ASHRAE Fundamentals formula (`c_p,da = 1.006`, `c_p,w = 1.86`, `r_0 = 2501.0`).
 */
export function enthalpyToTemperatureAshrae(e: number, specificHumidity: number): number {
  return calculateLinearEnthalpyToTemperature(
    e,
    specificHumidity,
    SPECIFIC_HEAT_CAPACITY_OF_DRY_AIR_ASHRAE,
    SPECIFIC_HEAT_CAPACITY_OF_WATER_VAPOR_STANDARD,
  );
}

/**
 * Calculates dry-bulb temperature [°C] from enthalpy [kJ/kg dry air] and specific humidity [g/kg dry air]
 * using Bernd Glück's (1991) piecewise-linear formula switching at `t = 13 °C`.
 */
export function enthalpyToTemperatureGluck(e: number, specificHumidity: number): number {
  return calculatePiecewiseGluckEnthalpyToTemperature(e, specificHumidity, GLUCK_DRY_AIR_TEMPERATURE_THRESHOLD);
}

/**
 * Calculates dry-bulb temperature [°C] from enthalpy [kJ/kg dry air] and specific humidity [g/kg dry air]
 * using the legacy Glück adaptation switching at `t = 0 °C`.
 */
export function enthalpyToTemperatureGluckLegacy(e: number, specificHumidity: number): number {
  return calculatePiecewiseGluckEnthalpyToTemperature(e, specificHumidity, 0);
}

/**
 * Calculates dry-bulb temperature [°C] from enthalpy [kJ/kg dry air] and specific humidity [g/kg dry air]
 * using the classic European Mollier `i-x` formula (`c_p,da = 1.005`, `c_p,w = 1.84`, `r_0 = 2501.0`).
 */
export function enthalpyToTemperatureMollierLegacy(e: number, specificHumidity: number): number {
  return calculateLinearEnthalpyToTemperature(
    e,
    specificHumidity,
    SPECIFIC_HEAT_CAPACITY_OF_DRY_AIR_EUROVENT,
    SPECIFIC_HEAT_CAPACITY_OF_WATER_VAPOR_LEGACY,
  );
}

let activeEnthalpyToTemperatureFunc: (e: number, specificHumidity: number) => number = enthalpyToTemperatureRecknagel;

/**
 * Configures the active enthalpy-to-temperature delegate.
 * @internal
 */
export function setActiveEnthalpyToTemperatureFormula(formula: MoistAirEnthalpyFormula): void {
  switch (formula) {
    case MoistAirEnthalpyFormula.Recknagel:
      activeEnthalpyToTemperatureFunc = enthalpyToTemperatureRecknagel;
      break;
    case MoistAirEnthalpyFormula.Ashrae:
      activeEnthalpyToTemperatureFunc = enthalpyToTemperatureAshrae;
      break;
    case MoistAirEnthalpyFormula.Gluck:
      activeEnthalpyToTemperatureFunc = enthalpyToTemperatureGluck;
      break;
    case MoistAirEnthalpyFormula.GluckLegacy:
      activeEnthalpyToTemperatureFunc = enthalpyToTemperatureGluckLegacy;
      break;
    case MoistAirEnthalpyFormula.MollierLegacy:
      activeEnthalpyToTemperatureFunc = enthalpyToTemperatureMollierLegacy;
      break;
    default:
      throw new RangeError(`Unsupported moist air enthalpy formula: ${String(formula)}`);
  }
}

/**
 * Gets the active enthalpy-to-temperature delegate.
 * @internal
 */
export function getActiveEnthalpyToTemperatureFunc(): (e: number, specificHumidity: number) => number {
  return activeEnthalpyToTemperatureFunc;
}

/**
 * Calculates temperature [°C] from enthalpy [kJ/kg] and specific humidity [g/kg]
 * using the active formula configured in `Initializer`.
 * @param e Enthalpy [kJ/kg].
 * @param specificHumidity Specific humidity [g/kg].
 * @returns Temperature [°C]
 * @throws TypeError if any parameter is not a finite number.
 * @throws Error if specific humidity is negative.
 */
export function enthalpyToTemperature(e: number, specificHumidity: number): number {
  return activeEnthalpyToTemperatureFunc(e, specificHumidity);
}
