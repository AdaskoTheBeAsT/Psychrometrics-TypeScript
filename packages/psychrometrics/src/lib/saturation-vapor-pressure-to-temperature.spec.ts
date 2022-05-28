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
import { saturationVaporPressureToTemperature } from './saturation-vapor-pressure-to-temperature';
import { temperatureToSaturationVaporPressure } from './temperature-to-saturation-vapor-pressure';

describe('saturationVaporPressureToTemperature', () => {
  beforeAll(() => {
    Initializer.initialize(2);
  });

  it('should throw when temperature too high', () => {
    expect.hasAssertions();

    expect(() => saturationVaporPressureToTemperature(102000)).toThrowError();
  });

  it('should throw when temperature too low', () => {
    expect.hasAssertions();

    expect(() => saturationVaporPressureToTemperature(0.0001)).toThrowError();
  });

  it('should calculate when passing 0.0014049735954231866', () => {
    expect.hasAssertions();

    expect(saturationVaporPressureToTemperature(0.0014049735954231866)).toBe(-100);
  });

  it('should calculate when passing 611.2911778902558', () => {
    expect.hasAssertions();

    expect(saturationVaporPressureToTemperature(611.2911778902558)).toBe(0);
  });

  it('should calculate when passing 101416.99487195771', () => {
    expect.hasAssertions();

    expect(saturationVaporPressureToTemperature(101416.99487195771)).toBe(100);
  });

  it('should give same result when passing 20.5', () => {
    expect.hasAssertions();

    const press = temperatureToSaturationVaporPressure(20.5);

    expect(saturationVaporPressureToTemperature(press)).toBe(20.5);
  });

  it('should run 1000 loop for 20C', () => {
    let temperature = 20;
    for (let i = 0; i < 1000; i++) {
      const pressure = temperatureToSaturationVaporPressure(temperature);
      temperature = saturationVaporPressureToTemperature(pressure);
    }

    expect(temperature).toBe(20);
  });

  it('should run 1000 loop for -20C', () => {
    let temperature = -20;
    for (let i = 0; i < 1000; i++) {
      const pressure = temperatureToSaturationVaporPressure(temperature);
      temperature = saturationVaporPressureToTemperature(pressure);
    }

    expect(temperature).toBe(-20);
  });
});
