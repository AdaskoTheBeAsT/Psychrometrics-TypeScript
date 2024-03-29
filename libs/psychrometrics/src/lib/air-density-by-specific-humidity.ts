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

import { GAS_CONSTANT_FOR_DRY_AIR, MOLAR_MASS_OF_DRY_AIR, MOLAR_MASS_OF_WATER_VAPOR } from './constants';

/**
 * Calculates air density by specific humidity [kg/m³].
 * @param airPressure Air pressure [Pa].
 * @param temperature Temperature [°C].
 * @param specificHumidity Specific humidity [g/kg].
 * @returns Air density [kg/m³].
 */
export function airDensityBySpecificHumidity(
  airPressure: number,
  temperature: number,
  specificHumidity: number
): number {
  const specificHumidityNormalized = specificHumidity / 1000;
  const temperatureKelvin = temperature + 273.15;
  return (
    ((1 + specificHumidityNormalized) * airPressure) /
    (GAS_CONSTANT_FOR_DRY_AIR *
      temperatureKelvin *
      (1 + (MOLAR_MASS_OF_DRY_AIR / MOLAR_MASS_OF_WATER_VAPOR) * specificHumidityNormalized))
  );
}
