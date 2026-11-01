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

import { KELVIN_CONST } from './constants';
import { SaturationVaporPressureFormula } from './saturation-vapor-pressure-formula';

// Magnus-Tetens coefficients (DIN EN ISO 13788:2012 Section 4.2.2; Tetens, 1930; Murray, 1967).
const MAGNUS_BASE_PRESSURE = 610.5;
const MAGNUS_WATER_A = 17.269;
const MAGNUS_WATER_B = 237.3;
const MAGNUS_ICE_A = 21.875;
const MAGNUS_ICE_B = 265.5;

// Huang (2018) coefficients (J. Appl. Meteor. Climatol., 57(6), 1265–1272, Eqs. 17 & 18).
const HUANG_WATER_A = 34.494;
const HUANG_WATER_B = 4924.99;
const HUANG_WATER_C = 237.1;
const HUANG_WATER_D = 105.0;
const HUANG_WATER_EXPONENT = 1.57;
const HUANG_ICE_A = 43.494;
const HUANG_ICE_B = 6545.8;
const HUANG_ICE_C = 278.0;
const HUANG_ICE_D = 868.0;

// ASHRAE Hyland & Wexler (1983) coefficients (ASHRAE Handbook — Fundamentals, Ch. 1, Eqs. 5 & 6).
const ASHRAE_ICE_C1 = -5.6745359e3;
const ASHRAE_ICE_C2 = 6.3925247;
const ASHRAE_ICE_C3 = -9.677843e-3;
const ASHRAE_ICE_C4 = 6.2215701e-7;
const ASHRAE_ICE_C5 = 2.0747825e-9;
const ASHRAE_ICE_C6 = -9.484024e-13;
const ASHRAE_ICE_C7 = 4.1635019;
const ASHRAE_WATER_C8 = -5.8002206e3;
const ASHRAE_WATER_C9 = 1.3914993;
const ASHRAE_WATER_C10 = -4.8640239e-2;
const ASHRAE_WATER_C11 = 4.1764768e-5;
const ASHRAE_WATER_C12 = -1.4452093e-8;
const ASHRAE_WATER_C13 = 6.5459673;

// IAPWS-95 Wagner & Pruß (2002) liquid water saturation coefficients (J. Phys. Chem. Ref. Data, 31(2), 387–535, Eq. 2.5).
const IAPWS_CRITICAL_TEMPERATURE = 647.096;
const IAPWS_CRITICAL_PRESSURE = 22064000.0;
const IAPWS_A1 = -7.85951783;
const IAPWS_A2 = 1.84408259;
const IAPWS_A3 = -11.7866497;
const IAPWS_A4 = 22.6807411;
const IAPWS_A5 = -15.9618719;
const IAPWS_A6 = 1.80122502;

// Murphy & Koop (2005) ice saturation coefficients (Q. J. R. Meteorol. Soc., 131(608), 1539–1565, Eq. 7).
const MURPHY_KOOP_A0 = 9.550426;
const MURPHY_KOOP_A1 = -5723.265;
const MURPHY_KOOP_A2 = 3.53068;
const MURPHY_KOOP_A3 = -0.00728332;

function validateWaterTemperature(temperature: number): void {
  if (!Number.isFinite(temperature)) {
    throw new TypeError('Temperature must be a finite number.');
  }
  if (temperature <= 0) {
    throw new RangeError(`Temperature too low (${temperature}°C). Must be greater than 0°C for water vapor pressure.`);
  }
  if (temperature > 100) {
    throw new RangeError(`Temperature too high (${temperature}°C). Must be at most 100°C for water vapor pressure.`);
  }
}

function validateIceTemperature(temperature: number): void {
  if (!Number.isFinite(temperature)) {
    throw new TypeError('Temperature must be a finite number.');
  }
  if (temperature > 0) {
    throw new RangeError(`Temperature too high (${temperature}°C). Must be at most 0°C for ice vapor pressure.`);
  }
  if (temperature < -100) {
    throw new RangeError(`Temperature too low (${temperature}°C). Must be at least -100°C for ice vapor pressure.`);
  }
}

function validateSaturationTemperature(temperature: number): void {
  if (!Number.isFinite(temperature)) {
    throw new TypeError('Temperature must be a finite number.');
  }
  if (temperature < -100 || temperature > 100) {
    throw new RangeError(`Temperature (${temperature}°C) is outside valid range. Must be between -100°C and 100°C.`);
  }
}

