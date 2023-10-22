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

import { altitudeToAirPressure } from './altitude-to-air-pressure';

describe('elevationToAirPressure', () => {
  it('should throw when height too high', () => {
    expect.hasAssertions();

    expect(() => altitudeToAirPressure(9000)).toThrow();
  });

  it('should throw when height too low', () => {
    expect.hasAssertions();

    expect(() => altitudeToAirPressure(-500)).toThrow();
  });

  it('should calculate when passing 8848', () => {
    expect.hasAssertions();

    expect(altitudeToAirPressure(8848)).toBe(31444.24523603051);
  });

  it('should calculate when passing -430.5', () => {
    expect.hasAssertions();

    expect(altitudeToAirPressure(-430.5)).toBe(106604.6217946672);
  });
});
