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
  adiabaticSaturationSpecificHumidity,
  adiabaticSaturationSpecificHumidityIsenthalpic,
  adiabaticSaturationSpecificHumidityThermodynamic,
} from './adiabatic-saturation-specific-humidity';
import { Initializer } from './initializer';
import { temperatureToMaximumSpecificHumidity } from './temperature-to-maximum-specific-humidity';
import { wetBulbTemperatureIsenthalpic, wetBulbTemperatureThermodynamic } from './wet-bulb-temperature';

describe('adiabaticSaturationSpecificHumidity', () => {
  beforeEach(() => {
    Initializer.initialize(2);
  });

  afterAll(() => {
    Initializer.initialize();
  });

  it('should match maximum specific humidity at wet-bulb temperature for both Isenthalpic and Thermodynamic modes', () => {
    const airPressure = 101325;
    const temperature = 25;
    const specificHumidity = 8;

    const wbtIsenthalpic = wetBulbTemperatureIsenthalpic(airPressure, temperature, specificHumidity);
    const expectedIsenthalpic = temperatureToMaximumSpecificHumidity(airPressure, wbtIsenthalpic);
    expect(adiabaticSaturationSpecificHumidity(airPressure, temperature, specificHumidity)).toBeCloseTo(
      expectedIsenthalpic,
      10,
    );
    expect(adiabaticSaturationSpecificHumidityIsenthalpic(airPressure, temperature, specificHumidity)).toBeCloseTo(
      expectedIsenthalpic,
      10,
    );

    const wbtThermodynamic = wetBulbTemperatureThermodynamic(airPressure, temperature, specificHumidity);
    const expectedThermodynamic = temperatureToMaximumSpecificHumidity(airPressure, wbtThermodynamic);
    expect(adiabaticSaturationSpecificHumidityThermodynamic(airPressure, temperature, specificHumidity)).toBeCloseTo(
      expectedThermodynamic,
      10,
    );
  });
});
