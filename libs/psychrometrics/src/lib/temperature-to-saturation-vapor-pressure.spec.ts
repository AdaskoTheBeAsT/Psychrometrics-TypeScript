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

import {
  temperatureToSaturationVaporPressure,
  temperatureToSaturationVaporPressureAshraeHylandWexler,
  temperatureToSaturationVaporPressureHuang2018,
  temperatureToSaturationVaporPressureIapws95MurphyKoop,
  temperatureToSaturationVaporPressureMagnusTetens,
  temperatureToSaturationVaporPressureOfIce,
  temperatureToSaturationVaporPressureOfWater,
} from './temperature-to-saturation-vapor-pressure';

describe('temperatureToSaturationVaporPressureOfIce', () => {
  it('should throw when temperature too high', () => {
    expect.hasAssertions();

    expect(() => temperatureToSaturationVaporPressureOfIce(20)).toThrow();
  });
});

describe('temperatureToSaturationVaporPressureOfWater', () => {
  it('should throw when temperature too low', () => {
    expect.hasAssertions();

    expect(() => temperatureToSaturationVaporPressureOfWater(-20)).toThrow();
  });
});

describe('temperatureToSaturationVaporPressure', () => {
  it('should throw when temperature too high', () => {
    expect.hasAssertions();

    expect(() => temperatureToSaturationVaporPressure(102)).toThrow();
  });

  it('should throw when temperature too low', () => {
    expect.hasAssertions();

    expect(() => temperatureToSaturationVaporPressure(-102)).toThrow();
  });

  it('should calculate Huang2018 when passing -100, 0, and 100', () => {
    expect.hasAssertions();

    expect(temperatureToSaturationVaporPressureHuang2018(-100)).toBe(0.0014049735954231866);
    expect(temperatureToSaturationVaporPressureHuang2018(0)).toBe(611.2911778902558);
    expect(temperatureToSaturationVaporPressureHuang2018(100)).toBe(101416.99487195771);
  });

  it('should calculate MagnusTetens by default at 0°C (610.5 Pa)', () => {
    expect.hasAssertions();

    expect(temperatureToSaturationVaporPressure(0)).toBe(610.5);
    expect(temperatureToSaturationVaporPressureMagnusTetens(0)).toBe(610.5);
  });

  it('should calculate AshraeHylandWexler and Iapws95MurphyKoop at 0°C and 20°C', () => {
    expect.hasAssertions();

    expect(temperatureToSaturationVaporPressureAshraeHylandWexler(0)).toBeCloseTo(611.15, 0);
    expect(temperatureToSaturationVaporPressureIapws95MurphyKoop(0)).toBeCloseTo(611.65, 0);
    expect(temperatureToSaturationVaporPressureAshraeHylandWexler(20)).toBeCloseTo(2338.8, 0);
    expect(temperatureToSaturationVaporPressureIapws95MurphyKoop(20)).toBeCloseTo(2339.3, 0);
  });
});
