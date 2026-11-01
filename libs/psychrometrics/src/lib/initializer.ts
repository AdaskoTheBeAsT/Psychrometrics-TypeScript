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

import { MonotoneCubicHermiteInterpolation, NumberTuple, Spline } from '@adaskothebeast/splines';
import {
  getActiveAdiabaticSaturationSpecificHumidityFunc,
  setActiveAdiabaticSaturationSpecificHumidityFormula,
} from './adiabatic-saturation-specific-humidity';
import { updateBarometricPressureBounds } from './air-pressure-to-altitude';
import {
  ASHRAE_GAS_CONSTANT_FOR_DRY_AIR,
  ASHRAE_MOLAR_MASS_OF_DRY_AIR,
  ASHRAE_MOLAR_MASS_RATIO,
  ASHRAE_STANDARD_AIR_DENSITY,
  EUROVENT_GAS_CONSTANT_FOR_DRY_AIR,
  EUROVENT_MOLAR_MASS_OF_DRY_AIR,
  EUROVENT_MOLAR_MASS_RATIO,
  EUROVENT_STANDARD_AIR_DENSITY,
  setActiveEnthalpyConstants,
  setActiveStandardConstants,
  SPECIFIC_HEAT_CAPACITY_OF_DRY_AIR_ASHRAE,
  SPECIFIC_HEAT_CAPACITY_OF_DRY_AIR_EUROVENT,
  SPECIFIC_HEAT_CAPACITY_OF_DRY_AIR_GLUCK_ABOVE_THRESHOLD,
  SPECIFIC_HEAT_CAPACITY_OF_WATER_VAPOR_LEGACY,
  SPECIFIC_HEAT_CAPACITY_OF_WATER_VAPOR_STANDARD,
} from './constants';
import { getActiveEnthalpyFunc, setActiveEnthalpyFormula } from './enthalpy';
import {
  getActiveEnthalpyToSpecificHumidityFunc,
  setActiveEnthalpyToSpecificHumidityFormula,
} from './enthalpy-to-specific-humidity';
import { getActiveEnthalpyToTemperatureFunc, setActiveEnthalpyToTemperatureFormula } from './enthalpy-to-temperature';
import { MoistAirEnthalpyFormula } from './moist-air-enthalpy-formula';
import { PsychrometricStandard } from './psychrometric-standard';
import { SaturationVaporPressureFormula } from './saturation-vapor-pressure-formula';
import {
  getSaturationVaporPressureToTemperatureSpline,
  InitializationRequiredError,
  setSaturationVaporPressureToTemperatureSpline,
  updateSaturationVaporPressureBounds,
} from './saturation-vapor-pressure-to-temperature';
import {
  getActiveSaturationVaporPressureFunc,
  getActiveSaturationVaporPressureOfIceFunc,
  getActiveSaturationVaporPressureOfWaterFunc,
  setActiveSaturationVaporPressureFormula,
  temperatureToSaturationVaporPressure,
} from './temperature-to-saturation-vapor-pressure';
import { WetBulbFormula } from './wet-bulb-formula';
import { getActiveWetBulbTemperatureFunc, setActiveWetBulbTemperatureFormula } from './wet-bulb-temperature';
import {
  getActiveWetBulbTemperatureToSpecificHumidityFunc,
  setActiveWetBulbTemperatureToSpecificHumidityFormula,
} from './wet-bulb-temperature-to-specific-humidity';

export { InitializationRequiredError };

/** Minimum allowed decimal point accuracy */
const MIN_DECIMAL_ACCURACY = 0;

/** Maximum allowed decimal point accuracy */
const MAX_DECIMAL_ACCURACY = 4;

/** Default decimal point accuracy */
const DEFAULT_DECIMAL_ACCURACY = 2;

/**
 * Manages initialization of interpolation splines, regional standards, and formulas for psychrometric calculations.
 */
