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
import { validateSpecificHumidity, validateTemperature } from './validation';

function calculateLinearEnthalpy(
  temperature: number,
  specificHumidity: number,
  cpDryAir: number,
  cpWaterVapor: number,
): number {
  validateTemperature(temperature);
  validateSpecificHumidity(specificHumidity);
  const specificHumidityNormalized = specificHumidity / 1000;
  return cpDryAir * temperature + specificHumidityNormalized * (EVAPORATION_HEAT + cpWaterVapor * temperature);
}

function calculatePiecewiseGluckEnthalpy(
  temperature: number,
  specificHumidity: number,
  thresholdTemperature: number,
): number {
  validateTemperature(temperature);
  validateSpecificHumidity(specificHumidity);
  const specificHumidityNormalized = specificHumidity / 1000;
  const vaporEnthalpy =
    specificHumidityNormalized * (EVAPORATION_HEAT + SPECIFIC_HEAT_CAPACITY_OF_WATER_VAPOR_LEGACY * temperature);

  if (temperature >= thresholdTemperature) {
    return (
      SPECIFIC_HEAT_CAPACITY_OF_DRY_AIR_GLUCK_ABOVE_THRESHOLD * temperature -
      GLUCK_DRY_AIR_ENTHALPY_OFFSET +
      vaporEnthalpy
    );
  }

  return SPECIFIC_HEAT_CAPACITY_OF_DRY_AIR_EUROVENT * temperature + vaporEnthalpy;
}

/**
 * Calculates moist air specific enthalpy [kJ/kg dry air] using the Recknagel / VDI 4670 / Eurovent formula:
 * `h = 1.005 * t + (x / 1000) * (2501.0 + 1.86 * t)`.
 */
export function enthalpyRecknagel(temperature: number, specificHumidity: number): number {
  return calculateLinearEnthalpy(
    temperature,
    specificHumidity,
    SPECIFIC_HEAT_CAPACITY_OF_DRY_AIR_EUROVENT,
    SPECIFIC_HEAT_CAPACITY_OF_WATER_VAPOR_STANDARD,
  );
}

/**
 * Calculates moist air specific enthalpy [kJ/kg dry air] using the ASHRAE Fundamentals formula:
 * `h = 1.006 * t + (x / 1000) * (2501.0 + 1.86 * t)`.
 */
export function enthalpyAshrae(temperature: number, specificHumidity: number): number {
  return calculateLinearEnthalpy(
    temperature,
    specificHumidity,
    SPECIFIC_HEAT_CAPACITY_OF_DRY_AIR_ASHRAE,
    SPECIFIC_HEAT_CAPACITY_OF_WATER_VAPOR_STANDARD,
  );
}

/**
 * Calculates moist air specific enthalpy [kJ/kg dry air] using Bernd Glück's (1991) piecewise-linear formula
 * switching at `t = 13 °C` (`1.005 * t` for `t < 13 °C`, `1.007 * t - 0.026` for `t >= 13 °C`, `c_p,w = 1.84`).
 */
export function enthalpyGluck(temperature: number, specificHumidity: number): number {
  return calculatePiecewiseGluckEnthalpy(temperature, specificHumidity, GLUCK_DRY_AIR_TEMPERATURE_THRESHOLD);
}

/**
 * Calculates moist air specific enthalpy [kJ/kg dry air] using the legacy Glück adaptation switching at `t = 0 °C`
 * (`1.005 * t` for `t < 0 °C`, `1.007 * t - 0.026` for `t >= 0 °C`, `c_p,w = 1.84`).
 */
export function enthalpyGluckLegacy(temperature: number, specificHumidity: number): number {
  return calculatePiecewiseGluckEnthalpy(temperature, specificHumidity, 0);
}

/**
 * Calculates moist air specific enthalpy [kJ/kg dry air] using the classic European Mollier `i-x` formula:
 * `h = 1.005 * t + (x / 1000) * (2501.0 + 1.84 * t)`.
 */
export function enthalpyMollierLegacy(temperature: number, specificHumidity: number): number {
  return calculateLinearEnthalpy(
    temperature,
    specificHumidity,
    SPECIFIC_HEAT_CAPACITY_OF_DRY_AIR_EUROVENT,
    SPECIFIC_HEAT_CAPACITY_OF_WATER_VAPOR_LEGACY,
  );
}

let activeEnthalpyFunc: (temperature: number, specificHumidity: number) => number = enthalpyRecknagel;

/**
 * Configures the active enthalpy delegate.
 * @internal
 */
export function setActiveEnthalpyFormula(formula: MoistAirEnthalpyFormula): void {
  switch (formula) {
    case MoistAirEnthalpyFormula.Recknagel:
      activeEnthalpyFunc = enthalpyRecknagel;
      break;
    case MoistAirEnthalpyFormula.Ashrae:
      activeEnthalpyFunc = enthalpyAshrae;
      break;
    case MoistAirEnthalpyFormula.Gluck:
      activeEnthalpyFunc = enthalpyGluck;
      break;
    case MoistAirEnthalpyFormula.GluckLegacy:
      activeEnthalpyFunc = enthalpyGluckLegacy;
      break;
    case MoistAirEnthalpyFormula.MollierLegacy:
      activeEnthalpyFunc = enthalpyMollierLegacy;
      break;
    default:
      throw new RangeError(`Unsupported moist air enthalpy formula: ${String(formula)}`);
  }
}

/**
 * Gets the active enthalpy delegate.
 * @internal
 */
export function getActiveEnthalpyFunc(): (temperature: number, specificHumidity: number) => number {
  return activeEnthalpyFunc;
}

/**
 * Calculates enthalpy [kJ/kg] from temperature [°C] and specific humidity [g/kg]
 * using the active formula configured in `Initializer`.
 * @param temperature Temperature [°C].
 * @param specificHumidity Specific humidity [g/kg].
 * @returns Enthalpy [kJ/kg].
 * @throws TypeError if any parameter is not a finite number.
 * @throws Error if any parameter is outside valid range.
 */
export function enthalpy(temperature: number, specificHumidity: number): number {
  return activeEnthalpyFunc(temperature, specificHumidity);
}
