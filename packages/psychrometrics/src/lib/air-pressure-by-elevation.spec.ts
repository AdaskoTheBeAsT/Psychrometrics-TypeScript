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

import { airPressureByElevation } from './air-pressure-by-elevation';

describe('airPressureByElevation', () => {
  it('should throw when height too high', () => {
    expect.hasAssertions();

    expect(() => airPressureByElevation(9000)).toThrowError();
  });

  it('should throw when height too low', () => {
    expect.hasAssertions();

    expect(() => airPressureByElevation(-500)).toThrowError();
  });

  it('should calculate when passing 8848', () => {
    expect.hasAssertions();

    expect(airPressureByElevation(8848)).toBe(31444.626324128334);
  });

  it('should calculate when passing -430.5', () => {
    expect.hasAssertions();

    expect(airPressureByElevation(-430.5)).toBe(106604.5657108011);
  });
});
