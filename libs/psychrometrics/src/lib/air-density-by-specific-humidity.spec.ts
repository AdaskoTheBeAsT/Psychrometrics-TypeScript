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

import { airDensityBySpecificHumidity } from './air-density-by-specific-humidity';

describe('airDensityBySpecificHumidity', () => {
  const testCases = [
    [101325, 20, 8.736841601662796, 1.1977919138004267],
    [101325, 0, 3.7751266016292133, 1.2893138971367555],
    [101325, -20, 0.3804182346564335, 1.3940333566475471],
  ];

  it.each(testCases)(
    'given air pressure=%p temperature=%p specific humidity=%p returns %p',
    (airPressure, temperature, specificHumidity, expected) => {
      const density = airDensityBySpecificHumidity(airPressure, temperature, specificHumidity);

      expect(density).toBe(expected);
    }
  );
});
