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

import { enthalpy, enthalpyToSpecificHumidity, enthalpyToTemperature } from './enthalpy';

describe('enthalpy', () => {
  const testCases = [
    [0, 0, -0.026],
    [0, 0.1, 0.2241],
    [0, 3.7751266016292133, 9.415591630674662],
    [-1, 0, -1.005],
    [-1, 3.4738170173133707, 7.676624536988883],
    [20, 8.736841601662796, 42.28635661669985],
    [-20, 0.3804182346564335, -19.162573386159615],
  ];

  it.each(testCases)(
    'given temperature=%p specific humidity=%p returns %p',
    (temperature, specificHumidity, expected) => {
      const e = enthalpy(temperature, specificHumidity);

      expect(e).toBe(expected);
    }
  );
});

describe('enthalpyToSpecificHumidity', () => {
  const testCases = [
    [-0.026, 0, 0],
    [0.2241, 0, 0.09999999999999999],
    [9.415591630674662, 0, 3.775126601629213],
    [-1.005, -1, 0],
    [7.676624536988883, -1, 3.4738170173133707],
    [42.28635661669985, 20, 8.736841601662798],
    [-19.162573386159615, -20, 0.3804182346564335],
  ];

  it.each(testCases)('given enthalpy=%p temperature=%p returns %p', (e, temperature, expected) => {
    const specificHumidity = enthalpyToSpecificHumidity(e, temperature);

    expect(specificHumidity).toBe(expected);
  });
});

describe('enthalpyToTemperature', () => {
  const testCases = [
    [-0.026, 0, 0],
    [0.2241, 0.1, 0],
    [9.415591630674662, 3.7751266016292133, 0],
    [-1.005, 0, -1],
    [7.676624536988883, 3.4738170173133707, -1.0000000000000002],
    [42.28635661669985, 8.736841601662796, 20.00000000000001],
    [-19.162573386159615, 0.3804182346564335, -20],
  ];

  it.each(testCases)('given enthalpy=%p specific humidity=%p returns %p', (e, specificHumidity, expected) => {
    const temperature = enthalpyToTemperature(e, specificHumidity);

    expect(temperature).toBe(expected);
  });
});