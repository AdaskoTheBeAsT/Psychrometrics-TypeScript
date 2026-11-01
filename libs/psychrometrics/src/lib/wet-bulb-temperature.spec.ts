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

import { adiabaticSaturationSpecificHumidity } from './adiabatic-saturation-specific-humidity';
import { condensedWaterOrIceEnthalpy } from './condensed-water-or-ice-enthalpy';
import { enthalpy } from './enthalpy';
import { Initializer } from './initializer';
import { MoistAirEnthalpyFormula } from './moist-air-enthalpy-formula';
import { PsychrometricStandard } from './psychrometric-standard';
import { SaturationVaporPressureFormula } from './saturation-vapor-pressure-formula';
import { temperatureToMaximumSpecificHumidity } from './temperature-to-maximum-specific-humidity';
import { WetBulbFormula } from './wet-bulb-formula';
import {
  wetBulbTemperature,
  wetBulbTemperatureIsenthalpic,
  wetBulbTemperatureThermodynamic,
} from './wet-bulb-temperature';
import { wetBulbTemperatureToSpecificHumidity } from './wet-bulb-temperature-to-specific-humidity';

describe('wetBulbTemperature', () => {
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
    [101325, 20, 8.736841601662796, 15.09927747192241],
    [101325, 0, 3.7751266016292133, 0],
    [101325, -20, 0.3804182346564335, -20.542690827750253],
    [101325, -50, 0.014503477444163701, -50.02301184467364],
  ];

  it.each(testCases)(
    'Isenthalpic (GluckLegacy/Huang2018): given air pressure=%p temperature=%p specific humidity=%p returns %p',
    (airPressure, temperature, specificHumidity, expected) => {
      Initializer.initialize(
        2,
        PsychrometricStandard.Eurovent,
        MoistAirEnthalpyFormula.GluckLegacy,
        SaturationVaporPressureFormula.Huang2018,
      );
      const wbt = wetBulbTemperature(airPressure, temperature, specificHumidity);

      expect(wbt).toBe(expected);
      expect(wetBulbTemperatureIsenthalpic(airPressure, temperature, specificHumidity)).toBe(expected);
    },
  );

  const thermodynamicCases = [
    [101325, 30, 10],
    [101325, 20, 7],
    [101325, 5, 2.5],
    [101325, -5, 1],
    [101325, -15, 0.5],
  ];

  it.each(thermodynamicCases)(
    'Thermodynamic: given air pressure=%p temperature=%p specific humidity=%p should satisfy energy balance and round-trip',
    (airPressure, temperature, specificHumidity) => {
      Initializer.initialize(
        2,
        PsychrometricStandard.Ashrae,
        MoistAirEnthalpyFormula.Ashrae,
        SaturationVaporPressureFormula.AshraeHylandWexler,
        WetBulbFormula.Thermodynamic,
      );

      const tStar = wetBulbTemperature(airPressure, temperature, specificHumidity);
      expect(tStar).toBe(wetBulbTemperatureThermodynamic(airPressure, temperature, specificHumidity));

      const xsStar = adiabaticSaturationSpecificHumidity(airPressure, temperature, specificHumidity);
      expect(xsStar).toBeCloseTo(temperatureToMaximumSpecificHumidity(airPressure, tStar), 9);

      const hIn = enthalpy(temperature, specificHumidity);
      const hSat = enthalpy(tStar, xsStar);
      const hwStar = condensedWaterOrIceEnthalpy(tStar);
      const lhs = hIn + ((xsStar - specificHumidity) / 1000) * hwStar;
      expect(lhs).toBeCloseTo(hSat, 6);

      const recoveredHumidity = wetBulbTemperatureToSpecificHumidity(airPressure, temperature, tStar);
      expect(recoveredHumidity).toBeCloseTo(specificHumidity, 5);
    },
  );

  it('Thermodynamic vs Isenthalpic should reflect condensed water enthalpy difference', () => {
    Initializer.initialize();
    const airPressure = 101325;
    const temperature = 35;
    const specificHumidity = 10;

    const tWbIsenthalpic = wetBulbTemperatureIsenthalpic(airPressure, temperature, specificHumidity);
    const tWbThermodynamic = wetBulbTemperatureThermodynamic(airPressure, temperature, specificHumidity);

    expect(tWbThermodynamic).toBeGreaterThan(tWbIsenthalpic);
    expect(tWbThermodynamic - tWbIsenthalpic).toBeGreaterThanOrEqual(0.05);
    expect(tWbThermodynamic - tWbIsenthalpic).toBeLessThanOrEqual(0.35);

    const satHumidity = temperatureToMaximumSpecificHumidity(airPressure, 25);
    expect(wetBulbTemperatureIsenthalpic(airPressure, 25, satHumidity)).toBeCloseTo(25, 3);
    expect(wetBulbTemperatureThermodynamic(airPressure, 25, satHumidity)).toBeCloseTo(25, 6);
  });
});
