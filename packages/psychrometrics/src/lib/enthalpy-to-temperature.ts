import {
  EvaporationHeat,
  SpecificHeatCapacityOfAirBelowZero,
  SpecificHeatCapacityOfAirEqAboveZero,
  SpecificHeatCapacityOfWater,
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
    (e + 0.026 - EvaporationHeat * specificHumidityNormalized) /
    (SpecificHeatCapacityOfAirEqAboveZero + SpecificHeatCapacityOfWater * specificHumidityNormalized);

  if (t1 >= 0) {
    return t1;
  }

  return (
    (e - EvaporationHeat * specificHumidityNormalized) /
    (SpecificHeatCapacityOfAirBelowZero + SpecificHeatCapacityOfWater * specificHumidityNormalized)
  );
}
