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
  ASHRAE_GAS_CONSTANT_FOR_DRY_AIR,
  ASHRAE_MOLAR_MASS_OF_DRY_AIR,
  ASHRAE_MOLAR_MASS_RATIO,
  ASHRAE_STANDARD_AIR_DENSITY,
  EUROVENT_GAS_CONSTANT_FOR_DRY_AIR,
  EUROVENT_MOLAR_MASS_OF_DRY_AIR,
  EUROVENT_MOLAR_MASS_RATIO,
  EUROVENT_STANDARD_AIR_DENSITY,
  GAS_CONSTANT_FOR_DRY_AIR,
  LATENT_HEAT_OF_FUSION_OF_WATER,
  MOLAR_MASS_OF_DRY_AIR,
  MOLAR_MASS_RATIO,
  SPECIFIC_HEAT_CAPACITY_OF_AIR_BELOW_ZERO,
  SPECIFIC_HEAT_CAPACITY_OF_AIR_EQ_ABOVE_ZERO,
  SPECIFIC_HEAT_CAPACITY_OF_DRY_AIR_ASHRAE,
  SPECIFIC_HEAT_CAPACITY_OF_DRY_AIR_EUROVENT,
  SPECIFIC_HEAT_CAPACITY_OF_DRY_AIR_GLUCK_ABOVE_THRESHOLD,
  SPECIFIC_HEAT_CAPACITY_OF_ICE,
  SPECIFIC_HEAT_CAPACITY_OF_LIQUID_WATER,
  SPECIFIC_HEAT_CAPACITY_OF_WATER_VAPOR,
  SPECIFIC_HEAT_CAPACITY_OF_WATER_VAPOR_LEGACY,
  SPECIFIC_HEAT_CAPACITY_OF_WATER_VAPOR_STANDARD,
  STANDARD_AIR_DENSITY,
} from './constants';
import { Initializer } from './initializer';
import { MoistAirEnthalpyFormula } from './moist-air-enthalpy-formula';
import { PsychrometricStandard } from './psychrometric-standard';
import { SaturationVaporPressureFormula } from './saturation-vapor-pressure-formula';
import { WetBulbFormula } from './wet-bulb-formula';

