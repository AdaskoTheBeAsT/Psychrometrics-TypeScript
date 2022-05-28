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

import { absoluteToRelativeHumidity } from './absolute-to-relative-humidity';

describe('absoluteToRelativeHumidity', () => {
  const testCases = [
    [101325, 20, 8.736841601662796, 59.99999999999999],
    [101325, -20, 0.3804182346564335, 59.999999999999986],
  ];

  it.each(testCases)(
    'given air pressure=%p temperature=%p absolute humidity=%p returns %p',
    (airPressure, temperature, absoluteHumidity, expected) => {
      const relativeHumidity = absoluteToRelativeHumidity(airPressure, temperature, absoluteHumidity);

      expect(relativeHumidity).toBe(expected);
    }
  );
});