/**
 * Calculates saturation vapor pressure over liquid water [Pa] for a temperature in (0, 100] °C
 * using the Magnus-Tetens formulation: `P_ws(t) = 610.5 * exp(17.269 * t / (237.3 + t))`.
 *
 * Reference: DIN EN ISO 13788:2012, Section 4.2.2; Tetens, O. (1930), Z. Geophys., 6, 297–309;
 * Murray, F. W. (1967), J. Appl. Meteorol., 6, 203–204.
 */
export function temperatureToSaturationVaporPressureOfWaterMagnusTetens(temperature: number): number {
  validateWaterTemperature(temperature);
  return MAGNUS_BASE_PRESSURE * Math.exp((MAGNUS_WATER_A * temperature) / (MAGNUS_WATER_B + temperature));
}

/**
 * Calculates saturation vapor pressure over ice [Pa] for a temperature in [-100, 0] °C
 * using the Magnus-Tetens formulation: `P_wi(t) = 610.5 * exp(21.875 * t / (265.5 + t))`.
 *
 * Reference: DIN EN ISO 13788:2012, Section 4.2.2; Tetens, O. (1930), Z. Geophys., 6, 297–309;
 * Murray, F. W. (1967), J. Appl. Meteorol., 6, 203–204.
 */
export function temperatureToSaturationVaporPressureOfIceMagnusTetens(temperature: number): number {
  validateIceTemperature(temperature);
  return MAGNUS_BASE_PRESSURE * Math.exp((MAGNUS_ICE_A * temperature) / (MAGNUS_ICE_B + temperature));
}

/**
 * Calculates saturation vapor pressure of water or ice [Pa] for a temperature in [-100, 100] °C
 * using the Magnus-Tetens formulation (DIN EN ISO 13788:2012, Section 4.2.2; Tetens, 1930; Murray, 1967).
 */
export function temperatureToSaturationVaporPressureMagnusTetens(temperature: number): number {
  validateSaturationTemperature(temperature);
  return temperature > 0
    ? temperatureToSaturationVaporPressureOfWaterMagnusTetens(temperature)
    : temperatureToSaturationVaporPressureOfIceMagnusTetens(temperature);
}

/**
 * Calculates saturation vapor pressure over liquid water [Pa] for a temperature in (0, 100] °C
 * using Huang (2018), Equation 17: `P_ws(t) = exp(34.494 - 4924.99 / (t + 237.1)) / (t + 105.0)^1.57`.
 *
 * Reference: Huang, J. (2018), *A Simple Accurate Formula for Calculating Saturation Vapor Pressure of Water and Ice*,
 * Journal of Applied Meteorology and Climatology, 57(6), 1265–1272.
 */
export function temperatureToSaturationVaporPressureOfWaterHuang2018(temperature: number): number {
  validateWaterTemperature(temperature);
  return (
    Math.exp(HUANG_WATER_A - HUANG_WATER_B / (temperature + HUANG_WATER_C)) /
    Math.pow(temperature + HUANG_WATER_D, HUANG_WATER_EXPONENT)
  );
}

/**
 * Calculates saturation vapor pressure over ice [Pa] for a temperature in [-100, 0] °C
 * using Huang (2018), Equation 18: `P_wi(t) = exp(43.494 - 6545.8 / (t + 278.0)) / (t + 868.0)^2`.
 *
 * Reference: Huang, J. (2018), *A Simple Accurate Formula for Calculating Saturation Vapor Pressure of Water and Ice*,
 * Journal of Applied Meteorology and Climatology, 57(6), 1265–1272.
 */
export function temperatureToSaturationVaporPressureOfIceHuang2018(temperature: number): number {
  validateIceTemperature(temperature);
  const denom = temperature + HUANG_ICE_D;
  return Math.exp(HUANG_ICE_A - HUANG_ICE_B / (temperature + HUANG_ICE_C)) / (denom * denom);
}

/**
 * Calculates saturation vapor pressure of water or ice [Pa] for a temperature in [-100, 100] °C
 * using Huang (2018), J. Appl. Meteor. Climatol., 57(6), 1265–1272, Equations 17 and 18.
 */
export function temperatureToSaturationVaporPressureHuang2018(temperature: number): number {
  validateSaturationTemperature(temperature);
  return temperature > 0
    ? temperatureToSaturationVaporPressureOfWaterHuang2018(temperature)
    : temperatureToSaturationVaporPressureOfIceHuang2018(temperature);
}

/**
 * Calculates saturation vapor pressure over liquid water [Pa] for a temperature in (0, 100] °C
 * using ASHRAE Handbook — Fundamentals, Chapter 1, Equation 6 (Hyland and Wexler, 1983, ASHRAE Transactions, 89(2A), 500–519).
 */
