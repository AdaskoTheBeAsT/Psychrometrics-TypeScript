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

import { relativeToSpecificHumidity } from './relative-to-specific-humidity';

describe('specificToRelativeHumidity', () => {
  const testCases = [
    [101325, 32, 60, 18.038226360479687],
    [101325, 20, 60, 8.736841601662796],
    [101325, 0, 60, 2.2595900446069703],
    [101325, -20, 60, 0.3804182346564335],
    [101325, -50, 60, 0.014503477444163701],
  ];

  it.each(testCases)(
    'given air pressure=%p temperature=%p relative humidity=%p returns %p',
    (airPressure, temperature, relativeHumidity, expected) => {
      const specificHumidity = relativeToSpecificHumidity(airPressure, temperature, relativeHumidity);

      expect(specificHumidity).toBe(expected);
    }
  );
});
