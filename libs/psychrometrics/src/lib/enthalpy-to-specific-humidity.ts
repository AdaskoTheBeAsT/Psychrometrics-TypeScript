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
import { validateEnthalpy, validateTemperature } from './validation';

function calculateLinearEnthalpyToSpecificHumidity(
  e: number,
  temperature: number,
  cpDryAir: number,
  cpWaterVapor: number,
): number {
  validateEnthalpy(e);
  validateTemperature(temperature);
  const specificHumidityNormalized = (e - cpDryAir * temperature) / (EVAPORATION_HEAT + cpWaterVapor * temperature);
  return specificHumidityNormalized * 1000;
}

function calculatePiecewiseGluckEnthalpyToSpecificHumidity(
  e: number,
  temperature: number,
  thresholdTemperature: number,
): number {
  validateEnthalpy(e);
  validateTemperature(temperature);
  const vaporUnitEnthalpy = EVAPORATION_HEAT + SPECIFIC_HEAT_CAPACITY_OF_WATER_VAPOR_LEGACY * temperature;
  const specificHumidityNormalized =
    temperature >= thresholdTemperature
      ? (e - SPECIFIC_HEAT_CAPACITY_OF_DRY_AIR_GLUCK_ABOVE_THRESHOLD * temperature + GLUCK_DRY_AIR_ENTHALPY_OFFSET) /
        vaporUnitEnthalpy
      : (e - SPECIFIC_HEAT_CAPACITY_OF_DRY_AIR_EUROVENT * temperature) / vaporUnitEnthalpy;
  return specificHumidityNormalized * 1000;
}

/**
 * Calculates specific humidity [g/kg dry air] from enthalpy [kJ/kg dry air] and temperature [°C]
 * using the Recknagel / VDI 4670 / Eurovent formula (`c_p,da = 1.005`, `c_p,w = 1.86`, `r_0 = 2501.0`).
 */
export function enthalpyToSpecificHumidityRecknagel(e: number, temperature: number): number {
  return calculateLinearEnthalpyToSpecificHumidity(
    e,
    temperature,
    SPECIFIC_HEAT_CAPACITY_OF_DRY_AIR_EUROVENT,
    SPECIFIC_HEAT_CAPACITY_OF_WATER_VAPOR_STANDARD,
  );
}

/**
 * Calculates specific humidity [g/kg dry air] from enthalpy [kJ/kg dry air] and temperature [°C]
 * using the ASHRAE Fundamentals formula (`c_p,da = 1.006`, `c_p,w = 1.86`, `r_0 = 2501.0`).
 */
export function enthalpyToSpecificHumidityAshrae(e: number, temperature: number): number {
  return calculateLinearEnthalpyToSpecificHumidity(
    e,
    temperature,
    SPECIFIC_HEAT_CAPACITY_OF_DRY_AIR_ASHRAE,
    SPECIFIC_HEAT_CAPACITY_OF_WATER_VAPOR_STANDARD,
  );
}

/**
 * Calculates specific humidity [g/kg dry air] from enthalpy [kJ/kg dry air] and temperature [°C]
 * using Bernd Glück's (1991) piecewise-linear formula switching at `t = 13 °C`.
 */
export function enthalpyToSpecificHumidityGluck(e: number, temperature: number): number {
  return calculatePiecewiseGluckEnthalpyToSpecificHumidity(e, temperature, GLUCK_DRY_AIR_TEMPERATURE_THRESHOLD);
}

/**
 * Calculates specific humidity [g/kg dry air] from enthalpy [kJ/kg dry air] and temperature [°C]
 * using the legacy Glück adaptation switching at `t = 0 °C`.
 */
export function enthalpyToSpecificHumidityGluckLegacy(e: number, temperature: number): number {
  return calculatePiecewiseGluckEnthalpyToSpecificHumidity(e, temperature, 0);
}

/**
 * Calculates specific humidity [g/kg dry air] from enthalpy [kJ/kg dry air] and temperature [°C]
 * using the classic European Mollier `i-x` formula (`c_p,da = 1.005`, `c_p,w = 1.84`, `r_0 = 2501.0`).
 */
export function enthalpyToSpecificHumidityMollierLegacy(e: number, temperature: number): number {
  return calculateLinearEnthalpyToSpecificHumidity(
    e,
    temperature,
    SPECIFIC_HEAT_CAPACITY_OF_DRY_AIR_EUROVENT,
    SPECIFIC_HEAT_CAPACITY_OF_WATER_VAPOR_LEGACY,
  );
}

let activeEnthalpyToSpecificHumidityFunc: (e: number, temperature: number) => number =
  enthalpyToSpecificHumidityRecknagel;

/**
 * Configures the active enthalpy-to-specific-humidity delegate.
 * @internal
 */
export function setActiveEnthalpyToSpecificHumidityFormula(formula: MoistAirEnthalpyFormula): void {
  switch (formula) {
    case MoistAirEnthalpyFormula.Recknagel:
      activeEnthalpyToSpecificHumidityFunc = enthalpyToSpecificHumidityRecknagel;
      break;
    case MoistAirEnthalpyFormula.Ashrae:
      activeEnthalpyToSpecificHumidityFunc = enthalpyToSpecificHumidityAshrae;
      break;
    case MoistAirEnthalpyFormula.Gluck:
      activeEnthalpyToSpecificHumidityFunc = enthalpyToSpecificHumidityGluck;
      break;
    case MoistAirEnthalpyFormula.GluckLegacy:
      activeEnthalpyToSpecificHumidityFunc = enthalpyToSpecificHumidityGluckLegacy;
      break;
    case MoistAirEnthalpyFormula.MollierLegacy:
      activeEnthalpyToSpecificHumidityFunc = enthalpyToSpecificHumidityMollierLegacy;
      break;
    default:
      throw new RangeError(`Unsupported moist air enthalpy formula: ${String(formula)}`);
  }
}

/**
 * Gets the active enthalpy-to-specific-humidity delegate.
 * @internal
 */
export function getActiveEnthalpyToSpecificHumidityFunc(): (e: number, temperature: number) => number {
  return activeEnthalpyToSpecificHumidityFunc;
}

/**
 * Calculates specific humidity [g/kg] from enthalpy [kJ/kg] and temperature [°C]
 * using the active formula configured in `Initializer`.
 * @param e Enthalpy [kJ/kg].
 * @param temperature Temperature [°C].
 * @returns Specific humidity [g/kg].
 * @throws TypeError if any parameter is not a finite number.
 * @throws Error if temperature is outside valid range.
 */
export function enthalpyToSpecificHumidity(e: number, temperature: number): number {
  return activeEnthalpyToSpecificHumidityFunc(e, temperature);
}
