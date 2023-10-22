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

import { dewPointTemperature } from './dew-point-temperature';
import { enthalpy } from './enthalpy';
import { enthalpyToSpecificHumidity } from './enthalpy-to-specific-humidity';
import { enthalpyToTemperature } from './enthalpy-to-temperature';
import { temperatureToMaximumSpecificHumidity } from './temperature-to-maximum-specific-humidity';

/**
 * Calculate wet bulb temperature from air pressure, temperature and specific humidity.
 * @param airPressure Air pressure in [Pa].
 * @param temperature Temperature in [°C].
 * @param specificHumidity Specific humidity in [g/kg].
 * @returns Wet bulb temperature in [°C].
 */
export function wetBulbTemperature(
  airPressure: number,
  temperature: number,
  specificHumidity: number,
  epsilon = 0.00001
): number {
  let temperaturePrev = temperature;
  let specificHumidityPrev = specificHumidity;
  if (temperature >= 0) {
    let temperatureDifference: number;
    do {
      const dp = dewPointTemperature(airPressure, specificHumidityPrev);
      temperatureDifference = (temperaturePrev - dp) / 2.0;
      if (temperaturePrev >= dp) {
        temperaturePrev -= Math.abs(temperatureDifference);
      } else {
        temperaturePrev += Math.abs(temperatureDifference);
      }

      const ent = enthalpy(temperature, specificHumidity);
      specificHumidityPrev = enthalpyToSpecificHumidity(ent, temperaturePrev);
    } while (Math.abs(temperatureDifference) > epsilon);
  } else {
    let specificHumidityDifference;
    do {
      const maxSpecificHumidity = temperatureToMaximumSpecificHumidity(airPressure, temperaturePrev);
      specificHumidityDifference = (maxSpecificHumidity - specificHumidityPrev) / 2.0;
      if (specificHumidityPrev >= maxSpecificHumidity) {
        specificHumidityPrev -= Math.abs(specificHumidityDifference);
      } else {
        specificHumidityPrev += Math.abs(specificHumidityDifference);
      }

      const ent = enthalpy(temperature, specificHumidity);
      temperaturePrev = enthalpyToTemperature(ent, specificHumidityPrev);
    } while (Math.abs(specificHumidityDifference / specificHumidityPrev) > epsilon);
  }

  return temperaturePrev;
}
