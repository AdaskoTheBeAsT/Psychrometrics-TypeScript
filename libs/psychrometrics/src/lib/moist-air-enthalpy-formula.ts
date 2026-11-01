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

/**
 * Specifies the empirical correlation used for moist air specific enthalpy `h(t, x)` [kJ/kg dry air]
 * and its inverse functions.
 */
export enum MoistAirEnthalpyFormula {
  /**
   * Modern European HVAC standard formula (Recknagel / VDI 4670 / Eurovent):
   * `h = 1.005 * t + (x / 1000) * (2501.0 + 1.86 * t)`.
   *
   * Reference: Recknagel, Sprenger, and Albers, *Taschenbuch für Heizung + Klimatechnik*;
   * VDI 4670 Blatt 1 (*Thermodynamic properties of humid air*).
   */
  Recknagel = 0,

  /**
   * North American HVAC standard formula (ASHRAE):
   * `h = 1.006 * t + (x / 1000) * (2501.0 + 1.86 * t)`.
   *
   * Reference: ASHRAE Handbook — Fundamentals, Chapter 1 (*Psychrometrics*), Equation 30.
   */
  Ashrae = 1,

  /**
   * Bernd Glück (1991) piecewise-linear dry-air enthalpy approximation switching at `13 °C`:
   * - For `t < 13 °C`: `h = 1.005 * t + (x / 1000) * (2501.0 + 1.84 * t)`
   * - For `t >= 13 °C`: `h = 1.007 * t - 0.026 + (x / 1000) * (2501.0 + 1.84 * t)`
   *
   * Reference: Glück, B. (1991), *Zustands- und Stoffwerte: Wasser, Dampf, Luft; Verbrennungsrechnung*,
   * 2nd ed., Verlag für Bauwesen, Berlin (continuous at `t = 13 °C` where `1.005 * 13 = 1.007 * 13 - 0.026 = 13.065 kJ/kg`).
   */
  Gluck = 2,

  /**
   * Legacy adaptation of Bernd Glück's formula switching at `0 °C` instead of `13 °C`:
   * - For `t < 0 °C`: `h = 1.005 * t + (x / 1000) * (2501.0 + 1.84 * t)`
   * - For `t >= 0 °C`: `h = 1.007 * t - 0.026 + (x / 1000) * (2501.0 + 1.84 * t)`
   *
   * Reference: Adapted from Glück, B. (1991) for legacy European AHU calculation compatibility.
   */
  GluckLegacy = 3,

  /**
   * Classic European Mollier `h-x` (`i-x`) chart formula:
   * `h = 1.005 * t + (x / 1000) * (2501.0 + 1.84 * t)`.
   *
   * Reference: Mollier, R. (1923), *Ein neues Diagramm für Dampfluftgemische*, Z. VDI 67, 869–872;
   * classic European `i-x` psychrometric tables.
   */
  MollierLegacy = 4,
}
