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

import { relativeToAbsoluteHumidity } from './relative-to-absolute-humidity';

describe('absoluteToRelativeHumidity', () => {
  const testCases = [
    [101325, 20, 60, 8.736841601662796],
    [101325, -20, 60, 0.3804182346564335],
  ];

  it.each(testCases)(
    'given air pressure=%p temperature=%p relative humidity=%p returns %p',
    (airPressure, temperature, relativeHumidity, expected) => {
      const absoluteHumidity = relativeToAbsoluteHumidity(airPressure, temperature, relativeHumidity);

      expect(absoluteHumidity).toBe(expected);
    }
  );
});
