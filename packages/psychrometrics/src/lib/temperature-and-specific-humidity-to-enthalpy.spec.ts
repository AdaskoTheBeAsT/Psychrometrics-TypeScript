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

import { temperatureAndSpecificHumidityToEnthalpy } from './temperature-and-specific-humidity-to-enthalpy';

describe('temperatureAndSpecificHumidityToEnthalpy', () => {
  const testCases = [
    [32, 18.038226360479687, 78.347492082141],
    [20, 8.736841601662796, 42.28624082757868],
    [-20, 0.3804182346564335, -19.18230709339536],
  ];

  it.each(testCases)(
    'given temperature=%p specific humidity=%p returns %p',
    (temperature, specificHumidity, expected) => {
      const enthalpy = temperatureAndSpecificHumidityToEnthalpy(temperature, specificHumidity);

      expect(enthalpy).toBe(expected);
    }
  );
});
