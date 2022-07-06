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
  EvaporationHeat,
  SpecificHeatCapacityOfAirBelowZero,
  SpecificHeatCapacityOfAirEqAboveZero,
  SpecificHeatCapacityOfWater,
} from './constants';

/**
 * Calculates enthalpy [J/kg] from temperature [°C] and specific humidity [g/kg].
 * @param temperature Temperature [°C].
 * @param specificHumidity Specific humidity [g/kg].
 * @returns Enthalpy [kJ/kg].
 */
export function enthalpy(temperature: number, specificHumidity: number): number {
  const specificHumidityNormalized = specificHumidity / 1000;
  if (temperature >= 0) {
    return (
      SpecificHeatCapacityOfAirEqAboveZero * temperature -
      0.026 +
      specificHumidityNormalized * (EvaporationHeat + SpecificHeatCapacityOfWater * temperature)
    );
  }

  return (
    SpecificHeatCapacityOfAirBelowZero * temperature +
    specificHumidityNormalized * (EvaporationHeat + SpecificHeatCapacityOfWater * temperature)
  );
}

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

  const t2 =
    (e - EvaporationHeat * specificHumidityNormalized) /
    (SpecificHeatCapacityOfAirBelowZero + SpecificHeatCapacityOfWater * specificHumidityNormalized);

  if (t1 >= 0) {
    return t1;
  }

  return t2;
}
