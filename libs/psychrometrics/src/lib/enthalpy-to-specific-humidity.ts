import {
  EVAPORATION_HEAT,
  SPECIFIC_HEAT_CAPACITY_OF_AIR_BELOW_ZERO,
  SPECIFIC_HEAT_CAPACITY_OF_AIR_EQ_ABOVE_ZERO,
  SPECIFIC_HEAT_CAPACITY_OF_WATER,
} from './constants';
import { validateEnthalpy, validateTemperature } from './validation';

/**
 * Calculates specific humidity [g/kg] from enthalpy [kJ/kg] and temperature [°C].
 * @param e Enthalpy [kJ/kg].
 * @param temperature Temperature [°C].
 * @returns Specific humidity [g/kg].
 * @throws TypeError if any parameter is not a finite number.
 * @throws RangeError if temperature is outside valid range.
 */
export function enthalpyToSpecificHumidity(e: number, temperature: number): number {
  validateEnthalpy(e);
  validateTemperature(temperature);
  let specificHumidityNormalized = 0;
  if (temperature >= 0) {
    specificHumidityNormalized =
      (e - SPECIFIC_HEAT_CAPACITY_OF_AIR_EQ_ABOVE_ZERO * temperature + 0.026) /
      (EVAPORATION_HEAT + SPECIFIC_HEAT_CAPACITY_OF_WATER * temperature);
  } else {
    specificHumidityNormalized =
      (e - SPECIFIC_HEAT_CAPACITY_OF_AIR_BELOW_ZERO * temperature) /
      (EVAPORATION_HEAT + SPECIFIC_HEAT_CAPACITY_OF_WATER * temperature);
  }
  return specificHumidityNormalized * 1000;
}