export function temperatureToSaturationVaporPressureOfWaterAshraeHylandWexler(temperature: number): number {
  validateWaterTemperature(temperature);
  const tK = temperature + KELVIN_CONST;
  const lnP =
    ASHRAE_WATER_C8 / tK +
    ASHRAE_WATER_C9 +
    tK * (ASHRAE_WATER_C10 + tK * (ASHRAE_WATER_C11 + ASHRAE_WATER_C12 * tK)) +
    ASHRAE_WATER_C13 * Math.log(tK);
  return Math.exp(lnP);
}

/**
 * Calculates saturation vapor pressure over ice [Pa] for a temperature in [-100, 0] °C
 * using ASHRAE Handbook — Fundamentals, Chapter 1, Equation 5 (Hyland and Wexler, 1983, ASHRAE Transactions, 89(2A), 500–519).
 */
export function temperatureToSaturationVaporPressureOfIceAshraeHylandWexler(temperature: number): number {
  validateIceTemperature(temperature);
  const tK = temperature + KELVIN_CONST;
  const lnP =
    ASHRAE_ICE_C1 / tK +
    ASHRAE_ICE_C2 +
    tK * (ASHRAE_ICE_C3 + tK * (ASHRAE_ICE_C4 + tK * (ASHRAE_ICE_C5 + ASHRAE_ICE_C6 * tK))) +
    ASHRAE_ICE_C7 * Math.log(tK);
  return Math.exp(lnP);
}

/**
 * Calculates saturation vapor pressure of water or ice [Pa] for a temperature in [-100, 100] °C
 * using the ASHRAE Hyland and Wexler (1983) formulation (ASHRAE Handbook — Fundamentals, Chapter 1, Equations 5 and 6).
 */
export function temperatureToSaturationVaporPressureAshraeHylandWexler(temperature: number): number {
  validateSaturationTemperature(temperature);
  return temperature > 0
    ? temperatureToSaturationVaporPressureOfWaterAshraeHylandWexler(temperature)
    : temperatureToSaturationVaporPressureOfIceAshraeHylandWexler(temperature);
}

/**
 * Calculates saturation vapor pressure over liquid water [Pa] for a temperature in (0, 100] °C
 * using the IAPWS-95 Wagner and Pruß (2002) six-term formulation (J. Phys. Chem. Ref. Data, 31(2), 387–535, Section 2.5, Equation 2.5).
 */
export function temperatureToSaturationVaporPressureOfWaterIapws95(temperature: number): number {
  validateWaterTemperature(temperature);
  const tK = temperature + KELVIN_CONST;
  const tau = 1.0 - tK / IAPWS_CRITICAL_TEMPERATURE;
  const tauSqrt = Math.sqrt(tau);
  const tau15 = tau * tauSqrt;
  const tau2 = tau * tau;
  const tau3 = tau2 * tau;
  const tau35 = tau3 * tauSqrt;
  const tau4 = tau2 * tau2;
  const tau75 = tau4 * tau35;

  const exponent =
    (IAPWS_CRITICAL_TEMPERATURE / tK) *
    (IAPWS_A1 * tau + IAPWS_A2 * tau15 + IAPWS_A3 * tau3 + IAPWS_A4 * tau35 + IAPWS_A5 * tau4 + IAPWS_A6 * tau75);
  return IAPWS_CRITICAL_PRESSURE * Math.exp(exponent);
}

/**
 * Calculates saturation vapor pressure over ice [Pa] for a temperature in [-100, 0] °C
 * using Murphy and Koop (2005), Q. J. R. Meteorol. Soc., 131(608), 1539–1565, Equation 7.
 */
export function temperatureToSaturationVaporPressureOfIceMurphyKoop(temperature: number): number {
  validateIceTemperature(temperature);
  const tK = temperature + KELVIN_CONST;
  return Math.exp(MURPHY_KOOP_A0 + MURPHY_KOOP_A1 / tK + MURPHY_KOOP_A2 * Math.log(tK) + MURPHY_KOOP_A3 * tK);
}

/**
 * Calculates saturation vapor pressure of water or ice [Pa] for a temperature in [-100, 100] °C
 * using Wagner and Pruß (2002) IAPWS-95 for liquid water and Murphy and Koop (2005) for ice.
 */
export function temperatureToSaturationVaporPressureIapws95MurphyKoop(temperature: number): number {
  validateSaturationTemperature(temperature);
  return temperature > 0
    ? temperatureToSaturationVaporPressureOfWaterIapws95(temperature)
    : temperatureToSaturationVaporPressureOfIceMurphyKoop(temperature);
}

let activeSaturationVaporPressureOfWaterFunc: (temperature: number) => number =
  temperatureToSaturationVaporPressureOfWaterMagnusTetens;
