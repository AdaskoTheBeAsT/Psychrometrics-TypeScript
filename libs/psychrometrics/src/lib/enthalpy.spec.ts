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
  enthalpy,
  enthalpyAshrae,
  enthalpyGluck,
  enthalpyGluckLegacy,
  enthalpyMollierLegacy,
  enthalpyRecknagel,
} from './enthalpy';
import { enthalpyToSpecificHumidity } from './enthalpy-to-specific-humidity';
import { enthalpyToTemperature } from './enthalpy-to-temperature';
import { Initializer } from './initializer';
import { MoistAirEnthalpyFormula } from './moist-air-enthalpy-formula';
import { PsychrometricStandard } from './psychrometric-standard';
import { SaturationVaporPressureFormula } from './saturation-vapor-pressure-formula';

describe('enthalpy', () => {
  afterAll(() => {
    Initializer.initialize();
  });

  const gluckLegacyTestCases = [
    [0, 0, -0.026],
    [0, 0.1, 0.2241],
    [0, 3.7751266016292133, 9.415591630674662],
    [-1, 0, -1.005],
    [-1, 3.4738170173133707, 7.676624536988883],
    [20, 8.736841601662796, 42.28635661669985],
    [-20, 0.3804182346564335, -19.162573386159615],
  ];

  it.each(gluckLegacyTestCases)(
    'GluckLegacy: given temperature=%p specific humidity=%p returns %p',
    (temperature, specificHumidity, expected) => {
      Initializer.initialize(
        2,
        PsychrometricStandard.Eurovent,
        MoistAirEnthalpyFormula.GluckLegacy,
        SaturationVaporPressureFormula.Huang2018,
      );
      const e = enthalpy(temperature, specificHumidity);

      expect(e).toBe(expected);
      expect(enthalpyGluckLegacy(temperature, specificHumidity)).toBe(expected);
    },
  );

  it('should produce expected values at 20°C and 10 g/kg across all enthalpy formulas', () => {
    const temperature = 20;
    const specificHumidity = 10;
    const xKg = 0.01;

    expect(enthalpyRecknagel(temperature, specificHumidity)).toBeCloseTo(
      1.005 * temperature + xKg * (2501 + 1.86 * temperature),
      12,
    );
    expect(enthalpyAshrae(temperature, specificHumidity)).toBeCloseTo(
      1.006 * temperature + xKg * (2501 + 1.86 * temperature),
      12,
    );
    expect(enthalpyGluck(temperature, specificHumidity)).toBeCloseTo(
      -0.026 + 1.007 * temperature + xKg * (2501 + 1.84 * temperature),
      12,
    );
    expect(enthalpyGluck(10, specificHumidity)).toBeCloseTo(1.005 * 10 + xKg * (2501 + 1.84 * 10), 12);
    expect(enthalpyGluckLegacy(temperature, specificHumidity)).toBeCloseTo(
      -0.026 + 1.007 * temperature + xKg * (2501 + 1.84 * temperature),
      12,
    );
    expect(enthalpyMollierLegacy(temperature, specificHumidity)).toBeCloseTo(
      1.005 * temperature + xKg * (2501 + 1.84 * temperature),
      12,
    );
  });

  const formulas = [
    MoistAirEnthalpyFormula.Recknagel,
    MoistAirEnthalpyFormula.Ashrae,
    MoistAirEnthalpyFormula.Gluck,
    MoistAirEnthalpyFormula.GluckLegacy,
    MoistAirEnthalpyFormula.MollierLegacy,
  ];

  it.each(formulas)('formula %p should round-trip across temperature thresholds', (formula) => {
    Initializer.initialize(2, PsychrometricStandard.Eurovent, formula, SaturationVaporPressureFormula.MagnusTetens);
    const temperaturesC = [-20, -0.5, 0, 5, 12.9, 13, 13.1, 20, 40];
    const sh = 8.5;

    for (const temperature of temperaturesC) {
      const e = enthalpy(temperature, sh);
      const shRoundTrip = enthalpyToSpecificHumidity(e, temperature);
      const tempRoundTrip = enthalpyToTemperature(e, sh);

      expect(shRoundTrip).toBeCloseTo(sh, 10);
      expect(tempRoundTrip).toBeCloseTo(temperature, 10);
    }
  });
});