export class Initializer {
  static #isInitialized = false;
  static #currentAccuracy: number | null = null;
  static #currentStandard: PsychrometricStandard = PsychrometricStandard.Eurovent;
  static #currentEnthalpyFormula: MoistAirEnthalpyFormula = MoistAirEnthalpyFormula.Recknagel;
  static #currentSaturationVaporPressureFormula: SaturationVaporPressureFormula =
    SaturationVaporPressureFormula.MagnusTetens;
  static #currentWetBulbFormula: WetBulbFormula = WetBulbFormula.Isenthalpic;

  /**
   * Gets whether the initializer has been initialized.
   */
  static get isInitialized(): boolean {
    return Initializer.#isInitialized;
  }

  /**
   * Gets the current decimal point accuracy, or null if not initialized.
   */
  static get currentAccuracy(): number | null {
    return Initializer.#currentAccuracy;
  }

  /**
   * Gets the currently configured regional psychrometric standard (`Eurovent` by default).
   */
  static get currentStandard(): PsychrometricStandard {
    return Initializer.#currentStandard;
  }

  /**
   * Gets the currently configured moist air enthalpy formula (`Recknagel` by default).
   */
  static get currentEnthalpyFormula(): MoistAirEnthalpyFormula {
    return Initializer.#currentEnthalpyFormula;
  }

  /**
   * Gets the currently configured saturation vapor pressure formula (`MagnusTetens` by default).
   */
  static get currentSaturationVaporPressureFormula(): SaturationVaporPressureFormula {
    return Initializer.#currentSaturationVaporPressureFormula;
  }

  /**
   * Gets the currently configured resolved wet-bulb calculation mode (`Isenthalpic` or `Thermodynamic`).
   */
  static get currentWetBulbFormula(): WetBulbFormula {
    return Initializer.#currentWetBulbFormula;
  }

  /**
   * Gets the active delegate for calculating moist air specific enthalpy [kJ/kg].
   */
  static get enthalpyFunc(): (temperature: number, specificHumidity: number) => number {
    return getActiveEnthalpyFunc();
  }

  /**
   * Gets the active delegate for calculating specific humidity [g/kg] from enthalpy and temperature.
   */
  static get enthalpyToSpecificHumidityFunc(): (enthalpy: number, temperature: number) => number {
    return getActiveEnthalpyToSpecificHumidityFunc();
  }

  /**
   * Gets the active delegate for calculating temperature [°C] from enthalpy and specific humidity.
   */
  static get enthalpyToTemperatureFunc(): (enthalpy: number, specificHumidity: number) => number {
    return getActiveEnthalpyToTemperatureFunc();
  }

  /**
   * Gets the active delegate for calculating saturation vapor pressure over liquid water [Pa].
   */
  static get saturationVaporPressureOfWaterFunc(): (temperature: number) => number {
    return getActiveSaturationVaporPressureOfWaterFunc();
  }

  /**
   * Gets the active delegate for calculating saturation vapor pressure over ice [Pa].
   */
  static get saturationVaporPressureOfIceFunc(): (temperature: number) => number {
    return getActiveSaturationVaporPressureOfIceFunc();
  }

  /**
   * Gets the active delegate for calculating saturation vapor pressure over water or ice [Pa].
   */
  static get saturationVaporPressureFunc(): (temperature: number) => number {
    return getActiveSaturationVaporPressureFunc();
  }

  /**
   * Gets the active delegate for calculating wet-bulb temperature [°C].
   */
  static get wetBulbTemperatureFunc(): (
    airPressure: number,
    temperature: number,
    specificHumidity: number,
    epsilon?: number,
    maxIterations?: number,
  ) => number {
    return getActiveWetBulbTemperatureFunc();
  }

  /**
   * Gets the active delegate for calculating specific humidity [g/kg] from dry-bulb and wet-bulb temperatures.
   */
  static get wetBulbTemperatureToSpecificHumidityFunc(): (
    airPressure: number,
    temperature: number,
    wetBulbTemperature: number,
  ) => number {
    return getActiveWetBulbTemperatureToSpecificHumidityFunc();
  }

