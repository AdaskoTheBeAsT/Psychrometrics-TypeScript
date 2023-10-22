import {
  EVAPORATION_HEAT,
  SPECIFIC_HEAT_CAPACITY_OF_AIR_BELOW_ZERO,
  SPECIFIC_HEAT_CAPACITY_OF_AIR_EQ_ABOVE_ZERO,
  SPECIFIC_HEAT_CAPACITY_OF_WATER,
} from './constants';

/**
 * Calculates temperature [°C] from enthalpy [kJ/kg] and specific humidity [g/kg].
 * @param e Enthalpy [kJ/kg].
 * @param specificHumidity Specific humidity [g/kg].
 * @returns Temperature [°C]
 */
export function enthalpyToTemperature(e: number, specificHumidity: number): number {
  const specificHumidityNormalized = specificHumidity / 1000;
  const t1 =
    (e + 0.026 - EVAPORATION_HEAT * specificHumidityNormalized) /
    (SPECIFIC_HEAT_CAPACITY_OF_AIR_EQ_ABOVE_ZERO + SPECIFIC_HEAT_CAPACITY_OF_WATER * specificHumidityNormalized);

  if (t1 >= 0) {
    return t1;
  }

  return (
    (e - EVAPORATION_HEAT * specificHumidityNormalized) /
    (SPECIFIC_HEAT_CAPACITY_OF_AIR_BELOW_ZERO + SPECIFIC_HEAT_CAPACITY_OF_WATER * specificHumidityNormalized)
  );
}