let activeSaturationVaporPressureOfIceFunc: (temperature: number) => number =
  temperatureToSaturationVaporPressureOfIceMagnusTetens;
let activeSaturationVaporPressureFunc: (temperature: number) => number =
  temperatureToSaturationVaporPressureMagnusTetens;

/**
 * Configures active saturation vapor pressure functions.
 * @internal
 */
export function setActiveSaturationVaporPressureFormula(formula: SaturationVaporPressureFormula): void {
  switch (formula) {
    case SaturationVaporPressureFormula.MagnusTetens:
      activeSaturationVaporPressureOfWaterFunc = temperatureToSaturationVaporPressureOfWaterMagnusTetens;
      activeSaturationVaporPressureOfIceFunc = temperatureToSaturationVaporPressureOfIceMagnusTetens;
      activeSaturationVaporPressureFunc = temperatureToSaturationVaporPressureMagnusTetens;
      break;
    case SaturationVaporPressureFormula.Huang2018:
      activeSaturationVaporPressureOfWaterFunc = temperatureToSaturationVaporPressureOfWaterHuang2018;
      activeSaturationVaporPressureOfIceFunc = temperatureToSaturationVaporPressureOfIceHuang2018;
      activeSaturationVaporPressureFunc = temperatureToSaturationVaporPressureHuang2018;
      break;
    case SaturationVaporPressureFormula.AshraeHylandWexler:
      activeSaturationVaporPressureOfWaterFunc = temperatureToSaturationVaporPressureOfWaterAshraeHylandWexler;
      activeSaturationVaporPressureOfIceFunc = temperatureToSaturationVaporPressureOfIceAshraeHylandWexler;
      activeSaturationVaporPressureFunc = temperatureToSaturationVaporPressureAshraeHylandWexler;
      break;
    case SaturationVaporPressureFormula.Iapws95MurphyKoop:
      activeSaturationVaporPressureOfWaterFunc = temperatureToSaturationVaporPressureOfWaterIapws95;
      activeSaturationVaporPressureOfIceFunc = temperatureToSaturationVaporPressureOfIceMurphyKoop;
      activeSaturationVaporPressureFunc = temperatureToSaturationVaporPressureIapws95MurphyKoop;
      break;
    default:
      throw new RangeError(`Unsupported saturation vapor pressure formula: ${String(formula)}`);
  }
}

/**
 * Gets the active delegate for calculating saturation vapor pressure over liquid water [Pa].
 * @internal
 */
export function getActiveSaturationVaporPressureOfWaterFunc(): (temperature: number) => number {
  return activeSaturationVaporPressureOfWaterFunc;
}

/**
 * Gets the active delegate for calculating saturation vapor pressure over ice [Pa].
 * @internal
 */
export function getActiveSaturationVaporPressureOfIceFunc(): (temperature: number) => number {
  return activeSaturationVaporPressureOfIceFunc;
}

/**
 * Gets the active delegate for calculating saturation vapor pressure over water or ice [Pa].
 * @internal
 */
export function getActiveSaturationVaporPressureFunc(): (temperature: number) => number {
  return activeSaturationVaporPressureFunc;
}

/**
 * Converts temperature to saturation vapor pressure of water using the active formula configured in `Initializer`.
 * Valid for temperatures > 0°C and <= 100°C.
 * @param temperature Temperature [°C].
 * @returns Saturation vapor pressure of water [Pa].
 * @throws RangeError if temperature is outside valid range.
 */
export function temperatureToSaturationVaporPressureOfWater(temperature: number): number {
  return activeSaturationVaporPressureOfWaterFunc(temperature);
}

/**
 * Converts temperature to saturation vapor pressure of ice using the active formula configured in `Initializer`.
 * Valid for temperatures >= -100°C and <= 0°C.
 * @param temperature Temperature [°C].
 * @returns Saturation vapor pressure of ice [Pa].
 * @throws RangeError if temperature is outside valid range.
 */
export function temperatureToSaturationVaporPressureOfIce(temperature: number): number {
  return activeSaturationVaporPressureOfIceFunc(temperature);
}

/**
 * Converts temperature to saturation vapor pressure using the active formula configured in `Initializer`.
 * Uses ice formula for temperatures <= 0°C and water formula for temperatures > 0°C.
 * Valid for temperatures from -100°C to 100°C.
 * @param temperature Temperature [°C].
 * @returns Saturation vapor pressure [Pa].
 * @throws RangeError if temperature is outside valid range (-100°C to 100°C).
 */
export function temperatureToSaturationVaporPressure(temperature: number): number {
  return activeSaturationVaporPressureFunc(temperature);
}