  /**
   * Gets the active delegate for calculating adiabatic saturation specific humidity [g/kg].
   */
  static get adiabaticSaturationSpecificHumidityFunc(): (
    airPressure: number,
    temperature: number,
    specificHumidity: number,
  ) => number {
    return getActiveAdiabaticSaturationSpecificHumidityFunc();
  }

  /**
   * Gets spline for conversion saturation vapor pressure to temperature.
   * @throws InitializationRequiredError if initialize() has not been called.
   */
  static get saturationVaporPressureToTemperatureSpline(): Spline {
    return getSaturationVaporPressureToTemperatureSpline();
  }

  /**
   * Sets spline for conversion saturation vapor pressure to temperature.
   * @internal This setter is primarily for testing purposes.
   */
  static set saturationVaporPressureToTemperatureSpline(spline: Spline) {
    setSaturationVaporPressureToTemperatureSpline(spline);
    Initializer.#isInitialized = true;
  }

  /**
   * Ensures the initializer is ready for use, initializing with defaults if needed.
   *
   * @param decimalPointAccuracy Optional decimal point accuracy (0-4). Defaults to 2.
   * @param standard Regional psychrometric standard (`Eurovent` by default).
   * @param enthalpyFormula Moist air specific enthalpy formula (`Recknagel` by default).
   * @param saturationVaporPressureFormula Saturation vapor pressure formula (`MagnusTetens` by default).
   * @param wetBulbFormula Wet-bulb / adiabatic saturation formula (`DefaultForStandard` by default).
   * @returns true if initialization was performed, false if already initialized.
   */
  static ensureInitialized(
    decimalPointAccuracy = DEFAULT_DECIMAL_ACCURACY,
    standard: PsychrometricStandard = PsychrometricStandard.Eurovent,
    enthalpyFormula: MoistAirEnthalpyFormula = MoistAirEnthalpyFormula.Recknagel,
    saturationVaporPressureFormula: SaturationVaporPressureFormula = SaturationVaporPressureFormula.MagnusTetens,
    wetBulbFormula: WetBulbFormula = WetBulbFormula.DefaultForStandard,
  ): boolean {
    if (Initializer.#isInitialized) {
      return false;
    }
    Initializer.initialize(
      decimalPointAccuracy,
      standard,
      enthalpyFormula,
      saturationVaporPressureFormula,
      wetBulbFormula,
    );
    return true;
  }

  /**
   * Resets the initializer state and restores default European (Eurovent / Recknagel / Magnus-Tetens / Isenthalpic)
   * constants and formulas. Useful for testing or changing accuracy.
   */
  static reset(): void {
    setSaturationVaporPressureToTemperatureSpline(null);
    Initializer.#isInitialized = false;
    Initializer.#currentAccuracy = null;
    Initializer.#currentStandard = PsychrometricStandard.Eurovent;
    Initializer.#currentEnthalpyFormula = MoistAirEnthalpyFormula.Recknagel;
    Initializer.#currentSaturationVaporPressureFormula = SaturationVaporPressureFormula.MagnusTetens;
    Initializer.#currentWetBulbFormula = WetBulbFormula.Isenthalpic;

    Initializer.applyStandard(PsychrometricStandard.Eurovent);
    Initializer.applyEnthalpyFormula(MoistAirEnthalpyFormula.Recknagel);
    Initializer.applySaturationVaporPressureFormula(SaturationVaporPressureFormula.MagnusTetens);
    Initializer.applyWetBulbFormula(WetBulbFormula.Isenthalpic);

    updateSaturationVaporPressureBounds(
      temperatureToSaturationVaporPressure(-100),
      temperatureToSaturationVaporPressure(100),
    );
    updateBarometricPressureBounds();
  }

