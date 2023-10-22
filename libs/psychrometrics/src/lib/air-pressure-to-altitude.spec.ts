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

import { airPressureToAltitude } from './air-pressure-to-altitude';

describe('airPressureToElevation', () => {
  it('should throw when air press too high', () => {
    expect.hasAssertions();

    expect(() => airPressureToAltitude(107000)).toThrow();
  });

  it('should throw when air press too low', () => {
    expect.hasAssertions();

    expect(() => airPressureToAltitude(30000)).toThrow();
  });

  it('should calculate when passing 31444.24523603051', () => {
    expect.hasAssertions();

    expect(airPressureToAltitude(31444.24523603051)).toBe(8847.999999999998);
  });

  it('should calculate when passing 106604.6217946672', () => {
    expect.hasAssertions();

    expect(airPressureToAltitude(106604.6217946672)).toBe(-430.5000000000028);
  });
});
