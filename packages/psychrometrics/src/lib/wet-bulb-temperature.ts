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
import { enthalpy, enthalpyToSpecificHumidity, enthalpyToTemperature } from './enthalpy';
import { temperatureToMaximumSpecificHumidity } from './temperature-to-maximum-specific-humidity';

const epsilon = 0.00001;

/**
 * Calculate wet bulb temperature from air pressure, temperature and specific humidity.
 * @param airPressure Air pressure in [Pa].
 * @param temperature Temperature in [°C].
 * @param specificHumidity Specific humidity in [g/kg].
 * @returns Wet bulb temperature in [°C].
 */
export function wetBulbTemperature(airPressure: number, temperature: number, specificHumidity: number): number {
  let temperaturePrev = temperature;
  let specificHumidityPrev = specificHumidity;
  if (temperature >= 0) {
    let temperatureDifference: number;
    let temperatureNext: number;
    do {
      const dp = dewPointTemperature(airPressure, specificHumidityPrev);
      temperatureDifference = (temperaturePrev - dp) / 2.0;
      if (temperaturePrev >= dp) {
        temperatureNext = temperaturePrev - Math.abs(temperatureDifference);
      } else {
        temperatureNext = temperaturePrev + Math.abs(temperatureDifference);
      }

      temperaturePrev = temperatureNext;
      specificHumidityPrev = enthalpyToSpecificHumidity(enthalpy(temperature, specificHumidity), temperaturePrev);
    } while (Math.abs(temperatureDifference) > epsilon);
  } else {
    let specificHumidityDifference;
    let specificHumidityNext;
    do {
      const maxSpecificHumidity = temperatureToMaximumSpecificHumidity(airPressure, temperaturePrev);
      specificHumidityDifference = (maxSpecificHumidity - specificHumidityPrev) / 2.0;
      if (specificHumidityPrev >= maxSpecificHumidity) {
        specificHumidityNext = specificHumidityPrev - Math.abs(specificHumidityDifference);
      } else {
        specificHumidityNext = specificHumidityPrev + Math.abs(specificHumidityDifference);
      }

      specificHumidityPrev = specificHumidityNext;
      temperaturePrev = enthalpyToTemperature(enthalpy(temperature, specificHumidity), specificHumidityPrev);
    } while (Math.abs(specificHumidityDifference) > epsilon);
  }

  return temperaturePrev;
}
