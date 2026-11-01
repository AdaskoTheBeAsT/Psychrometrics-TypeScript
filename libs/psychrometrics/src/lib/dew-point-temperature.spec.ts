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

import { dewPointTemperature } from './dew-point-temperature';
import { Initializer } from './initializer';
import { MoistAirEnthalpyFormula } from './moist-air-enthalpy-formula';
import { PsychrometricStandard } from './psychrometric-standard';
import { SaturationVaporPressureFormula } from './saturation-vapor-pressure-formula';

describe('dewPointTemperature', () => {
  beforeAll(() => {
    Initializer.initialize(
      2,
      PsychrometricStandard.Eurovent,
      MoistAirEnthalpyFormula.GluckLegacy,
      SaturationVaporPressureFormula.Huang2018,
    );
  });

  afterAll(() => {
    Initializer.initialize();
  });

  const testCases = [
    [101325, 8.736841601662796, 12.008179492113],
    [101325, 0.3804182346564335, -25.212484391024],
  ];

  it.each(testCases)(
    'given air pressure=%p specific humidity=%p returns %p',
    (airPressure, specificHumidity, expected) => {
      const temperature = dewPointTemperature(airPressure, specificHumidity);

      expect(temperature).toBe(expected);
    },
  );
});
