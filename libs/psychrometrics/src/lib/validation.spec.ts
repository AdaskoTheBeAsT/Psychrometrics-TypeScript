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
  validateAirPressure,
  validateEnthalpy,
  validatePressureRatio,
  validateRelativeHumidity,
  validateSpecificHumidity,
  validateTemperature,
  validateWetBulbTemperature,
} from './validation';

describe('validateAirPressure', () => {
  it('should pass for valid pressure', () => {
    expect(() => validateAirPressure(101325)).not.toThrow();
    expect(() => validateAirPressure(50000)).not.toThrow();
    expect(() => validateAirPressure(0.001)).not.toThrow();
  });

  it('should throw TypeError for non-finite values', () => {
    expect(() => validateAirPressure(Number.NaN)).toThrow(TypeError);
    expect(() => validateAirPressure(Infinity)).toThrow(TypeError);
    expect(() => validateAirPressure(-Infinity)).toThrow(TypeError);
  });

  it('should throw Error for non-positive values', () => {
    expect(() => validateAirPressure(0)).toThrow();
    expect(() => validateAirPressure(-100)).toThrow();
  });
});

describe('validateRelativeHumidity', () => {
  it('should pass for valid humidity (0-100%)', () => {
    expect(() => validateRelativeHumidity(0)).not.toThrow();
    expect(() => validateRelativeHumidity(50)).not.toThrow();
    expect(() => validateRelativeHumidity(100)).not.toThrow();
  });

  it('should throw TypeError for non-finite values', () => {
    expect(() => validateRelativeHumidity(Number.NaN)).toThrow(TypeError);
  });

  it('should throw Error for out of range values', () => {
    expect(() => validateRelativeHumidity(-1)).toThrow();
    expect(() => validateRelativeHumidity(101)).toThrow();
  });
});

describe('validateSpecificHumidity', () => {
  it('should pass for valid humidity', () => {
    expect(() => validateSpecificHumidity(0)).not.toThrow();
    expect(() => validateSpecificHumidity(10)).not.toThrow();
    expect(() => validateSpecificHumidity(100)).not.toThrow();
  });

  it('should throw TypeError for non-finite values', () => {
    expect(() => validateSpecificHumidity(Number.NaN)).toThrow(TypeError);
  });

  it('should throw Error for negative values', () => {
    expect(() => validateSpecificHumidity(-1)).toThrow();
  });
});

describe('validateTemperature', () => {
  it('should pass for valid temperature', () => {
    expect(() => validateTemperature(0)).not.toThrow();
    expect(() => validateTemperature(-100)).not.toThrow();
    expect(() => validateTemperature(100)).not.toThrow();
    expect(() => validateTemperature(20)).not.toThrow();
  });

  it('should throw TypeError for non-finite values', () => {
    expect(() => validateTemperature(Number.NaN)).toThrow(TypeError);
    expect(() => validateTemperature(Infinity)).toThrow(TypeError);
  });

  it('should throw Error for out of range values', () => {
    expect(() => validateTemperature(-101)).toThrow();
    expect(() => validateTemperature(101)).toThrow();
  });

  it('should allow custom range', () => {
    expect(() => validateTemperature(50, 0, 50)).not.toThrow();
    expect(() => validateTemperature(51, 0, 50)).toThrow();
  });
});

describe('validateEnthalpy', () => {
  it('should pass for valid enthalpy', () => {
    expect(() => validateEnthalpy(0)).not.toThrow();
    expect(() => validateEnthalpy(-100)).not.toThrow();
    expect(() => validateEnthalpy(100)).not.toThrow();
  });

  it('should throw TypeError for non-finite values', () => {
    expect(() => validateEnthalpy(Number.NaN)).toThrow(TypeError);
    expect(() => validateEnthalpy(Infinity)).toThrow(TypeError);
  });
});

describe('validateWetBulbTemperature', () => {
  it('should pass when wet bulb <= dry bulb', () => {
    expect(() => validateWetBulbTemperature(15, 20)).not.toThrow();
    expect(() => validateWetBulbTemperature(20, 20)).not.toThrow();
  });

  it('should throw when wet bulb > dry bulb', () => {
    expect(() => validateWetBulbTemperature(25, 20)).toThrow();
  });
});

describe('validatePressureRatio', () => {
  it('should pass when saturation pressure < air pressure', () => {
    expect(() => validatePressureRatio(1000, 101325)).not.toThrow();
  });

  it('should throw when saturation pressure >= air pressure', () => {
    expect(() => validatePressureRatio(101325, 101325)).toThrow();
    expect(() => validatePressureRatio(102000, 101325)).toThrow();
  });

  it('should throw when ratio is too close to 1', () => {
    expect(() => validatePressureRatio(100500, 101325)).toThrow();
  });
});
