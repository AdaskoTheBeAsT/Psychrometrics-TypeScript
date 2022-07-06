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
 * Calculate enthalpy from temperature and specific humidity.
 * @param temperature Temperature in [°C].
 * @param specificHumidity Specific humidity in [g/kg].
 * @returns Enthalpy in [kJ/kg].
 */
export function temperatureAndSpecificHumidityToEnthalpy(temperature: number, specificHumidity: number): number {
  const specificHumidityNormalized = specificHumidity / 1000.0;
  return 1.006 * temperature + specificHumidityNormalized * (2501.0 + 1.805 * temperature);
}