  /**
   * Initialize interpolation for saturation vapor pressure to temperature formula,
   * regional constants, and calculation formulas.
   *
   * @param decimalPointAccuracy Decimal point accuracy (0-4, default: 2).
   * @param standard Regional psychrometric standard (`Eurovent` by default).
   * @param enthalpyFormula Moist air specific enthalpy formula (`Recknagel` by default).
   * @param saturationVaporPressureFormula Saturation vapor pressure formula (`MagnusTetens` by default).
   * @param wetBulbFormula Wet-bulb / adiabatic saturation formula (`DefaultForStandard` by default).
   * @throws RangeError if decimalPointAccuracy or any enum argument is outside valid range.
   */
  static initialize(
    decimalPointAccuracy = DEFAULT_DECIMAL_ACCURACY,
    standard: PsychrometricStandard = PsychrometricStandard.Eurovent,
    enthalpyFormula: MoistAirEnthalpyFormula = MoistAirEnthalpyFormula.Recknagel,
    saturationVaporPressureFormula: SaturationVaporPressureFormula = SaturationVaporPressureFormula.MagnusTetens,
    wetBulbFormula: WetBulbFormula = WetBulbFormula.DefaultForStandard,
  ): void {
    if (!Number.isInteger(decimalPointAccuracy) || decimalPointAccuracy < MIN_DECIMAL_ACCURACY) {
      throw new RangeError(
        `decimalPointAccuracy must be an integer at least ${MIN_DECIMAL_ACCURACY}. Received: ${decimalPointAccuracy}`,
      );
    }
    if (decimalPointAccuracy > MAX_DECIMAL_ACCURACY) {
      throw new RangeError(
        `decimalPointAccuracy must be at most ${MAX_DECIMAL_ACCURACY}. Received: ${decimalPointAccuracy}`,
      );
    }

    const resolvedWetBulbFormula = Initializer.resolveWetBulbFormula(standard, wetBulbFormula);

    if (
      Initializer.#isInitialized &&
      Initializer.#currentAccuracy === decimalPointAccuracy &&
      Initializer.#currentStandard === standard &&
      Initializer.#currentEnthalpyFormula === enthalpyFormula &&
      Initializer.#currentSaturationVaporPressureFormula === saturationVaporPressureFormula &&
      Initializer.#currentWetBulbFormula === resolvedWetBulbFormula
    ) {
      return;
    }

    Initializer.applyStandard(standard);
    Initializer.applyEnthalpyFormula(enthalpyFormula);
    Initializer.applySaturationVaporPressureFormula(saturationVaporPressureFormula);
    Initializer.applyWetBulbFormula(resolvedWetBulbFormula);

    const multiplier = Math.pow(10, decimalPointAccuracy);
    const start = -100 * multiplier;
    const end = 100 * multiplier;
    const count = end - start + 1;
    const tuples = new Array<NumberTuple>(count);

    let idx = 0;
    for (let t = start; t <= end; t += 1) {
      const x = t / multiplier;
      tuples[idx++] = [temperatureToSaturationVaporPressure(x), x];
    }

    updateSaturationVaporPressureBounds(tuples[0][0], tuples[count - 1][0]);
    updateBarometricPressureBounds();

    setSaturationVaporPressureToTemperatureSpline(new MonotoneCubicHermiteInterpolation(tuples));
    Initializer.#isInitialized = true;
    Initializer.#currentAccuracy = decimalPointAccuracy;
    Initializer.#currentStandard = standard;
    Initializer.#currentEnthalpyFormula = enthalpyFormula;
    Initializer.#currentSaturationVaporPressureFormula = saturationVaporPressureFormula;
    Initializer.#currentWetBulbFormula = resolvedWetBulbFormula;
  }

  private static applyStandard(standard: PsychrometricStandard): void {
    switch (standard) {
      case PsychrometricStandard.Eurovent:
        setActiveStandardConstants(
          EUROVENT_MOLAR_MASS_OF_DRY_AIR,
          EUROVENT_MOLAR_MASS_RATIO,
          EUROVENT_GAS_CONSTANT_FOR_DRY_AIR,
          EUROVENT_STANDARD_AIR_DENSITY,
        );
        break;
      case PsychrometricStandard.Ashrae:
        setActiveStandardConstants(
          ASHRAE_MOLAR_MASS_OF_DRY_AIR,
          ASHRAE_MOLAR_MASS_RATIO,
          ASHRAE_GAS_CONSTANT_FOR_DRY_AIR,
          ASHRAE_STANDARD_AIR_DENSITY,
        );
        break;
      default:
        throw new RangeError(`Unsupported psychrometric standard: ${String(standard)}`);
    }
  }

