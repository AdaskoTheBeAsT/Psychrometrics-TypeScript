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

import { elevationByAirPressure } from './elevation-by-air-pressure';

describe('elevationByAirPressure', () => {
  it('should throw when air press too high', () => {
    expect.hasAssertions();

    expect(() => elevationByAirPressure(107000)).toThrowError();
  });

  it('should throw when air press too low', () => {
    expect.hasAssertions();

    expect(() => elevationByAirPressure(30000)).toThrowError();
  });

  it('should calculate when passing 31444.626324128334', () => {
    expect.hasAssertions();

    expect(elevationByAirPressure(31444.626324128334)).toBe(8848);
  });

  it('should calculate when passing 106604.5657108011', () => {
    expect.hasAssertions();

    expect(elevationByAirPressure(106604.5657108011)).toBe(-430.4999999999994);
  });
});