describe('class Initializer', () => {
  afterAll(() => {
    Initializer.initialize();
  });

  it('should throw exception when trying to access uninitialized spline property', () => {
    Initializer.reset();

    expect(Initializer.isInitialized).toBe(false);
    expect(Initializer.currentAccuracy).toBeNull();
    expect(Initializer.currentStandard).toBe(PsychrometricStandard.Eurovent);
    expect(Initializer.currentEnthalpyFormula).toBe(MoistAirEnthalpyFormula.Recknagel);
    expect(Initializer.currentSaturationVaporPressureFormula).toBe(SaturationVaporPressureFormula.MagnusTetens);
    expect(Initializer.currentWetBulbFormula).toBe(WetBulbFormula.Isenthalpic);

    expect(MOLAR_MASS_OF_DRY_AIR).toBe(EUROVENT_MOLAR_MASS_OF_DRY_AIR);
    expect(MOLAR_MASS_RATIO).toBe(EUROVENT_MOLAR_MASS_RATIO);
    expect(GAS_CONSTANT_FOR_DRY_AIR).toBe(EUROVENT_GAS_CONSTANT_FOR_DRY_AIR);
    expect(STANDARD_AIR_DENSITY).toBe(EUROVENT_STANDARD_AIR_DENSITY);
    expect(SPECIFIC_HEAT_CAPACITY_OF_AIR_BELOW_ZERO).toBe(SPECIFIC_HEAT_CAPACITY_OF_DRY_AIR_EUROVENT);
    expect(SPECIFIC_HEAT_CAPACITY_OF_AIR_EQ_ABOVE_ZERO).toBe(SPECIFIC_HEAT_CAPACITY_OF_DRY_AIR_EUROVENT);
    expect(SPECIFIC_HEAT_CAPACITY_OF_WATER_VAPOR).toBe(SPECIFIC_HEAT_CAPACITY_OF_WATER_VAPOR_STANDARD);
    expect(SPECIFIC_HEAT_CAPACITY_OF_LIQUID_WATER).toBe(4.186);
    expect(SPECIFIC_HEAT_CAPACITY_OF_ICE).toBe(2.1);
    expect(LATENT_HEAT_OF_FUSION_OF_WATER).toBe(333.4);

    const action = () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const _tmp = Initializer.saturationVaporPressureToTemperatureSpline;
    };

    expect(action).toThrow();
  });

  it('initialize should throw exception when decimal point accuracy less than zero', () => {
    expect(() => Initializer.initialize(-1)).toThrow();
  });

  it('initialize should throw exception when decimal point accuracy more than 4', () => {
    expect(() => Initializer.initialize(5)).toThrow();
  });

  it('initialize should throw exception for unsupported enum values', () => {
    expect(() => Initializer.initialize(2, 999 as PsychrometricStandard)).toThrow(RangeError);
    expect(() => Initializer.initialize(2, PsychrometricStandard.Eurovent, 999 as MoistAirEnthalpyFormula)).toThrow(
      RangeError,
    );
    expect(() =>
      Initializer.initialize(
        2,
        PsychrometricStandard.Eurovent,
        MoistAirEnthalpyFormula.Recknagel,
        999 as SaturationVaporPressureFormula,
      ),
    ).toThrow(RangeError);
    expect(() =>
      Initializer.initialize(
        2,
        PsychrometricStandard.Eurovent,
        MoistAirEnthalpyFormula.Recknagel,
        SaturationVaporPressureFormula.MagnusTetens,
        999 as WetBulbFormula,
      ),
    ).toThrow(RangeError);
  });

  it('initialize should pass when invoked without decimal point accuracy', () => {
    expect(() => Initializer.initialize()).not.toThrow();
    expect(Initializer.isInitialized).toBe(true);
    expect(Initializer.currentAccuracy).toBe(2);
  });

  it('initialize should configure constants and delegates for standards and formulas', () => {
    Initializer.initialize(
      2,
      PsychrometricStandard.Ashrae,
      MoistAirEnthalpyFormula.Ashrae,
      SaturationVaporPressureFormula.AshraeHylandWexler,
    );

    expect(Initializer.currentStandard).toBe(PsychrometricStandard.Ashrae);
    expect(Initializer.currentEnthalpyFormula).toBe(MoistAirEnthalpyFormula.Ashrae);
    expect(Initializer.currentSaturationVaporPressureFormula).toBe(SaturationVaporPressureFormula.AshraeHylandWexler);
    expect(Initializer.currentWetBulbFormula).toBe(WetBulbFormula.Thermodynamic);

    expect(MOLAR_MASS_OF_DRY_AIR).toBe(ASHRAE_MOLAR_MASS_OF_DRY_AIR);
    expect(MOLAR_MASS_RATIO).toBe(ASHRAE_MOLAR_MASS_RATIO);
    expect(GAS_CONSTANT_FOR_DRY_AIR).toBe(ASHRAE_GAS_CONSTANT_FOR_DRY_AIR);
    expect(STANDARD_AIR_DENSITY).toBe(ASHRAE_STANDARD_AIR_DENSITY);
    expect(SPECIFIC_HEAT_CAPACITY_OF_AIR_BELOW_ZERO).toBe(SPECIFIC_HEAT_CAPACITY_OF_DRY_AIR_ASHRAE);
    expect(SPECIFIC_HEAT_CAPACITY_OF_AIR_EQ_ABOVE_ZERO).toBe(SPECIFIC_HEAT_CAPACITY_OF_DRY_AIR_ASHRAE);
    expect(SPECIFIC_HEAT_CAPACITY_OF_WATER_VAPOR).toBe(SPECIFIC_HEAT_CAPACITY_OF_WATER_VAPOR_STANDARD);

    Initializer.initialize(
      2,
      PsychrometricStandard.Eurovent,
      MoistAirEnthalpyFormula.Gluck,
      SaturationVaporPressureFormula.Huang2018,
    );

    expect(Initializer.currentStandard).toBe(PsychrometricStandard.Eurovent);
    expect(Initializer.currentEnthalpyFormula).toBe(MoistAirEnthalpyFormula.Gluck);
    expect(Initializer.currentSaturationVaporPressureFormula).toBe(SaturationVaporPressureFormula.Huang2018);
    expect(Initializer.currentWetBulbFormula).toBe(WetBulbFormula.Isenthalpic);
    expect(SPECIFIC_HEAT_CAPACITY_OF_AIR_BELOW_ZERO).toBe(SPECIFIC_HEAT_CAPACITY_OF_DRY_AIR_EUROVENT);
    expect(SPECIFIC_HEAT_CAPACITY_OF_AIR_EQ_ABOVE_ZERO).toBe(SPECIFIC_HEAT_CAPACITY_OF_DRY_AIR_GLUCK_ABOVE_THRESHOLD);
    expect(SPECIFIC_HEAT_CAPACITY_OF_WATER_VAPOR).toBe(SPECIFIC_HEAT_CAPACITY_OF_WATER_VAPOR_LEGACY);

    Initializer.initialize(
      2,
      PsychrometricStandard.Eurovent,
      MoistAirEnthalpyFormula.MollierLegacy,
      SaturationVaporPressureFormula.Iapws95MurphyKoop,
      WetBulbFormula.Thermodynamic,
    );

    expect(Initializer.currentEnthalpyFormula).toBe(MoistAirEnthalpyFormula.MollierLegacy);
    expect(Initializer.currentSaturationVaporPressureFormula).toBe(SaturationVaporPressureFormula.Iapws95MurphyKoop);
    expect(Initializer.currentWetBulbFormula).toBe(WetBulbFormula.Thermodynamic);
    expect(SPECIFIC_HEAT_CAPACITY_OF_AIR_BELOW_ZERO).toBe(SPECIFIC_HEAT_CAPACITY_OF_DRY_AIR_EUROVENT);
    expect(SPECIFIC_HEAT_CAPACITY_OF_AIR_EQ_ABOVE_ZERO).toBe(SPECIFIC_HEAT_CAPACITY_OF_DRY_AIR_EUROVENT);
    expect(SPECIFIC_HEAT_CAPACITY_OF_WATER_VAPOR).toBe(SPECIFIC_HEAT_CAPACITY_OF_WATER_VAPOR_LEGACY);
  });

  it('ensureInitialized should not reinitialize when already initialized', () => {
    Initializer.reset();
    Initializer.initialize(
      1,
      PsychrometricStandard.Ashrae,
      MoistAirEnthalpyFormula.Ashrae,
      SaturationVaporPressureFormula.Huang2018,
    );

    Initializer.ensureInitialized(
      3,
      PsychrometricStandard.Eurovent,
      MoistAirEnthalpyFormula.Recknagel,
      SaturationVaporPressureFormula.MagnusTetens,
    );

    expect(Initializer.currentAccuracy).toBe(1);
    expect(Initializer.currentStandard).toBe(PsychrometricStandard.Ashrae);
    expect(Initializer.currentEnthalpyFormula).toBe(MoistAirEnthalpyFormula.Ashrae);
    expect(Initializer.currentSaturationVaporPressureFormula).toBe(SaturationVaporPressureFormula.Huang2018);
  });
});
