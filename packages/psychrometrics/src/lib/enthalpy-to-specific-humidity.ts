import {
  EvaporationHeat,
  SpecificHeatCapacityOfAirBelowZero,
  SpecificHeatCapacityOfAirEqAboveZero,
  SpecificHeatCapacityOfWater,
} from './constants';

/**
 * Calculates specific humidity [g/kg] from enthalpy [kJ/kg] and temperature [°C].
 * @param e Enthalpy [kJ/kg].
 * @param temperature Temperature [°C].
 * @returns Specific humidity [g/kg].
 */
export function enthalpyToSpecificHumidity(e: number, temperature: number): number {
  let specificHumidityNormalized = 0;
  if (temperature >= 0) {
    specificHumidityNormalized =
      (e - SpecificHeatCapacityOfAirEqAboveZero * temperature + 0.026) /
      (EvaporationHeat + SpecificHeatCapacityOfWater * temperature);
  } else {
    specificHumidityNormalized =
      (e - SpecificHeatCapacityOfAirBelowZero * temperature) /
      (EvaporationHeat + SpecificHeatCapacityOfWater * temperature);
  }
  return specificHumidityNormalized * 1000;
}