  private static applyEnthalpyFormula(formula: MoistAirEnthalpyFormula): void {
    setActiveEnthalpyFormula(formula);
    setActiveEnthalpyToSpecificHumidityFormula(formula);
    setActiveEnthalpyToTemperatureFormula(formula);

    switch (formula) {
      case MoistAirEnthalpyFormula.Recknagel:
        setActiveEnthalpyConstants(
          SPECIFIC_HEAT_CAPACITY_OF_DRY_AIR_EUROVENT,
          SPECIFIC_HEAT_CAPACITY_OF_DRY_AIR_EUROVENT,
          SPECIFIC_HEAT_CAPACITY_OF_WATER_VAPOR_STANDARD,
        );
        break;
      case MoistAirEnthalpyFormula.Ashrae:
        setActiveEnthalpyConstants(
          SPECIFIC_HEAT_CAPACITY_OF_DRY_AIR_ASHRAE,
          SPECIFIC_HEAT_CAPACITY_OF_DRY_AIR_ASHRAE,
          SPECIFIC_HEAT_CAPACITY_OF_WATER_VAPOR_STANDARD,
        );
        break;
      case MoistAirEnthalpyFormula.Gluck:
      case MoistAirEnthalpyFormula.GluckLegacy:
        setActiveEnthalpyConstants(
          SPECIFIC_HEAT_CAPACITY_OF_DRY_AIR_EUROVENT,
          SPECIFIC_HEAT_CAPACITY_OF_DRY_AIR_GLUCK_ABOVE_THRESHOLD,
          SPECIFIC_HEAT_CAPACITY_OF_WATER_VAPOR_LEGACY,
        );
        break;
      case MoistAirEnthalpyFormula.MollierLegacy:
        setActiveEnthalpyConstants(
          SPECIFIC_HEAT_CAPACITY_OF_DRY_AIR_EUROVENT,
          SPECIFIC_HEAT_CAPACITY_OF_DRY_AIR_EUROVENT,
          SPECIFIC_HEAT_CAPACITY_OF_WATER_VAPOR_LEGACY,
        );
        break;
      default:
        throw new RangeError(`Unsupported moist air enthalpy formula: ${String(formula)}`);
    }
  }

  private static applySaturationVaporPressureFormula(formula: SaturationVaporPressureFormula): void {
    setActiveSaturationVaporPressureFormula(formula);
  }

  private static resolveWetBulbFormula(
    standard: PsychrometricStandard,
    wetBulbFormula: WetBulbFormula,
  ): WetBulbFormula.Isenthalpic | WetBulbFormula.Thermodynamic {
    switch (wetBulbFormula) {
      case WetBulbFormula.DefaultForStandard:
        return standard === PsychrometricStandard.Ashrae ? WetBulbFormula.Thermodynamic : WetBulbFormula.Isenthalpic;
      case WetBulbFormula.Isenthalpic:
        return WetBulbFormula.Isenthalpic;
      case WetBulbFormula.Thermodynamic:
        return WetBulbFormula.Thermodynamic;
      default:
        throw new RangeError(`Unsupported wet-bulb formula: ${String(wetBulbFormula)}`);
    }
  }

  private static applyWetBulbFormula(
    resolvedFormula: WetBulbFormula.Isenthalpic | WetBulbFormula.Thermodynamic,
  ): void {
    setActiveWetBulbTemperatureFormula(resolvedFormula);
    setActiveWetBulbTemperatureToSpecificHumidityFormula(resolvedFormula);
    setActiveAdiabaticSaturationSpecificHumidityFormula(resolvedFormula);
  }
}
