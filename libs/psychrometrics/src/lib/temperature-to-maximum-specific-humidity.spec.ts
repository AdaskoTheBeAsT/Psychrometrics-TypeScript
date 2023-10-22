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

import { temperatureToMaximumSpecificHumidity } from './temperature-to-maximum-specific-humidity';

describe('temperatureToMaximumSpecificHumidity', () => {
  const testCases = [
    [101325, 20, 14.699054061706954],
    [101325, 0, 3.7751266016292133],
    [101325, -1, 3.4738170173133707],
    [101325, -20, 0.6342890248947272],
  ];

  it.each(testCases)('given air pressure=%p temperature=%p returns %p', (airPressure, temperature, expected) => {
    const specificHumidity = temperatureToMaximumSpecificHumidity(airPressure, temperature);

    expect(specificHumidity).toBe(expected);
  });
});
