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

/**
 * Validates that air pressure is positive and within reasonable bounds.
 * @param airPressure Air pressure [Pa].
 * @param paramName Optional parameter name for error message.
 * @throws Error if air pressure is invalid.
 */
export function validateAirPressure(airPressure: number, paramName = 'airPressure'): void {
  if (!Number.isFinite(airPressure)) {
    throw new TypeError(`${paramName} must be a finite number.`);
  }
  if (airPressure <= 0) {
    throw new Error(`${paramName} must be positive. Received: ${airPressure} Pa.`);
  }
}

/**
 * Validates that relative humidity is within 0-100% range.
 * @param relativeHumidity Relative humidity [%].
 * @param paramName Optional parameter name for error message.
 * @throws Error if relative humidity is invalid.
 */
export function validateRelativeHumidity(relativeHumidity: number, paramName = 'relativeHumidity'): void {
  if (!Number.isFinite(relativeHumidity)) {
    throw new TypeError(`${paramName} must be a finite number.`);
  }
  if (relativeHumidity < 0 || relativeHumidity > 100) {
    throw new Error(`${paramName} must be between 0 and 100%. Received: ${relativeHumidity}%.`);
  }
}

/**
 * Validates that specific humidity is non-negative.
 * @param specificHumidity Specific humidity [g/kg].
 * @param paramName Optional parameter name for error message.
 * @throws Error if specific humidity is invalid.
 */
export function validateSpecificHumidity(specificHumidity: number, paramName = 'specificHumidity'): void {
  if (!Number.isFinite(specificHumidity)) {
    throw new TypeError(`${paramName} must be a finite number.`);
  }
  if (specificHumidity < 0) {
    throw new Error(`${paramName} must be non-negative. Received: ${specificHumidity} g/kg.`);
  }
}

/**
 * Validates that temperature is within valid range for psychrometric calculations.
 * @param temperature Temperature [°C].
 * @param min Minimum allowed temperature [°C].
 * @param max Maximum allowed temperature [°C].
 * @param paramName Optional parameter name for error message.
 * @throws Error if temperature is invalid.
 */
export function validateTemperature(temperature: number, min = -100, max = 100, paramName = 'temperature'): void {
  if (!Number.isFinite(temperature)) {
    throw new TypeError(`${paramName} must be a finite number.`);
  }
  if (temperature < min || temperature > max) {
    throw new Error(`${paramName} must be between ${min}°C and ${max}°C. Received: ${temperature}°C.`);
  }
}

/**
 * Validates that enthalpy is a finite number.
 * @param enthalpy Enthalpy [kJ/kg].
 * @param paramName Optional parameter name for error message.
 * @throws Error if enthalpy is invalid.
 */
export function validateEnthalpy(enthalpy: number, paramName = 'enthalpy'): void {
  if (!Number.isFinite(enthalpy)) {
    throw new TypeError(`${paramName} must be a finite number.`);
  }
}

/**
 * Validates that wet bulb temperature is valid relative to dry bulb temperature.
 * Wet bulb temperature must be less than or equal to dry bulb temperature.
 * @param wetBulbTemp Wet bulb temperature [°C].
 * @param dryBulbTemp Dry bulb temperature [°C].
 * @throws Error if wet bulb temperature is invalid.
 */
export function validateWetBulbTemperature(wetBulbTemp: number, dryBulbTemp: number): void {
  validateTemperature(wetBulbTemp, -100, 100, 'wetBulbTemperature');
  if (wetBulbTemp > dryBulbTemp) {
    throw new Error(`Wet bulb temperature (${wetBulbTemp}°C) cannot exceed dry bulb temperature (${dryBulbTemp}°C).`);
  }
}

/**
 * Checks if saturation vapor pressure is approaching or exceeding air pressure,
 * which would cause division by zero or invalid results.
 * @param saturationVaporPressure Saturation vapor pressure [Pa].
 * @param airPressure Air pressure [Pa].
 * @throws Error if the condition would cause invalid calculations.
 */
export function validatePressureRatio(saturationVaporPressure: number, airPressure: number): void {
  if (saturationVaporPressure >= airPressure) {
    throw new Error(
      `Saturation vapor pressure (${saturationVaporPressure} Pa) must be less than air pressure (${airPressure} Pa). ` +
        `This condition typically occurs at very high temperatures or very low air pressures.`,
    );
  }
  // Warn if getting close to the limit (within 1%)
  const ratio = saturationVaporPressure / airPressure;
  if (ratio > 0.99) {
    throw new Error(
      `Saturation vapor pressure is too close to air pressure (ratio: ${ratio.toFixed(4)}). ` +
        `Results may be unreliable.`,
    );
  }
}
