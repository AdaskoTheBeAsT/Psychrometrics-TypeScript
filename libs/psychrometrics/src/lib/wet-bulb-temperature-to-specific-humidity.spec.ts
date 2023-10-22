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

import { Initializer } from './initializer';
import { wetBulbTemperatureToSpecificHumidity } from './wet-bulb-temperature-to-specific-humidity';

describe('wetBulbTemperatureToSpecificHumidity', () => {
  beforeAll(() => {
    Initializer.initialize(2);
  });

  const testCases = [
    [101325, 20, 15.09927747192241, 8.73684239897718],
    [101325, 0, 0, 3.775126601629213],
    [101325, -20, -20.542690827750253, 0.3804224088580431],
  ];

  it.each(testCases)(
    'given air pressure=%p temperature=%p wet bulb temperature=%p returns %p',
    (airPressure, temperature, wetBulbTemperature, expected) => {
      const wbt = wetBulbTemperatureToSpecificHumidity(airPressure, temperature, wetBulbTemperature);

      expect(wbt).toBe(expected);
    }
  );
});
