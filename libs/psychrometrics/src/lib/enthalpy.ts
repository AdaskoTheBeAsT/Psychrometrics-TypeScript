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
  SPECIFIC_HEAT_CAPACITY_OF_AIR_BELOW_ZERO,
  SPECIFIC_HEAT_CAPACITY_OF_AIR_EQ_ABOVE_ZERO,
  SPECIFIC_HEAT_CAPACITY_OF_WATER,
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
      SPECIFIC_HEAT_CAPACITY_OF_AIR_EQ_ABOVE_ZERO * temperature -
      0.026 +
      specificHumidityNormalized * (EVAPORATION_HEAT + SPECIFIC_HEAT_CAPACITY_OF_WATER * temperature)
    );
  }

  return (
    SPECIFIC_HEAT_CAPACITY_OF_AIR_BELOW_ZERO * temperature +
    specificHumidityNormalized * (EVAPORATION_HEAT + SPECIFIC_HEAT_CAPACITY_OF_WATER * temperature)
  );
}
